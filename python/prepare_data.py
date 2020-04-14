import os
import pickle
from sklearn.model_selection import train_test_split

# Load the saved dataset
data_dir = out_dir = '/Volumes/Seagate/SeagateBackupPlus/Github/Capstone/data/'

with open(data_dir + 'data8k.p', 'rb') as f:
    data = pickle.load(f)

train, test = train_test_split(data, test_size=0.33, random_state=42)

pickle.dump(train, open(data_dir + 'train_data.p', 'wb'))
pickle.dump(test, open(data_dir + 'test_data.p', 'wb'))

