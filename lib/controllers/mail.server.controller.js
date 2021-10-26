const { getMailServiceConfig } = require('./email.service.server.controller');

var mailController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        hasher = require('../auth/hasher'),
        User = require('../models/user.server.model'),
        applicationConfig = require('../configs/application.config'),
        Routine = require('../models/routine.server.model'),
        utilityHelper = require('../helpers/utilities.helper'),
        errorHelper = require('../helpers/error.helper'),
        Promise = require("bluebird"),
        fs = Promise.promisifyAll(require('fs'));
    var mailHelper = require('../helpers/mail.helper'),
        emailTemplateController = require('./email.template.server.controller');
    var mongoose = require('mongoose');
    var documentFields = '_id question answer assignedTo active ';

    function MailModule() {}


    var _p = MailModule.prototype;

    _p.sendMail = function(req, userMail, etname, next) {
        req.body.templateName = etname

        return new Promise(function(resolve, reject) {
            emailTemplateController.getEmailTemplateByTemplateName(req)
                .then(function(emailTemplate) {
                    var messageBody = '';
                    if (emailTemplate) {
                        messageBody = emailTemplate.templateBody;
                        var mailOptions = {
                            fromEmail: 'Flyp10 <' + emailTemplate.emailFrom + '>', // sender address
                            toEmail: userMail, // list of receivers
                            subject: emailTemplate.emailSubject, // Subject line
                            textMessage: messageBody, // plaintext body
                            htmlTemplateMessage: messageBody
                        };
                        return mailHelper.sendEmailWithNoAttachment(req, mailOptions, next);
                    } else {
                        return;
                    }
                })
                .then(function(data) {
                    resolve(data);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _p.sendMailWithParams = function(req, userMail, etname, params, next) {
        req.body.templateName = etname

        return new Promise(function(resolve, reject) {
            emailTemplateController.getEmailTemplateByTemplateName(req)
                .then(function(emailTemplate) {
                    var messageBody = '';
                    if (emailTemplate) {
                        if (emailTemplate.templateName == "New Card added") {
                            messageBody = emailTemplate.templateBody;
                            messageBody = messageBody.replace("{{cardnumber}}", params.cardnumber);
                        } else if (emailTemplate.templateName == "New Flyp10 purchase") {
                            messageBody = emailTemplate.templateBody;
                            messageBody = messageBody.replace("{{cardnumber}}", params.cardnumber);
                            messageBody = messageBody.replace("{{reason}}", params.reason);
                        } else if (emailTemplate.templateName == "User Activation") {
                            messageBody = emailTemplate.templateBody;
                            messageBody = messageBody.replace("{{name}}", params.username);
                            messageBody = messageBody.replace("{{link}}", params.link);
                        } else if (emailTemplate.templateName == "Judge Account Activation" || emailTemplate.templateName == "Competitor Account Activation") {
                            messageBody = emailTemplate.templateBody;
                            messageBody = messageBody.replace("{name}", params.name);
                            messageBody = messageBody.replace("{username}", params.username);
                        } else if (emailTemplate.templateName == "Judge certification verified") {
                            messageBody = emailTemplate.templateBody;

                            messageBody = messageBody.replace("{{Name}}", params.name);
                            messageBody = messageBody.replace("{{userid}}", params.username);
                            messageBody = messageBody.replace("{{sport}}", params.sport);
                            messageBody = messageBody.replace("{{level}}", params.level);
                            messageBody = messageBody.replace("{{expiry}}", params.date);
                        } else if (emailTemplate.templateName == "Recruiter status verified") {
                            messageBody = emailTemplate.templateBody;

                            messageBody = messageBody.replace("{{Name}}", params.name);
                            messageBody = messageBody.replace("{{userid}}", params.username);
                        } else if (emailTemplate.templateName == "Remit Reject") {
                            messageBody = emailTemplate.templateBody;
                            messageBody = messageBody.replace("{{body}}", params.body);

                        } else if (emailTemplate.templateName == "Remit Accept") {
                            messageBody = emailTemplate.templateBody;
                            messageBody = messageBody.replace("{{body}}", params.body);

                        }

                        var mailOptions = {
                            fromEmail: 'Flyp10 <' + emailTemplate.emailFrom + '>', // sender address
                            toEmail: userMail, // list of receivers
                            subject: emailTemplate.emailSubject, // Subject line
                            textMessage: messageBody, // plaintext body
                            htmlTemplateMessage: messageBody
                        };
                        return mailHelper.sendEmailWithNoAttachment(req, mailOptions, next);
                    } else {
                        return;
                    }
                })
                .then(function(data) {
                    resolve(data);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }
    _p.sendMailToAdmin = function(req, userMail, etname, params, next) {
        req.body.templateName = etname

        return new Promise(function(resolve, reject) {
            emailTemplateController.getEmailTemplateByTemplateName(req)
                .then(function(emailTemplate) {
                    var messageBody = '';
                    if (emailTemplate) {
                        if (emailTemplate.templateName == "Judge certification added") {
                            messageBody = emailTemplate.templateBody;
                            messageBody = messageBody.replace("{{username}}", params.username);
                        } else if (emailTemplate.templateName == "Remit Reject") {
                            messageBody = emailTemplate.templateBody;
                            messageBody = messageBody.replace("{{body}}", params.body);

                        } else if (emailTemplate.templateName == "Remit Accept") {
                            messageBody = emailTemplate.templateBody;
                            messageBody = messageBody.replace("{{body}}", params.body);

                        }


                        var mailOptions = {
                            fromEmail: 'Flyp10 <' + emailTemplate.emailFrom + '>', // sender address
                            toEmail: "flyp10@outlook.com", // list of receivers
                            subject: emailTemplate.emailSubject, // Subject line
                            textMessage: messageBody, // plaintext body
                            htmlTemplateMessage: messageBody
                        };
                        return mailHelper.sendEmailWithNoAttachment(req, mailOptions, next);
                    } else {
                        return;
                    }
                })
                .then(function(data) {
                    resolve(data);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }
    _p.sendReportMail = function(req, res, next) {
        var mailOptions = {
            fromEmail: req.body.from, // sender address
            toEmail: "mohan@statlight.in;flyp10@outlook.com;anandan.r@statlight.in", // list of receivers
            subject: req.body.subject, // Subject line
            textMessage: req.body.messagebody, // plaintext body
            htmlTemplateMessage: req.body.messagebody
        };
        //   console.log(mailOptions)
        mailHelper.sendEmailWithNoAttachment(req, mailOptions, next);
        res.json({
            success: true,
            message: "Report Mail send Successfully"
        })
    }
    return {
        sendMail: _p.sendMail,
        sendMailWithParams: _p.sendMailWithParams,
        sendMailToAdmin: _p.sendMailToAdmin,
        sendReportMail: _p.sendReportMail


    };

})();

module.exports = mailController;