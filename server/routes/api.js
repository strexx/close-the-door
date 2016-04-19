var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('moment'),
    getObject = require('../methods/methods.js'),
    time = require('../methods/time.js');

var filePath = './resources/doorstatus.json';

router.post('/', function(req, res) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss');

    jsonfile.readFile(filePath, function(err, obj) {
        var lastObject = getObject.last(obj),
            newdata = {
                time: now,
                doorStatus: req.body.doorStatus || lastObject.doorStatus
            };
        obj.push(newdata);
        jsonfile.writeFileSync(filePath, obj);
        res.redirect('/');
    });
});

router.get('/status/leds', function(req, res) {
    jsonfile.readFile(filePath, function(err, obj) {
        var minutes = time.difference(obj),
            doorStatus = getObject.last(obj).doorStatus,
            leds = {
                red: false,
                orange: false,
                green: false
            };

        if (minutes >= 5 && doorStatus === 1) {
            leds.red = true;
        } else if (minutes >= 2 && doorStatus === 1) {
            leds.orange = true;
        } else {
            leds.green = true;
        }
        console.log(minutes);
        res.send(JSON.stringify(leds));
    });
});

router.get('/status/alarm', function(req, res) {
    jsonfile.readFile(filePath, function(err, obj) {

        var minutes = time.difference(obj);
        var doorStatus = getObject.last(obj).doorStatus
        if (minutes >= 5 && doorStatus === 1) {
            res.send('{"alarm":"true"}');
        } else {
            res.send('{"alarm":"false"}');
        }
    });
});

// router.get('/status/led/:led', function(req, res) {
//     var led = req.params.led;
//     jsonfile.readFile(filePath, function(err, obj) {
//         res.send('{"led":"' + getObject.last(obj).leds[led] + '"}');
//     });
// });

router.get('/data/', function(req, res) {
    jsonfile.readFile(filePath, function(err, obj) {
        res.send(obj);
    });
});

module.exports = router;
