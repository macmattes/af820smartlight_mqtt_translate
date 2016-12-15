var Client = require('strong-pubsub');
var Adapter = require('strong-pubsub-mqtt');

var sub = new Client({host: '127.0.0.1', port: 1883}, Adapter);
var pub = new Client({host: '127.0.0.1', port: 1883}, Adapter);

var stopic = '/smartlight/EG_Wohnzimmer'

sub.subscribe('stat_json' + stopic);

sub.on('message', function(topic, msg) {
 console.log(topic, msg.toString());

 var data = JSON.parse(msg);

 function toArray(obj) {
  const result = [];
  for (const prop in obj) {
    const value = obj[prop];
    if (typeof value === 'object') {
      result.push(toArray(value));
    } else {
      result.push(value);
      console.log(prop,value);
      sub.publish('stat' + stopic + prop, value.toString());
    }
  }
  return result;
 }

 console.log(toArray(data));

})

pub.subscribe('cmnd' + stopic + '/#');

pub.on('message', function(topic, msg) {
 console.log(topic, msg.toString());
 var tres = topic.split("/");
 var res = msg.toString().split(",");
 console.log(res[0],tres.length,tres[tres.length-1]);

   if (msg.toString() === 'on') {
      pub.publish('cmnd_json' + stopic, '{ "cmd" : "turnOn" }');
   } else if (msg.toString() === 'off') {
      pub.publish('cmnd_json' + stopic, '{ "cmd" : "turnOff" }');
   } else if (msg.toString() === 'checkStatus') {
      pub.publish('cmnd_json' + stopic, '{ "cmd"  :  "checkStatus" }');
   } else if (msg.toString() === 'checkWifi') {
      pub.publish('cmnd_json' + stopic, '{ "cmd"  :  "checkWifi" }');
   } else if (msg.toString() === 'sleep') {
      pub.publish('cmnd_json' + stopic, '{ "cmd"  :  "sleep", "time" : ' + res[0] + ' }');
   } else if (msg.toString() === 'register') {
      pub.publish('cmnd_json' + stopic, '{ "cmd"  :  "register" }');
   } else if (tres[tres.length-1] === 'setColorRGB') {
      pub.publish('cmnd_json' + stopic, '{ "cmd" : "setColor", "red": ' + parseInt(res[0].substr(0, 2), 16) + ', "green": ' + parseInt(res[0].substr(2, 2), 16) + ', "blue": ' + parseInt(res[0].substr(4, 2), 16) + ', "white": 0, "time": 300, "lux": 0 }');
   } else if (tres[tres.length-1] === 'setColorWhite') {
      pub.publish('cmnd_json' + stopic, '{ "cmd" : "setColor", "red": 0, "green": 0, "blue": 0, "white": ' + res[0] + ', "time": 300, "lux": ' + res[0] + ' }');
   }


});
