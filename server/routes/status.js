var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    jsonfile = require('jsonfile'),
    getObject = require('../methods/methods.js');

var dataPath = './resources/data.json';

router.get('/', function(req, res, next) {
    res.render('status', {
        title: 'Status',
        description: 'The status form the leds'

    });
});

router.post('/', function(req, res, next) {
    var body = req.body
    var now = moment().format('YYYY-MM-DD HH:mm:ss');
    var newData = {
        time: now,
        doorStatus: 0,
        status: "costum",
        alarm: body.alarm,
        redLed: body.redLed,
        orangeLed: body.orangeLed,
        greenLed: body.greenLed
    };

    jsonfile.writeFileSync(dataPath, newData);

    res.redirect('/status');
});

module.exports = router;
