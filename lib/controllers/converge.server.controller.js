 var convergeController = (function() {

     'use strict';

     var dataProviderHelper = require('../data/mongo.provider.helper'),
         HTTPStatus = require('http-status'),
         messageConfig = require('../configs/api.message.config'),
         hasher = require('../auth/hasher'),
         applicationConfig = require('../configs/application.config'),
         Converge = require('../models/converge.server.model'),
         UserWallet = require('../models/wallet.server.model'),
         CCInfo = require('../models/card.server.model'),
         Transaction = require('../models/transaction.server.model'),
         utilityHelper = require('../helpers/utilities.helper'),
         errorHelper = require('../helpers/error.helper'),
         Promise = require("bluebird"),
         User = require('../models/user.server.model'),
         ConvergeError = require('../models/convergeerror.server.model'),
         ConvergeConfig = require('../configs/Converge.config'),
         fs = Promise.promisifyAll(require('fs')),
         ConvergeLib = require('converge-lib'),
         convergeLib = new ConvergeLib(ConvergeConfig.merchandID, ConvergeConfig.userID, ConvergeConfig.pin, ConvergeConfig.testMode);
     //convergeLib = new ConvergeLib("2109185", "websales", "94XYMSTREJPCOHTSHLNS7AJ5I3XCROCOIVUFE80OUI67JVB01GP8QN3R8UBDH5GW",false);
     //convergeLib web password -Flyp10#2019!
     //   convergeLib = new ConvergeLib("007937", "webpage", "XHR62X",true);
     var mongoose = require('mongoose');
     var mailController = require('./mail.server.controller');
     var join = Promise.join;
     var documentFields = '_id ssl_txn_id ssl_transaction_type ssl_txn_time ssl_token_response ssl_token ssl_result ssl_result_message userid ssl_amount ssl_card_number ssl_card_short_description ssl_card_type ';
     var walletdocumentFields = '_id balance userid addedOn updatedOn';
     var transactiondocumentFields = '_id userid txn_amount txn_type txn_id txn_token txn_desc txn_date promocode';
     var testURL = 'https://demo.myvirtualmerchant.com/VirtualMerchantDemo/processxml.do';
     var productionURL = 'https://www.myvirtualmerchant.com/VirtualMerchant/processxml.do';
     var documentUserFields = '_id firstName lastName email username phoneNumber mobileNumber passphrase active userRole imageName twoFactorAuthEnabled  blocked userConfirmed  addedOn imageProperties securityQuestion address dob cardToken subtype paylianceCID subStart subEnd recruiterStatus';
     var documentCCInfoFields = '_id token userid isdefault deleted addedBy addedOn deletedOn';
     var documentRecruiterFields = '_id firstName lastName email username phoneNumber mobileNumber passphrase active userRole imageName twoFactorAuthEnabled  blocked userConfirmed  addedOn imageProperties securityQuestion address dob cardToken subtype paylianceCID subStart subEnd promocode';
     //const convergeURL = 'https://api.demo.convergepay.com/hosted-payments/transaction_token'

     var request = require('request');

     function ConvergeModule() {}

     ConvergeModule.CreateResponse = function(response) {
         var newResponse = new Converge();

         newResponse.ssl_txn_id = response.ssl_txn_id ? response.ssl_txn_id : "";
         newResponse.ssl_transaction_type = response.ssl_transaction_type ? response.ssl_transaction_type : "";
         newResponse.ssl_txn_time = response.ssl_txn_time ? response.ssl_txn_time : "";
         newResponse.ssl_token_response = response.ssl_token_response ? response.ssl_token_response : '';
         newResponse.ssl_token = response.ssl_token ? response.ssl_token : "";
         newResponse.ssl_tender_amount = response.ssl_tender_amount ? response.ssl_tender_amount : "";
         newResponse.ssl_result_message = response.ssl_result_message ? response.ssl_result_message : "";
         newResponse.ssl_result = response.ssl_result ? response.ssl_result : "";
         newResponse.ssl_ps2000_data = response.ssl_ps2000_data ? response.ssl_ps2000_data : "";
         newResponse.ssl_promo_code = response.ssl_promo_code ? response.ssl_promo_code : "";
         newResponse.ssl_merchant_initiated_unscheduled = response.ssl_merchant_initiated_unscheduled ? response.ssl_merchant_initiated_unscheduled : "";
         newResponse.ssl_loyalty_program = response.ssl_loyalty_program ? response.ssl_loyalty_program : "";
         newResponse.ssl_loyalty_account_balance = response.ssl_loyalty_account_balance ? response.ssl_loyalty_account_balance : "";
         newResponse.ssl_last_name = response.ssl_last_name ? response.ssl_last_name : "";
         newResponse.ssl_issue_points = response.ssl_issue_points ? response.ssl_issue_points : "";
         newResponse.ssl_first_name = response.ssl_first_name ? response.ssl_first_name : "";
         newResponse.ssl_exp_date = response.ssl_exp_date ? response.ssl_exp_date : "";
         newResponse.ssl_enrollment = response.ssl_enrollment ? response.ssl_enrollment : "";
         newResponse.ssl_departure_date = response.ssl_departure_date ? response.ssl_departure_date : "";
         newResponse.ssl_cvv2_response = response.ssl_cvv2_response ? response.ssl_cvv2_response : "";
         newResponse.ssl_completion_date = response.ssl_completion_date ? response.ssl_completion_date : "";
         newResponse.ssl_card_type = response.ssl_card_type ? response.ssl_card_type : "";
         newResponse.ssl_card_short_description = response.ssl_card_short_description ? response.ssl_card_short_description : "";
         newResponse.ssl_card_number = response.ssl_card_number ? response.ssl_card_number : "";
         newResponse.ssl_avs_response = response.ssl_avs_response ? response.ssl_avs_response : "";
         newResponse.ssl_approval_code = response.ssl_approval_code ? response.ssl_approval_code : "";
         newResponse.ssl_amount = response.ssl_amount ? response.ssl_amount : "";
         newResponse.ssl_account_status = response.ssl_account_status ? response.ssl_account_status : "";
         newResponse.ssl_account_balance = response.ssl_account_balance ? response.ssl_account_balance : "";
         newResponse.ssl_access_code = response.ssl_access_code ? response.ssl_access_code : "";
         newResponse.userid = response.userid;
         newResponse.addedBy = response.userid;
         newResponse.addedOn = new Date();
         return newResponse;
     };
     ConvergeModule.CreateUserWallet = function(walletObj) {
         var newWallet = new UserWallet();
         newWallet.userid = walletObj.userid;
         newWallet.uid = mongoose.Types.ObjectId(walletObj.userid);
         newWallet.balance = walletObj.balance;
         newWallet.addedBy = walletObj.userid;
         newWallet.addedOn = new Date();
         return newWallet;
     }
     ConvergeModule.CreateUserCCinfo = function(CardObj) {
         var newCCInfo = new CCInfo();
         newCCInfo.userid = mongoose.Types.ObjectId(CardObj.userid);
         newCCInfo.token = CardObj.token
         newCCInfo.isdefault = CardObj.isdefault;
         newCCInfo.addedBy = CardObj.userid;
         newCCInfo.addedOn = new Date();
         return newCCInfo;
     }

     ConvergeModule.CreateConvergeErrorLog = function(ErrorObj) {
         var errorLog = new ConvergeError();
         errorLog.uid = mongoose.Types.ObjectId(ErrorObj.userid);
         errorLog.errorcode = ErrorObj.errorCode;
         errorLog.errorName = ErrorObj.errorName;
         errorLog.errormessage = ErrorObj.errorMessage;
         errorLog.addedBy = ErrorObj.userid;
         errorLog.addedOn = new Date();
         return errorLog;
     }
     ConvergeModule.CreateTransaction = function(transactionObj) {
         var newTransaction = new Transaction();
         newTransaction.userid = transactionObj.userid;
         newTransaction.txn_amount = transactionObj.txn_amount;
         newTransaction.txn_type = transactionObj.txn_type;
         newTransaction.txn_id = transactionObj.txn_id;
         newTransaction.txn_token = transactionObj.txn_token;
         newTransaction.promocode = transactionObj.promocode ? transactionObj.promocode : '0';
         newTransaction.txn_date = transactionObj.txn_date;
         newTransaction.txn_desc = transactionObj.txn_desc;
         newTransaction.addedBy = transactionObj.userid;
         newTransaction.addedOn = new Date();
         return newTransaction;
     }
     var _p = ConvergeModule.prototype;


     _p.getconvergeTransaction = function(req, next) {
         var pagerOpts = utilityHelper.getPaginationOpts(req, next);
         var query = {};
         query.deleted = false;
         var sortOpts = { addedOn: -1 };
         return dataProviderHelper.getAllWithDocumentFieldsPagination(Converge, query, pagerOpts, documentFields, sortOpts);
     };

     _p.saveConvergeResponse = function(req, res, next) {
         //req.body = JSON.parse(req.body);
         //_p.logActivity(req);
         var query = {};
         var modelInfo = utilityHelper.sanitizeUserInput(req, next);
         // console.log("modelInfo",modelInfo)
         query.ssl_txn_id = modelInfo.ssl_txn_id;
         query.userid = modelInfo.userid;
         query.deleted = false;
         return dataProviderHelper.checkForDuplicateEntry(Converge, query).then(function(count) {
                 if (count > 0) {
                     var newResponse = ConvergeModule.CreateResponse(modelInfo);
                     return [newResponse, dataProviderHelper.save(newResponse)];
                     // throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.faq.alreadyExistsFaq + '"}');
                 } else {
                     var newResponse = ConvergeModule.CreateResponse(modelInfo);
                     return [newResponse, dataProviderHelper.save(newResponse)];
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

     };
     _p.saveConvergeerrorlog = function(req, res, next) {
         //req.body = JSON.parse(req.body);
         var query = {};
         var modelInfo = utilityHelper.sanitizeUserInput(req, next);
         // console.log("modelInfo",modelInfo)
         query.deleted = true;
         return dataProviderHelper.checkForDuplicateEntry(ConvergeError, query).then(function(count) {
                 if (count > 0) {
                     var newResponse = ConvergeModule.CreateConvergeErrorLog(modelInfo);
                     return [newResponse, dataProviderHelper.save(newResponse)];
                     // throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.faq.alreadyExistsFaq + '"}');
                 } else {
                     var newResponse = ConvergeModule.CreateConvergeErrorLog(modelInfo);
                     return [newResponse, dataProviderHelper.save(newResponse)];
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

     };
     _p.getUserWallet = function(req, next) {
         var pagerOpts = utilityHelper.getPaginationOpts(req, next);
         var query = {};
         query.deleted = false;
         var sortOpts = { addedOn: -1 };
         return dataProviderHelper.getAllWithDocumentFieldsPagination(UserWallet, query, pagerOpts, walletdocumentFields, sortOpts);
     };

     _p.getAllUserWallet = function(req, next) {
         var pagerOpts = utilityHelper.getPaginationOpts(req, next);
         var query = [{
                 $match: {

                     $and: [{ 'deleted': false }, { 'userRole': '3' }]

                 }
             },
             {
                 $lookup: {
                     from: "user_wallet",
                     localField: "_id",
                     foreignField: "uid",
                     as: "walletinfo"
                 }
             },
             {
                 $unwind: "$walletinfo"
             },

         ];
         var sortOpts = { addedOn: -1 };
         return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(User, query, pagerOpts, walletdocumentFields, sortOpts);
     };

     _p.SaveCCinfo = function(req, res, next) {
         //_p.logActivity(req)
         //req.body = JSON.parse(req.body);
         var query = {};
         var modelInfo = utilityHelper.sanitizeUserInput(req, next);
         // console.log("modelInfo",modelInfo)
         query.userid = mongoose.Types.ObjectId(modelInfo.userid);
         query.token = modelInfo.token;
         query.deleted = false;
         return dataProviderHelper.checkForDuplicateEntry(CCInfo, query).then(function(count) {
                 if (count > 0) {
                     throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.card.alreadyExistsCard + '"}');
                 } else {
                     var newCCInfo = ConvergeModule.CreateUserCCinfo(modelInfo);
                     return [newCCInfo, dataProviderHelper.save(newCCInfo)];
                 }
             }).then(function(response) {
                 //console.log(req.body.isdefault)
                 if (req.body.isdefault) {
                     if (response[0]._id) {
                         var query1 = { _id: { $ne: mongoose.Types.ObjectId(response[0]._id) } };
                         var updatequery = { $set: { "isdefault": false } };
                         dataProviderHelper.updateMany(CCInfo, query1, updatequery);
                     } else {
                         //  console.log("null response")
                     }

                 }
                 //	console.log(response)
                 res.status(HTTPStatus.OK);
                 res.json({
                     message: messageConfig.card.save
                 });
                 return join(
                     _p.sendmailToUser(req, next)

                 );
             })
             .catch(Promise.CancellationError, function(cancellationErr) {
                 errorHelper.customErrorResponse(res, cancellationErr, next);
             })
             .catch(function(err) {
                 return next(err);
             });

     };
     _p.sendmailToUser = function(req, next) {
         let query = {
             _id: req.body.userid,
             deleted: false
         }

         dataProviderHelper.find(User, query).then(function(user) {
             // console.log("userdata",query,user);
             if (user) {
                 //	 console.log(user[0].email);
                 convergeLib.getCard(req.body.token)
                     .then(function(response) {
                         //    console.log('response ',response);
                         if (response.txn.ssl_account_number) {
                             var params = {
                                 cardnumber: response.txn.ssl_account_number
                             }
                             mailController.sendMailWithParams(req, user[0].email, 'New Card added', params, next);
                         } else {
                             //console.log("unable to fetch card data")
                         }

                     })

             }
         })

     }
     _p.saveUserWallet = function(req, res, next) {
         //req.body = JSON.parse(req.body);
         var query = {};
         var modelInfo = utilityHelper.sanitizeUserInput(req, next);
         // console.log("modelInfo",modelInfo)
         query.userid = modelInfo.userid;
         query.deleted = false;
         return dataProviderHelper.checkForDuplicateEntry(UserWallet, query).then(function(count) {

            if(Number(modelInfo.balance) >= 1){
                if (count > 0) {
                var walletquery = {};
                walletquery.userid = modelInfo.userid;
                dataProviderHelper.find(UserWallet, walletquery).then(function(response) {
                    if (response) {
                        // console.log("dddddddddddddddddd",modelInfo.type);
                        let res = response[0];
                        if (modelInfo.type == 'c') {

                            var query = {};
                            query.userid = modelInfo.userid;
                            query.deleted = false;

                            res.balance = Number(res.balance) + Number(modelInfo.balance);
                            res.updatedBy = modelInfo.userid;
                            res.updatedOn = new Date();
                            return dataProviderHelper.save(res);

                        } else {
                            res.balance = Number(res.balance) - Number(modelInfo.balance);
                            res.updatedBy = modelInfo.userid;
                            res.updatedOn = new Date();
                            return dataProviderHelper.save(res);
                        }

                    }
                })
            } else {

                UserWallet.find(query, function(err, userWallet) {
                    if (!err) {
                        if (userWallet.length) {
                            //console.log('userwallet is present')
                            var newWallet = ConvergeModule.CreateUserWallet(modelInfo);
                            return [newWallet, dataProviderHelper.save(newWallet)];
                        } else {
                            // console.log('userwallet is not present')

                            User.find({ _id: mongoose.Types.ObjectId(modelInfo.userid) }, function(err, userDetails) {
                                if (!err) {
                                    if (userDetails.length) {
                                        // console.log('userdetails', userDetails[0])
                                        if (userDetails[0].referralType == 'F') {
                                            User.find({ username: userDetails[0].referrer }, function(err, referrerDetails) {
                                                if (referrerDetails.length) {

                                                    // console.log('referral details.length', referrerDetails[0])
                                                    UserWallet.find({ userid: referrerDetails[0]._id }, function(err, userWallet) {


                                                        if (userWallet.length) {
                                                            // console.log('userWallet length', userWallet[0])
                                                            let amount = Number(modelInfo.balance) / 2
                                                            amount = amount + Number(userWallet[0].balance)
                                                            UserWallet.update({ userid: referrerDetails[0]._id }, { $set: { balance: amount } }, function(err, updateRes) {


                                                                let MyDate = new Date()
                                                                let formatted_date = ('0' + MyDate.getDate()).slice(-2) + '-' +
                                                                    ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + MyDate.getFullYear() + " " + MyDate.getHours() + ":" + MyDate.getMinutes() + ":" + MyDate.getSeconds()

                                                                //console.log('formatted date', formatted_date)
                                                                let info = {
                                                                    userid: referrerDetails[0]._id,
                                                                    txn_amount: Number(modelInfo.balance) / 2,
                                                                    txn_type: 'C',
                                                                    txn_id: "00000-0000-000",
                                                                    txn_token: '0000000000',
                                                                    promocode: '',
                                                                    txn_date: formatted_date,
                                                                    txn_desc: `Referral from @${userDetails[0].username}`,
                                                                    addedBy: userDetails[0]._id
                                                                }

                                                                let transaction = ConvergeModule.CreateTransaction(info)

                                                                transaction.save(function(err, transRes) {


                                                                    var newWallet = ConvergeModule.CreateUserWallet(modelInfo);
                                                                    return [newWallet, dataProviderHelper.save(newWallet)];

                                                                })







                                                            })
                                                        } else {
                                                            var newWallet = ConvergeModule.CreateUserWallet(modelInfo);

                                                            return [newWallet, dataProviderHelper.save(newWallet)];
                                                        }



                                                    })



                                                } else {
                                                    //console.log('referral details no length')
                                                    var newWallet = ConvergeModule.CreateUserWallet(modelInfo);

                                                    return [newWallet, dataProviderHelper.save(newWallet)];
                                                }
                                            })
                                        } else {
                                            var newWallet = ConvergeModule.CreateUserWallet(modelInfo);
                                            return [newWallet, dataProviderHelper.save(newWallet)];
                                        }

                                    } else {
                                        //console.log('no userdetails')
                                        var newWallet = ConvergeModule.CreateUserWallet(modelInfo);

                                        return [newWallet, dataProviderHelper.save(newWallet)];
                                    }
                                } else {

                                    var newWallet = ConvergeModule.CreateUserWallet(modelInfo);

                                    return [newWallet, dataProviderHelper.save(newWallet)];

                                }
                            })

                        }
                    }
                });

            }
            }else {
                return true
            }
                 
             }).then(function() {
                 res.status(HTTPStatus.OK);
                 if(Number(modelInfo.balance) >= 1){
                    res.json({
                        message: messageConfig.Amount.credit
                    });
                 }else{
                    res.json({
                        success: true,
                        message:""
                    });
                 }
                 
             })
             .catch(Promise.CancellationError, function(cancellationErr) {
                 errorHelper.customErrorResponse(res, cancellationErr, next);
             })
             .catch(function(err) {
                 return next(err);
             });

     };
     _p.makeAsDefault = function(req, res, next) {
         //console.log("sdsdssdddddddddddd",req.body.docid)
         var query = { _id: { $ne: mongoose.Types.ObjectId(req.body.docid) } };
         var updatequery = { $set: { "isdefault": false } };
         var query_1 = { _id: mongoose.Types.ObjectId(req.body.docid) };
         var updatequery_1 = { $set: { "isdefault": true } };
         dataProviderHelper.updateOnebyID(CCInfo, query_1, updatequery_1);
         dataProviderHelper.updateMany(CCInfo, query, updatequery).then(function() {
                 res.status(HTTPStatus.OK);
                 res.json({
                     message: messageConfig.Amount.credit
                 });
             }).catch(Promise.CancellationError, function(cancellationErr) {
                 errorHelper.customErrorResponse(res, cancellationErr, next);
             })
             .catch(function(err) {
                 return next(err);
             });
     };
     _p.getTransaction = function(req, next) {
         var pagerOpts = utilityHelper.getPaginationOpts(req, next);
         var query = {};
         query.deleted = false;
         var sortOpts = { addedOn: -1 };
         return dataProviderHelper.getAllWithDocumentFieldsPagination(Transaction, query, pagerOpts, transactiondocumentFields, sortOpts);
     };
     _p.getWalletinfo = function(req, next) {
         var query = {};
         query.userid = req.params.userid;
         query.deleted = false;
         return dataProviderHelper.find(UserWallet, query);
     };
     _p.getCardByuserid = function(req, next) {
         //_p.logActivity(req)
         var query = {};
         query.userid = req.params.userid;
         query.deleted = false;
         return dataProviderHelper.find(CCInfo, query);
     };
     _p.getTransactioninfo = function(req, next) {
         var query = {};
         query.userid = req.params.userid;
         query.deleted = false;
         return dataProviderHelper.find(Transaction, query);
     };
     _p.saveTransaction = function(req, res, next) {
         //req.body = JSON.parse(req.body);
         var query = {};
         var modelInfo = utilityHelper.sanitizeUserInput(req, next);
         // console.log("modelInfo",modelInfo)
         query.userid = modelInfo.userid;
         query.deleted = false;
         return dataProviderHelper.checkForDuplicateEntry(Transaction, query).then(function(count) {

            if(Number(modelInfo.txn_amount) >= 1){
                if (count > 0) {
                    var newTransaction = ConvergeModule.CreateTransaction(modelInfo);
                    return [newTransaction, dataProviderHelper.save(newTransaction)];
                } else {
                    var newTransaction = ConvergeModule.CreateTransaction(modelInfo);
                    return [newTransaction, dataProviderHelper.save(newTransaction)];
                }
            }else{
                return true
            }
                
             }).then(function() {
                 res.status(HTTPStatus.OK);
                 if(Number(modelInfo.txn_amount) >= 1){
                    res.json({
                        message: messageConfig.Amount.credit
                    });
                    return join(
                        _p.sendmailToUserforpurchase(req, next)
   
                    );
                 }else{
                    res.json({
                        success:true,
                        message: ""
                    });
                 }
                
             })
             .catch(Promise.CancellationError, function(cancellationErr) {
                 errorHelper.customErrorResponse(res, cancellationErr, next);
             })
             .catch(function(err) {
                 return next(err);
             });

     };
     _p.sendmailToUserforpurchase = function(req, next) {
         let query = {
             _id: req.body.userid,
             deleted: false
         }
         var desc = req.body.txn_desc
         var sub = desc.search("subscription")
         var fillup = desc.search("Account fllup");
         var reason;
         if (sub > -1 || fillup > -1) {
             if (sub > -1) {
                 reason = "Premium Subscription"
             } else {
                 reason = "Wallet fillup"
             }
             dataProviderHelper.find(User, query).then(function(user) {
                 // console.log("userdata",query,user);
                 if (user) {
                     //	 console.log(user[0].email);
                     convergeLib.getCard(req.body.txn_token)
                         .then(function(response) {
                             //    console.log('response ',response);
                             if (response.txn.ssl_account_number) {
                                 var params = {
                                         cardnumber: response.txn.ssl_account_number,
                                         reason: reason
                                     }
                                     //, or 
                                 mailController.sendMailWithParams(req, user[0].email, 'New Flyp10 purchase', params, next);
                             } else {
                                 //console.log("unable to fetch card data")
                             }

                         })

                 }
             })
         }

     }
     _p.gentokenAfterPayment = function(req, res, next) {
         //_p.logActivity(req)
         convergeLib.collectPayment(req.body.firstName, req.body.lastName, req.body.email, req.body.cardNumber, req.body.expirationDate, req.body.cvv, req.body.amount, req.body.invoiceNumber, req.body.description, req.body.address, req.body.zip, req.body.city, req.body.state)
             .then(function(response) {
                 //   console.log('response ',response);
                 res.status(HTTPStatus.OK);
                 res.json({
                     response
                 });
             })
             .catch(function(err) {
                 console.error('error', err);
                 res.status(HTTPStatus.BAD_REQUEST);
                 var _errorsRes = (err.length === 1) ? err[0].msg : err;
                 res.json({
                     message: _errorsRes,
                     val: 0
                 });
             });
     }
     _p.getinfobyToken = function(req, res, next) {
         //_p.logActivity(req)
         return convergeLib.getCard(req.body.token)
             .then(function(response) {
                 //console.log('response ',response);
                 res.status(HTTPStatus.OK);
                 res.json({
                     response
                 });
             })
             .catch(function(err) {
                 console.error('error', err);
                 res.status(HTTPStatus.BAD_REQUEST);
                 var _errorsRes = (err.length === 1) ? err[0].msg : err;
                 res.json({
                     message: _errorsRes,
                     val: 0
                 });
             });
     }
     _p.getuserInfo = function(req) {
         return dataProviderHelper.findById(User, req.params.userid, documentUserFields);
     };
     _p.getccinfobyid = function(req) {
         //_p.logActivity(req)
         return dataProviderHelper.findById(CCInfo, req.params.docid, documentCCInfoFields);
     };
     _p.getJudgeWallet = function(req) {
         // var query = {};
         //query.userRole='2';
         // query.deleted = false;
         var query = [{
                 $match: {

                     $and: [{ 'deleted': false }, { 'userRole': '2' }]

                 }


             },
             {
                 $lookup: {
                     from: "user_wallet",
                     localField: "_id",
                     foreignField: "uid",
                     as: "walletinfo"
                 }
             },
             {
                 $unwind: "$walletinfo"
             },
             {
                 $match: {

                     'walletinfo.balance': { $exists: true, $ne: null, $ne: '0' }

                 }
             }
         ];
         return dataProviderHelper.aggregate(User, query);
     };
     _p.updateUser = function(req, res, next) {

         var modelInfo = utilityHelper.sanitizeUserInput(req, next);
         // For checking duplicate entry
         var query = {};
         query.username = modelInfo.username.toLowerCase();
         query._id = { $ne: req.params.userid }
         query.deleted = false;
         //  console.log(query)
         //   console.log("updateUser",modelInfo)		
         dataProviderHelper.checkForDuplicateEntry(User, query)
             .then(function(count) {
                 if (count > 0) {
                     throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.user.alreadyExists + '"}');
                 } else {
                     // console.log("updateUser", "else")
                     return _p.updateUserMiddlewareFunc(req, res, modelInfo, next);

                 }
             })
             .then(function() {
                 res.status(HTTPStatus.OK);
                 res.json({
                     message: messageConfig.user.updateMessage
                 });
             })
             .catch(Promise.CancellationError, function(cancellationErr) {
                 errorHelper.customErrorResponse(res, cancellationErr, next);
             })
             .catch(function(err) {
                 return next(err);
             });
     }
     _p.updatesubUser = function(req, res, next) {

         var modelInfo = utilityHelper.sanitizeUserInput(req, next);
         // For checking duplicate entry
         var query = {};
         //query.username = modelInfo.username.toLowerCase();
         query._id = { $ne: req.params.userid }
         query.deleted = false;
         // console.log(query)
         // console.log("updateUser",modelInfo)		
         dataProviderHelper.checkForDuplicateEntry(User, query)
             .then(function(count) {
                 if (count > 0) {
                     return _p.updatesubUserMiddlewareFunc(req, res, modelInfo, next);
                     //throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.user.alreadyExists + '"}');
                 } else {
                     // console.log("updateUser", "else")
                     return _p.updatesubUserMiddlewareFunc(req, res, modelInfo, next);

                 }
             })
             .then(function() {
                 res.status(HTTPStatus.OK);
                 res.json({
                     message: messageConfig.user.updateMessage
                 });
             })
             .catch(Promise.CancellationError, function(cancellationErr) {
                 errorHelper.customErrorResponse(res, cancellationErr, next);
             })
             .catch(function(err) {
                 return next(err);
             });
     }
     _p.updateRecruiter = function(req, res, next) {

         var modelInfo = utilityHelper.sanitizeUserInput(req, next);
         // For checking duplicate entry
         var query = {};
         //query.username = modelInfo.username.toLowerCase();
         query._id = { $ne: req.params.userid }
         query.deleted = false;
         //  console.log(query)
         //  console.log("updateUser",modelInfo)		
         dataProviderHelper.checkForDuplicateEntry(User, query)
             .then(function(count) {
                 if (count > 0) {
                     return _p.updateRecruiterMiddlewareFunc(req, res, modelInfo, next);
                     //throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.user.alreadyExists + '"}');
                 } else {
                     // console.log("updateUser","else")	
                     return _p.updateRecruiterMiddlewareFunc(req, res, modelInfo, next);

                 }
             })
             .then(function() {
                 res.status(HTTPStatus.OK);
                 res.json({
                     message: messageConfig.user.updateMessage
                 });
                 return join(
                     _p.sendmailTorecruiterActivation(req, next)

                 );
             })
             .catch(Promise.CancellationError, function(cancellationErr) {
                 errorHelper.customErrorResponse(res, cancellationErr, next);
             })
             .catch(function(err) {
                 return next(err);
             });
     }

     _p.sendmailTorecruiterActivation = function(req, next) {
         if (req.RecruiterInfo.username && req.body.recruiterStatus == '1') {
             var params = {
                 name: req.RecruiterInfo.firstName + " " + req.RecruiterInfo.lastName,
                 username: req.RecruiterInfo.username,
             }

             mailController.sendMailWithParams(req, req.RecruiterInfo.email, 'Recruiter status verified', params, next);
         }
     }
     _p.confirmUser = function(req, res, next) {

         var modelInfo = utilityHelper.sanitizeUserInput(req, next);
         // For checking duplicate entry
         var query = {};
         //query.username = modelInfo.username.toLowerCase();
         query._id = { $ne: req.params.userid }
         query.deleted = false;
         //  console.log(query)
         //  console.log("updateUser",modelInfo)		
         dataProviderHelper.checkForDuplicateEntry(User, query)
             .then(function(count) {
                 if (count > 0) {
                     return _p.updateUserConfirmMiddlewareFunc(req, res, modelInfo, next);
                     //throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.user.alreadyExists + '"}');
                 } else {
                     // console.log("updateUser", "else")
                     return _p.updateUserConfirmMiddlewareFunc(req, res, modelInfo, next);

                 }
             })
             .then(function() {
                 res.status(HTTPStatus.OK);
                 res.json({
                     message: messageConfig.user.updateMessage
                 });
                 return join(

                     _p.sendmailtoActiveUser(req, next)

                 );
             })
             .catch(Promise.CancellationError, function(cancellationErr) {
                 errorHelper.customErrorResponse(res, cancellationErr, next);
             })
             .catch(function(err) {
                 return next(err);
             });
     }
     _p.sendmailtoActiveUser = function(req, next) {
         if (req.body) {
             if (req.body.userRole == '2') {

                 var params = {
                     name: req.body.firstName + " " + req.body.lastName,
                     username: req.body.username
                 }
                 mailController.sendMailWithParams(req, req.body.email, 'Judge Account Activation', params, next);
             } else if (req.body.userRole == '3') {
                 var params = {
                     name: req.body.firstName + " " + req.body.lastName,
                     username: req.body.username
                 }
                 mailController.sendMailWithParams(req, req.body.email, 'Competitor Account Activation', params, next);
             }
         }

     }
     _p.updateUserConfirmMiddlewareFunc = function(req, res, modelInfo, next) {
         //console.log("inside MiddleWare")
         req.confirmUser.userConfirmed = true;
         req.confirmUser.updatedBy = "superadmin";
         req.confirmUser.updatedOn = new Date();
         return dataProviderHelper.save(req.confirmUser);


     };
     _p.updatesubUserMiddlewareFunc = function(req, res, modelInfo, next) {
         //   console.log("updateUser",modelInfo)				
         // console.log("subscription",modelInfo);
         req.updatesubUserInfo.subtype = modelInfo.subtype;
         req.updatesubUserInfo.subStart = modelInfo.subStart;
         req.updatesubUserInfo.subEnd = modelInfo.subEnd;
         req.updatesubUserInfo.updatedBy = modelInfo.admin;
         req.updatesubUserInfo.updatedOn = new Date();
         return dataProviderHelper.save(req.updatesubUserInfo);


     };
     _p.updateRecruiterMiddlewareFunc = function(req, res, modelInfo, next) {
         //	console.log("inside MiddleWare")
         req.RecruiterInfo.recruiterStatus = modelInfo.recruiterStatus;
         req.RecruiterInfo.updatedBy = "superadmin";
         req.RecruiterInfo.updatedOn = new Date();
         return dataProviderHelper.save(req.RecruiterInfo);


     };
     _p.updateUserMiddlewareFunc = function(req, res, modelInfo, next) {
         //console.log("updateUser",modelInfo)		
         if (modelInfo.updateToken == '1') {
             //   console.log("card Token")		
             req.updateUserInfo.cardToken = modelInfo.cardToken
             req.updateUserInfo.updatedBy = req.updateUserInfo.username;
             req.updateUserInfo.updatedOn = new Date();
             return dataProviderHelper.save(req.updateUserInfo);
         } else {
             // console.log("subscription",modelInfo);
             req.updateUserInfo.subtype = modelInfo.subtype;
             req.updateUserInfo.subStart = modelInfo.subStart;
             req.updateUserInfo.subEnd = modelInfo.subEnd;
             req.updateUserInfo.promocode = modelInfo.promocode;
             req.updateUserInfo.updatedBy = req.updateUserInfo.username;
             req.updateUserInfo.updatedOn = new Date();
             return dataProviderHelper.save(req.updateUserInfo);
         }

     };

     _p.patchCCInfo = function(req, res, next) {
         req.cardlistinfo.deleted = true;
         req.cardlistinfo.deletedOn = new Date();
         req.cardlistinfo.deletedBy = req.decoded.user.username;

         var query = {};
         query._id = req.params.docid;
         query.deleted = true;

         dataProviderHelper.checkForDuplicateEntry(CCInfo, query)
             .then(function(count) {
                 if (count > 0) {
                     throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.card.alreadyExists + '"}');
                 } else {
                     if (req.cardlistinfo.isdefault) {
                         throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.card.DeleteDeny + '"}');
                     } else {
                         dataProviderHelper.save(req.cardlistinfo)
                     }

                 }
             })
             .then(function() {
                 res.status(HTTPStatus.OK);
                 res.json({
                     message: messageConfig.card.deleteMessage
                 });
             })
             .catch(Promise.CancellationError, function(cancellationErr) {
                 errorHelper.customErrorResponse(res, cancellationErr, next);
             })
             .catch(function(err) {
                 return next(err);
             });
     };
     _p.getVerifiedRecruiter = function(req, next) {
         var pagerOpts = utilityHelper.getPaginationOpts(req, next);
         var query = {};
         query.userRole = '4';
         query.recruiterStatus = { $exists: true, $eq: '1' }
         query.deleted = false;
         var sortOpts = { addedOn: -1 };
         return dataProviderHelper.getAllWithDocumentFieldsPagination(User, query, pagerOpts, documentRecruiterFields, sortOpts);
     }
     _p.getUnVerifiedRecruiter = function(req, next) {
         var pagerOpts = utilityHelper.getPaginationOpts(req, next);
         var query = {};
         query.userRole = '4';
         query.recruiterStatus = { $exists: true, $eq: '0' }
         query.deleted = false;
         var sortOpts = { addedOn: -1 };
         return dataProviderHelper.getAllWithDocumentFieldsPagination(User, query, pagerOpts, documentRecruiterFields, sortOpts);
     }
     _p.getRejectedRecruiter = function(req, next) {
         var pagerOpts = utilityHelper.getPaginationOpts(req, next);
         var query = {};
         query.userRole = '4';
         query.recruiterStatus = { $exists: true, $eq: '2' }
         query.deleted = false;
         var sortOpts = { addedOn: -1 };
         return dataProviderHelper.getAllWithDocumentFieldsPagination(User, query, pagerOpts, documentRecruiterFields, sortOpts);
     }
     _p.getSessionTokenForHPP = function(req, res, next) {

         // console.log(req.body.amount, req.body.userid)
         const options = {
             url: ConvergeConfig.convergeURL + '?ssl_merchant_id=' + ConvergeConfig.merchandID + '&ssl_user_id=' + ConvergeConfig.userID + '&ssl_pin=' + ConvergeConfig.pin + '&ssl_transaction_type=ccsale&ssl_amount=' + req.body.amount + '&ssl_avs_address=' + req.body.address + '&ssl_first_name=' + req.body.firstName + '&ssl_last_name=' + req.body.lastName + '&ssl_avs_zip=' + req.body.zip,
             method: 'POST',
             body: '',
             headers: {
                 'Access-Control-Allow-Origin': '*'
             }
         };
         // console.log(options.url, "url")
         const callback = (err, resp, body) => {
                 //console.log(resp.statusCode,"status",body,"body")
                 if (!err && resp.statusCode == 200) {
                     return res.json({
                         success: true,
                         data: body
                     })

                 } else {
                     return res.json({
                         success: false,
                         message: err
                     })
                 }
             }
             // console.log(options)
         request(options, callback);

     }
     _p.logActivity = async function(req) {
         // const requestIp = require('request-ip');

         // const clientIp = requestIp.getClientIp(req); 

         // let fileName =req.app.get('rootDir')+'/lib/configs/creditcardauthlogfile.txt'

         // await createlogfile(fileName);
         // try{         
         //         let log="\r\nAddedOn-"+new Date().toString()+",IP-Address-"+clientIp+",RequestBody-"+JSON.stringify(req.body)+",Route-"+req.originalUrl
         //         fs.appendFile(fileName, log, function (err) {
         //           if(err){
         //             console.log(err)
         //           console.log('log not saved')
         //           }else{
         //               console.log('Log saved')
         //            // res.send({result:true,message:"Log saved."})
         //           }
         //         });

         //     }catch(e){

         //     }
     }

     function createlogfile(fileName) {
         return new Promise(function(resolve, reject) {
             fs.exists(fileName, function(exists) {
                 if (exists) {
                     resolve();
                 } else {
                     fs.writeFile(fileName, '', function(err, data) {
                         if (err) {
                             // console.log(err, 'err')
                             reject(err);
                         } else {
                             resolve(data);
                         }
                     });
                 }
             });
         })
     }
     return {
         saveConvergeResponse: _p.saveConvergeResponse,
         getconvergeTransaction: _p.getconvergeTransaction,
         getAllUserWallet: _p.getAllUserWallet,
         getUserWallet: _p.getUserWallet,
         saveUserWallet: _p.saveUserWallet,
         getTransaction: _p.getTransaction,
         saveTransaction: _p.saveTransaction,
         getWalletinfo: _p.getWalletinfo,
         getTransactioninfo: _p.getTransactioninfo,
         gentokenAfterPayment: _p.gentokenAfterPayment,
         getSessionTokenForHPP: _p.getSessionTokenForHPP,
         getuserInfo: _p.getuserInfo,
         updateUser: _p.updateUser,
         updatesubUser: _p.updatesubUser,
         getJudgeWallet: _p.getJudgeWallet,
         saveConvergeerrorlog: _p.saveConvergeerrorlog,
         getinfobyToken: _p.getinfobyToken,
         SaveCCinfo: _p.SaveCCinfo,
         getCardByuserid: _p.getCardByuserid,
         makeAsDefault: _p.makeAsDefault,
         getccinfobyid: _p.getccinfobyid,
         patchCCInfo: _p.patchCCInfo,
         getVerifiedRecruiter: _p.getVerifiedRecruiter,
         getUnVerifiedRecruiter: _p.getUnVerifiedRecruiter,
         getRejectedRecruiter: _p.getRejectedRecruiter,
         updateRecruiter: _p.updateRecruiter,
         confirmUser: _p.confirmUser


     };

 })();

 module.exports = convergeController;