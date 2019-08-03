var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('recognizer', { title: 'Named Entity Recognizer' });
});

module.exports = router;
