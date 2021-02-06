import requests
import hmac
import hashlib
import datetime
import json
import sys
import settings

API_KEY = settings.API_KEY
SECRET_KEY = settings.SECRET_KEY
ASSETS = ['all', 'btc', 'xrp', 'ltc', 'eth', 'mona', 'bcc', 'xlm', 'qtum']
REJECT_ASSETS = []


class Api_private():
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
    api = Api_private(url)
    res = api.get_response()
    return res


def calc_average(trade_history_list, asset):
    trade_history_list.reverse()
    pair = asset + '_jpy'
    value_total = 0
    amount_total = 0
    count_now = 0
    sign = 1
    for trade_history in trade_history_list:
        if trade_history['pair'] == pair:
            if trade_history['side'] == 'buy':
                sign = 1
            elif trade_history['side'] == 'sell':
                sign = -1
            count_now = float(trade_history['amount'])
            price_now = float(trade_history['price'])
            value_total += sign * count_now * price_now
            amount_total += sign * count_now
    if amount_total < 1e-10:
        return 0
    return value_total / amount_total


def calc_profit(trade_history_list, asset):
    pair = asset + '_jpy'
    profit = 0
    for trade_history in trade_history_list:
        if trade_history['pair'] == pair:
            if trade_history['side'] == 'buy':
                profit -= float(trade_history['amount']) * float(trade_history['price']) + float(trade_history['fee_amount_quote'])
            if trade_history['side'] == 'sell':
                profit += float(trade_history['amount']) * float(trade_history['price']) + float(trade_history['fee_amount_quote'])
    asset_value = calc_asset_value(asset)
    profit += asset_value
    return round(profit)


def calc_asset_value(target_asset):
    url = '/user/assets'
    api = Api_private(url)
    res = api.get_response()
    for asset in res['data']['assets']:
        asset_name = asset['asset']
        if target_asset in REJECT_ASSETS:
            print('{} には対応していません'.format(target_asset))
            sys.exit()
        onhand_amount = float(asset['onhand_amount'])
        if asset_name == target_asset:
            pair = target_asset + '_jpy'
            asset_value = onhand_amount*float(fetch_ticker(pair)['data']['last'])
    return asset_value


def fetch_ticker(pair):
    api_public = Api_public('/{}/ticker'.format(pair))
    res = api_public.get_response()
    return res


def asset_index_input():
    try:
        asset_index = int(input())
        if asset_index >= len(ASSETS):
            print('0~{}から選んでください'.format(len(ASSETS)-1))
            return asset_index_input()
        return asset_index
    except ValueError:
        print('数字を入力してください')
        return asset_index_input()


def show_pl(asset, average, profit):
    print('-'*15)
    print('通貨：{}'.format(asset.upper()))
    print('平均：{:.3f}'.format(average))
    print('損益：{}'.format(profit))


def calc_all_assets_pl(trade_history_list):
    profit_total = 0
    for asset in ASSETS:
        if asset == 'all':
            continue
        profit = calc_asset_pl(trade_history_list, asset)
        profit_total += profit
    print('-'*25)
    print('損益（total）：{}'.format(profit_total))
    print('-'*25)


def calc_asset_pl(trade_history_list, asset):
    average = calc_average(trade_history_list, asset)
    profit = calc_profit(trade_history_list, asset)
    show_pl(asset, average, profit)
    return profit


def main():
    # 0: all, 1: btc, 2: xrp, 3: ltc, 4: eth, 5: mona, 6: bcc, 7: xlm, 8: qtum
    print(', '.join([str('{}: {}'.format(i, asset_name)) for i, asset_name in enumerate(ASSETS)]))
    index = asset_index_input()
    asset = ASSETS[index]
    trade_history_list = fetch_trade_history()['data']['trades']
    if asset == 'all':
        calc_all_assets_pl(trade_history_list)
    else:
        calc_asset_pl(trade_history_list, asset)


if __name__ == '__main__':
    main()
