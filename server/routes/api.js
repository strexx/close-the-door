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

console.log(getStatus);

router.post('/', function(req, res) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss');

    jsonfile.readFile(dataPath, function(err, data) {
        var lastObject = getObject.last(data),
            newdata = {
                time: now,
                doorStatus: req.body.doorStatus || lastObject.doorStatus
            };
        if (getObject.last(data).doorStatus != req.body.doorStatus) {
            data.push(newdata);
        }
        jsonfile.writeFileSync(dataPath, data);
    });
});

router.get('/status', function(req, res) {
    jsonfile.readFile(dataPath, function(err, data) {
        jsonfile.readFile(settingsPath, function(err, settings) {
            res.send(JSON.stringify(getStatus(data, settings)));
        });
    });
});

// router.get('/status/alarm', function(req, res) {
//     jsonfile.readFile(dataPath, function(err, data) {
//
//         var minutes = time.difference(data);
//         var doorStatus = getObject.last(data).doorStatus
//         if (minutes >= 5 && doorStatus === 1) {
//             res.send('{"alarm":"true"}');
//         } else {
//             res.send('{"alarm":"false"}');
//         }
//     });
// });

router.get('/data/', function(req, res) {
    jsonfile.readFile(dataPath, function(err, data) {
        res.send(data);
    });
});

module.exports = router;
