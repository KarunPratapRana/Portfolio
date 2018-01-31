const nodemailer = require('nodemailer');
var pug = require('pug');
var redis = require("redis"),
    passport = require( 'passport' );
    redisClient = require('./redisConfig');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var redisPort = (process.env.NODE_ENV ==='production')?19628 : 6379,
    redisHost = (process.env.NODE_ENV ==='production')?'redis-19628.c13.us-east-1-3.ec2.cloud.redislabs.com' : '127.0.0.1';


var kue = require('kue'),
   queue = kue.createQueue({
   		prefix: 'q',
  		redis: {
  			port: redisPort,
    		host: redisHost,
  		}
	});	
var mail = function(argument) {
	
	function email(data, done) {
		//console.log(data);
	    passport.use(new GoogleStrategy({
	        clientID: "114697355005-3fbioarctn450cd9a0g6ff3a9clrb087.apps.googleusercontent.com",
	        clientSecret: "6VZxjEKHZb_IdrNHI7dIG-LQ",
	        callbackURL: "https://ajay-financialadvisor.herokuapp.com/auth/google/callback"
	      },
	      function(accessToken, refreshToken, profile, cb) {
	      		console.log(accessToken +refreshToken+ profile);
	      		//process.nextTick(function () {
		      		nodemailer.createTestAccount((err, account) => {		
					    let transporter = nodemailer.createTransport({
					        service: 'Gmail',
					        XOAuth2: {
						      user: "ajaybani05@gmail.com",
						      clientId: "114697355005-3fbioarctn450cd9a0g6ff3a9clrb087.apps.googleusercontent.com",
						      clientSecret: "6VZxjEKHZb_IdrNHI7dIG-LQ",
						      refreshToken:refreshToken,
						      accessToken:accessToken,
						      timeout: 3600
						    }
					    });				

					    let mailOptions = {
					        from: 'Ajay Portfolio 👥 <ajaybani05@gmail.com>', // sender address
					        to: data.to, // list of receivers
					        subject: 'Comment on your profile', // Subject line
					        html: data.html
					    };					

					    // send mail with defined transport object
					    transporter.sendMail(mailOptions, (error, info) => {
					        if (error) {
					            return console.log(error);
					        }	
					    });
					});
					console.log(profile);
					done();
					//return done(null, profile);
				//});
	    	}

	    ));
	}

	function send(formData) {
		htmlTemplate = pug.renderFile(__dirname+'/template.pug', formData);	
		var job = queue.create('email', {
		  to: 'ajaykumarpandeya@gmail.com',
		  html: htmlTemplate
		}).save( function(err){
		   if( !err ) console.log('sending mail to ajay');
		});

		queue.process('email', function(job, done){
	  		email(job.data, done);
		});	
	}
	return {
		sendMail:function(formData){
			send(formData);
		}
	}
}

module.exports = mail;