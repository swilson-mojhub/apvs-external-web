const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const getClaimSummary = require('../../../../services/data/get-claim-summary')
const removeClaimExpense = require('../../../../services/data/remove-claim-expense')
const removeClaimDocument = require('../../../../services/data/remove-claim-document')
const dateHelper = require('../../../../views/helpers/date-helper')
const claimExpenseHelper = require('../../../../views/helpers/claim-expense-helper')
const benefitsEnum = require('../../../../constants/benefits-enum')
const ClaimSummary = require('../../../../services/domain/claim-summary')
const ValidationError = require('../../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/first-time/eligibility/:referenceId/claim/:claimId/summary', function (req, res, next) {
    UrlPathValidator(req.params)

    getClaimSummary(req.params.claimId)
      .then(function (claimDetails) {
        return res.render('first-time/eligibility/claim/claim-summary',
          {
            referenceId: req.params.referenceId,
            claimId: req.params.claimId,
            claimDetails: claimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            benefitsEnum: benefitsEnum
          })
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/summary', function (req, res, next) {
    UrlPathValidator(req.params)
    var savedClaimDetails
    getClaimSummary(req.params.claimId)
      .then(function (claimDetails) {
        savedClaimDetails = claimDetails
        var claimSummary = new ClaimSummary(claimDetails.claim.visitConfirmation) // eslint-disable-line no-unused-vars
        return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/bank-account-details`)
      })
      .catch(function (error) {
        if (error instanceof ValidationError) {
          return res.status(400).render('first-time/eligibility/claim/claim-summary', {
            referenceId: req.params.referenceId,
            claimId: req.params.claimId,
            claimDetails: savedClaimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            benefitsEnum: benefitsEnum,
            errors: error.validationErrors
          })
        } else {
          next(error)
        }
      })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/summary/remove/:claimExpenseId', function (req, res, next) {
    UrlPathValidator(req.params)

    removeClaimExpense(req.params.claimId, req.params.claimExpenseId)
      .then(function () {
        return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`)
      })
      .catch(function (error) {
        next(error)
      })
  })

  router.post('/first-time/eligibility/:referenceId/claim/:claimId/summary/removeFile/:claimDocumentId', function (req, res, next) {
    UrlPathValidator(req.params)
    removeClaimDocument(req.params.claimDocumentId)
      .then(function () {
        return res.redirect(`/first-time/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`)
      })
      .catch(function (error) {
        next(error)
      })
  })
}
