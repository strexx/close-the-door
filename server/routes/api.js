var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('moment'),
    getObject = require('../methods/methods.js'),
    time = require('../methods/time.js');

var dataPath = './resources/doorstatus.json';
var settingsPath = './resources/settings.json';

router.post('/', function(req, res) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss');

    jsonfile.readFile(dataPath, function(err, data) {
        var lastObject = getObject.last(data),
            newdata = {
                time: now,
                doorStatus: req.body.doorStatus || lastObject.doorStatus
            };
        data.push(newdata);
        jsonfile.writeFileSync(dataPath, data);
        res.redirect('/');
    });
});

router.get('/status/leds', function(req, res) {
    jsonfile.readFile(dataPath, function(err, data) {
        jsonfile.readFile(settingsPath, function(err, settings) {
            var minutes = time.difference(data),
                doorStatus = getObject.last(data).doorStatus,
                leds = {
                    red: false,
                    orange: false,
                    green: false
                };
            if (minutes >= JSON.parse(settings.warnings.first) && doorStatus === 1) {
                leds.red = true;
            } else if (minutes >= JSON.parse(settings.warnings.second) && doorStatus === 1) {
                leds.orange = true;
            } else {
                leds.green = true;
            }
            res.send(JSON.stringify(leds));
        });
    });
});

router.get('/status/alarm', function(req, res) {
    jsonfile.readFile(dataPath, function(err, data) {

        var minutes = time.difference(data);
        var doorStatus = getObject.last(data).doorStatus
        if (minutes >= 5 && doorStatus === 1) {
            res.send('{"alarm":"true"}');
        } else {
            res.send('{"alarm":"false"}');
        }
    });
});

// router.get('/status/led/:led', function(req, res) {
//     var led = req.params.led;
//     jsonfile.readFile(dataPath, function(err, data) {
//         res.send('{"led":"' + getObject.last(data).leds[led] + '"}');
//     });
// });

router.get('/data/', function(req, res) {
    jsonfile.readFile(dataPath, function(err, data) {
        res.send(data);
    });
});

module.exports = router;
