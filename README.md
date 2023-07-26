# Monesting

完全自分用サブスク管理Webアプリ

使用にはGoogleアカウントが必要です。

## 準備

### 1. OAuth 2.0 認証情報の取得

主要機能を使うにはOAuth2でGoogle APIへアクセスできるようにする必要があります。

[公式ドキュメント](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)等を参考にOAuth 2.0 認証情報を取得してください。

このアプリは `https://www.googleapis.com/auth/drive.appdata` のスコープが必要です。

### 2. 環境変数ファイルの編集

この`README.md`と同じ階層に.envファイルを作成し、取得した認証情報を使って以下の内容を入れて保存してください。

```env
AUTH_GOOGLE_CLIENT_ID=" < client_id > "
AUTH_GOOGLE_CLIENT_SECRET=" < client_secret >"
AUTH_JWT_SECRET=" < 任意のjwt secret文字列 > "
```

### 3. 必要パッケージのダウンロード

このアプリを動作させるためにはNode.js 18が必要です。

以下のコマンドを実行します。

すでにyarn等を使用している場合は各自読み替えてください。

```sh
npm npm ci
```

## 開発サーバー起動

```sh
npm run dev
```

## ビルド

```sh
npm run build
```
