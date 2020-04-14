import pandas as pd
import unittest
import librosa

local_dir = 'data/files.csv'

class UnitTests(unittest.TestCase):
    def test(self):
        self.assertTrue(True)

    def test_load(self):
        self.assertIsInstance(pd.read_csv(local_dir), pd.DataFrame)

    def test_names(self):
        df = pd.read_csv(local_dir, index_col=0)
        self.assertListEqual(list(df.columns), ['filename', 'label'])
    

if __name__ == '__main__':
    unittest.main()
    