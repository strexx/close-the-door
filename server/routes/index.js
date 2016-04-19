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
                description: 'A stop behind closing the door',
                door: JSON.parse(getObject.last(obj).doorStatus),
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





module.exports = router;
