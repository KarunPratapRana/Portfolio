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
var mail = function() {
	function email(data, done) {	
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			secure: false,
			port: 25,
			auth: {
				user: "ajaybani05@gmail.com",
				pass: "Ajay@143*"
			},
			tls: {
				rejectUnauthorized: false
			}
		});				

		let mailOptions = {
			from: 'AjayFinanceAdvisier 👥 <ajaybani05@gmail.com>', // sender address
			to: data.to, // list of receivers
			subject: 'Client Query', // Subject line
			html: data.html
		};					

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
				done(error);
			}
			done();	
		});
	}

	queue.process('email', function(job, done){
		email(job.data, done);
	});
	  
	function send(formData) {
		htmlTemplate = pug.renderFile(__dirname+'/template.pug', formData);	
		queue.create('email', {
		  to: 'ajaykumarpandeya@gmail.com',
		  html: htmlTemplate
		}).save();	
	}
	return {
		sendMail:function(formData){
			send(formData);
		}
	}
}

module.exports = mail;