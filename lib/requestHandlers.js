const users = require('./users')
const token = require('./token')
const checks = require('./checks')

const sampleHandler = function (data, callback) {
    callback(200, {
        name: 'sample is called'
    })
}

const pingHandler = function (data, callback) {
    callback(200)
}

const usersHandler = function (data, callback) {
    const acceptableMethods = ['put', 'post', 'get', 'delete']
    if (acceptableMethods.indexOf(data.method) > -1) {
        users[data.method](data, callback)
    }
    else {
        callback(405)
    }
}


const notFoundHandler = function (data, callback) {
    callback(404);
}

const tokenHandler = function (data, callback) {
    const acceptableMethods = ['put', 'post', 'get', 'delete']
    if (acceptableMethods.indexOf(data.method) > -1) {
        token[data.method](data, callback)
    }
    else {
        callback(405)
    }
}
const checksHandler = function (data, callback) {
    const acceptableMethods = ['put', 'post', 'get', 'delete']
    if (acceptableMethods.indexOf(data.method) > -1) {
        checks[data.method](data, callback)
    }
    else {
        callback(405)
    }
}

module.exports = {
    users: usersHandler,
    sample: sampleHandler,
    ping: pingHandler,
    notFound: notFoundHandler,
    token: tokenHandler,
    checks: checksHandler
}