import os
import math
import glob
import json
import random
from datetime import datetime

import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import keras
from keras.models import Sequential, load_model
from keras.layers import Dense, GlobalAveragePooling2D
from keras.layers.convolutional import Conv2D
from keras.layers.pooling import MaxPool2D, GlobalAveragePooling2D
from keras.layers.core import Activation, Flatten
from keras.layers import BatchNormalization, Dropout
from sklearn.metrics import classification_report


load = True
batch_size = 128
img_data = []
img_label = []
categories = ['Larry_Page','Jeff_Bezos','Mark_Zuckerberg', 'others']
img_size = (150,150,3)
n_classes = len(categories)
ROOT_DIR = '../data/imgs'
LOGS_ROOT_DIR = '../logs/'
EXEC_TIME = datetime.now().strftime("%Y%m%d-%H%M%S")
LOG_DIR = os.path.join(LOGS_ROOT_DIR, EXEC_TIME)

def _make_sample(files):
    for category, file_name in files:
        _add_sample(category, file_name)
    return np.array(img_data), np.array(img_label)


def _add_sample(category, file_name):
    img = Image.open(file_name)
    img = img.convert("RGB")
    img = img.resize((150, 150))
    data = np.asarray(img)
    img_data.append(data)
    img_label.append(category)


def read_img():
    all_files = []
    for idx, category in enumerate(categories):
        img_dir = os.path.join(ROOT_DIR, 'extended', category)
        files = glob.glob(img_dir + '/*.jpg')
        for file in files:
            all_files.append([idx, file])

    random.shuffle(all_files)
    th = math.floor(len(all_files) * 0.8)
    train = all_files[0:th]
    test = all_files[th:]
    th = math.floor(len(train) * 0.9)
    val = train[th:]
    train = train[0:th]
    x_train, y_train = _make_sample(train)
    x_test, y_test = _make_sample(test)
    x_val, y_val = _make_sample(val)

    x_train = x_train.astype('float32')
    x_test = x_test.astype('float32')
    x_val = x_val.astype('float32')
    x_train /= 255
    x_test /= 255
    x_val /= 255
    y_train = keras.utils.to_categorical(y_train, n_classes)
    y_test = keras.utils.to_categorical(y_test, n_classes)
    y_val = keras.utils.to_categorical(y_val, n_classes)
    return x_train, y_train, x_test, y_test, x_val, y_val


def learn_model(x_train, y_train, x_val, y_val):
    model = Sequential()
    model.add(Conv2D(64, (3,3), padding='same', activation='relu',input_shape=img_size))
    model.add(Conv2D(64, (3,3), padding='same',activation='relu'))
    model.add(MaxPool2D())
    model.add(GlobalAveragePooling2D())
    model.add(Dense(128, activation='relu'))
    model.add(Dense(n_classes, activation='softmax'))
    model.compile(optimizer='sgd',
                 loss='categorical_crossentropy',
                 metrics=['accuracy'])
    model.summary()

    early_stopping = keras.callbacks.EarlyStopping(monitor='val_loss', patience=2, verbose=0, mode='auto')
    history = model.fit(x_train,
                        y_train,
                        epochs=1,
                        batch_size=batch_size,
                        validation_data=(x_val, y_val),
                        callbacks=[early_stopping])
    model.save('model.h5', include_optimizer=False)
    return model, history


def save_history_loss_and_acc(history):
    fig, axes = plt.subplots(1,2)
    axes[0].plot(history.history['loss'])
    axes[0].plot(history.history['val_loss'])
    axes[0].title('model loss')
    axes[0].ylabel('loss')
    axes[0].xlabel('epoch')
    axes[0].legend(['train', 'test'], loc='best')

    axes[1].plot(history.history['acc'])
    axes[1].plot(history.history['val_acc'])
    axes[1].title('model accuracy')
    axes[1].ylabel('accuracy')
    axes[1].xlabel('epoch')
    axes[1].legend(['train', 'test'], loc='best')

    fig.savefig(os.path.join(LOG_DIR, 'history_loss.jpg'))


# imgサンプル
def img_show(model, x_test, y_test):
    y_pred = model.predict(x_test)
    y_test = [int(y_test[i].argmax()) for i in range(len(y_test))]
    y_pred = [int(y_pred[i].argmax()) for i in range(len(y_pred))]
    print(y_test[:5])
    print(y_pred[:5])
    score_dict = classification_report(y_test, y_pred, output_dict=True)
    with open(os.path.join(LOG_DIR, 'classification_report.json'), 'w') as f:
        json.dump(score_dict, f, indent=4)

    fig, axes = plt.subplots(1,10, figsize=(20, 20))
    with open(os.path.join(LOG_DIR, 'predict.json'), 'w') as f:
        dict = {
            'predict': y_pred,
            'label': y_test,
        }
        json.dump(dict, f, indent=4)
    for i in range(10):
        axes[i].set_title('predict: {}\nanswer: {}'.format(str(y_pred[i]), str(y_test[i])))
        axes[i].axis("off")
        axes[i].imshow(x_test[i].reshape(150,150,3))
    fig.savefig(os.path.join(LOG_DIR, 'img.jpg'))


def check_data(x_train, y_train, x_test, y_test, x_val, y_val):
    for i in range(len(y_test)):
        print(y_test[i].argmax())


def main():
    os.makedirs(LOG_DIR, exist_ok=True)
    x_train, y_train, x_test, y_test, x_val, y_val = read_img()
    # check_data(x_train, y_train, x_test, y_test, x_val, y_val)
    if load:
        model = load_model('model.h5', compile=False)
    else:
        model, history = learn_model(x_train, y_train, x_val, y_val)
        save_history_loss_and_acc(history)
    img_show(model, x_test, y_test)


if __name__ == '__main__':
    main()
