/**
 * This file defines all routes used in this application. Any logic that is applicable to all routes can be added here.
 */
const log = require('../services/log')

var routes = [
  require('./index'),
  require('./start'),
  require('./eligibility/first-time-eligibility-flow'),
  require('./first-time/about-the-prisoner.js'),
  require('./first-time/about-you.js'),
  // These are temporary UX added routes
  require('./file-upload'),
  require('./eligibility/about-the-prisoner'),
  require('./eligibility/about-you'),
  require('./claim/visit-type'),
  require('./claim/your-journey'),
  require('./payment/bank-account-details'),
  require('./application-submitted'),
  require('./claim/transport'),
  require('./claim/additional-expenses'),
  require('./claim/light-refreshment-details'),
  require('./claim/claim-summary'),
  require('./claim/car-details'),
  require('./claim/taxi-details'),
  require('./claim/train-details'),
  require('./eligibility/confirm-your-details'),
  require('./eligibility/eligibility-requirements'),
  require('./claim/profile'),
  require('./claim/claim-details'),
  require('./eligibility/eligibility-fail'),
  // Health check routes
  require('./health-check/status')
]

module.exports = function (router) {
  router.use(function (req, res, next) {
    log.info({ request: req }, 'Route Started.')
    next()
  })

  routes.forEach(function (route) {
    route(router)
  })

  router.use(function (req, res) {
    log.info({ response: res }, 'Route Complete.')
  })
}