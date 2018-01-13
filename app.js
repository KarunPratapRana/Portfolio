var express = require('express');
var controllers = require('./controllers');
var path = require('path');

var app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public', { maxAge: 24*3600000 }))

app.get('/', function (req, res) {
  res.render('profile')
})
app.get('/signup', controllers.user.post);

app.listen(5000, function(){
	console.log('Now my server is hosted at localhost:5000')
});