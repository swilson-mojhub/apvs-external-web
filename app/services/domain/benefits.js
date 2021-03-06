const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class Benefits {
  constructor (benefit) {
    this.benefit = benefit ? benefit.trim() : ''
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.benefit, 'benefit', errors)
      .isRequired(ERROR_MESSAGES.getBenefitRequired)
      .isValidBenefit(true)

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = Benefits
