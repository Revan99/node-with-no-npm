const handler = require('./requestHandlers')

module.exports = {
    sample: handler.sample,
    ping: handler.ping,
    notFound: handler.notFound
}