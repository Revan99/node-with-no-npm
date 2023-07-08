const sampleHandler = function (data, callback) {
    callback(200, {
        name: 'sample is called'
    })
}

const pingHandler = function (data, callback) {
    callback(200)
}


const notFoundHandler = function (data, callback) {
    callback(404);
}

module.exports = {
    sample: sampleHandler,
    ping: pingHandler,
    notFound: notFoundHandler
}