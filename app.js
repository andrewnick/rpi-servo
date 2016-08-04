var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var five = require("johnny-five");
var Raspi = require("raspi-io");

var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  var servo = new five.Servo.Continuous('P1-12');

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {

    if (!key) {
      return;
    }

    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    } else if (key.name === "up") {
      console.log("CW");
      servo.cw();
    } else if (key.name === "down") {
      console.log("CCW");
      servo.ccw();
    } else if (key.name === "space") {
      console.log("Stopping");
      servo.stop();
    } else if (key.name === "left") {
	console.log("left")
	servo.cw(0.1);
    }
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	socket.broadcast.emit('hi');
  	 io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
});

// app.listen(3000, function () {
//  console.log('Example app listening on port 3000!');
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});