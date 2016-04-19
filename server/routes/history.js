var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile'),
    getObject = require('../methods/methods.js'),
    time = require('../methods/time.js');

var dataPath = './resources/doorstatus.json';


router.get('/', function(req, res, next) {
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


module.exports = router;
