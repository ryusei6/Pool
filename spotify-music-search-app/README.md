# spotify-music-search-app
楽曲の検索、再生をするWebアプリ  
https://spotify-music-search-app.web.app/

## 概要
アーティスト名を入力すると、そのアーティストのアルバムが表示される。  
<img width="720" alt="album" src="https://user-images.githubusercontent.com/45719980/125818227-397b6460-9db2-4dbf-9acb-3cf15962a504.png">

アルバムをクリックすると、そのアルバムに入っている楽曲を選択、試聴できる。  
<img width="720" alt="track" src="https://user-images.githubusercontent.com/45719980/125818546-ff5574fd-6cc9-4cdc-a214-5fbba05f5b32.png">


おすすめのアーティストを表示する。　　
<img width="720" alt="recommend" src="https://user-images.githubusercontent.com/45719980/125896090-595d2791-12bd-4295-9642-bbb6caedcfd8.png">


## Usage
### Spotify APIの設定
[ここ](https://developer.spotify.com/) で Spotify APIの設定

### 環境変数
`.env`に以下を設定  
- REACT_APP_REDIRECT_URI
- REACT_APP_CLIENT_ID

### ローカルで動かす
```
$ npm start
```

## 参考
[spotify API](https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-recommendations)  
[Spotify API + Reactを使って似ている曲を教えてくれるアプリを作ってみた](https://qiita.com/afroman09/items/cc129e57eadc9ae844fd)
