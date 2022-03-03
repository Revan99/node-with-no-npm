const http = require("http");

const server = http.createServer(function (req, res) {
  res.end("Hello World\n");
});

server.listen(3000, function () {
  console.log("server is running on port 3000");
});
