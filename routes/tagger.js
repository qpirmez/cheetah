var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tagger', { title: 'Named Entity Tagger' });
});

module.exports = router;
