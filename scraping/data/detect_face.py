# -*- coding:utf-8 -*-
import os
import glob
import argparse

import cv2
import numpy as np


cascade_path = './haarcascades/haarcascade_frontalface_default.xml'
faceCascade = cv2.CascadeClassifier(cascade_path)

IMGS_ROOT_DIR = './imgs'


def detect_face(target):
    target_dir = os.path.join(IMGS_ROOT_DIR, 'original', target)
    if not os.path.isdir(target_dir):
        print('directory not found')
        return
    face_dir = os.path.join(IMGS_ROOT_DIR, 'face', target)
    detected_dir = os.path.join(IMGS_ROOT_DIR, 'detected', target)
    os.makedirs(face_dir, exist_ok=True)
    os.makedirs(detected_dir, exist_ok=True)

    error = 0
    file_num = 1
    error_max = 100
    imgs = glob.glob(os.path.join(target_dir, '*.jpg'))
    imgs_num = len(imgs)
    while file_num - 1 < imgs_num:
        try:
            path_to_img = os.path.join(target_dir, str(file_num).zfill(4) + '.jpg')
            img = cv2.imread(path_to_img, cv2.IMREAD_COLOR)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = faceCascade.detectMultiScale(gray, 1.1, 3)
            img2 = img.copy()
            if len(faces) > 0:
                for face_num, rect in enumerate(faces):
                    cv2.rectangle(img2, tuple(rect[0:2]), tuple(rect[0:2]+rect[2:4]), (0, 0,255), thickness=1)
                    cv2.imwrite(os.path.join(detected_dir, str(file_num) + '.jpg'), img2)
                    print('-> Cutting image', str(file_num).zfill(4) + '_' + str(face_num+1) + '.jpg', end=' ')
                    x = rect[0]
                    y = rect[1]
                    w = rect[2]
                    h = rect[3]
                    cv2.imwrite(os.path.join(face_dir, str(file_num).zfill(4) + '_' + str(face_num+1) + '.jpg'), img[y:y+h, x:x+w])
                    print('successful')
            else:
                print('-> ' + str(file_num).zfill(4) + '.jpg: No Face')
            file_num += 1
        except:
            print('-> ' + str(file_num).zfill(4) + '.jpg: No image')
            file_num += 1
            error += 1
            if error >= error_max:
                print('Probably unsupported format images are included.')
                break
            continue


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-t', '--target', help='target name', type=str, required=True)
    args = parser.parse_args()
    detect_face(args.target)


if __name__ == '__main__':
    main()
