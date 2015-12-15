var forever = require('forever-monitor');
var MAX_RETRIES = 10;

var node = new(forever.Monitor)('app.js', {
  // 32 bit int max
  max: MAX_RETRIES,
  minUpTime: 10000,
  spinSleepTime: 10000,
  killTree: true
});

node.on('exit', function() {
  console.log('API server died after ' + MAX_RETRIES + ' restarts');
});

node.start();
