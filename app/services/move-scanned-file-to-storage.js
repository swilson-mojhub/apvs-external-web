var path = require('path')
var Promise = require('bluebird').Promise
var fs = Promise.promisifyAll(require('fs'))

module.exports = function (file, fileUpload, targetDir) {
  var targetFilePath = path.join(targetDir, file.filename)
  // fs.rename will fail when mapped to Azure FS, thus copy + delete
  fs.createReadStream(file.path).pipe(fs.createWriteStream(targetFilePath))
  fs.unlinkAsync(file.path).catch()
  fileUpload.destination = targetDir
  fileUpload.path = targetFilePath
}
