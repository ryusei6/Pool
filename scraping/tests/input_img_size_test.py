import os
import glob
import unittest

import cv2

CHECK_IMG_DIR = '../data/imgs/extended'
IMG_SIZE = (150, 150, 3)


class InputImgSizeTestCase(unittest.TestCase):
    '''
    face_paddingの画像サイズが(200, 200, 3)になっているかのチェック
    '''
    def test_size(self):
        dirs = glob.glob(os.path.join(CHECK_IMG_DIR, '*/'))
        for dir in dirs:
            files = glob.glob(os.path.join(dir, '*.jpg'))
            for file in files:
                img = cv2.imread(file, cv2.COLOR_BGR2RGB)
                self.assertEqual(img.shape, IMG_SIZE)


if __name__ == '__main__':
    unittest.main()
