var tessel = require('tessel');
var servoLib = require('servo-pca9685');
var servo = servoLib.use(tessel.port['A']);

function forward() {
  servo.move(1, 1);
  servo.move(2, 0);
}

function back() {
  servo.move(1, 0);
  servo.move(2, 1);
}

function right() {
  servo.move(1, 1);
  servo.move(2, 1);
}

function left() {
  servo.move(1, 0);
  servo.move(2, 0);
}

function stop() {
  servo.move(1, 0.5);
  servo.move(2, 0.5);
}
