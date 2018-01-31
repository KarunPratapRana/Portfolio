var express = require('express');
var compression = require('compression')
var controllers = require('./controllers');
var path = require('path');
var bodyParser = require('body-parser');
var cache = require('./middleware/cacheMiddleware'),
    passport = require( 'passport' );

var app = express();
app.use(compression())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
var options = {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set({
      'ETag': 'strong',
      'Accept-Encoding': 'gzip'
    })
  }
}
app.use(express.static('public', options))

app.get('/', cache(2), function (req, res) {
  console.log("Welcome to Ajay's Portfolio");
  res.render('profile');
})
app.post('/contact_me', controllers.user.post);
app.get('/contact_me', cache(2), controllers.user.get);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: ['https://mail.google.com/'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get( '/auth/google/callback', 
      passport.authenticate( 'google', { 
        successRedirect: '/',
        failureRedirect: '/login'
}));

const port = process.env.PORT || 3000;
app.listen(port, function(){
  var server = process.env.NODE_ENV?process.env.NODE_ENV:'testing';
	console.log(server+ ' server is runnung at port ' +port);
});
