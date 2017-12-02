var express = require('express');
var app = express();
var router = require('./router/main')(app);
var session = require('express-session');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
});
app.use(express.static('public'));
app.use(express.static('views/www'));
app.use(express.static('views/www/Share'));
app.use(express.static('views/www/AdminTargetServer'));
app.use(express.static('views/www/AdminSatellite'));
app.use(express.static('views/www/AdminHistory'));
app.use(express.static('views/www/AdminPassword'));
app.use('js',express.static('views/www/js'));
// app.use(express.static('views/www/AdminProduct'));
// app.use(express.static('views/www'));
// app.use(express.static('public'));
app.use(session({
 secret: '@#@$SATELLITE_RELAY_WEB#!!!$',
 resave: false,
 saveUninitialized: true
}));
