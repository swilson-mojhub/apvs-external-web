const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')
const paymentMethods = require('../../constants/payment-method-enum')

class PaymentDetails {
  constructor (paymentMethod, accountNumber, sortCode) {
    this.paymentMethod = paymentMethod
    this.accountNumber = accountNumber.replace(/ /g, '')
    this.sortCode = sortCode.replace(/ |-/g, '')
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.paymentMethod, 'PaymentMethod', errors)
      .isRequired(ERROR_MESSAGES.getPaymentMethod)

    if (this.paymentMethod === paymentMethods.DIRECT_BANK_PAYMENT.value) {
      FieldValidator(this.accountNumber, 'AccountNumber', errors)
        .isRequired(ERROR_MESSAGES.getEnterAccountNumber)
        .isNumeric()
        .isLength(8, ERROR_MESSAGES.getIsLengthDigitsMessage)

      FieldValidator(this.sortCode, 'SortCode', errors)
        .isRequired(ERROR_MESSAGES.getEnterSortCode)
        .isNumeric()
        .isLength(6, ERROR_MESSAGES.getIsLengthDigitsMessage)
    }

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = PaymentDetails
