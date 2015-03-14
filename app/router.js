var credentials = require('./config/credentials.json');
var opts = require('./config/opts.json');

var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('./model/user.js');

var users = new Array();
var rooms = new Array();

module.exports = function(app, passport){
  // PASSPORT

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  var twitterStrategy = new TwitterStrategy({
    consumerKey: credentials.twitter_api.consumerKey,
    consumerSecret: credentials.twitter_api.consumerSecret,
    callbackURL: __server_ip+credentials.twitter_api.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    console.log(global.df.logtime()+" @"+profile.username+" logged in.");

    var user = {};

    var tmp_user = {
      _id: profile._json.id,
      token: token,
      tokenSecret: tokenSecret,
      username: profile.username,
      name: profile._json.name,
      avatar: profile.photos[0].value.replace("_normal", ""),
      banner: (typeof profile._json.profile_banner_url!=='undefined'?profile._json.profile_banner_url:"")
    }

    users.push(new User(tmp_user, done));
  });

  passport.use(twitterStrategy);

  // ROUTE

  var indexRender = function(req, res){
    //res.locals.user = req.user || null;
    res.render('index');
  }

  app.get('/', indexRender);
  app.get('/room/:id', indexRender);

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/return', passport.authenticate('twitter') ,function(req, res){
    res.redirect('/');
  });
  
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};

// MIDDLEWARE

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.session.room = req.params.id;
    res.redirect('/auth/twitter/return');
  }
};

function notloggedIn(req, res, next) {
  if (!req.user) {
    next();
  } else {
    req.session.room = req.params.id;
    res.redirect('/auth/twitter/return');
  }
};

function isSupported(req, res, next) {
  if (req.user.supported){
    next();
  } else {
    res.send(403, "You can't perform this action as an unsupported user.");
  }
}

function extAccess(req, res, next) {
  req.session.ext = true;
  next();
}