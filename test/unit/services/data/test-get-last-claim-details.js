const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const REFERENCE = 'LASTCD1'
const ELIGIBILITYID = '1234'
const LAST_NAME = 'Bloggs'
const LAST_NAME_MASKED = 'B*****'

const CHILDREN = [{ClaimChildId: 1, LastName: LAST_NAME}]
const EXPENSES = [{ClaimExpenseId: 2}]
const ESCORT = [{ClaimEscortId: 3, LastName: LAST_NAME}]

var getClaimChildrenByIdOrLastApprovedStub = sinon.stub().resolves(CHILDREN)
var getClaimExpenseByIdOrLastApprovedStub = sinon.stub().resolves(EXPENSES)
var getClaimEscortByIdOrLastApprovedStub = sinon.stub().resolves(ESCORT)
var maskArrayOfNamesStub = sinon.stub().returns(LAST_NAME_MASKED)

const getLastClaimDetails = proxyquire('../../../../app/services/data/get-last-claim-details', {
  './get-claim-children-by-id-or-last-approved': getClaimChildrenByIdOrLastApprovedStub,
  './get-claim-expense-by-id-or-last-approved': getClaimExpenseByIdOrLastApprovedStub,
  './get-claim-escort-by-id-or-last-approved': getClaimEscortByIdOrLastApprovedStub,
  '../helpers/mask-array-of-names': maskArrayOfNamesStub
})

describe('services/data/get-last-claim-details', function () {
  it('should call to get last claim children and last claim expenses', function () {
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, false)
      .then(function (result) {
        sinon.assert.calledWith(getClaimChildrenByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, null)
        sinon.assert.calledWith(getClaimExpenseByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, null)
        sinon.assert.calledWith(getClaimEscortByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, null)
        sinon.assert.notCalled(maskArrayOfNamesStub)

        expect(result.children).to.be.equal(CHILDREN)
        expect(result.expenses).to.be.equal(EXPENSES)
        expect(result.escort).to.be.equal(ESCORT)
      })
  })

  it('should mask child last name and escort last name if mask is true', function () {
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, true)
      .then(function (result) {
        sinon.assert.calledWith(getClaimChildrenByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, null)
        sinon.assert.calledWith(getClaimExpenseByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, null)
        sinon.assert.calledWith(getClaimEscortByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, null)
        sinon.assert.calledWith(maskArrayOfNamesStub, CHILDREN)
        sinon.assert.calledWith(maskArrayOfNamesStub, ESCORT)
      })
  })
})
