module.exports = function (router) {
  router.get('/additional-expenses', function (req, res, next) {
    res.render('claim/additional-expenses')
    next()
  })

  router.post('/additional-expenses', function (req, res, next) {
    res.redirect('light-refreshment-details')
    next()
  })
}