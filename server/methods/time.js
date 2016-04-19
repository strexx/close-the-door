var moment = require('moment'),
    getObject = require('./methods.js');

var time = (function() {
    function difference(data) {
        var lastTime = moment(getObject.last(data).time),
            secondLastTime = moment(getObject.secondLast(data).time),
            minutes = moment.duration(lastTime.diff(secondLastTime)).asMinutes();

        return minutes;
    }


    return {
        difference: difference
    };
})();

module.exports = time;
