const crypto = require('crypto')
const config = require('./config')
const _data = require('./data')

const hash = function (password) {
    if (!password && password.length <= 0) {
        return false
    }
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(password).digest('hex')
    return hash
}

const parseJsonToObject = function (str) {
    try {
        return JSON.parse(str)
    }
    catch (err) {
        return {}
    }
}

const createRandomString = function (stringLength) {
    if (!stringLength || typeof (stringLength) !== 'number') {
        return false
    }
    const possibleChars = 'abcdefghijklmnopqrstuvwxyz1234567890'
    let str = ''
    for (i = 1; i <= stringLength; i++) {
        const randomChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length - 1))
        str += randomChar
    }
    return str
}

const verifyToken = function (tokenId, phone, callback) {
    _data.read('tokens', tokenId, function (err, tokenData) {
        if (err || !tokenData)
            return callback(false)
        if (tokenData.phone !== phone || tokenData.expires < Date.now())
            return callback(false)
        return callback(true)
    })
}

module.exports = {
    hash,
    parseJsonToObject,
    createRandomString
}