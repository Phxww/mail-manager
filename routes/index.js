const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const mailManager = require('../modules/mailManager');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/emailService', function(req, res) {
  res.render('emailService');
});

router.post('/emailService', function(req, res) {

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFieldsSize = 20 * 1024 * 1024;
  form.parse(req, function(err, fields, files) {
    if(err) {
        return res.redirect(303, '/error');
    }

    let attachments =[];
    for(let item in files){
      if(item !== 'files'){
        attachments.push({
          filename:path.basename(files[item].name),
          path:files[item].path
        })
      }
    }

    var mailOpt = {
        to: fields.toUser, 
        subject: fields.subject, 
        html:fields.editordata,
        attachments:attachments
    }
    
    const mail = new mailManager();
    mail.send(mailOpt);

  });

res.redirect('/emailService');

});

module.exports = router;
