var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    jsonfile = require('jsonfile'),
    getObject = require('../methods/methods.js');

router.get('/', function(req, res, next) {
    res.render('status', {
        title: 'Status',
        description: 'The status form the leds'

    });
});

router.post('/', function(req, res, next) {
    var body = req.body
    jsonfile.readFile(historyPath, function(err, historyData) {
        var now = moment().format('YYYY-MM-DD HH:mm:ss');
        var doorStatus = getObject.last(historyData).doorStatus,
            newData = {
                time: now,
                doorStatus: doorStatus,
                status: "costum",
                alarm: req.body.alarm,
                redLed: req.body.redLed,
                orangeLed: req.body.orangeLed,
                greenLed: req.body.greenLed
            };
        if (getObject.last(historyData).leds !== newData.leds) {
            historyData.push(newData);
            jsonfile.writeFileSync(historyPath, historyData);
        }
        res.redirect('/status');
    });
});

module.exports = router;
