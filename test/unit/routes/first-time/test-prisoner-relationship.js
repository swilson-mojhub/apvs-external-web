var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
var mockViewEngine = require('../mock-view-engine')
var bodyParser = require('body-parser')
const dateFormatter = require('../../../../app/services/date-formatter')

var validationErrors

var route = proxyquire(
  '../../../../app/routes/first-time/prisoner-relationship', {
    '../../services/validators/eligibility/prisoner-relationship-validator': function () { return validationErrors }
  })

describe('routes/first-time/prisoner-relationship', function () {
  var request
  var dobDay = '01'
  var dobMonth = '05'
  var dobYear = '1955'
  var dob = dateFormatter.buildFormatted(dobDay, dobMonth, dobYear)

  beforeEach(function () {
    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    validationErrors = false
  })

  describe('GET /first-time/:dob', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time/' + dob)
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time/:dob', function () {
    it('should respond with a 302', function (done) {
      request
        .post('/first-time/' + dob)
        .expect(302)
        .end(done)
    })

    it('should respond with a 400 if validation fails', function (done) {
      validationErrors = { 'relationship': [] }
      request
        .post('/first-time/' + dob)
        .expect(400)
        .end(done)
    })

    it('should redirect to eligibility-fail page if relationship is None of the above', function (done) {
      request
        .post('/first-time/' + dob)
        .send({
          relationship: 'None of the above'
        })
        .expect('location', '/eligibility-fail')
        .end(done)
    })

    it('should redirect to /first-time/:dob/:relationship page if relationship is any value other than None of the above', function (done) {
      var relationship = 'not-none-of-the-above'

      request
        .post('/first-time/' + dob)
        .send({
          relationship: relationship
        })
        .expect('location', '/first-time/' + dob + '/' + relationship)
        .end(done)
    })
  })
})