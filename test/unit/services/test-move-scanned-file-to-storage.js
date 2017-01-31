var expect = require('chai').expect
var Promise = require('bluebird').Promise
var mkdir = Promise.promisify(require('fs').mkdir)
var writeFile = Promise.promisify(require('fs').writeFile)
var rmdir = Promise.promisify(require('fs').rmdir)
var unlink = Promise.promisify(require('fs').unlink)
var open = Promise.promisify(require('fs').open)

var path = require('path')
var moveScannedFilesToStorage = require('../../../app/services/move-scanned-file-to-storage')

const SOURCE_DIRECTORY = 'source'
const TARGET_DIRECTORY = 'target'
const FILENAME = 'testfile'
var sourceDirectoryPath
var targetDirectoryPath
var file = {}
var fileUpload = {
  destination: '',
  path: ''
}

describe('services/move-scanned-file-to-storage', function () {
  before(function () {
    sourceDirectoryPath = path.join(__dirname, SOURCE_DIRECTORY)
    targetDirectoryPath = path.join(__dirname, TARGET_DIRECTORY)

    file.filename = FILENAME
    file.path = path.join(sourceDirectoryPath, FILENAME)

    return Promise.all([
      mkdir(sourceDirectoryPath)
        .then(function () {
          return writeFile(file.path, 'test')
        }),
      mkdir(targetDirectoryPath)
    ])
    .catch(function (error) { // eslint-disable-line handle-callback-err
      // files already exist
    })
  })

  it('should move scanned file to storage', function () {
    moveScannedFilesToStorage(file, fileUpload, targetDirectoryPath)
    expect(fileUpload.destination).to.equal(targetDirectoryPath)
    expect(fileUpload.path).to.equal(path.join(targetDirectoryPath, file.filename))
  })

  after(function () {
    return open(fileUpload.path, 'r')
      .then(function () {
        return unlink(fileUpload.path)
        .then(function () {
          return Promise.all([rmdir(sourceDirectoryPath), rmdir(targetDirectoryPath)])
        })
      })
  })
})
