const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const claimTypeEnum = require('../../constants/claim-type-enum')
const documentTypeEnum = require('../../constants/document-type-enum')
const getRepeatEligibility = require('./get-repeat-eligibility')
const maskArrayOfNames = require('../helpers/mask-array-of-names')
const maskString = require('../helpers/mask-string')

module.exports = function (claimId, claimType) {
  return knex('Claim')
    .leftJoin('Eligibility', 'Claim.EligibilityId', '=', 'Eligibility.EligibilityId')
    .leftJoin('Visitor', 'Eligibility.EligibilityId', '=', 'Visitor.EligibilityId')
    .leftJoin('Prisoner', 'Eligibility.EligibilityId', '=', 'Prisoner.EligibilityId')
    .where('Claim.ClaimId', claimId)
    .first(
      'Claim.EligibilityId',
      'Claim.Reference',
      'Claim.DateSubmitted',
      'Claim.DateOfJourney',
      'Claim.IsAdvanceClaim',
      'Visitor.FirstName',
      'Visitor.LastName',
      'Visitor.Benefit',
      'Visitor.Country',
      'Prisoner.FirstName AS PrisonerFirstName',
      'Prisoner.LastName AS PrisonerLastName',
      'Prisoner.DateOfBirth AS PrisonerDateOfBirth',
      'Prisoner.PrisonNumber',
      'Prisoner.NameOfPrison',
      'Eligibility.Status AS EligibilityStatus'
    )
    .then(function (claim) {
      if ((claimType === claimTypeEnum.REPEAT_CLAIM || claimType === claimTypeEnum.REPEAT_DUPLICATE) &&
        claim.EligibilityStatus == null) {
        // Repeat claim using existing eligibility data, retrieve from IntSchema
        return getRepeatEligibility(claim.Reference, null, claim.EligibilityId)
          .then(function (eligibility) {
            claim.FirstName = eligibility.FirstName
            claim.LastName = eligibility.LastName
            claim.Country = eligibility.Country
            claim.Benefit = eligibility.Benefit
            claim.PrisonerFirstName = eligibility.PrisonerFirstName
            claim.PrisonerLastName = eligibility.PrisonerLastName
            claim.PrisonerDateOfBirth = eligibility.PrisonerDateOfBirth
            claim.PrisonNumber = eligibility.PrisonNumber
            claim.NameOfPrison = eligibility.NameOfPrison
            return claim
          })
      }
      return claim
    })
    .then(function (claim) {
      return knex('ClaimDocument')
        .where({'ClaimDocument.ClaimId': claimId, 'ClaimDocument.IsEnabled': true, 'ClaimDocument.ClaimExpenseId': null})
        .orWhere({
          'ClaimDocument.ClaimId': null,
          'ClaimDocument.Reference': claim.Reference,
          'ClaimDocument.EligibilityId': claim.EligibilityId,
          'ClaimDocument.IsEnabled': true,
          'ClaimDocument.ClaimExpenseId': null})
        .select('ClaimDocument.DocumentStatus', 'ClaimDocument.DocumentType', 'ClaimDocument.ClaimDocumentId')
        .orderBy('ClaimDocument.DateSubmitted', 'desc')
        .then(function (claimDocuments) {
          return knex('Claim')
            .join('ClaimExpense', 'Claim.ClaimId', '=', 'ClaimExpense.ClaimId')
            .where({ 'Claim.ClaimId': claimId, 'ClaimExpense.IsEnabled': true })
            .select('ClaimExpense.*', 'ClaimDocument.DocumentStatus', 'ClaimDocument.DocumentType', 'ClaimDocument.ClaimDocumentId')
            .leftJoin('ClaimDocument', function () {
              this
                .on('ClaimExpense.ClaimId', 'ClaimDocument.ClaimId')
                .on('ClaimExpense.ClaimExpenseId', 'ClaimDocument.ClaimExpenseId')
                .on('ClaimExpense.IsEnabled', 'ClaimDocument.IsEnabled')
            })
            .then(function (claimExpenses) {
              claim.benefitDocument = []
              claimDocuments.forEach(function (document) {
                if (document.DocumentType === documentTypeEnum['VISIT_CONFIRMATION'].documentType) {
                  claim.visitConfirmation = document
                } else {
                  claim.benefitDocument.push(document)
                }
              })
              return claimExpenses
            })
        })
        .then(function (claimExpenses) {
          return knex('Claim')
            .join('ClaimChild', 'Claim.ClaimId', '=', 'ClaimChild.ClaimId')
            .where({ 'Claim.ClaimId': claimId, 'ClaimChild.IsEnabled': true })
            .select()
            .orderBy('ClaimChild.FirstName')
            .then(function (claimChild) {
              var child = claimChild
              if (claimType === claimTypeEnum.REPEAT_DUPLICATE) {
                child = maskArrayOfNames(claimChild)
              }
              return {
                claimExpenses: claimExpenses,
                claimChild: child
              }
            })
        })
        .then(function (expensesAndChildren) {
          return knex('ClaimEscort')
            .where({
              'ClaimEscort.ClaimId': claimId,
              'ClaimEscort.IsEnabled': true
            })
            .first()
            .then(function (claimEscort) {
              var escort = claimEscort
              if (claimType === claimTypeEnum.REPEAT_DUPLICATE && claimEscort) {
                escort.LastName = maskString(claimEscort.LastName, 1)
              }
              return {
                claim: claim,
                claimExpenses: expensesAndChildren.claimExpenses,
                claimChild: expensesAndChildren.claimChild,
                claimEscort: claimEscort
              }
            })
        })
    })
}
