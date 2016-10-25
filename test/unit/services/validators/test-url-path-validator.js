const expect = require('chai').expect
const UrlPathValidator = require('../../../../app/services/validators/url-path-validator')

describe('services/validators/url-path-validator', function () {
  const VALID_DOB = { dob: '1989-04-11' }
  const INVALID_DOB = { dob: 'invalid' }

  const VALID_RELATIONSHIP = { relationship: 'partner' }
  const INVALID_RELATIONSHIP = { relationship: 'invalid' }

  const VALID_ASSISTANCE = { assistance: 'no' }
  const INVALID_ASSISTANCE = { assistance: 'invalid' }

  const VALID_BENEFIT = { requireBenefitUpload: 'no' }
  const INVALID_BENEFIT = { requireBenefitUpload: 'invalid' }

  const VALID_REFERENCE = { reference: '49CCADM' }
  const INVALID_REFERENCE = { reference: 'invalid' }

  it('should throw error if passed null', function (done) {
    expect(function () {
      UrlPathValidator(null)
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if passed undefined', function (done) {
    expect(function () {
      UrlPathValidator(undefined)
    }).to.throw(TypeError)
    done()
  })

  it('should throw Error if passed an invalid dob value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_DOB)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid relationship value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_RELATIONSHIP)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid assistance value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_ASSISTANCE)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid benefit value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_BENEFIT)
    }).to.throw(Error)
    done()
  })

  it('should throw Error if passed an invalid reference value', function (done) {
    expect(function () {
      UrlPathValidator(INVALID_REFERENCE)
    }).to.throw(Error)
    done()
  })

  it('should return undefined if passed a valid dob value', function (done) {
    var result = UrlPathValidator(VALID_DOB)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid relationship value', function (done) {
    var result = UrlPathValidator(VALID_RELATIONSHIP)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid assistance value', function (done) {
    var result = UrlPathValidator(VALID_ASSISTANCE)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid dob value', function (done) {
    var result = UrlPathValidator(VALID_DOB)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid benefit value', function (done) {
    var result = UrlPathValidator(VALID_BENEFIT)
    expect(result).to.equal(undefined)
    done()
  })

  it('should return undefined if passed a valid reference value', function (done) {
    var result = UrlPathValidator(VALID_REFERENCE)
    expect(result).to.equal(undefined)
    done()
  })
})