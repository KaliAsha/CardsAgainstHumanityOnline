
/**
 * Module dependencies.
 */

var credentials = require('./app/config/credentials.json');
var opts = require('./app/config/opts.json');

var express = require('express');
var http 	= require('http');
var path 	= require('path');

var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport 	 = require('passport');
var easymongo    = require('easymongo');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

global.mongo = new easymongo({dbname: opts.vars.bdd});

// personal vars
df = require('date-fu');
request = require('request-json');

// all environments
app.set('port', process.env.PORT || opts.vars.port);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'app/public')));
app.use('/bower',express.static(path.join(__dirname, 'bower_components/')));
app.use(cookieParser()) // required before session.
app.use(session({
	secret: credentials.session.secret, 
	name: 'sid', 
	cookie: { secure: false },
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
server.listen(app.get('port'));

__server_ip = (process.argv[2]=="local"?'localhost:'+app.get('port'):otps.var.site_url);

require('./app/router.js')(app, passport);
require('./app/io.js')(io);