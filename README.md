
## ファイルの説明

|ファイル名|説明|
|--- |--- |
|app.js|nodeのメインファイル（ここでWebサーバーやWebSocketサーバー、Arduinoとのシリアル通信を実装）|
|public|Webサーバーが返すルートディレクトリ|
|arduino/arduino.ino|Arduinoプログラム|

## 概要図

![wather概要図](https://raw.githubusercontent.com/balmychan/watcher/master/public/img/about_watcher.png)

## セットアップ

```
$ git clone xxxx
$ cd xxxx
$ npm install
$ bower install
$ node app.js
```

app.jsに書かれているシリアルポートの設定（/dev/tty.****の部分）は各自変更すること。もしMacを使っているなら、下記コマンドで確認できる

```
$ ls -1 /dev/tty.*
/dev/tty.BeaatsStduioWireless-SPP
/dev/tty.Bluetooth-Incoming-Port
/dev/tty.usbmodem14111
```

Arduinoと接続されているUSBを確認し、各自設定する