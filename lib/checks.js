const _data = require('./data')
const config = require('./config')
const helpers = require('./helpers')

const verifyToken = function (tokenId, phone, callback) {

    if (!tokenId) return callback(false)
    _data.read('tokens', tokenId, function (err, data) {
        if (err || !data)
            return callback(false)
        if (data.phone !== phone || data.expires < Date.now())
            return callback(false)
        return callback(true)
    })
}


const post = function (data, callback) {
    const protocol = (typeof (data.payload.protocol) === 'string' && ['http', 'https'].includes(data.payload.protocol) && data.payload.protocol) || false
    const url = (typeof (data.payload.url) === 'string' && data.payload.url) || false
    const method = (typeof (data.payload.method) === 'string' && ['get', 'post', 'put', 'delete'].includes(data.payload.method) && data.payload.method) || false
    const successCodes = (typeof (data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 && data.payload.successCodes) || false
    const timeoutSeconds = typeof (data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds || false
    if (!protocol || !url || !method || !successCodes || !timeoutSeconds)
        return callback(400, { Error: "Missing required fields" })
    const token = typeof (data.headers.token) === 'string' ? data.headers.token : false
    _data.read('tokens', token, function (err, tokenData) {
        if (err || !tokenData)
            return callback(403)
        const userPhone = tokenData.phone
        _data.read('users', userPhone, function (err, userData) {
            if (err || !userData)
                return callback(403)
            const userChecks = typeof (userData.checks) === 'object' && userData.checks instanceof Array && userData.checks || []
            if (userChecks.length >= config.maxChecks)
                return callback(400, { Error: 'User already has maximum number of checks (' + config.maxChecks + ')' })
            const checkId = helpers.createRandomString(20)
            const checkObject = {
                id: checkId,
                userPhone,
                protocol,
                method,
                url,
                successCodes,
                timeoutSeconds
            }
            _data.create('checks', checkId, checkObject, function (err) {
                if (err)
                    return callback(500, { Error: 'Could not create the new check' })
                userData.checks = userChecks
                userData.checks.push(checkObject.id)
                _data.update('users', userPhone, userData, function (err) {
                    if (err) return callback(500, { Error: 'Could not update the user with new check' })
                    return callback(201, checkObject)
                })
            })
        })
    })
}
const get = function (data, callback) {
    const id = typeof (data.queryObject.id) === 'string' && data.queryObject.id.trim().length === 20 ? data.queryObject.id.trim() : false
    if (!id) {
        return callback(400, { Error: 'Missing required Field' })
    }
    _data.read('checks', id, function (err, checkData) {
        if (err || !checkData)
            return callback(404)
        const tokenId = typeof (data.headers.token) === 'string' ? data.headers.token : false
        verifyToken(tokenId, checkData.userPhone, function (isTokenValid) {
            if (!isTokenValid)
                return callback(403, { Error: 'Missing token inside headers, or token is invalid' })
            callback(200, checkData)
        })
    })

}

const put = function (data, callback) {
    const id = typeof (data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false

    const protocol = (typeof (data.payload.protocol) === 'string' && ['http', 'https'].includes(data.payload.protocol) && data.payload.protocol) || false
    const url = (typeof (data.payload.url) === 'string' && data.payload.url) || false
    const method = (typeof (data.payload.method) === 'string' && ['get', 'post', 'put', 'delete'].includes(data.payload.method) && data.payload.method) || false
    const successCodes = (typeof (data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 && data.payload.successCodes) || false
    const timeoutSeconds = typeof (data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds || false

    if (!id) return callback(400, { Error: 'missing required field' })
    if (!protocol && !url && !method && !successCodes && !timeoutSeconds)
        return callback(400, { Error: 'missing field(s) to update' })
    _data.read('checks', id, function (err, checkData) {
        if (err || !checkData) return callback(400, { Error: 'check id do not exist' })
        const tokenId = typeof (data.headers.token) === 'string' ? data.headers.token : false
        verifyToken(tokenId, checkData.userPhone, function (isTokenValid) {
            if (!isTokenValid)
                return callback(403, { Error: 'Missing token inside headers, or token is invalid' })
            if (protocol)
                checkData.protocol = protocol
            if (url)
                checkData.url = url
            if (method)
                checkData.method = method
            if (successCodes)
                checkData.successCodes = successCodes
            if (timeoutSeconds)
                checkData.timeoutSeconds = timeoutSeconds
            _data.update('checks', id, checkData, function (err) {
                if (err) return callback(500, { Error: 'Could not update the check' })
                return callback(200)
            })
        })
    })
}

const deleteCheck = function (data, callback) {
    const id = typeof (data.queryObject.id) === 'string' && data.queryObject.id.trim().length === 20 ? data.queryObject.id.trim() : false
    if (!id)
        return callback(400, { Error: 'Missing required Field' })
    _data.read('checks', id, function (err, checkData) {
        if (err || !checkData) return callback(400, { Error: 'the specified Check Id dose not exist' })
        const tokenId = typeof (data.headers.token) === 'string' ? data.headers.token : false
        verifyToken(tokenId, checkData.userPhone, function (isTokenValid) {
            if (!isTokenValid)
                return callback(403, { Error: 'Missing token inside headers, or token is invalid' })
            _data.delete('checks', id, function (err) {
                if (err) return callback(500, { Error: 'could not delete the check' })
                _data.read('users', checkData.userPhone, function (err, userData) {
                    if (err && !userData) {
                        return callback(500, { Error: 'Could not find the specified user, there for could not update users checklist' })
                    }
                    userData.checks = userData.checks.filter(userCheck => {
                        return userCheck !== id
                    })
                    _data.update('users', checkData.userPhone, userData, function (err) {
                        if (err) {
                            return callback(500, { Error: 'Could not delete the check from user checklist' })
                        }
                        return callback(200)
                    })
                })
            })
        })
    })
}

module.exports = {
    post,
    get,
    put,
    delete: deleteCheck
}