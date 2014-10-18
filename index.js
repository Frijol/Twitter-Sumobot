// Get Tessel connected to Wifi
var tessel = require('tessel');
var wifi = require('wifi-cc3000');
var wifiSettings = {
  ssid: 'Gaumenkitzel',
  password: 'Gaumenkitzel',
  timeout: 40
};

checkConnection();

wifi.on('disconnect', function () {
  console.log('Disconnected.');
  checkConnection();
});

function checkConnection () {
  if (wifi.isConnected()) {
    console.log('Connected.');
    main();
  } else {
    console.log('Connecting...');
    wifi.connect(wifiSettings, function (err, res) {
      if(err) {
        console.log('Error connecting:', err);
      }
      checkConnection();
    });
  }
}

function main () {
  // Set up Twitter
  console.log('Setting up Twitter...');
  var twitter = require('twitter');
  var util = require('util');
  var twit = new twitter({
    consumer_key: 'O7oc0pvsZn4xjgcuHuYdX4FaC',
    consumer_secret: 'iJYuHFz2sD46Nvk3mcwzX8uih14aEAMgVWdWoR59nx8v6Zl7ZX',
    access_token_key: '2529232909-luARGU89K4CKFMvfzBjCgG6ubefzDkdDWkSB85i',
    access_token_secret: 'GXQfuzvGdjLEs3t1HEYfhQ9x9bdBcSBVXjBkbRgwYlOE0'
  });
  tessel.led[0].output(1);
  console.log('Twitter is all set up.');
  
  // Set up servos
  var servoLib = require('servo-pca9685');
  var servo = servoLib.use(tessel.port['A']);

  // When servo module is ready...
  servo.on('ready', function () {
    console.log('Servo module ready. Listening for tweets...');
    tessel.led[1].output(1);
    // Stream tweets that mention the keyword
    twit.stream('statuses/filter', {track:'#Tesselbot'}, function(stream) {
      stream.on('data', function(data) {
        var tweet = data.text;
        console.log(tweet);
        if (tweet.indexOf('forward') > 0) {
          forward();
        } else if ( tweet.indexOf('back') > 0 ) {
          back();
        } else if (tweet.indexOf('right') > 0 ) {
          right();
        } else if (tweet.indexOf('left') > 0) {
          left();
        } else {
          // Anything not an explicit command makes it stop
          stop();
        }
      });
    });
  });
}

// Motion functions
function forward() {
  console.log('Moving: forward');
  servo.move(1, 1);
  servo.move(2, 0);
}

function back() {
  console.log('Moving: back');
  servo.move(1, 0);
  servo.move(2, 1);
}

function right() {
  console.log('Moving: right');
  servo.move(1, 1);
  servo.move(2, 1);
}

function left() {
  console.log('Moving: left');
  servo.move(1, 0);
  servo.move(2, 0);
}

function stop() {
  console.log('Stopping.');
  servo.move(1, 0.5);
  servo.move(2, 0.5);
}
