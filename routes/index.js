var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard 1.01' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('index', { title: 'Dashboard 1.01' });
});

module.exports = router;
