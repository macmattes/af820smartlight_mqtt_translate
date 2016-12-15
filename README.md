# af820smartlight_mqtt_translator

Übersetzt MQTT-Json Nachrichten von und zu diesem Projekt "https://gitlab.com/iot/af820smartlight" um die Lampen einfach in FHEM einbinden zu können.
Benötigt eine Node.js Installation obiges Projekt mit allen Abhängigkeiten und die npm Pakete
strong-pubsub und strong-pubsub-mqtt.

wir verbinden uns auf unseren lokalen mqtt-broker 127.0.0.1 es kann  aber auch jeder andere sein

die Übersetzung   
zur Lampe       "cmnd/smartlight/{path}" -> "cmnd_json/smartlight/{path}" 

die Antworten   "stat_json/smartlight/{path}" -> "stat/smartlight/{path}"

in Fhem ein MQTT Device je Lampengruppe anlegen
define smartlight MQTT_DEVICE

die Publish Atribute anlegen
attr smartlight publishSet_setColorRGB cmnd/smartlight/EG_Wohnzimmer/setColorRGB
attr smartlight publishSet_setColorWhite cmnd/smartlight/EG_Wohnzimmer/setColorWhite 
attr smartlight publishSet_setSleep cmnd/smartlight/EG_Wohnzimmer/setSleep
attr smartlight publishSet_checkWifi cmnd/smartlight/EG_Wohnzimmer/checkWifi
attr smartlight publishSet_checkStatus cmnd/smartlight/EG_Wohnzimmer/checkStatus

für die Antworten noch ein AutoSubscribe anlegen
attr smartlight autoSubscribeReadings stat/smartlight/EG_Wohnzimmer/+

ein Colorpicker für die Farbe und ein Slider für die Helligkeit
attr samrtlight widgetOverride setColorWhite:slider,0,1,255 setColorRGB:colorpicker

schon laufen die Lampen in Fhem 
