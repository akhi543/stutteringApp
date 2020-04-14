import time
import random
import math
import os
import warnings

warnings.filterwarnings('ignore')

import numpy as np
from tqdm import tqdm
import pickle

import torch
import torch.optim as optim
import torch.nn as nn
import torch.nn.functional as F

from sklearn.metrics import f1_score, recall_score, precision_score


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


class Data:
    def __init__(self, data_file):
        print ('Reading acoustic features...')
        self.data_file = data_file
        with open(self.data_file, 'rb') as file:
            self.training_data = pickle.load(file)
            random.shuffle(self.training_data)
        self.features = [torch.tensor(x[0], device=device) for x in self.training_data]
        self.labels = torch.tensor([x[1] for x in self.training_data], dtype=torch.long, device=device).view(-1, 1)
        print ('Read %d speech utterances' % (len(self.training_data)))


class BinaryClassifier(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers):
        super(BinaryClassifier, self).__init__()

        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.gru = nn.GRU(input_size, hidden_size, num_layers, batch_first=True, bidirectional=True)
        self.linear = nn.Linear(hidden_size * 2, hidden_size * 2)
        self.linear2 = nn.Linear(hidden_size * 2, 2)
        self.softmax = nn.LogSoftmax(dim=0)

        self.dropout_layer = nn.Dropout(p=0.2)
    
    def forward(self, seq, hidden):
        outputs, hidden = self.gru(seq, hidden)
        output = outputs[0][-1]
        output = F.relu(self.linear(output))
        output = F.relu(self.linear2(output))
        output = self.softmax(output)
        return output

    
    def init_hidden(self):
        return torch.zeros(self.num_layers * 2, 1, self.hidden_size, device=device)


def as_minutes(s):
    m = math.floor(s / 60)
    s -= m * 60
    return '%dm %ds' % (m, s)


def time_since(since, percent):
    now = time.time()
    s = now - since
    es = s / percent
    rs = es - s
    return '%s (- %s)' % (as_minutes(s), as_minutes(rs))


def train_time(since):
    now = time.time()
    s = now - since
    m = math.floor(s / 60)
    s -= m * 60
    h = math.floor(m / 60)
    m -= h * 60
    return ('%dh %dm %ds') % (h, m, s)


def train(x, y, model, optimizer, criterion):
    hidden = model.init_hidden()

    optimizer.zero_grad()

    output = model(x.unsqueeze(0), hidden)
    loss = criterion(output.unsqueeze(0), y)

    loss.backward()
    optimizer.step()

    return loss.item()

def train_iters(model, data, config):
    start = time.time()
    
    optimizer = optim.SGD(model.parameters(), lr=config.learning_rate)
    criterion = nn.NLLLoss()
    samples = list(zip(data.features, data.labels))
    training_data = [random.choice(samples) for i in range(config.num_epochs)]
    data_len = len(data.training_data)
    
    print ('Started training...')
    print ('Training parameters: %d epochs, %g learning rate' % (config.num_epochs, config.learning_rate))
    print ()

    loss_total = 0

    for epoch in range(1, config.num_epochs + 1):
        
        sample = training_data[epoch - 1]
        
        if config.random_training:
            x, y = sample
            loss = train(x, y, model, optimizer, criterion)
            loss_total += loss
        else:
            loss_epoch = 0
            random.shuffle(samples)
            for x, y in samples:
                loss = train(x, y, model, optimizer, criterion)
                loss_epoch += loss
            loss_epoch /= data_len
            loss_total += loss_epoch

        if epoch % config.print_every == 0:
            loss_avg = loss_total / config.print_every
            loss_total = 0
            print ('%s :: (%d   %d%%)  ::  Loss:  %.4f' % (time_since(start, epoch / config.num_epochs),
                                                        epoch, 100 * epoch / config.num_epochs, loss_avg))
        
        if epoch % config.save_every == 0:
            torch.save(model, config.data_dir + 'model.p')
    
    print ('Training took %s' % (train_time(start)))


def evaluate_randomly(model, data, n=10):
    print ()
    print ('> Target, < Predicted')
    print ()
    for i in range(n):
        x, y = random.choice(list(zip(data.features, data.labels)))
        print ('=========')
        print ('> ', y.item())
        hidden = model.init_hidden()
        output = model(x.unsqueeze(0), hidden)
        print ('< ', torch.argmax(output.exp()).item())
        print ()


def evaluate(model, data):
  pred = []
  targets = data.labels.view(-1,).tolist()

  for x in data.features:
    hidden = model.init_hidden()
    output = model(x.unsqueeze(0), hidden)
    pred.append(torch.argmax(output.exp()).item())
  
  matches = [p == t for p, t in zip(pred, targets)]
  acc = sum(matches) / len(matches)

  f = f1_score(targets, pred)
  p = precision_score(targets, pred)
  r = recall_score(targets, pred)
  evaluate_randomly(model, data)
  return acc, f, p, r


class Config1(object):
    data_dir = '/Volumes/Seagate/SeagateBackupPlus/Github/Capstone/data/'
    data_file = data_dir + 'data8k.p'
    train_file = data_dir + 'train_data.p'
    test_file = data_dir + 'test_data.p'
    feature_dim = 39
    hidden_dim = 256
    num_layers = 2
    num_epochs = 10
    print_every = 1
    save_every = 1
    learning_rate = 0.01
    random_training = False


class Config2(object):
    data_dir = '/Volumes/Seagate/SeagateBackupPlus/Github/Capstone/data/'
    data_file = data_dir + 'data8k.p'
    train_file = data_dir + 'train_data.p'
    test_file = data_dir + 'test_data.p'
    feature_dim = 39
    hidden_dim = 256
    num_layers = 2
    num_epochs = 2000
    print_every = 50
    save_every = 100
    learning_rate = 0.001
    random_training = True


def main(train_model=True, setting=0):
  config = Config1() if setting == 0 else Config2()

  # Load the dataset for training
  print('Training data...')
  train_data = Data(config.train_file)
  print ('Testing data...')
  test_data = Data(config.test_file)

  # Check for saved models
  if os.path.isfile(config.data_dir + 'model.p'):
    print ('Found saved model, loading model from ', config.data_dir)
    model = torch.load(config.data_dir + 'model.p', map_location=device)
    model = model.to(device)
    model.train()
  else:
    model = BinaryClassifier(config.feature_dim, config.hidden_dim, config.num_layers).to(device)

  # Start to train the model
  if train_model:
    train_iters(
        model=model,
        data=train_data,
        config=config
    )

  # Training Finished, save the model last time
  torch.save(model, config.data_dir + 'model.p')

  # Evaluate the model
  model.eval()
  print ()
  print ('Train Evaluation...')
  a, f, p, r = evaluate(model, train_data)
  print ('Final scores')
  print ('Accuracy %.3f, F1-Score %.3f' % (a, f))
  print ('Precision %.3f, Recall %.3f' % (p, r))
  
  print ()
  print ('Test Evaluation...')
  a2, f2, p2, r2 = evaluate(model, test_data)
  print ('Final scores')
  print ('Accuracy %.3f, F1-Score %.3f' % (a2, f2))
  print ('Precision %.3f, Recall %.3f' % (p2, r2))

# main(False)
