const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const ValidationError = require('../../../../../app/services/errors/validation-error')

var urlPathValidatorStub
var stubInsertVisitor
var stubDuplicateClaimCheck
var stubGetTravellingFromAndTo
var stubAboutYou
var app

describe('routes/apply/new-eligibility/about-you', function () {
  const COOKIES = [ 'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MTUxLjk1MzU1LCJkb2JFbmNvZGVkIjoiMTEzNzI1MTIyIiwicmVsYXRpb25zaGlwIjoicjQiLCJiZW5lZml0IjoiYjEiLCJyZWZlcmVuY2VJZCI6IjMyMjEwYzdmYmViMTU5YTcwYSIsImRlY3J5cHRlZFJlZiI6IjhXSzFCR1AiLCJjbGFpbVR5cGUiOiJmaXJzdC10aW1lIn0=' ]
  const COOKIES_EXPIRED = [ 'apvs-start-application=' ]
  const ROUTE = `/apply/first-time/new-eligibility/about-you`

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubInsertVisitor = sinon.stub()
    stubDuplicateClaimCheck = sinon.stub()
    stubGetTravellingFromAndTo = sinon.stub()
    stubAboutYou = sinon.stub()

    var route = proxyquire('../../../../../app/routes/apply/new-eligibility/about-you', {
      '../../../services/data/insert-visitor': stubInsertVisitor,
      '../../../services/data/duplicate-claim-check': stubDuplicateClaimCheck,
      '../../../services/data/get-travelling-from-and-to': stubGetTravellingFromAndTo,
      '../../../services/domain/about-you': stubAboutYou,
      '../../../services/validators/url-path-validator': urlPathValidatorStub
    })

    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200 for valid path parameters', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should persist data and redirect to /apply/eligibility/new-claim/future-or-past-visit for valid data', function () {
      stubDuplicateClaimCheck.resolves(false)
      stubInsertVisitor.resolves()
      stubGetTravellingFromAndTo.resolves({to: 'hewell'})
      stubAboutYou.returns({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
          sinon.assert.calledOnce(stubAboutYou)
          sinon.assert.calledOnce(stubInsertVisitor)
          sinon.assert.calledOnce(stubGetTravellingFromAndTo)
        })
        .expect('location', `/apply/eligibility/new-claim/future-or-past-visit`)
    })

    it('should persist data and redirect to /apply/first-time/new-eligibility/date-of-birth?error=expired', function () {
      stubDuplicateClaimCheck.resolves(false)
      stubInsertVisitor.resolves()
      stubGetTravellingFromAndTo.resolves({to: 'hewell'})
      stubAboutYou.returns({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .set('Cookie', COOKIES_EXPIRED)
        .expect('location', `/apply/first-time/new-eligibility/date-of-birth?error=expired`)
    })

    it('should redirect to /apply/eligibility/new-claim/future-or-past-visit for Northern Ireland person and GB Prison', function () {
      stubDuplicateClaimCheck.resolves(false)
      stubInsertVisitor.resolves()
      stubGetTravellingFromAndTo.resolves({to: 'hewell'})
      stubAboutYou.returns({Country: 'Northern Ireland'})

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', `/apply/eligibility/new-claim/future-or-past-visit`)
    })

    it('should redirect to /apply/eligibility/new-claim/journey-information for Northern Ireland person and NI Prison', function () {
      stubDuplicateClaimCheck.resolves(false)
      stubInsertVisitor.resolves()
      stubGetTravellingFromAndTo.resolves({to: 'maghaberry'})
      stubAboutYou.returns({country: 'Northern Ireland'})

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', `/apply/eligibility/new-claim/journey-information`)
    })

    it('should respond with a 400 for invalid data', function () {
      stubAboutYou.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 400 for a duplicate claim', function () {
      stubDuplicateClaimCheck.resolves(true)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      stubAboutYou.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      stubInsertVisitor.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
