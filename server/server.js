var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var eventController = require('./events/eventController.js');
var morgan = require('morgan');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var auth = require('./keys/auth.js');

const PORT = 8080;

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost/jamboree');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public/'));
app.use(passport.initialize());


// skeleton for eventual API calls
// app.post('/api/acct/signin', acctController.signin);
// app.post('/api/acct/signup', acctController.signup);
// app.get('/api/acct/signedin', acctController.checkAuth);
// app.get('/api/acct/logout', acctController.checkAuth);
// app.post('/api/acct/addToList', acctController.addToList);





// configuration ===========================================

// Passport Facebook strategy configuration=================

// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
var userController = require('./users/userController');

passport.use(new Strategy({
    clientID: auth.clientID,
    clientSecret: auth.clientSecret,
    callbackURL: auth.callbackURL,
    profileFields: ['id', 'displayName', 'picture.height(150).width(150)','friends']
  },
  function(accessToken, refreshToken, profile, cb) {
    //call a function which checks if user is in db
    userController.createOrFindOne(profile);
    return cb(null, profile);
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});



// passport routes =========================================================
// route to handle all facebook passport requests

app.get('/api/events/getList', eventController.getEvents);

app.get('/login/facebook',
  passport.authenticate('facebook', {scope: ['user_friends']}));

app.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    //send cookie so client side has user info
    res.cookie('name',req.user.displayName);
    res.cookie('fbId',req.user.id);
    res.cookie('picture',req.user.photos[0].value);
    res.redirect('/#mainApp');

  });




console.log( 'listening on', PORT );
app.listen( PORT );


module.exports = app;
