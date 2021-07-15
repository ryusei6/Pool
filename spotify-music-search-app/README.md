# spotify-music-search-app
楽曲の検索、再生をするWebアプリ  

## 概要
アーティスト名を入力すると、そのアーティストのアルバムが表示される。  
<img width="720" alt="album" src="https://user-images.githubusercontent.com/45719980/125233961-a44b8680-e31a-11eb-88fe-931d3c8de259.png">

アルバムをクリックすると、そのアルバムに入っている楽曲を選択、試聴できる。  
<img width="720" alt="track" src="https://user-images.githubusercontent.com/45719980/125233942-98f85b00-e31a-11eb-99c3-9eb9995c5ab1.png">


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

### deploy
```
$ npm run build
$ firebase deploy
```

## 参考
[spotify API](https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-recommendations)  
[Spotify API + Reactを使って似ている曲を教えてくれるアプリを作ってみた](https://qiita.com/afroman09/items/cc129e57eadc9ae844fd)
