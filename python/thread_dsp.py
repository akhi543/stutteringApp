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
fluent_dir = '/Volumes/Seagate/SeagateBackupPlus/Github/Capstone/data/fluent_speech_commands_dataset/'
out_dir = '/Volumes/Seagate/SeagateBackupPlus/Github/Capstone/data/'
files = in_dir + 'files.csv'


def calc_fft(y, rate):
    n = len(y)
    freq = np.fft.rfftfreq(n, d=1/rate)
    Y = abs(np.fft.rfft(y) / n)
    return (Y, freq)


def extract_features(signal, rate, label):
    pre_emphasis = 0.97
    emphasized_signal = np.append(signal[0], signal[1:] - pre_emphasis * signal[:-1])
    mfcc = librosa.feature.mfcc(signal, rate, n_mfcc=13)
    delta = librosa.feature.delta(mfcc, order=1)
    double_delta = librosa.feature.delta(mfcc, order=2)
    features = np.vstack((mfcc, delta, double_delta)).T

    return (features, label)


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
    filenames = [in_dir + f for f in filenames]
    # print (df)

    mfccs = {}
    deltas = {}
    double_deltas = {}
    data = []
    speakers = pd.read_csv(fluent_dir + 'data/speaker_demographics.csv')['speakerId'].tolist()
    speaker_dirs = [fluent_dir + 'wavs/speakers/' + s for s in speakers]
    speaker_files = []
    for sd in speaker_dirs:
        for r, d, f in os.walk(sd):
            i = 0
            for file in f:
                if not file.startswith('.'):
                    i += 1
                    speaker_files.append(r + '/' + file)
                if i > 3:
                    break
            break


    print ('\nReading {} audio files...\n'.format(len(filenames) + len(speaker_files)))

    for wav_file in tqdm(filenames + speaker_files):
        signal, rate = librosa.load(wav_file, sr=8000)
        # rate, signal = wavfile.read(wav_file)
        if wav_file.startswith(fluent_dir):
            data.append((signal, rate, 0))
        else:
            data.append((signal, rate, 1))
        # print (wav_file)
        # print ('Rate :: {}, Length :: {:.2f} s'.format(rate, signal.shape[0]/rate))
        # print ()
        
        # mfccs[wav_file], deltas[wav_file], double_deltas[wav_file] = extract_features(signal, rate)
    
    print ('\nProcessing audio files on %d workers...' % (n_workers))

    with concurrent.futures.ThreadPoolExecutor(max_workers=n_workers) as executor:
        result = list(tqdm(executor.map(extract_features, *zip(*data)), total=len(data)))

    # print (result)
    # print (result[0])
    # print (result[0][0])

    # pickle.dump(result, open(out_dir + 'features.p', 'wb'))
    pickle.dump(result, open(out_dir + 'data8k.p', 'wb'))
    # pickle.dump(deltas, open(out_dir + 'deltas.p', 'wb'))
    # pickle.dump(double_deltas, open(out_dir + 'double_deltas.p', 'wb'))
    # pickle.dump(mfccs, open(out_dir + 'mfccs.p', 'wb'))

    # load_file = pickle.load(open(out_dir + 'mfccs.p', 'rb'))
    # print (load_file)



if __name__ == "__main__":
    main()
