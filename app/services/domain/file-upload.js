const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const fs = require('fs')
const dateFormatter = require('../date-formatter')
const documentTypeEnum = require('../../constants/document-type-enum')
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class FileUpload {
  constructor (claimId, documentType, claimExpenseId, file, fileTypeError, alternative) {
    this.file = file
    this.alternative = alternative
    this.fileTypeError = fileTypeError
    this.IsValid()
    if (!this.alternative) {
      this.path = file.path
    }
    this.claimId = claimId
    this.documentType = documentTypeEnum[documentType]
    this.claimExpenseId = claimExpenseId
    this.dateSubmitted = dateFormatter.now().toDate()

    if (file) {
      this.documentStatus = 'uploaded'
    } else {
      this.documentStatus = alternative
    }
  }

  IsValid () {
    var errors = ErrorHandler()

    if (this.fileTypeError) {
      throw new ValidationError({upload: [ERROR_MESSAGES.getUploadIncorrectType]})
    }

    if (!this.file) {
      FieldValidator(this.alternative, 'upload', errors)
        .isRequired()
    }

    if (this.file && this.alternative) {
      fs.unlinkSync(this.file.path)
      throw new ValidationError({upload: [ERROR_MESSAGES.getUploadFileAndAlternativeSelected]})
    }

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = FileUpload