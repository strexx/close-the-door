var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('moment'),
    getObject = require('../methods/methods.js'),
    time = require('../methods/time.js');

var dataPath = './resources/doorstatus.json';
var settingsPath = './resources/settings.json';

router.get('/', function(req, res, next) {
    jsonfile.readFile(dataPath, function(err, obj) {
        if (obj != undefined || obj != null) {
            res.render('home', {
                title: 'Home',
                description: 'Een stop achter het sluiten van de deur',
                door: getObject.last(obj).doorStatus,
                timeAgo: moment(getObject.last(obj).time).fromNow(),
                data: {
                    red: true,
                    orange: false,
                    green: false
                }
            });

        } else if (err) {
            res.status(404);
            next();
        }
    });
});

router.get('/history', function(req, res, next) {
    jsonfile.readFile(dataPath, function(err, obj) {
        if (obj != undefined || obj != null) {
            res.render('history', {
                title: 'History',
                description: 'On this page you can see the status of the leds',
                data: getObject.last(obj)
            });

        } else if (err) {
            res.status(404);
            next();
        }
    });
});

router.get('/settings', function(req, res, next) {
    jsonfile.readFile(settingsPath, function(err, obj) {
        if (err) {
            res.status(404);
            next();
        }

        res.render('settings', {
            title: 'Settings',
            description: 'Eddit the settings of your allarm',
            data: obj
        });
    });
});
router.post('/settings', function(req, res, next) {
    jsonfile.readFile(settingsPath, function(err, obj) {
        var settings = {
            "warnings": {
                "first": "5",
                "second": "2"
            },
            "times": {
                "start": 2,
                "end": 5
            }
        }

    });
});

module.exports = router;
