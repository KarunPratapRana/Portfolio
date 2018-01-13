var signup = function() {
	return {
		post: function(req, res){
			res.send('Hello World')
		}
	}
}	

module.exports = signup;