const nodemailer = require('nodemailer');
var pug = require('pug');
var redis = require("redis"),
    redisClient = require('./redisConfig');
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
	  nodemailer.createTestAccount((err, account) => {		
		    let transporter = nodemailer.createTransport({
		        service: 'Gmail',
		        auth: {
		            user: 'ajaykumarpandeya@gmail.com', // generated ethereal user
		            pass: 'ajaykumarpandey1' // generated ethereal password
		        }
		    });	

		    let mailOptions = {
		        from: data.to, // sender address
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
	  done();
	}

	function send(formData) {
		htmlTemplate = pug.renderFile(__dirname+'/template.pug', formData);
		console.log(htmlTemplate);	
		var job = queue.create('email', {
		  to: 'ajaykumarpandeya@gmail.com',
		  html: htmlTemplate
		}).save( function(err){
		   if( !err ) console.log( job.id );
		});

		queue.process('email', function(job, done){
	  		email(job.data, done);
		});	
	}
	return {
		sendMail:function(formData){
			console.log(formData);
			send(formData);
		}
	}
}

module.exports = mail;