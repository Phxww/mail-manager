const express = require('express');
const router = express.Router();
const mailManager = require('../modules/mailManager');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/emailService', function(req, res) {
  res.render('emailService');
});

router.post('/emailService', function(req, res) {

  const mail = new mailManager();
    mail.send(req);

res.redirect('/emailService');

});

module.exports = router;
