//var redisPort = process.env.REDIS_PORT || 6379,
//    redisHost = process.env.REDIS_HOST || '127.0.0.1',
//    redisAuth = process.env.REDIS_AUTH || null,
//    redis = require('redis');
var redisPort = (process.env.NODE_ENV ==='production')?19628 : 6379,
    redisHost = (process.env.NODE_ENV ==='production')?'redis-19628.c13.us-east-1-3.ec2.cloud.redislabs.com' : '127.0.0.1',
    redisAuth = null,
    redis = require('redis');
var onError = function (error) {
  console.error('Error in Redis client: ' + error.message);
  console.error(error.stack);
  console.log('Exiting now because of error in Redis client');
  process.exit(1);
};

var onConnect =  function () {
  console.log('Successfully connected to Redis ' + redisHost + ':' + redisPort);
};

module.exports = exports = (function () {
  var redisClient = redis.createClient(redisPort, redisHost, {
    auth_pass: redisAuth
  });
  redisClient.on('error', onError);
  redisClient.on('connect', onConnect);
  return redisClient;
});