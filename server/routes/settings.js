var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    jsonfile = require('jsonfile');

var dataPath = './resources/doorstatus.json';
var settingsPath = './resources/settings.json';

router.get('/', function(req, res, next) {
  //display settings page
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
router.post('/', function(req, res, next) {
    var body = req.body
    //set settings to page
    jsonfile.readFile(settingsPath, function(err, obj) {
        var settings = {
            "warnings": {
                "first": body.firstwarning,
                "second": body.firstwarning
            },
            "times": {
                "start": body.startTime,
                "end": body.endTime
            }
        };
        //write data
        jsonfile.writeFileSync(settingsPath, settings);
        res.redirect('/settings');
    });
});

module.exports = router;
