var bunyan = require('bunyan')
var PrettyStream = require('bunyan-prettystream')
var logsPath = process.env.LOGGING_PATH || 'logs/external-web.log'

// Stream to handle pretty printing of Bunyan logs to stdout.
var prettyStream = new PrettyStream()
prettyStream.pipe(process.stdout)

// Create a base logger for the application.
var log = bunyan.createLogger({
  name: 'external-web',
  streams: [],
  serializers: {
    'request': requestSerializer,
    'response': responseSerializer
  }
})

// Add console Stream.
log.addStream({
  level: 'DEBUG',
  stream: prettyStream
})

// Add file stream.
log.addStream({
  type: 'rotating-file',
  level: 'DEBUG',
  path: logsPath,
  period: '1d',
  count: 7
})

function requestSerializer (request) {
  return {
    url: request.url,
    method: request.method,
    params: request.params
  }
}

function responseSerializer (response) {
  return {
    statusCode: response.statusCode
  }
}

module.exports = log