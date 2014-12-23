var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(app, passport){
  app.get('/room/:id', function(req, res){
    var room = global.rooms[req.params.id];
    if(room){
      res.render('test', {room: room, server_url: "http://"+__server_ip});
    }else{
      console.log('Unknown room');
    }
  });
  /*
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new TwitterStrategy({
      consumerKey: 'WElcXnG6fw4tTSMrJsiVSAMBI',
      consumerSecret: 'NyxeIBknAGDyS9LeiEM8yUToYZxakyalLeyUAqR8w4ptJMVpvo',
      callbackURL: "http://chat.vchabrette.fr/auth/twitter/return"
    },
    function(token, tokenSecret, profile, done) {
      var user = {};
      user.id = profile.id;
      user.username = profile.username;
      user.displayName = profile.displayName;
      user.avatar = profile.photos[0].value.replace("_normal", "");
      user.banner = profile._json.profile_banner_url+'/web';
      done(null,user);
    }
  ));
	/*app.get('/', function(req, res){
		res.redirect('/' + Math.random().toString(36).slice(2));
	});

  app.get('/', notloggedIn, function(req, res){
    res.render('index');
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/ext', extAccess, passport.authenticate('twitter'));

  app.get('/auth/twitter/return', passport.authenticate('twitter'), function(req, res) {
    if(req.session.ext){
      delete req.session.ext;
      res.render('quit_popup');
      return;
    }
    var room_id = (req.session.room || Math.random().toString(36).slice(2));
    delete req.session.room;
    res.redirect('/room/' + room_id);
  });

  //app.post('/', passport.authenticate('local', { successRedirect: '/'+Math.random().toString(36).slice(2), failureRedirect: '/' }));

  app.get('/room/:id', loggedIn, function(req, res){
    res.render('chat', {room_id: req.params.id, server_url: "http://62.210.139.99:8082", user:req.user});
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  /*app.get('/test', function(req, res){
    res.render('chat', {room_id: 'testroom', server_url: "http://62.210.139.99:8082", user:{"id":"85623167","username":"VChabrette","displayName":"Vincent Chabrette","avatar":"https://pbs.twimg.com/profile_images/455825249485864960/RidWnQlf.jpeg","banner":"https://pbs.twimg.com/profile_banners/85623167/1395536032"}});
  });*/
};

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

function extAccess(req, res, next) {
  req.session.ext = true;
  next();
}