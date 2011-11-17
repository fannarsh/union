var fs = require('fs'),
    union = require('../lib'),
    director = require('director'),
    favicon = require('./middleware/favicon');

var router = new director.http.Router();

var server = union.createServer({
  before: [
    favicon('./favicon.png'),
    function (req, res) {
      var found = router.dispatch(req, res);
      if (!found) {
        res.emit('next');
      }
    }
  ]
});

router.get(/foo/, function () {
  this.res.writeHead(200, { 'Content-Type': 'text/plain' })
  this.res.end('hello world\n');
});

router.post(/foo/, { stream: true }, function () {
  var req = this.req,
      res = this.res,
      writeStream;
      
  writeStream = fs.createWriteStream(Date.now() + '-foo.txt');
  req.pipe(writeStream);
  
  writeStream.on('close', function () {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('wrote to a stream!');
  });
});

server.listen(8080);
console.log('union with director running on 8080');