import os
import json
import urllib
import argparse
import requests
from bs4 import BeautifulSoup
import time

class Yahoo(object):
    def __init__(self):
        self.url = 'https://search.yahoo.co.jp/image/search'

    def _create_url(self, keyword, count):
        params = urllib.parse.urlencode(
            {'p': keyword, 'ei': 'UTF-8', 'b': count}
        )
        url = self.url + '?' + params
        return url

    def search(self, keyword, max):
        print('searching \'{}\'...'.format(keyword))
        results = []
        total = 0
        count = 1
        max_page = (max-1)//20 + 1
        for i in range(max_page):
            url = self._create_url(keyword, count)
            count += 20

            html = requests.get(url).text
            soup = BeautifulSoup(html, 'lxml') # lxml: C言語で高速、html.parser: Pythonで遅い
            tags = soup.find_all("img")
            image_url_list = [tag.get("src") for tag in tags][:20]

            if not len(image_url_list):
                print('-> No more images')
                break
            elif len(image_url_list) > max - total:
                results += image_url_list[: max - total]
                break
            else:
                results += image_url_list
                total += len(image_url_list)

        print('-> Found', str(len(results)), 'images')
        return results

def input():
    parser = argparse.ArgumentParser()
    parser.add_argument('-t', '--target', help='target name', type=str, required=True)
    parser.add_argument('-n', '--number', help='number of images', type=int, required=True)
    parser.add_argument('-d', '--directory', help='download location', type=str, default='./imgs')
    args = parser.parse_args()

    target_name = args.target
    number = args.number
    imgs_dir = args.directory

    os.makedirs(imgs_dir, exist_ok=True)
    os.makedirs(os.path.join(imgs_dir, target_name), exist_ok=True)

    return {'imgs_dir': imgs_dir, 'target_name': target_name, 'number': number}

def download(results,imgs_dir,target_name):
    download_errors = []
    for i, url in enumerate(results):
        print('-> Downloading image', str(i + 1).zfill(4), end=' ')
        try:
            urllib.request.urlretrieve(
                url,
                os.path.join(imgs_dir, target_name, str(i + 1).zfill(4) + '.jpg'),
            )
            print('successful')
            time.sleep(1)
        except BaseException:
            print('failed')
            download_errors.append(i + 1)
            continue

    print('-' * 50)
    print('Complete downloaded')
    print('├─ Successful downloaded', len(results) - len(download_errors), 'images')
    print('└─ Failed to download', len(download_errors), 'images', *download_errors)

def main():
    input_data = input()
    yahoo = Yahoo()
    results = yahoo.search(input_data['target_name'], input_data['number'])
    download(results,input_data['imgs_dir'], input_data['target_name'])

if __name__ == '__main__':
    main()
