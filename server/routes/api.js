var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('moment'),
    getObject = require('../methods/methods.js'),
    time = require('../methods/time.js'),
    getStatus = require('../methods/getstatus.js');

//devine paths for data
var doorstatusPath = './resources/doorstatus.json';
var settingsPath = './resources/settings.json';
var dataPath = './resources/data.json';
var costumData = 0;

//post of api
router.post('/', function(req, res) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    //get last doorstatus
    jsonfile.readFile(doorstatusPath, function(err, data) {
        var lastObject = getObject.last(data),
            newdata = {
                time: now,
                doorStatus: req.body.doorStatus || lastObject.doorStatus
            };
        //only set new objece if the doorstatus is changed
        if (getObject.last(data).doorStatus != req.body.doorStatus) {
            data.push(newdata);
        }
        //wirite to file
        jsonfile.writeFileSync(doorstatusPath, data);
    });
});

router.get('/status', function(req, res) {
  //get the data to check if there is a costum status
    jsonfile.readFile(dataPath, function(err, data) {
      //if there is no costum status get the normal status
        if (data.doorStatus === undefined) {
            jsonfile.readFile(doorstatusPath, function(err, doorstatusdata) {
                jsonfile.readFile(settingsPath, function(err, settings) {
                    res.send(JSON.stringify(getStatus(doorstatusdata, settings)));
                });
            });
        } else {
          //send the costum status
            res.send(data);
            //if page is seem 2 times delete the costum object
            costumData++;
            if (costumData === 2) {
                costumData = 0;
                jsonfile.writeFileSync(dataPath, '');
            }
        }
    });
});

router.get('/data/', function(req, res) {
  //return the last 15 objects of the data for the graph
    jsonfile.readFile(doorstatusPath, function(err, data) {
        if (data.length >= 15) {
            data.reverse().length = 15;
            res.send(data.reverse());
        } else {
            res.send(data);
        }
    });
});

module.exports = router;
