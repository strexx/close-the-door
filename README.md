# How to create a alarm if the door is open?
If the door stays open the alarm will go on. If the door is closed the alarm will be turned off.


## API
My app has a API where you can get the realtime data.

## Current status
You can get the last status from my sensor from [iot.dolstra.me/api/status](http://iot.dolstra.me/api/status/). You will get the status of the LED's, alarm and the status of the door.

    {
      "time": "2016-04-21 15:53:07",
      "doorStatus": 1,
      "status": "closed",
      "alarm": false,
      "redLed": false,
      "orangeLed": false,
      "greenLed": true
    }

## History
You can also get the history data from [iot.dolstra.me/api/data](http://iot.dolstra.me/api/data). You will get a array with the time and door status.

    [{
      "time": "2016-04-21 18:52:02",
      "doorStatus": "1"
    }]

## Post a status for the LED's
If you wan't to change the status of the LED's you can post to [iot.dolstra.me/status](http://iot.dolstra.me/status). The post sting must be:

    greenLed=true&orangeLed=true&redLed=true&alarm=true
