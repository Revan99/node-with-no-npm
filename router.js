const handler = require('./lib/requestHandlers')

module.exports = {
    sample: handler.sample,
    ping: handler.ping,
    notFound: handler.notFound,
    users: handler.users,
    token: handler.token,
    checks: handler.checks
}