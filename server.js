var express = require('express');
var controllers = require('./controllers');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
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
      'Accept-Encoding': 'gzip, deflate'
    })
  }
}
app.use(express.static('public', options))

app.get('/', function (req, res) {
  console.log("Welcome to Ajay's Portfolio");
  res.render('profile');
})
app.post('/contact_me', controllers.user.post);
app.get('/contact_me', controllers.user.get);

const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('server is runnung at port ' +port);
});
