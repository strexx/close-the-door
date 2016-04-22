# How to create a alarm if the door is open?
If the door stays open the alarm will go on. If the door is closed the alarm will be turned off.

## Live URL
[Zie live](http://iot.dolstra.me)

## Code

### Install requrements
- nodejs
- gulp global installed
- npm installed
- Arduino app
- ArduinoJson lib
- ESP8266WiFi lib

## Installation server
In the server folder you can find the code for the server.

Download:
[github.com/mat1th/close-the-door](https://github.com/mat1th/close-the-door.git)

Go to the project:

```bash
cd path/to/files
```
Install node modules:

```bash
npm install
```

## Building

Install Gulp:

```bash
npm install --global gulp-cli
```

Start Gulp:

```bash
gulp
```

## Starting the app

Start the app:
```bash
npm start
```

## Code structure
In the ```app.js``` file you can find the start file from the app. for every route is a file in the  ```routes/file.js```. If there is a post request to the server it will store the data in the  ```resources/doorStatus.js```.

```
/server
  /methods
    /getstatus.js     -> returns the status op the leds based on the current time.
    /methods.js       -> returns the to the last object of a array
    /time.js          -> returns the time between the last object and now
  /public             
    /src              -> all css/js/img fils  
    /dist             -> files combined with gulp (you can client side only can get here)
  /resources          
    /data.json        -> stores the costum LEDs status
    /doorStatus.json  -> stores the history of the doorStatus
    /settings.json    -> stores the setting
  /routes
    /api.js           -> the api route with al get and posts
    /index.js         -> the home page
    /settins.js       -> the settings page with a post and get
    /status.js        -> status page with a post and get
  /views
    /error.hbs        -> if you get a route or a error you will see this page
    /home.hbs         -> the home page from the app with the status and the graph
    /layout.hbs       -> the base layout form the app with the footer and header
    /settins.hbs      -> the settings page with a from to change the settings
    /status.hbs       -> the status page with a form to add a costum status
  /app.js

```

## Instalation Arduino
Open the Arduino app that you can download form the [Arduino](http://arduino.com) website.
Add the ArduinoJson and ESP8266WiFi libarys to the Arduino app. Then open the ```/arduino/projects/closethedoor/closethedoor.ino``` file. Change the WiFi and the server  settings and upload it to your arduino. Now it will post to your server.


## API
My app has a API where you can get the realtime data.

### Current status
You can get the last status from my sensor from [iot.dolstra.me/api/status](http://iot.dolstra.me/api/status/). You will get the status of the LED's, alarm and the status of the door.

```json
    {
      "time": "2016-04-21 15:53:07",
      "doorStatus": 1,
      "status": "closed",
      "alarm": false,
      "redLed": false,
      "orangeLed": false,
      "greenLed": true
    }
```

### History
You can also get the history data from [iot.dolstra.me/api/data](http://iot.dolstra.me/api/data). You will get a array with the time and door status.

```json
    [{
      "time": "2016-04-21 18:52:02",
      "doorStatus": "1"
    }]
```

### Post a status for the LED's
If you wan't to change the status of the LED's you can post to [iot.dolstra.me/status](http://iot.dolstra.me/status). The post sting must be:

```
    greenLed=true&orangeLed=true&redLed=true&alarm=true
```

## Made by
[Matthias Dolstra](https://dolstra.me)
