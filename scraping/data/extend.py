import os
import glob
import argparse
import numpy as np
from keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array

IMGS_ROOT_DIR = './imgs'
EXTEND_NUM = 50
RESIZE_SHAPE = (150, 150)


# 画像を拡張する関数
def draw_images(generator, x, index, output_dir):
    save_name = 'extened_' + str(index).zfill(4)
    g = generator.flow(x, batch_size=1, save_to_dir=output_dir, save_prefix=save_name, save_format='jpg')

    # 1つの入力画像から何枚拡張するかを指定（今回は50枚）
    for i in range(EXTEND_NUM):
        bach = g.next()


def extend_img(target):
    target_dir = os.path.join(IMGS_ROOT_DIR, 'face', target)
    if not os.path.isdir(target_dir):
        print('directory not found')
        return
    extended_dir = os.path.join(IMGS_ROOT_DIR, 'extended', target)
    os.makedirs(extended_dir, exist_ok=True)

    datagen = ImageDataGenerator(
        rotation_range=30,
        width_shift_range=20,
        height_shift_range=0.,
        zoom_range=0.1,
        horizontal_flip=True,
        vertical_flip=True
    )

    imgs_path = glob.glob(target_dir + '/*.jpg')
    # 読み込んだ画像を順に拡張
    for i in range(len(imgs_path)):
        img = load_img(imgs_path[i])
        img = img.resize(RESIZE_SHAPE)
        x = img_to_array(img)
        x = np.expand_dims(x, axis=0)
        draw_images(datagen, x, i, extended_dir)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-t', '--target', help='target name', type=str, required=True)
    args = parser.parse_args()
    extend_img(args.target)


if __name__ == '__main__':
    main()
