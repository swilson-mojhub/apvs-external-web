var expect = require('chai').expect
const sortViewClaimResultsHelper = require('../../../../app/services/helpers/sort-view-claim-results-helper')

const CLAIM_EXPENSES = [{
  ClaimExpenseId: 1,
  ExpenseType: 'car',
  Cost: 2.2,
  RequestedCost: 3,
  Status: 'APPROVED-DIFF-AMOUNT'
}]

const CLAIM_EXPENSES_NO_STATUS = [{
  ClaimExpenseId: 1,
  ExpenseType: 'car',
  RequestedCost: 3
}]

const CLAIM_EXPENSES_COST_NOT_SET = [{
  Cost: '',
}]

const ELIGIBILITY = {
  EligibilityId: 1,
  FirstName: 'tester'
}

const CLAIM_DOCUMENTS = [
  { ClaimDocumentId: 1, DocumentType: 'VISIT-CONFIRMATION' },
  { ClaimDocumentId: 2, DocumentType: 'working-tax-credit' },
  { ClaimDocumentId: 3, DocumentType: 'RECEIPT', ClaimExpenseId: 1 },
  { ClaimDocumentId: 4, DocumentType: 'RECEIPT', ClaimExpenseId: 111 }
]

const EXTERNAL_CLAIM_DOCUMENTS = [
  { ClaimDocumentId: 4, DocumentType: 'VISIT-CONFIRMATION' },
  { ClaimDocumentId: 5, DocumentType: 'working-tax-credit' },
  { ClaimDocumentId: 6, DocumentType: 'working-tax-credit' }
]

const PAST_CLAIM = {
  ClaimId: 1,
  IsAdvanceClaim: false
}

const ADVANCE_CLAIM = {
  ClaimId: 1,
  IsAdvanceClaim: true
}

describe('services/helpers/sort-view-claim-results-helper', function () {
  it('should add Eligibility information to claim', function () {
    sortViewClaimResultsHelper(PAST_CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, [], [])
    expect(PAST_CLAIM.EligibilityId).to.equal(ELIGIBILITY.EligibilityId)
    expect(PAST_CLAIM.FirstName).to.equal(ELIGIBILITY.FirstName)
  })

  it('should add internal claim documents to claim', function () {
    sortViewClaimResultsHelper(PAST_CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, [], [])
    expect(PAST_CLAIM.visitConfirmation.ClaimDocumentId).to.equal(CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(PAST_CLAIM.benefitDocument[0].ClaimDocumentId).to.equal(CLAIM_DOCUMENTS[1].ClaimDocumentId)
  })

  it('should replace internal documents with external documents', function () {
    sortViewClaimResultsHelper(PAST_CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, [], EXTERNAL_CLAIM_DOCUMENTS)
    expect(PAST_CLAIM.visitConfirmation.ClaimDocumentId).to.equal(EXTERNAL_CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(PAST_CLAIM.benefitDocument[0].ClaimDocumentId).to.equal(EXTERNAL_CLAIM_DOCUMENTS[2].ClaimDocumentId)
    expect(PAST_CLAIM.benefitDocument[1].ClaimDocumentId).to.equal(EXTERNAL_CLAIM_DOCUMENTS[1].ClaimDocumentId)
  })

  it('should add claim document to claim expense', function () {
    sortViewClaimResultsHelper(PAST_CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, CLAIM_EXPENSES, [])
    expect(CLAIM_EXPENSES[0].DocumentType).to.equal(CLAIM_DOCUMENTS[2].DocumentType)
    expect(CLAIM_EXPENSES[0].fromInternalWeb).to.equal(true)
  })

  it('if given an invalid cost it should be set to zero', function () {
    var result = sortViewClaimResultsHelper(PAST_CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, CLAIM_EXPENSES_COST_NOT_SET, [])
    expect(result[0].Cost).to.equal(0)
  })

  it('use requested cost when a claim expense has no status', function () {
    sortViewClaimResultsHelper(PAST_CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, CLAIM_EXPENSES_NO_STATUS, [])
    expect(CLAIM_EXPENSES_NO_STATUS[0].Cost).to.equal(CLAIM_EXPENSES_NO_STATUS[0].RequestedCost)
  })

  it('should add placeholder claim documents when is advance claim and no claim docuemnts returned', function () {
    sortViewClaimResultsHelper(ADVANCE_CLAIM, ELIGIBILITY, [], CLAIM_EXPENSES, [])
    expect(ADVANCE_CLAIM.visitConfirmation.DocumentType).to.equal('VISIT-CONFIRMATION')
    expect(ADVANCE_CLAIM.visitConfirmation.ClaimDocumentId).to.equal(undefined)
    expect(ADVANCE_CLAIM.visitConfirmation.fromInternalWeb).to.equal(true)
  })

  it('should not add placeholder documents', function () {
    sortViewClaimResultsHelper(ADVANCE_CLAIM, ELIGIBILITY, CLAIM_DOCUMENTS, CLAIM_EXPENSES, [])
    expect(ADVANCE_CLAIM.visitConfirmation.DocumentType).to.equal(CLAIM_DOCUMENTS[0].DocumentType)
    expect(ADVANCE_CLAIM.visitConfirmation.ClaimDocumentId).to.equal(CLAIM_DOCUMENTS[0].ClaimDocumentId)
    expect(ADVANCE_CLAIM.visitConfirmation.fromInternalWeb).to.equal(true)
  })
})
