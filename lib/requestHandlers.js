const users = require('./users')

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

module.exports = {
    users: usersHandler,
    sample: sampleHandler,
    ping: pingHandler,
    notFound: notFoundHandler
}