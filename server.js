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
app.use(express.static('public', { maxAge: 24*3600000 }))

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
