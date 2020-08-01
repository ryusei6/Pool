import requests
import hmac
import hashlib
import datetime
import json
import sys
import settings

API_KEY = settings.API_KEY
SECRET_KEY = settings.SECRET_KEY


class Api_private_get():
    def __init__(self, url):
        self.url = url
        self.server_url = 'https://api.bitbank.cc/v1'
        self.str_timestamp = self._get_timestamp()

    def _get_timestamp(self):
        timestamp = str(datetime.datetime.today())
        return timestamp

    def _signature(self):
        signature = hmac.new(bytearray(SECRET_KEY, 'utf-8'), self._make_content(), hashlib.sha256).hexdigest()
        return signature

    def _make_content(self):
        payload = self.str_timestamp + '/v1' + self.url
        payload = bytearray(payload, 'utf-8')
        return payload

    def get_response(self):
        headers = {
            'ACCESS-KEY' : API_KEY,
            'ACCESS-NONCE' : self.str_timestamp,
            'ACCESS-SIGNATURE' : self._signature(),
        }
        url = self.server_url + self.url
        res = requests.get(url, headers=headers).text
        res = json.loads(res)
        return res


class Api_public():
    def __init__(self, url):
        self.url = url
        self.server_url = 'https://public.bitbank.cc'

    def get_response(self):
        url = self.server_url + self.url
        res = requests.get(url).text
        res = json.loads(res)
        return res


def fetch_trade_history():
    url = '/user/spot/trade_history'
    api = Api_private_get(url)
    res = api.get_response()
    return res

def calc_average(trade_history_list, asset):
    trade_history_list.reverse()
    pair = asset + '_jpy'
    average = 0
    count_before = 0
    count_now = 0
    for trade_history in trade_history_list:
        if trade_history['pair'] == pair:
            if trade_history['side'] == 'buy':
                count_now = float(trade_history['amount'])
                price_now = float(trade_history['price'])
                value_before = count_before * average
                value_now = count_now * price_now
                average = (value_before+value_now)/(count_before+count_now)
                value_before = value_now
                count_before += count_now
            if trade_history['side'] == 'sell':
                count_now = float(trade_history['amount'])
                count_before -= count_now
    return average

def calc_benefit(trade_history_list, asset):
    pair = asset + '_jpy'
    benefit = 0
    for trade_history in trade_history_list:
        if trade_history['pair'] == pair:
            if trade_history['side'] == 'buy':
                benefit -= float(trade_history['amount']) * float(trade_history['price']) + float(trade_history['fee_amount_quote'])
            if trade_history['side'] == 'sell':
                benefit += float(trade_history['amount']) * float(trade_history['price']) + float(trade_history['fee_amount_quote'])
    jpy_value, asset_value = calc_asset_value(asset)
    benefit += asset_value
    return round(benefit)

def calc_asset_value(target_asset):
    url = '/user/assets'
    api = Api_private_get(url)
    res = api.get_response()
    for asset in res['data']['assets']:
        asset_name = asset['asset']
        reject_asset = ['ltc', 'eth']
        if target_asset in reject_asset:
            print('{} には対応していません'.format(target_asset))
            sys.exit()
        onhand_amount = float(asset['onhand_amount'])
        if asset_name == 'jpy':
            jpy_value = onhand_amount
        elif asset_name == target_asset:
            pair = target_asset + '_jpy'
            asset_value = onhand_amount*float(fetch_ticker(pair)['data']['last'])
    return jpy_value, asset_value

def fetch_ticker(pair):
    api_public = Api_public('/{}/ticker'.format(pair))
    res = api_public.get_response()
    return res


def main():
    assets = ['jpy', 'btc', 'xrp', 'ltc', 'eth', 'mona', 'bcc']
    asset = assets[2]
    trade_history_list = fetch_trade_history()['data']['trades']
    average = calc_average(trade_history_list, asset)
    benefit = calc_benefit(trade_history_list, asset)
    print('平均：{:.3f}'.format(average))
    print('損益：{}'.format(benefit))


if __name__ == '__main__':
    main()
