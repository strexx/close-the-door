var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('moment'),
    getObject = require('../methods/methods.js'),
    time = require('../methods/time.js'),
    getStatus = require('../methods/getstatus.js');

var dataPath = './resources/doorstatus.json';
var settingsPath = './resources/settings.json';

router.get('/', function(req, res, next) {
    jsonfile.readFile(dataPath, function(err, data) {
        jsonfile.readFile(settingsPath, function(err, settings) {
            if (data != undefined || data != null) {
                res.render('home', {
                    title: 'Home',
                    description: 'A stop behind closing the door',
                    door: JSON.parse(getObject.last(data).doorStatus),
                    timeAgo: moment(getObject.last(data).time).fromNow(),
                    data: {
                        red: getStatus(data, settings).redLed,
                        orange: getStatus(data, settings).orangeLed,
                        green: getStatus(data, settings).greenLed
                    },
                    status: getStatus(data, settings).status
                });
            } else if (err) {
                res.status(404);
                next();
            }
        });
    });
});





module.exports = router;
