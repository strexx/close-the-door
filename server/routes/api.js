var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('moment'),
    getObject = require('../methods/methods.js');

var filePath = 'resources/data.json';

router.post('/', function(req, res) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss');

    jsonfile.readFile(filePath, function(err, obj) {
        var lastObject = getObject(obj),
            newdata = {
                time: now,
                doorStatus: req.body.matthias || lastObject.doorStatus,
                leds: {
                    red: req.body.redLed || lastObject.leds.red,
                    green: req.body.greenLed || lastObject.leds.green,
                    orange: req.body.orangeLed || lastObject.leds.orange
                },
                alarm: {
                    status: false
                }
            };

        obj.push(newdata);
        jsonfile.writeFileSync(filePath, obj);
        res.redirect('/');
    });
});

router.get('/status/leds', function(req, res) {
    jsonfile.readFile(filePath, function(err, obj) {
        res.send( JSON.stringify(getObject.last(obj).leds));
    });
});

router.get('/status/alarm', function(req, res) {
    jsonfile.readFile(filePath, function(err, obj) {
        res.send( JSON.stringify(getObject.last(obj).alarm));
    });
});

router.get('/status/led/:led', function(req, res) {
    var now = moment("2016-04-19 05:43:20"); //todays date
    var end = moment("2016-04-19 05:45:40"); // another date
    var duration = moment.duration(now.diff(end));
    var days = duration.asMinutes();
    var led = req.params.led;

    jsonfile.readFile(filePath, function(err, obj) {
        res.send('{"led":"' + getObject.last(obj).leds[led] + '"}');
    });
});

router.get('/data/', function(req, res) {
    var name = req.params.name;

    jsonfile.readFile(filePath, function(err, obj) {
        res.send(obj);
    });
});

module.exports = router;
