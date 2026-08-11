# iPhoneだけで導入する手順（PC不要）

> 最初の1回だけ、GitHubにこのファイル一式を置きます。以後は普通のアプリ感覚です。

## 0. 用意するもの
- iPhone
- Safari
- GitHubアカウント（無料）
- このZIPを「ファイル」アプリで展開したもの

## 1. GitHubに置く
1. Safariで github.com を開いてログイン
2. 右上メニューから **New repository**（新しいリポジトリ）を作る
3. Repository name は `nyanko-checker` などでOK
4. **Public** を選択して作成
5. 作成したリポジトリで **Add file → Upload files**
6. ZIPを展開したフォルダの中身（index.html / app.js / data.js / style.css / sw.js / manifest.webmanifest / icon-180.png / icon-192.png / icon-512.png）をアップロード
7. **Commit changes** を押す

※ iPhoneのGitHub画面でフォルダごとのアップロードが面倒な場合、GitHubアプリではなくSafariの「デスクトップ用Webサイトを表示」を使うと操作しやすいことがあります。

## 2. GitHub PagesをONにする
1. リポジトリの **Settings**
2. **Pages**
3. Build and deployment の Source を **Deploy from a branch**
4. Branch を **main / (root)** にして Save
5. 少しすると Pages 画面に公開URLが表示される

## 3. ホーム画面に追加
1. 公開URLを **Safari** で開く
2. Safariの共有ボタン
3. **ホーム画面に追加**
4. 「Webアプリとして開く」が表示される場合はON
5. 追加

これでホーム画面の「にゃんこ所持」から起動できます。

## 4. 最初の所持登録
1. 全キャラ表示のまま「表示中を全所持」
2. 持っていないキャラだけタップしてグレーに戻す
3. 必要ならガチャごとに確認

## 5. バックアップ（重要）
1. 右上の ⚙︎
2. 「バックアップを書き出す」
3. 共有メニュー → **ファイルに保存**
4. **iCloud Drive** に保存

機種変更やPC復活後は「バックアップから復元」で同じJSONを選択してください。
