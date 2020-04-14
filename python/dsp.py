import pandas as pd
import numpy as np
import os
from tqdm import tqdm
import librosa
from scipy.io import wavfile
import matplotlib.pyplot as plt
import pickle
import concurrent.futures


in_dir = 'data/'
out_dir = '/Volumes/Seagate/SeagateBackupPlus/Github/Capstone/data/'
files = in_dir + 'files.csv'


def calc_fft(y, rate):
    n = len(y)
    freq = np.fft.rfftfreq(n, d=1/rate)
    Y = abs(np.fft.rfft(y) / n)
    return (Y, freq)


def extract_features(signal, rate):
    mfcc = librosa.feature.mfcc(signal, rate).T
    delta = librosa.feature.delta(mfcc, order=1).T
    double_delta = librosa.feature.delta(mfcc, order=2).T

    return (mfcc, delta, double_delta)


def features_from_data(data):
    result = []
    for signal, rate in data:
        result.append(extract_features(signal, rate))
    return result


def main():
    n_workers = 2
    df = pd.read_csv(files, index_col=0)
    df.set_index('filename', inplace=True)
    filenames = df.index.tolist()
    # print (df)

    mfccs = {}
    deltas = {}
    double_deltas = {}
    data = []

    print ('\nReading {} audio files...\n'.format(len(filenames)))

    for wav_file in tqdm(filenames):
        signal, rate = librosa.load(in_dir + wav_file)
        # rate, signal = wavfile.read(in_dir + wav_file)
        # data.append((signal.astype(dtype=np.float32), rate))
        # print (wav_file)
        # print ('Rate :: {}, Length :: {:.2f} s'.format(rate, signal.shape[0]/rate))
        # print ()
        
        mfccs[wav_file], deltas[wav_file], double_deltas[wav_file] = extract_features(signal, rate)
    
    # print (data)
    # print ('\nProcessing audio files on %d workers...' % (n_workers))

    # with concurrent.futures.ThreadPoolExecutor(max_workers=n_workers) as executor:
    #     result = list(executor.map(extract_features, *zip(*data)))

    # print (result)
    # print (result[0])
    # print (result[0][0])

    pickle.dump(deltas, open(out_dir + 'deltas.p', 'wb'))
    pickle.dump(double_deltas, open(out_dir + 'double_deltas.p', 'wb'))
    pickle.dump(mfccs, open(out_dir + 'mfccs.p', 'wb'))

    # load_file = pickle.load(open(out_dir + 'mfccs.p', 'rb'))
    # print (load_file)



if __name__ == "__main__":
    main()
