const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const ValidationError = require('../../../../../../app/services/errors/validation-error')
require('sinon-bluebird')

describe('routes/apply/eligibility/claim/file-upload', function () {
  const REFERENCE = 'V123456'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const DOB = '1990-12-12'
  const CLAIMID = '1'
  const ROUTE = `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary/file-upload?document=`
  const YOUR_CLAIMS_UPLOAD_ROUTE = `/your-claims/${DOB}/${REFERENCEID}/${CLAIMID}/file-upload?document=`

  var app
  var urlPathValidatorStub
  var directoryCheckStub
  var uploadStub
  var fileUploadDomainStub
  var claimDocumentInsertStub
  var generateCSRFTokenStub
  var clamAvStub
  var configStub
  var insertTaskStub
  var csurfStub
  var csrfProtectionStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    directoryCheckStub = sinon.stub()
    uploadStub = sinon.stub()
    fileUploadDomainStub = sinon.stub()
    claimDocumentInsertStub = sinon.stub()
    generateCSRFTokenStub = sinon.stub()
    clamAvStub = sinon.stub()
    configStub = sinon.stub()
    insertTaskStub = sinon.stub()
    csrfProtectionStub = sinon.stub()
    csurfStub = sinon.stub().returns(csrfProtectionStub)

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/claim/file-upload', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/directory-check': directoryCheckStub,
      '../../../../services/upload': uploadStub,
      '../../../../services/domain/file-upload': fileUploadDomainStub,
      '../../../../services/data/insert-file-upload-details-for-claim': claimDocumentInsertStub,
      '../../../../services/generate-csrf-token': generateCSRFTokenStub,
      '../../../../services/clam-av': { clamAvStub, '@noCallThru': true },
      '../../../../../config': configStub,
      '../../../../services/data/insert-task': insertTaskStub,
      'csurf': csurfStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should call the CSRFToken generator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(generateCSRFTokenStub)
        })
    })

    it('should respond with a 200 if passed valid document type', function () {
      return supertest(app)
        .get(`${ROUTE}VISIT_CONFIRMATION`)
        .expect(200)
    })

    it('should call the directory check', function () {
      return supertest(app)
        .get(`${ROUTE}VISIT_CONFIRMATION`)
        .expect(function () {
          sinon.assert.calledOnce(directoryCheckStub)
        })
    })

    it('should respond with a 500 if passed invalid document type', function () {
      return supertest(app)
        .get(`${ROUTE}TEST`)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      clamAvStub.resolves()
      uploadStub.callsArg(2)
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should create a file upload object, insert it to DB and give 302', function () {
      uploadStub.callsArg(2).returns({})
      claimDocumentInsertStub.resolves()
      clamAvStub.resolves()
      return supertest(app)
        .post(`${ROUTE}VISIT_CONFIRMATION`)
        .expect(function () {
          sinon.assert.calledOnce(uploadStub)
          sinon.assert.calledOnce(fileUploadDomainStub)
          sinon.assert.calledOnce(claimDocumentInsertStub)
        })
        .expect(302)
    })

    it('should throw a validation error if the upload service throws an error', function () {
      uploadStub.callsArgWith(2, new Error())
      return supertest(app)
        .post(`${ROUTE}TEST`)
        .expect(400)
    })

    it('should catch a validation error', function () {
      uploadStub.callsArg(2).returns({})
      fileUploadDomainStub.throws(new ValidationError())
      clamAvStub.resolves()
      return supertest(app)
        .post(`${ROUTE}VISIT_CONFIRMATION`)
        .expect(400)
    })

    it('should respond with a 500 if an error is thrown in csrfProtection', function () {
      uploadStub.callsArg(2).returns({})
      csrfProtectionStub.callsArgWith(2, new Error())
      return supertest(app)
        .post(`${ROUTE}VISIT_CONFIRMATION`)
        .expect(500)
    })

    it('should respond with a 500 if passed invalid document type', function () {
      uploadStub.callsArg(2).returns({})
      return supertest(app)
        .post(`${ROUTE}TEST`)
        .expect(500)
    })
  })

  describe(`GET ${YOUR_CLAIMS_UPLOAD_ROUTE}`, function () {
    it('should respond with a 200 if passed valid document type', function () {
      return supertest(app)
        .get(`${YOUR_CLAIMS_UPLOAD_ROUTE}VISIT_CONFIRMATION`)
        .expect(200)
    })

    it('should respond with a 500 if passed invalid document type', function () {
      return supertest(app)
        .get(`${YOUR_CLAIMS_UPLOAD_ROUTE}TEST`)
        .expect(500)
    })
  })

  describe(`POST ${YOUR_CLAIMS_UPLOAD_ROUTE}`, function () {
    it('should create a file upload object, insert it to DB and give 302', function () {
      uploadStub.callsArg(2).returns({})
      claimDocumentInsertStub.resolves()
      clamAvStub.resolves()
      return supertest(app)
        .post(`${YOUR_CLAIMS_UPLOAD_ROUTE}VISIT_CONFIRMATION`)
        .expect(function () {
          sinon.assert.calledOnce(uploadStub)
          sinon.assert.calledOnce(fileUploadDomainStub)
          sinon.assert.calledOnce(claimDocumentInsertStub)
        })
        .expect(302)
    })

    it('should respond with a 500 if passed invalid document type', function () {
      uploadStub.callsArg(2).returns({})
      return supertest(app)
        .post(`${YOUR_CLAIMS_UPLOAD_ROUTE}TEST`)
        .expect(500)
    })
  })
})
