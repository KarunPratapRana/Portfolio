var fs = require('fs');
var signup = function() {
	return {
		post: function(req, res){
			console.log(req.body.email+ " wants to contact us");
			fs.appendFileSync("contactUs.txt", 'Email: '+req.body.email+'\n', "UTF-8",{'flags': 'a+'});
			res.render('profile');
		},
		get: function (req, res) {
  			console.log("Redirect");
  			res.render('profile')
		}
	}
}	

module.exports = signup;