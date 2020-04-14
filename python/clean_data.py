import time
import random
import math
import os
import warnings

warnings.filterwarnings('ignore')

import numpy as np
from tqdm import tqdm
import pickle
import soundfile as sf
import librosa


def extract_features(signal, rate):
    pre_emphasis = 0.97
    emphasized_signal = np.append(signal[0], signal[1:] - pre_emphasis * signal[:-1])
    mfcc = librosa.feature.mfcc(signal, rate, n_mfcc=13)
    delta = librosa.feature.delta(mfcc, order=1)
    double_delta = librosa.feature.delta(mfcc, order=2)
    features = np.vstack((mfcc, delta, double_delta)).T

    return features

def envelope(signal, rate):
    mask = []
    y = pd.Series(signal).apply(np.abs)
    y_mean = y.rolling(window=int(rate/10), min_periods=1, center=True).mean()
    for mean in y_mean:
        mask.append(mean > 0.0005)
    return mask


data_dir = '/Volumes/Seagate/SeagateBackupPlus/Github/Capstone/data'
clean_dir = '/Volumes/Seagate/SeagateBackupPlus/Github/Capstone/data/clean'
files = []
for dirs in ['AllAudioWav', 'AllMonoWavAudioOnly', 'AllReadWavAudioOnly']:
    for r, d, f in os.walk(os.path.join(data_dir, dirs)):
        for file in f:
            if not file.startswith('.'):
                files.append(os.path.join(r, file))
print (len(files))

i = 1
for f in tqdm(files):
    signal, rate = librosa.load(f, sr=8000)
    es = np.append(signal[0], signal[1:] - 0.97 * signal[:-1])
    mask = envelope(es, rate)
    es = es[mask]
    sf.write(os.path.join(clean_dir, 'clean_file_' + str(i) + '.wav'), es, rate)
    i += 1
