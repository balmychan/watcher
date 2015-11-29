// Import
var sys        = require('sys');
var serialport = require('serialport');
var express    = require('express');
var ws         = require('websocket.io');
var moment     = require('moment');
var request    = require('request');

// State
var alertHistories = [
  // { 'date': 'xxxx-xx-xx xx:xx:xx', 'isAlert': true|false }
];

/////////////////////////
// Serial port
/////////////////////////
var serialPort = new serialport.SerialPort("/dev/tty.usbmodem14111", {
  baudrate: 9600
});
serialPort.on("open", function () {
  console.log('\033[96m Serial port connected\033[39m');
  serialPort.on('data', function(input) {
    try {
      var buffer = new Buffer(input, 'utf8');
      var data = JSON.parse(buffer);
      console.log("Received:" + buffer);
      if (data.type == "alert") {
        alertHistories.unshift({
          'date': moment().format('YYYY/MM/DD HH:mm:ss'),
          'isAlert': data.isAlert
        });
        sendAlert(data.isAlert);
      }
    } catch(e) {}
  });
});

/**
 * Send color code to Arduino
 */
function sendColor(red, green, blue) {
  var message = (red << 16) ^ (green << 8) ^ (blue << 0);
  serialPort.write("C" + message + "$");
}

/////////////////////////
// WebSocket server
/////////////////////////
var wsServer = ws.listen(8888, function () {
  console.log('\033[96m WebSocket server running\033[39m');
});

/**
 * 監視状況を送信
 */
function sendAlert(isAlert) {
  wsServer.clients.forEach(function(client) {
    client.send(JSON.stringify({ 'isAlert' : isAlert }));
  });
  tweetAlert();
}

function tweetAlert() {
  var options = {
    uri: 'https://zapier.com/hooks/catch/3gcq9h/',
    form: { "test": "test", "date": moment().format('YYYY/MM/DD HH:mm:ss') },
    json: true
  };
  request.post(options, function(error, response, body){
    // noop
    console.log(error);
    console.log(response);
  });
}

/////////////////////////
// Web server
/////////////////////////
var app = express();
app.use(express.static('public'));
app.get('/api/v1/color', function(req, res) {
  var red   = req.query.red;
  var green = req.query.green;
  var blue  = req.query.blue;
  sendColor(red, green, blue);
  res.send('ok');
});
app.get('/api/v1/alert_histories', function(req, res) {
  res.send(JSON.stringify(alertHistories.slice(0, 19)));
});
app.get('/api/v1/alert/on', function(req, res){
  sendAlert(true);
  res.send('ok');
});
app.get('/api/v1/alert/off', function(req, res){
  sendAlert(false);
  res.send('ok');
});
var webServer = app.listen(3000, function () {
  console.log('\033[96m Web server running\033[39m');
  var host = webServer.address().address;
  var port = webServer.address().port;
});

