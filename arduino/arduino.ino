#define ALERT_LIMIT_VALUE 300
// Pin設定
int redPin   = 3;
int greenPin = 5;
int bluePin  = 6;
int psdPin   = 1;
// ステータス
char mode = 'N';
char message[30];
int messageNextIndex = 0;
bool isAlert = false;
int ledCounter = 0;
bool isShow = false;
// 保存した色
int currentRed   = 255;
int currentGreen = 0;
int currentBlue  = 0;

/**
 * 初期化
 */
void setup() {
  pinMode(redPin,   OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin,  OUTPUT);
  Serial.begin(9600);
}

/**
 * メインループ処理
 */
void loop() {
  // メッセージ受信ループ
  while(Serial.available()) {
    char ch = Serial.read();
    // モード開始していなければ、開始する
    if (mode == 'N') {
      mode = ch;
    }
    // 終端記号でなければ、メッセージを蓄積する
    else if (ch != '$') {
      message[messageNextIndex] = ch;
      messageNextIndex++;
    }
    // 終端記号なら、終了
    else if (ch == '$') {
      message[messageNextIndex] = '\0'; // 末尾にNULLを入れる
      receivedMessage(mode, message);
      mode = 'N';
      messageNextIndex = 0;
    }
  }
  // 監視ループ
  int value = analogRead(psdPin);
  if (isAlert == false && ALERT_LIMIT_VALUE < value) {
    isAlert = true;
    sendAlert(isAlert);
  }
  else if (isAlert == true && value < ALERT_LIMIT_VALUE) {
    isAlert = false;
    sendAlert(isAlert);
  }
  // 点滅用
  if (500 < ledCounter++) {
    isShow = !isShow;
    ledCounter = 0;
  }
  // LEDを更新
  updateLED(isAlert && isShow, currentRed, currentGreen, currentBlue);
}

/**
 * シリアルポートでメッセージを送信する
 */
void sendSerialMessage(char* message) {
  Serial.println(message);
}

/**
 * アラートを送信する
 */
void sendAlert(bool isAlert) {
  char sendMessage[100];
  sprintf(sendMessage, "{ \"type\": \"alert\", \"isAlert\": %s }", isAlert ? "true" : "false");
  sendSerialMessage(sendMessage);
}

/**
 * 色を指定のRGB値で更新する
 */
void setColor(int red, int green, int blue) {
  currentRed   = red;
  currentGreen = green;
  currentBlue  = blue;
}

/**
 * LEDの点灯を更新
 */
void updateLED(bool show, int red, int green, int blue) {
  if (show) {
    analogWrite(redPin,   red);
    analogWrite(greenPin, green);
    analogWrite(bluePin,  blue);
  } else {
    analogWrite(redPin,   0);
    analogWrite(greenPin, 0);
    analogWrite(bluePin,  0);
  }
}

/**
 * メッセージ受信処理
 */
void receivedMessage(char mode, char* message) {
  if (mode == 'C') {
    receiveColor(message);
  } else if (mode == 'G') {
    receiveGetColor(message);
  }
}

/**
 * カラーメッセージを受信
 */
void receiveColor(char* message) {
  long color = atol(message);
  int red   = (color >> 16) & 255;
  int green = (color >>  8) & 255;
  int blue  = (color >>  0) & 255;
  setColor(red, green, blue);
}

/**
 * 現在のカラーを返すメッセージを受信
 */
void receiveGetColor(char* message) {
  char sendMessage[100];
  sprintf(sendMessage, "{ \"type\": \"color\", \"red\": %d, \"green\": %d, \"blue\": %d }", currentRed, currentGreen, currentBlue);
  sendSerialMessage(sendMessage);
}
