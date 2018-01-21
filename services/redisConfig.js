var redisPort = process.env.REDIS_PORT || 6379,
    redisHost = process.env.REDIS_HOST || '127.0.0.1',
    redisAuth = process.env.REDIS_AUTH || null,
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