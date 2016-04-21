var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    jsonfile = require('jsonfile'),
    getObject = require('../methods/methods.js');

var dataPath = './resources/data.json';

router.get('/', function(req, res, next) {
  //render the status page
    res.render('status', {
        title: 'Status',
        description: 'The status form the leds'
    });
});

router.post('/', function(req, res, next) {
    var body = req.body
    // create a object from the post
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
    // writ to file
    jsonfile.writeFileSync(dataPath, newData);

    res.redirect('/status');
});

module.exports = router;
