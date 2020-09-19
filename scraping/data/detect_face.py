# -*- coding:utf-8 -*-
import cv2
import numpy as np
import os
import argparse

cascade_path = './haarcascades/haarcascade_frontalface_default.xml'
faceCascade = cv2.CascadeClassifier(cascade_path)


def detect_face(path_to_imgs_dir):
    if not os.path.isdir(path_to_imgs_dir):
        print('directory not found')
        return
    input_dirs = os.path.split(path_to_imgs_dir)
    if not input_dirs[1]:
        input_dirs = os.path.split(input_dirs[0])
    path_to_original_dir, target = input_dirs
    images_num = len(os.listdir(path_to_imgs_dir))
    path_to_root_dir = os.path.split(path_to_original_dir)[0]
    path_to_face_dir = os.path.join(path_to_root_dir, 'face', target)
    path_to_detected_dir = os.path.join(path_to_root_dir, 'detected', target)
    os.makedirs(path_to_face_dir, exist_ok=True)
    os.makedirs(path_to_detected_dir, exist_ok=True)

    error = 0
    file_num = 1
    error_max = 100
    while file_num - 1 < images_num:
        try:
            path_to_img = os.path.join(path_to_imgs_dir, str(file_num).zfill(4) + '.jpg')
            img = cv2.imread(path_to_img, cv2.IMREAD_COLOR)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = faceCascade.detectMultiScale(gray, 1.1, 3)
            img2 = img.copy()
            if len(faces) > 0:
                for face_num, rect in enumerate(faces):
                    cv2.rectangle(img2, tuple(rect[0:2]), tuple(rect[0:2]+rect[2:4]), (0, 0,255), thickness=1)
                    cv2.imwrite(os.path.join(path_to_detected_dir, str(file_num) + '.jpg'), img2)
                    print('-> Cutting image', str(file_num).zfill(4) + '_' + str(face_num+1) + '.jpg', end=' ')
                    x = rect[0]
                    y = rect[1]
                    w = rect[2]
                    h = rect[3]
                    cv2.imwrite(os.path.join(path_to_face_dir, str(file_num).zfill(4) + '_' + str(face_num+1) + '.jpg'), img[y:y+h, x:x+w])
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
    parser.add_argument('-d', '--directory', help='cutted images location', type=str, required=True)
    args = parser.parse_args()
    directory_name = args.directory

    detect_face(directory_name)


if __name__ == '__main__':
    main()
