
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

global.df = require('date-fu');
global.df.logtime = function(){
	return "["+global.df.strftime(new Date(), '%T')+"]";
}

var mongo = new easymongo({dbname: opts.vars.bdd});
global.mongo = {db : mongo};
global.mongo.collections = {
	users : mongo.collection("users"),
	rooms : mongo.collection("rooms")
}

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

__server_ip = (process.argv[2]=="local"?'http://127.0.0.1:'+app.get('port'):opts.vars.site_url);

require('./app/router.js')(app, passport);
require('./app/io.js')(io);

var Ticker = require('./app/ticker.js');
var ticker = new Ticker(2000);
ticker.start(function(err){
	if(err!=null){
		console.log(err);
	}
});