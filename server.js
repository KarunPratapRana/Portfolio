var express = require('express');
var compression = require('compression')
var controllers = require('./controllers');
var path = require('path');
var bodyParser = require('body-parser');
var cache = require('./middleware/cacheMiddleware');

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
      'Expires': 'Thu, 15 Apr 2018 20:00:00 GMT',
      'Accept-Encoding': 'gzip'
    })
  }
}
app.use(express.static('public', options))

app.get('/', function (req, res) {
  console.log("Welcome to Ajay's Portfolio");
  res.render('profile');
})
app.post('/contact_me', controllers.user.post);
app.get('/contact_me', cache(2), controllers.user.get);

const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('server is runnung at port ' +port);
});
