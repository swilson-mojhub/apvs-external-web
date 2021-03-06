const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class NewClaim {
  constructor (reference, day, month, year, isAdvanceClaim) {
    this.reference = reference
    this.fields = [
      day,
      month,
      year
    ]
    this.dateOfJourney = dateFormatter.build(day, month, year)
    this.isAdvanceClaim = isAdvanceClaim
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.reference, 'Reference', errors)
      .isRequired()

    if (!this.isAdvanceClaim) {
      FieldsetValidator(this.fields, 'DateOfJourney', errors)
        .isRequired(ERROR_MESSAGES.getEnterDateOfVisit)
        .isValidDate(this.dateOfJourney)
        .isPastDate(this.dateOfJourney)
        .isDateWithinDays(this.dateOfJourney, 99, this.isAdvanceClaim)
    } else {
      FieldsetValidator(this.fields, 'DateOfJourney', errors)
        .isRequired(ERROR_MESSAGES.getEnterDateOfVisit)
        .isValidDate(this.dateOfJourney)
        .isFutureDate(this.dateOfJourney)
        .isDateWithinDays(this.dateOfJourney, 99, this.isAdvanceClaim)
        .isNotDateWithinDays(this.dateOfJourney, 5)
    }

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = NewClaim
