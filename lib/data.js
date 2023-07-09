const fs = require('fs')
const path = require('path')

const baseDir = path.join(__dirname, '/../.data')

const create = function (dir, fileName, data, callback) {
    fs.open(baseDir + '/' + dir + '/' + fileName + '.json', 'wx', function (err, fileDescriptor) {

        if (err || !fileDescriptor) {
            return callback("Ops, something went wrong and couldn't make the file " + err,)
        }
        const stringData = JSON.stringify(data)

        fs.writeFile(fileDescriptor, stringData, function (err) {
            if (err) {
                return callback('Error occur while writing to the file')
            }
            fs.close(fileDescriptor, function (err) {
                if (err) {
                    return callback('Error occur while closing the file')
                }
                return callback(false)
            })
        })

    })
}

const read = function (dir, fileName, callback) {
    fs.readFile(baseDir + '/' + dir + '/' + fileName + '.json', 'utf8', function (err, data) {
        return callback(err, data)
    })
}

const update = function (dir, fileName, data, callback) {
    fs.open(baseDir + '/' + dir + '/' + fileName + '.json', 'r+', function (err, fileDescriptor) {

        if (err || !fileDescriptor) {
            return callback("Ops, something went wrong, could not update the file")
        }
        const stringData = JSON.stringify(data)
        fs.ftruncate(fileDescriptor, stringData.length, function (err) {
            if (err) {
                return callback('Could not truncate the file')
            }
            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (err) {
                    return callback('Error occur while writing to the file')
                }
                fs.close(fileDescriptor, function (err) {
                    if (err) {
                        return callback('Error occur while closing the file')
                    }
                    return callback(false)
                })
            })
        })

    })
}

const fileDelete = function (dir, fileName, callback) {
    fs.unlink(baseDir + '/' + dir + '/' + fileName + '.json', function (err) {
        if (err) {
            return callback('Ops, something went wrong, could not delete the file')
        }
        return callback(false)
    })
}




module.exports = {
    baseDir,
    create,
    read,
    update,
    delete: fileDelete
}