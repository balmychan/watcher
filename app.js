var sys        = require('sys');
var serialport = require('serialport');
var express    = require('express');
var ws         = require('websocket.io');

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
        sendAlert(data.isAlert);
      }
    } catch(e) {}
  });
});

/**
 * Send color code to Arduino
 */
function sendColor(red, blue, green) {
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
}

/////////////////////////
// Web server
/////////////////////////
var app = express();
app.use(express.static('public'));
app.get('/api/v1/color', function(req, res){
  var red   = req.query.red;
  var green = req.query.green;
  var blue  = req.query.blue;
  sendColor(red, green, blue);
  res.send('ok');
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

