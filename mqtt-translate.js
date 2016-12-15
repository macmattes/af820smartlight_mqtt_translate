var Client = require('strong-pubsub');
var Adapter = require('strong-pubsub-mqtt');

var sub = new Client({host: '127.0.0.1', port: 1883}, Adapter);
var pub = new Client({host: '127.0.0.1', port: 1883}, Adapter);

sub.subscribe('stat_json/smartlight/#');
sub.on('message', function(topic, msg) {
 var subtopic = 'stat' + topic.substr(9, topic.length-9);
 console.log(subtopic, topic, msg.toString());

 var data = JSON.parse(msg);

 function toArray(obj) {
  const result = [];
  for (const prop in obj) {
    const value = obj[prop];
    if (typeof value === 'object') {
      result.push(toArray(value));
    } else {
      result.push(value);
      sub.publish( subtopic + '/' + prop, value.toString());
    }
  }
  return result;
 }

 console.log(toArray(data));

})

pub.subscribe('cmnd/smartlight/#');
pub.on('message', function(topic, msg) {
 console.log(topic, msg.toString());
 var tres = topic.split("/");
 var res = msg.toString().split(",");
 var pubtopic = 'cmnd_json' + topic.substr(4, topic.length-4);
 
 console.log(pubtopic, res[0],tres.length);

   if (msg.toString() === 'on') {
      pub.publish( pubtopic , '{ "cmd" : "turnOn" }');
   } else if (msg.toString() === 'off') {
      pub.publish( pubtopic , '{ "cmd" : "turnOff" }');
   } else if (msg.toString() === 'checkStatus') {
      pub.publish( pubtopic , '{ "cmd"  :  "checkStatus" }');
   } else if (msg.toString() === 'checkWifi') {
      pub.publish( pubtopic , '{ "cmd"  :  "checkWifi" }');
   } else if (msg.toString() === 'register') {
      pub.publish( pubtopic , '{ "cmd"  :  "register" }');
   } else if (tres[tres.length-1] === 'setSleep') {
      pub.publish( pubtopic.substr(0, pubtopic.length - 9) , '{ "cmd"  :  "sleep", "time" : ' + res[0] + ' }');
   } else if (tres[tres.length-1] === 'setColorRGB') {
      pub.publish( pubtopic.substr(0, pubtopic.length - 12) , '{ "cmd" : "setColor", "red": ' + parseInt(res[0].substr(0, 2), 16) + ', "green": ' + parseInt(res[0].substr(2, 2), 16) + ', "blue": ' + parseInt(res[0].substr(4, 2), 16) + ', "white": 0, "time": 300, "lux": 0 }');
   } else if (tres[tres.length-1] === 'setColorWhite') {
      pub.publish( pubtopic.substr(0, pubtopic.length - 14) , '{ "cmd" : "setColor", "red": 0, "green": 0, "blue": 0, "white": ' + res[0] + ', "time": 300, "lux": ' + res[0] + ' }');
   }


});
