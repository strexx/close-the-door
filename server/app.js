//load packages
var express = require('express'),
    path = require('path'),
    bodyParser = require("body-parser"),
    app = express(),
    //create routes
    api = require('./routes/api'),
    routes = require('./routes/index'),
    status = require('./routes/status'),
    dashboard = require('./routes/dashboard'),
    settings = require('./routes/settings');

//set vieuw enging
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//define static path
app.use(express.static(path.join(__dirname, 'public/dist')));

//define routes
app.use('/', routes);
app.use('/api', api);
app.use('/status', status);
app.use('/dashboard', dashboard);
app.use('/settings', settings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//start app and lissen to poort 3010
app.listen(3010, function() {
    console.log('listening on port 3010!');
});
