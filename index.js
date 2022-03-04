const http = require("http");
const url = require("url");

const server = http.createServer(function (req, res) {
  //parse the url
  const path = url.parse(req.url, true);
  //remove the first and last slashes
  const trimmedPath = path.pathname.replace(/^\/+|\/+$/g, "");
  //get the method
  const method = req.method.toLocaleLowerCase();

  //respond the the request
  res.end("Hello World\n");

  console.log("Requesting on :", trimmedPath, "and the method is :", method);
});

server.listen(3000, function () {
  console.log("server is running on port 3000");
});
