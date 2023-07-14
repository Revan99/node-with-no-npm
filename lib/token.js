const _data = require('./data')
const helpers = require('./helpers')


const get = function (data, callback) {
    const id = typeof (data.queryObject.id) === 'string' && data.queryObject.id.trim().length === 20 ? data.queryObject.id.trim() : false
    if (!id) {
        return callback(400, { Error: 'Missing required Field' })
    }
    _data.read('tokens', id, function (err, tokenData) {
        if (err && !tokenData) {
            return callback(404)
        }
        return callback(200, tokenData)
    })
}
const post = function (data, callback) {
    const phone = (!!data.payload.phone && data.payload.phone.length === 10 && data.payload.phone) || false
    const password = (!!data.payload.password && data.payload.password.length > 0 && data.payload.password) || false
    if (!password || !phone)
        return callback(400, { Error: 'Missing required field(s)' })
    _data.read('users', phone, function (err, userData) {
        if (err || !userData)
            return callback(400, { Error: 'Could not find the specified user' })
        if (helpers.hash(password) !== userData.hashPassword)
            return callback(400, { Error: 'phone or password is incorrect' })
        const tokenId = helpers.createRandomString(20);
        const expires = Date.now() + 1000 * 60 * 60;
        const tokenObject = {
            phone,
            expires,
            id: tokenId
        }
        _data.create('tokens', tokenId, tokenObject, function (err) {
            if (err)
                return callback(500, { Error: 'Could not make the token' })
            return callback(200, tokenObject)
        })
    })
}
const put = function (data, callback) {
    const id = typeof (data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false
    const extend = typeof (data.payload.extend) === 'boolean' && data.payload.extend === true ? true : false
    console.log(id, extend)
    if (!id || !extend)
        return callback(400, { Error: 'Missing required field(s) of filed(s) are invalid' })
    _data.read('tokens', id, function (err, tokenData) {
        if (err || !tokenData)
            return callback(400, { Error: 'Could not find the specified token' })
        if (tokenData.expires < Date.now())
            return callback(400, { Error: 'The token is already expired' })
        tokenData.expires = Date.now() + 1000 * 60 * 60
        _data.update('tokens', id, tokenData, function (err) {
            if (err)
                return callback(500, { Error: 'Could not update the token' })
            return callback(200)
        })
    })
}
const deleteToken = function (data, callback) {
    const id = typeof (data.queryObject.id) === 'string' && data.queryObject.id.trim().length === 20 ? data.queryObject.id.trim() : false
    if (!id) {
        return callback(400, { Error: 'Missing required Field' })
    }
    _data.read('tokens', id, function (err, data) {
        if (err && !data) {
            return callback(400, { Error: 'Could not find the specified token' })
        }
        _data.delete('tokens', id, function (err) {
            if (err) {
                return callback(500, { Error: 'Could not delete the specified token' })
            }
            return callback(200)
        })
    })
}




module.exports = {
    get,
    post,
    put,
    delete: deleteToken
}