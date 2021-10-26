var faqController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        hasher = require('../auth/hasher'),
        applicationConfig = require('../configs/application.config'),
        Faq = require('../models/faq.server.model'),
        Pricing = require('../models/pricingsetting'),
        utilityHelper = require('../helpers/utilities.helper'),
        errorHelper = require('../helpers/error.helper'),
        Promise = require("bluebird"),
        fs = Promise.promisifyAll(require('fs'));

    var documentFields = '_id question answer assignedTo active ';

    function FaqModule() {}

    FaqModule.CreatePricing = function(pricingObj, loggedInUser) {
        var newpricingObjinfo = new Pricing();
        newpricingObjinfo.premium = pricingObj.premium;
        newpricingObjinfo.premiumPlus = pricingObj.premiumPlus;
        newpricingObjinfo.addCredits = pricingObj.addCredits;
        newpricingObjinfo.active = true;
        newpricingObjinfo.addedBy = loggedInUser;
        newpricingObjinfo.addedOn = new Date();
        return newpricingObjinfo;
    };
    FaqModule.CreateFaq = function(faqObj, loggedInUser) {
        var newFaqinfo = new Faq();
        newFaqinfo.question = faqObj.question;
        newFaqinfo.answer = faqObj.answer;
        newFaqinfo.assignedTo = faqObj.assignedTo;
        newFaqinfo.active = faqObj.active;
        newFaqinfo.addedBy = loggedInUser;
        newFaqinfo.addedOn = new Date();
        return newFaqinfo;
    };
    var _p = FaqModule.prototype;

    _p.checkValidationErrors = function(req) {
        //console.log(req.body)
        req.checkBody('question', messageConfig.faq.fieldRequiredFaq).notEmpty();
        req.checkBody('answer', messageConfig.faq.fieldansRequiredFaq).notEmpty();
        req.checkBody('assignedTo', messageConfig.faq.fieldassignedToRequiredFaq).notEmpty();
        return req.validationErrors();


    };
    _p.checkPricingValidationErrors = function(req) { //console.log(req.body)
        req.checkBody('premium', messageConfig.pricingsetting.validationErrMessage.premium).notEmpty();
        req.checkBody('premiumPlus', messageConfig.pricingsetting.validationErrMessage.premiumPlus).notEmpty();
        req.checkBody('addCredits', messageConfig.pricingsetting.validationErrMessage.addCredits).notEmpty();
        return req.validationErrors();
    };

    _p.getFaq = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = {};
        query.deleted = false;
        var sortOpts = { addedOn: -1 };
        return dataProviderHelper.getAllWithDocumentFieldsPagination(Faq, query, pagerOpts, documentFields, sortOpts);
    };
    _p.getFaqByID = function(req) {
        //console.log(req.params.faqid)

        return dataProviderHelper.findById(Faq, req.params.faqid, documentFields);
    };
    _p.updateFaq = function(req, res, next) {
        if (req.body.question) {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.question = req.body.question;
            query.assignedTo = req.body.assignedTo;
            query._id = { $ne: req.params.faqid }
            query.deleted = false;
            //console.log(query)
            dataProviderHelper.checkForDuplicateEntry(Faq, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.faq.alreadyExistsFaq + '"}');
                    } else {
                        //console.log("inside update")
                        return _p.updatefaqFunc(req, res, modelInfo);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.faq.updateMessageFaq
                    });
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });

        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.faq.notFoundFaq
            });
        }


    };

    _p.updatefaqFunc = function(req, res, modelInfo) {
        //   //console.log("req.eventObj",req)
        req.faq.question = modelInfo.question;
        req.faq.answer = modelInfo.answer;
        req.faq.assignedTo = modelInfo.assignedTo;
        req.faq.active = modelInfo.active;
        req.faq.updatedBy = req.decoded.user.username;
        req.faq.updatedOn = new Date();
        return dataProviderHelper.save(req.faq);
    };


    _p.getFaqByuserID = function(req) {
        //console.log(req.params.userid)
        var query = {};
        query.assignedTo = req.params.userid;
        query.deleted = false;
        query.active = true;
        return dataProviderHelper.find(Faq, query);
    };

    _p.getPricesetting = function(req) {

        var query = {};
        query.deleted = false;
        query.active = true;
        return dataProviderHelper.find(Pricing, query);
    };

    _p.getPricesettingByID = function(req) {
        var query = {};
        query.deleted = false;
        query._id = req.params.Id
        query.active = true;
        return dataProviderHelper.find(Pricing, query);
    };
    _p.saveMiddleFunc = function(req, res, newUser, next, msg) {
        dataProviderHelper.save(newUser)
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: msg
                });
            })
            .catch(function(err) {
                return next(err);
            });
    };

    _p.postPricing = function(req, res, next) {
        //req.body = JSON.parse(req.body);
        var errors = _p.checkPricingValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes
            });
        } else {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            //console.log("modelInfo",modelInfo)
            query.Active = true;
            query.deleted = false;
            return dataProviderHelper.checkForDuplicateEntry(Pricing, query).then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.pricingsetting.pricingsetting + '"}');
                    } else {
                        var newfaq = FaqModule.CreatePricing(modelInfo, req.decoded.user.username);
                        return [newfaq, dataProviderHelper.save(newfaq)];
                    }
                }).then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.pricingsetting.savemessage
                    });
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });
        }
    };

    _p.saveFaq = function(req, res, next) {
        //req.body = JSON.parse(req.body);
        var errors = _p.checkValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes
            });
        } else {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            //console.log("modelInfo",modelInfo)
            query.question = modelInfo.question;
            query.assignedTo = modelInfo.assignedTo;
            query.deleted = false;
            return dataProviderHelper.checkForDuplicateEntry(Faq, query).then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.faq.alreadyExistsFaq + '"}');
                    } else {
                        var newfaq = FaqModule.CreateFaq(modelInfo, req.decoded.user.username);
                        return [newfaq, dataProviderHelper.save(newfaq)];
                    }
                }).then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.faq.saveMessagfaq
                    });
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });
        }
    };



    _p.patchFaqInformation = function(req, res, next) {
        req.faq.deleted = true;
        req.faq.deletedOn = new Date();
        req.faq.deletedBy = req.decoded.user.username;

        var _query = {
            '_Id': req.params.faqid,
            'deleted': false
        };
        dataProviderHelper.checkForDuplicateEntry(Faq, _query)
            .then(function(count) {

                if (count > 1) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.faq.FaqDeleteDeny + '"}');
                } else {
                    dataProviderHelper.save(req.faq)
                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.faq.deleteMessageFaq
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });


    }
    _p.patchPricingSetting = function(req, res, next) {
        req.PricingInfo.updatedBy = req.decoded.user.username;
        req.PricingInfo.updatedOn = new Date();
        req.PricingInfo.premium = req.body.premium
        req.PricingInfo.premiumPlus = req.body.premiumPlus
        req.PricingInfo.addCredits = req.body.addCredits
        var _query = {
            'deleted': false
        };
        dataProviderHelper.checkForDuplicateEntry(Pricing, _query)
            .then(function(count) {
                if (count > 1) {
                    dataProviderHelper.save(req.PricingInfo)
                } else {
                    dataProviderHelper.save(req.PricingInfo)
                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.pricingsetting.updatemessage
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });


    }
    return {
        saveFaq: _p.saveFaq,
        getFaq: _p.getFaq,
        getFaqByID: _p.getFaqByID,
        getFaqByuserID: _p.getFaqByuserID,
        updateFaq: _p.updateFaq,
        patchFaqInformation: _p.patchFaqInformation,
        postPricing: _p.postPricing,
        getPricesetting: _p.getPricesetting,
        getPricesettingByID: _p.getPricesettingByID,
        patchPricingSetting: _p.patchPricingSetting

    };

})();

module.exports = faqController;