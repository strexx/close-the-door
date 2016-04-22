var fs = require('fs'),
    express = require('express'),
    router = express.Router(),
    request = require("request"),
    getObject = require('../methods/methods.js');

router.get('/', function(req, res, next) {
    request("http://dylanvens.com/iot/includes/app/getData.php", function(error, response, dylanvens) {
      var data1 = getObject.last(JSON.parse(dylanvens));
        data1.title = "Dylan";

        res.render('dashboard', {
            title: 'Dashboard',
            description: 'A dashboard form other users',
            data: [data1]
        });
    });
});

module.exports = router;
