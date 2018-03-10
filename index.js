var config = require('./config');
var Log = require('log'), log = new Log(config.log.level);
var mqtt = require('mqtt');
var TelegramBot = require('node-telegram-bot-api');
var http = require('http');
var fs = require('fs');

var telegramBot = new TelegramBot(config.telegram.token, {polling: true});
var mqtt = mqtt.connect(config.mqtt);

var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

mqtt.on('error', function (error) {
    log.error(error);
});

mqtt.on('connect', function () {
    //log.info('Connected to mqtt broker!')
    mqtt.publish(config.mqtt.publish, 'online')
    mqtt.subscribe(config.mqtt.subscription);
});

mqtt.on('message', function (topic, message) {
    var payload = message.toString();
    var chatId = topic.substring(topic.lastIndexOf('/')+1);
    if (topic.lastIndexOf('/message') > 0) {
	 telegramBot.sendMessage(chatId, 'message');
	} else if (topic.lastIndexOf('/image') > 0) {
       var tmp = payload.split("#");
       download(tmp[0], '/var/tmp/' + tmp[1], function(){
       telegramBot.sendPhoto(chatId, '/var/tmp/' + tmp[1]);
      });
     //telegramBot.sendPhoto(chatId, payload);
	} else {
     telegramBot.sendMessage(chatId, payload);
    }
});

// Matches /fhem [whatever]
telegramBot.onText(/\/fhem (.+)/, function onEchoText(msg, match) {
  const resp = match[1];
  const chatId = msg.chat.id;
  mqtt.publish(config.mqtt.publish + '/' + msg.chat.id, resp)
});