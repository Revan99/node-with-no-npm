const http = require("http");
const { StringDecoder } = require("string_decoder");
const url = require("url");
const router = require('./router')
const config = require('./config')

const server = http.createServer(function (req, res) {
  //parse the url
  const path = url.parse(req.url);
  //remove the first and last slashes
  const trimmedPath = path.pathname.replace(/^\/+|\/+$/g, "");
  //get the method
  const method = req.method.toLocaleLowerCase();
  //get the query
  const queryObject = path.query;

  const header = req.header

  const decoder = new StringDecoder('utf-8');

  let buffer = ''

  req.on('data', function (data) {
    buffer += decoder.write(data)
  })

  req.on('end', function () {

    buffer += decoder.end()
    const chosenHandler = typeof router[trimmedPath] ? router[trimmedPath] : router.notFound

    const data = {
      path,
      trimmedPath,
      method,
      queryObject,
      header,
      payload: buffer
    }

    chosenHandler(data, function (statusCode, payload) {
      statusCode = typeof statusCode === 'number' ? statusCode : 200
      payload = typeof payload === 'object' ? payload : {}

      const jsonPayload = JSON.stringify(payload)

      res.setHeader('Content-type', 'application/json')
      res.writeHead(statusCode)
      res.end(jsonPayload)

      console.log('sending back:', statusCode, jsonPayload)
    })
  });

})




server.listen(config.httpPort, function () {
  console.log("server is running on port " + config.port + " in " + config.envName + " mode");
});
