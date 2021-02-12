import os
import glob
import argparse
import numpy as np


IMGS_ROOT_DIR = '../data/imgs'


def check_data_num():
    extended_dir = os.path.join(IMGS_ROOT_DIR, 'extended')
    files = os.listdir(extended_dir)
    targets = [f for f in files if os.path.isdir(os.path.join(extended_dir, f))]

    max_length = max([len(target) for target in targets])
    for target in targets:
        imgs = glob.glob(os.path.join(extended_dir, target, '*.jpg'))
        print(target.ljust(max_length), len(imgs))




def main():
    check_data_num()

if __name__ == '__main__':
    main()
