var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    moment = require('moment'),
    getObject = require('../methods/methods.js'),
    time = require('../methods/time.js');

var dataPath = './resources/doorstatus.json';
var historyPath = './resources/history.json';

router.get('/', function(req, res, next) {
    jsonfile.readFile(dataPath, function(err, data) {
        jsonfile.readFile(historyPath, function(err, historyData) {
            if (data != undefined || data != null) {
                res.render('home', {
                    title: 'Home',
                    description: 'A stop behind closing the door',
                    door: JSON.parse(getObject.last(data).doorStatus),
                    timeAgo: moment(getObject.last(data).time).fromNow(),
                    data: getObject.last(historyData).leds,
                    status: getObject.last(historyData).status
                });

            } else if (err) {
                res.status(404);
                next();
            }
        });
    });
});





module.exports = router;
