const _data = require('./data')
const helpers = require('./helpers')

const post = function (data, callback) {
    const firstName = (!!data.payload.firstName && data.payload.firstName.length > 0 && data.payload.firstName) || false
    const lastName = (!!data.payload.lastName && data.payload.lastName.length > 0 && data.payload.lastName) || false
    const phone = (!!data.payload.phone && data.payload.phone.length === 10 && data.payload.phone) || false
    const password = (!!data.payload.password && data.payload.password.length > 0 && data.payload.password) || false
    const tosAgreement = !!data.payload.firstName

    if (firstName && lastName && phone && password && tosAgreement) {
        _data.read('users', phone, function (err) {
            if (!err) {
                return callback(400, { Error: ' this user might exist' })
            }
            const hashPassword = helpers.hash(password)
            if (!hashPassword) {
                return callback(500, { Error: 'Could not create user\'s hash password' })
            }
            const userObject = {
                firstName,
                lastName,
                phone,
                hashPassword,
                tosAgreement
            }
            _data.create('users', phone, userObject, function (err) {
                if (!err) {
                    return callback(200)
                }
                return callback(500, { Error: 'Could not create the new user' })
            })
        })
    }
    else {
        return callback(500, { Error: 'Should send required field' })
    }
}
const get = function (data, callback) {
    const phone = typeof (data.queryObject.phone) === 'string' && data.queryObject.phone.trim().length === 10 ? data.queryObject.phone.trim() : false
    if (!phone) {
        return callback(400, { Error: 'Missing required Field' })
    }
    _data.read('users', phone, function (err, data) {
        if (err && !data) {
            return callback(404)
        }
        delete data.hashPassword
        return callback(200, data)
    })
}
const put = function (data, callback) {
    const phone = (!!data.payload.phone && data.payload.phone.length === 10 && data.payload.phone) || false
    const firstName = (!!data.payload.firstName && data.payload.firstName.length > 0 && data.payload.firstName) || false
    const lastName = (!!data.payload.lastName && data.payload.lastName.length > 0 && data.payload.lastName) || false
    const password = (!!data.payload.password && data.payload.password.length > 0 && data.payload.password) || false

    if (!phone) {
        return callback(400, { Error: 'Missing required Field' })
    }

    if (firstName || lastName || password) {
        _data.read('users', phone, function (err, user) {
            if (err || !user) {
                return callback(400, { Error: 'the specified user does not exit' })
            }
            if (firstName) {
                user.firstName = firstName
            }
            if (lastName) {
                user.lastName = lastName
            }
            if (password) {
                user.hashPassword = helpers.hash(password)
            }
            _data.update('users', phone, user, function (err) {
                if (err) {
                    return callback(500, { Error: 'Cloud not update the user' })
                }
                return callback(200)
            })
        })
    } else {
        return callback(400, { Error: 'Missing fields to updated' })
    }


}
const deleteUser = function (data, callback) {
    const phone = typeof (data.queryObject.phone) === 'string' && data.queryObject.phone.trim().length === 10 ? data.queryObject.phone.trim() : false
    console.log(phone)
    if (!phone) {
        return callback(400, { Error: 'Missing required Field' })
    }
    _data.read('users', phone, function (err, data) {
        if (err && !data) {
            return callback(400, { Error: 'Could not find the specified user' })
        }
        _data.delete('users', phone, function (err) {
            if (err) {
                return callback(500, { Error: 'Could not delete the specified user' })
            }
            return callback(200)
        })
    })
}

module.exports = {
    post,
    get,
    put,
    delete: deleteUser
}