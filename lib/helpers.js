const crypto = require('crypto')
const config = require('./config')

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

module.exports = {
    hash,
    parseJsonToObject
}