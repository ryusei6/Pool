# lights-out
パズルゲーム  
https://lights-out-f975d.web.app/
<img width="" src="https://user-images.githubusercontent.com/45719980/125819179-91a5e785-dafd-4d12-9c9e-8eb96974b7ce.png">

## 参考
- [React.jsプロジェクト立ち上げ方](https://note.com/natsukingdom/n/n2dd88d531f22)

## デプロイ手順
```
$ npm run build
$ firebase deploy
```

長期間ログインしていないと以下のようなエラーが出る時がある。
> Error: Failed to get Firebase project lights-out-f975d. Please make sure the project exists and your account has permission to access it.

その時はログインし直すと直る
```
$ firebase logout
$ firebase login
$ npm run build
$ firebase deploy
```
