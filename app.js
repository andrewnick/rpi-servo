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

  var speed = 0;
  var dir = 'cw';

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
      speed += 0.05
      console.log("faster");
    } else if (key.name === "down") {
      speed -= 0.05
      console.log("slower");
    } else if (key.name === "space") {
      console.log("Stopping");
      servo.stop();
      speed = 0;
    } else if (key.name === "left") {
      console.log("left")
      dir = "ccw"
    } else if (key.name === "right") {
    	console.log("right")
      dir = "cw";
    }

    if (dir === 'cw') {
      servo.cw(speed);
    } else {
      servo.ccw(speed);
    }

  });

  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      // socket.broadcast.emit('hi');
       // io.emit('chat message', msg);
      console.log('message: ' + msg);
    });
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
