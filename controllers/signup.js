var fs = require('fs');
var services = require('../services');
var signup = function() {
	return {
		post: function(req, res){
			console.log(req.body.email+ " wants to contact us");
			console.log(req.body)
			services.mail.sendMail(req.body);
			res.redirect('/')
		},
		get: function (req, res) {
  			console.log("Redirect");
  			res.render('profile')
		}
	}
}	

module.exports = signup;