var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser     =        require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
 secret: '@#@$SATELLITE_REPLAY_SIMPLE_UI#@$#$',
 resave: false,
 saveUninitialized: true
}));

var router = require('./router/main')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(express.static('views/www'));
app.use(express.static('views/www/Share'));
app.use(express.static('views/www/AdminTargetServer'));
app.use(express.static('views/www/AdminSatellite'));
app.use(express.static('views/www/AdminHistory'));
app.use(express.static('views/www/AdminPassword'));
app.use(express.static('views/www/Login'));
app.use('js',express.static('views/www/js'));

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
});
