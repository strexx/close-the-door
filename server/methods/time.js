var moment = require('moment'),
    getObject = require('./methods.js');

var time = (function() {
    function difference(data) {
        var now = moment(moment().format('YYYY-MM-DD HH:mm:ss')),
            lastTime = moment(getObject.last(data).time),
            minutes = moment.duration(now.diff(lastTime)).asMinutes();
        return minutes;
    }

    return {
        difference: difference
    };
})();

module.exports = time;
