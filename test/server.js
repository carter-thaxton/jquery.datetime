var http = require('http');
var StaticServer = require('node-static').Server;

var publicServer = new StaticServer('./public');

http.createServer(function (req, res) {
  req.on('end', function () {
    publicServer.serve(req, res);
  });
}).listen(8080);
