const sampleHandler = function(data, callback){
    callback(200, {
        name:'sample is called'
    })
}


const notFoundHandler = function(data, callback){
    callback(404);
}

module.exports = {
    sample: sampleHandler,
    notFound: notFoundHandler
}