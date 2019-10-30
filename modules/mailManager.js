const nodemailer = require("nodemailer");
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const formidable = require('formidable');
const path = require('path');

function mailManager() {
  
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST ,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  return {
    send: function(req){
      
      const form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.maxFieldsSize = 20 * 1024 * 1024;
      form.parse(req, function(err, fields, files) {
        if(err) {
            return res.redirect(303, '/error');
        }

        let attachments =[];
        let mailOption ={};

        for(let item in files){
          if(item !== 'files'){
            attachments.push({
              filename:path.basename(files[item].name),
              path:files[item].path
            })
          }
        }

        mailOption = {
          from: process.env.MAIL_USER,
          to: fields.toUser, 
          subject: fields.subject || "", 
          html:fields.editordata || "",
          attachments:attachments || ""
        }
        
        transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));
        transporter.sendMail(mailOption,function(error, info) {
          if (error) {
            return console.log(error);
          } else {
             console.log("訊息已發送: " + info.response);
          }
        });
      });
     
    }
  }
}

module.exports = mailManager;


 