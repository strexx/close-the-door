var moment = require('moment'),
    getObject = require('../methods/methods.js'),
    time = require('../methods/time.js'),
    getStatus = require('../methods/getstatus.js');

var getStatus = function (data, settings) {
    var now = moment().format('YYYY-MM-DD HH:mm:ss'),
        minutes = time.difference(data),
        doorStatus = JSON.parse(getObject.last(data).doorStatus),
        newData = {
            time: now,
            doorStatus: doorStatus,
            status: "",
            alarm: false,
            redLed: false,
            orangeLed: false,
            greenLed: false
        };

    if (minutes >= JSON.parse(settings.warnings.second) && doorStatus === 1) {
        newData.status = "warning";
        newData.alarm = true;
        newData.redLed = true;
    } else if (minutes >= JSON.parse(settings.warnings.first) && doorStatus === 1) {
        newData.status = "longopen";
        newData.orangeLed = true;
    } else if (minutes >= 0 && doorStatus === 1) {
        newData.status = "open";
        newData.greenLed = true;
    } else {
        newData.status = "closed";
        newData.greenLed = true;
    }
    return newData;
}

module.exports = getStatus;
