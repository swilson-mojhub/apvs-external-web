const EnumHelper = require('./helpers/enum-helper')

module.exports = {
  INCOME_SUPPORT: {
    value: 'income-support',
    requireBenefitUpload: false,
    displayName: 'Income Support',
    multipage: false,
    urlValue: 'b1'
  },

  JOBSEEKERS_ALLOWANCE: {
    value: 'jobseekers-allowance',
    requireBenefitUpload: false,
    displayName: 'Jobseeker’s Allowance (JSA)',
    multipage: false,
    urlValue: 'b2'
  },

  EMPLOYMENT_SUPPORT: {
    value: 'employment-support',
    requireBenefitUpload: false,
    displayName: 'Employment and Support Allowance (ESA)',
    multipage: false,
    urlValue: 'b3'
  },

  UNIVERSAL_CREDIT: {
    value: 'universal-credit',
    requireBenefitUpload: true,
    displayName: 'Universal Credit',
    multipage: false,
    urlValue: 'b4'
  },

  WORKING_TAX_CREDIT: {
    value: 'working-tax-credit',
    requireBenefitUpload: true,
    displayName: 'Working Tax credits (with disability or child tax) or Child Tax Credit',
    multipage: true,
    urlValue: 'b5'
  },

  PENSION_CREDIT: {
    value: 'pension-credit',
    requireBenefitUpload: true,
    displayName: 'Pension Credit',
    multipage: true,
    urlValue: 'b6'
  },

  HC2: {
    value: 'hc2',
    requireBenefitUpload: true,
    displayName: 'Health Certificate (HC2)',
    multipage: false,
    urlValue: 'b7'
  },

  HC3: {
    value: 'hc3',
    requireBenefitUpload: true,
    displayName: 'Health Certificate (HC3)',
    multipage: false,
    urlValue: 'b8'
  },

  NHS_TAX_CREDIT: {
    value: 'nhs-tax-credit',
    requireBenefitUpload: true,
    displayName: 'NHS Tax Credit Exemption Certificate',
    multipage: false,
    urlValue: 'b9'
  },

  NONE: {
    value: 'none',
    requireBenefitUpload: false,
    displayName: 'None',
    multipage: false,
    urlValue: 'none'
  },

  getByValue: function (value) {
    return EnumHelper.getKeyByAttribute(this, value)
  }
}
