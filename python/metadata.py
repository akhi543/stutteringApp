import os
import pandas as pd


local_dir = 'data/'
external_dir = '/Volumes/Seagate/SeagateBackupPlus/Github/Capstone/data/'


def main():
    filenames = []
    for r, d, f in os.walk(local_dir):
        filenames.extend(f)
    
    filenames = [file for file in filenames if file.endswith('.wav')]
    labels = [1 for x in range(len(filenames))]
    df = pd.DataFrame(list(zip(filenames, labels)), columns=['filename', 'label'])
    print (df)

    df.to_csv(local_dir + 'files.csv')
    df.to_csv(external_dir + 'files.csv')
    

if __name__ == "__main__":
    main()
