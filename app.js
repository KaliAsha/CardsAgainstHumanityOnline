
/**
 * Module dependencies.
 */

var opts = require('./app/config/opts.json')

var express = require('express');
var http 	= require('http');
var path 	= require('path');
var extip 	= require('externalip');

var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport 	 = require('passport');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// personal vars
df = require('date-fu');
request = require('request-json');

// all environments
app.set('port', process.env.PORT || 8087);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'app/public')));
app.use(cookieParser()) // required before session.
app.use(session({
	secret: opts.session.secret, 
	name: 'sid', 
	cookie: { secure: false },
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
server.listen(app.get('port'));

extip(function (err, ip) {
  __server_ip = (process.argv[2]=="local"?'localhost:'+app.get('port'):ip.trim()+":80");
});

var ctrler = require('./app/appctrl.js');
require('./app/router.js')(app, passport);
require('./app/io.js')(io);