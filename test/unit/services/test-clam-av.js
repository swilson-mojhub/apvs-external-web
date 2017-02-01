const proxyquire = require('proxyquire')
const sinon = require('sinon')
const expect = require('chai').expect

const EXPECTED_ERROR = 'No valid & active virus scanning binaries are active and available!'

describe('services/clam-av', function () {
  var isInfectedStub
  var clamStub
  var configStub

  beforeEach(function () {
    configStub = sinon.stub()
    isInfectedStub = sinon.stub()

    clamStub = sinon.stub().returns({
      is_infected: isInfectedStub
    })
  })

  it('should throw an error if ENABLE_MALWARE_SCANNING is not true and the error message is anything but the expected error', function () {
    configStub.ENABLE_MALWARE_SCANNING = 'false'
    clamStub.throws(new Error())

    expect(function () {
      proxyquire('../../../app/services/clam-av', {
        'clamscan': clamStub,
        '../../config': configStub
      })
    }).to.throw(Error)
  })

  it('should suppress claim scan error if ENABLE_MALWARE_SCANNING is true or we see EXPECTED_ERROR', function () {
    configStub.ENABLE_MALWARE_SCANNING = 'true'
    clamStub.throws(new Error(EXPECTED_ERROR))

    expect(function () {
      proxyquire('../../../app/services/clam-av', {
        'clamscan': clamStub,
        '../../config': configStub
      })
    }).to.not.throw(Error)
  })

  describe('scan', function () {
    const FILE_PATH = '/tmp/dummy/path'

    it('should scan file when malware scanning is enabled', function () {
      var clamAv = proxyquire('../../../app/services/clam-av', {
        'clamscan': clamStub,
        '../../config': configStub
      })

      configStub.ENABLE_MALWARE_SCANNING = 'true'
      clamAv.scan(FILE_PATH)
      sinon.assert.calledOnce(isInfectedStub)
      sinon.assert.calledWith(isInfectedStub, FILE_PATH)
    })

    it('should not scan file when malware scanning is disabled', function () {
      var clamAv = proxyquire('../../../app/services/clam-av', {
        'clamscan': clamStub,
        '../../config': configStub
      })

      configStub.ENABLE_MALWARE_SCANNING = 'false'
      clamAv.scan('/tmp/dummy/path')
      sinon.assert.notCalled(isInfectedStub)
    })
  })
})
