import os
import glob
import argparse
import numpy as np
from keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array


# 画像を拡張する関数
def draw_images(generator, x, index, output_dir):
    save_name = 'extened_' + str(index).zfill(4)
    g = generator.flow(x, batch_size=1, save_to_dir=output_dir, save_prefix=save_name, save_format='jpeg')

    # 1つの入力画像から何枚拡張するかを指定（今回は50枚）
    for i in range(50):
        bach = g.next()


def extend_img(path_to_imgs_dir):
    if not os.path.isdir(path_to_imgs_dir):
        print('directory not found')
        return
    input_dirs = os.path.split(path_to_imgs_dir)
    if not input_dirs[1]:
        input_dirs = os.path.split(input_dirs[0])
    path_to_original_dir, target = input_dirs
    image_names = os.listdir(path_to_imgs_dir)
    images_num = len(image_names)
    path_to_root_dir = os.path.split(path_to_original_dir)[0]
    path_to_extended_dir = os.path.join(path_to_root_dir, 'extended', target)
    os.makedirs(path_to_extended_dir, exist_ok=True)


    datagen = ImageDataGenerator(
        rotation_range=30,
        width_shift_range=20,
        height_shift_range=0.,
        zoom_range=0.1,
        horizontal_flip=True,
        vertical_flip=True
    )

    # 読み込んだ画像を順に拡張
    for i in range(images_num):
        img = load_img(os.path.join(path_to_imgs_dir, image_names[i]))
        img = img.resize((150, 150))
        x = img_to_array(img)
        x = np.expand_dims(x, axis=0)
        draw_images(datagen, x, i, path_to_extended_dir)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--directory', help='input images location', type=str, required=True)
    args = parser.parse_args()
    path_to_imgs = args.directory
    extend_img(path_to_imgs)


if __name__ == '__main__':
    main()
