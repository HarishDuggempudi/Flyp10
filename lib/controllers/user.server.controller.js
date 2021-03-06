var userController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        fileOperations = require('../helpers/file.operation.helper'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        hasher = require('../auth/hasher'),
        applicationConfig = require('../configs/application.config'),
        collectionConfig = require('../configs/collection.config'),
        User = require('../models/user.server.model'),
        AppVersion = require('../models/app.version.model'),
        UserWallet = require('../models/wallet.server.model'),
        JudgeSport = require('../models/Judge-Sportdetail.server.model'),
        Payliance = require('../models/payliance.mgmt.server.modal'),
        PaylianceCusObj = Payliance.paylianceCusObjModel,
        PaylianceACHObj = Payliance.paylianceACHObjModel,
        PaylianceRemitRequestObj = Payliance.paylianceRemitRequestModel,
        PayliancePaymentObj = Payliance.payliancePaymentModel,
        TransactionObj = Payliance.paylianceTransactionModel,
        TransactionStatusObj = Payliance.paylianceTransactionStatusModel,
        NotificationTokenObj = Payliance.notificationToken,
        Country = require('../models/country.model'),
        StateForCountry = require('../models/statesforcountry.server.model'),
        userConfirmationTokenController = require('./user.confirmation.server.controller'),
        passwordChangeVerifyController = require('./password.change.verify.server.controller'),
        PasswordChangeVerifyToken = require('../models/password.change.verify.server.model'),
        emailServiceController = require('./email.service.server.controller'),
        utilityHelper = require('../helpers/utilities.helper'),
        USAGMemberVerification = require('../models/USAG-membership-verification.model'),
        errorHelper = require('../helpers/error.helper'),
        Promise = require("bluebird"),
        json2csv = require('json2csv').parse,
        mime = require('mime'),
        path = require('path'),
        cron = require('node-cron'),
        Payliance = require('../models/payliance.mgmt.server.modal'),
        NotificationTokenObj = Payliance.notificationToken,

        // fs = require('fs'),
        HtmlModuleContent = require('../models/html.module.server.model'),
        ConvergeLib = require('converge-lib'),
        ConvergeConfig = require('../configs/Converge.config'),
        convergeLib = new ConvergeLib(ConvergeConfig.merchandID, ConvergeConfig.userID, ConvergeConfig.pin, ConvergeConfig.testMode),
        // convergeLib = new ConvergeLib("2109185", "websales", "94XYMSTREJPCOHTSHLNS7AJ5I3XCROCOIVUFE80OUI67JVB01GP8QN3R8UBDH5GW",false),
        // convergeLib = new ConvergeLib("8000404809", "webpage", "L5B0YKW0DJ8AMZYM565GE9MX7XQ2MVZC16CN8104BADH1RGKHJLVQ5FT222KGVDF",true),
        fs = Promise.promisifyAll(require('fs')),
        xml2js = require('xml2js');
    var mailController = require('./mail.server.controller');
    var join = Promise.join;
    // USAePAY auth config ------------------
    var crypto = require('crypto'),
        shasum = crypto.createHash('sha1'),
        sha256 = require('sha256'),
        seed = "flyp10#2019",
        apikey = "VcWz1a8SKU8h0kW9pXBkdhIcvrqM3Fqn",
        // apikey = "_zuTp009bmVd0fusx44VD7Sw2Nfl847e",
        apipin = "425310",
        // prehash = apikey + seed,
        prehash = apikey + seed + apipin,
        apihash = 's2/' + seed + '/' + sha256(prehash),
        authkey = new Buffer(apikey + ":" + apihash).toString('base64');
    shasum.update(prehash);
    const hashVal = shasum.digest("hex");
    const USAePayUrl = 'https://secure.usaepay.com/soap/gate/5W8TCYSW';
    const recaptcha = "https://www.google.com/recaptcha/api/siteverify"

    //CRON job scheduling -----------------------
    // cron.schedule("5 18 * * Wed", function() {
    // // cron.schedule("0 */5 * * *", function() {
    // cron.schedule("* * * * *", function() {
    //     _p.getJudgesForScheduling();        
    // });

    // cron.schedule("5 9 * * *", function() {
    // cron.schedule("* * * * *", function() {
    //     _p.checkAndRefundRemittance();        
    // });

    const niceware = require('niceware');
    var passphrase = require('passphrase');
    var Q = require('q');
    //ADC68F Flyp10#2019
    var request = require('request');
    var mongoose = require('mongoose');
    var testURL = 'https://demo.myvirtualmerchant.com/VirtualMerchantDemo/processxml.do';
    var productionURL = 'https://www.myvirtualmerchant.com/VirtualMerchant/processxml.do';

    var documentFields = '_id firstName alwaysSharedRoutine EligibleJudgeForMyFlyp10Routine lastName email username phoneNumber mobileNumber passphrase active userRole imageName twoFactorAuthEnabled  blocked userConfirmed  addedOn imageProperties securityQuestion address dob cardToken subtype paylianceCID subStart subEnd promocode recruiterStatus isUSCitizen country referrer referralType';
    var documentFieldsPayliance = '_id addedOn CID UID';
    var documentFieldsNotificationToken = '_id UID token';
    var documentFieldsRemitHistory = '_id addedOn AuthCode BatchNum BatchRefNum Username Status BatchKey RefNum TransKey PreviousBalance ClosingBalance UID';
    var documentFieldsRemitRequest = '_id addedOn CID UID AID amount username type';
    var documentjudgeFields = '_id  username sportName level uploadingfor active originalfilename docName docdescription active docProperties status expdate userid sportid levelid'
    var documentUserFields = '_id firstName lastName email username phoneNumber mobileNumber passphrase active userRole imageName twoFactorAuthEnabled  blocked userConfirmed  addedOn imageProperties securityQuestion address dob cardToken subtype paylianceCID subStart subEnd recruiterStatus isUSCitizen country';

    function UserModule() {}
    UserModule.CreateSignupUser = function(userObj, imageInfo, password, saltPassword) {
        var newUserInfo = new User();
        //console.log("wewew", userObj)
        newUserInfo.firstName = userObj.firstName;
        newUserInfo.lastName = userObj.lastName;
        newUserInfo.email = userObj.email;
        newUserInfo.username = userObj.username;
        newUserInfo.cardToken = userObj.cardToken;
        newUserInfo.password = password;
        newUserInfo.passwordSalt = saltPassword;
        newUserInfo.passphrase = userObj.passphrase;
        newUserInfo.phoneNumber = userObj.phoneNumber;
        newUserInfo.dob = userObj.dob;
        newUserInfo.address = userObj.address;
        newUserInfo.securityQuestion = userObj.securityQuestion;
        newUserInfo.securityAnswer = " ";
        newUserInfo.securityAnswerSalt = " ";
        newUserInfo.active = userObj.active;
        newUserInfo.userRole = userObj.userRole;
        newUserInfo.imageName = imageInfo._imageName;
        newUserInfo.imageProperties = {
            imageExtension: imageInfo._imageExtension,
            imagePath: imageInfo._imagePath
        };
        newUserInfo.addedBy = 'self';
        newUserInfo.addedOn = new Date();
        newUserInfo.blocked = false;
        newUserInfo.isUSCitizen = userObj.isUSCitizen ? userObj.isUSCitizen : '2'
        newUserInfo.country = userObj.country ? userObj.country : 'United States'
        newUserInfo.referrer = userObj.referrer
        newUserInfo.referralType = userObj.referralType
        return newUserInfo;
    };
    UserModule.CreateUser = function(userObj, loggedInUser, imageInfo, password, saltPassword) {
        var newUserInfo = new User();
        newUserInfo.firstName = userObj.firstName;
        newUserInfo.lastName = userObj.lastName;
        newUserInfo.email = userObj.email;
        newUserInfo.username = userObj.username;
        newUserInfo.password = password;
        newUserInfo.passwordSalt = saltPassword;
        newUserInfo.passphrase = userObj.passphrase;
        newUserInfo.phoneNumber = userObj.phoneNumber;
        newUserInfo.dob = userObj.dob;
        newUserInfo.address = userObj.address;
        newUserInfo.securityQuestion = userObj.securityQuestion;
        newUserInfo.securityAnswer = " ";
        newUserInfo.securityAnswerSalt = " ";
        newUserInfo.active = userObj.active;
        newUserInfo.userRole = userObj.userRole;
        newUserInfo.imageName = imageInfo._imageName;
        newUserInfo.imageProperties = {
            imageExtension: imageInfo._imageExtension,
            imagePath: imageInfo._imagePath
        };
        newUserInfo.addedBy = loggedInUser;
        newUserInfo.addedOn = new Date();
        newUserInfo.blocked = false;
        newUserInfo.isUSCitizen = userObj.isUSCitizen ? userObj.isUSCitizen : '2'
        newUserInfo.country = userObj.country ? userObj.country : 'United States';
        newUserInfo.alwaysSharedRoutine = userObj.alwaysSharedRoutine ? userObj.alwaysSharedRoutine : 'N'
        newUserInfo.EligibleJudgeForMyFlyp10Routine = userObj.EligibleJudgeForMyFlyp10Routine ? userObj.EligibleJudgeForMyFlyp10Routine : false
        return newUserInfo;
    };
    UserModule.CreateJudgesSport = function(sportObj, loggedInUser, documentinfo) {
        var newJudgeInfo = new JudgeSport();
        //   //console.log(sportObj.sportdocname);
        newJudgeInfo.username = sportObj.username;
        newJudgeInfo.sportName = sportObj.sportName;
        newJudgeInfo.level = sportObj.level;
        newJudgeInfo.userid = mongoose.Types.ObjectId(sportObj.userid);
        newJudgeInfo.sportid = mongoose.Types.ObjectId(sportObj.sportid);
        newJudgeInfo.levelid = mongoose.Types.ObjectId(sportObj.levelid);
        newJudgeInfo.uploadingfor = sportObj.uploadingfor ? sportObj.uploadingfor : '0';
        newJudgeInfo.active = sportObj.active;
        newJudgeInfo.docdescription = sportObj.docdescription;
        newJudgeInfo.docName = documentinfo._documentName;
        newJudgeInfo.originalfilename = sportObj.sportdocname;
        newJudgeInfo.docProperties = {
            docExtension: documentinfo._documentMimeType,
            docPath: documentinfo._documentPath
        };
        newJudgeInfo.addedBy = loggedInUser;
        newJudgeInfo.addedOn = new Date();
        return newJudgeInfo;
    };
    UserModule.CreateUserSport = function(sportObj) {
        var newJudgeInfo = new JudgeSport();
        // //console.log(sportObj.sportdocname);
        newJudgeInfo.username = sportObj.username;
        newJudgeInfo.sportName = sportObj.sportName;
        newJudgeInfo.level = sportObj.level;
        newJudgeInfo.userid = mongoose.Types.ObjectId(sportObj.userid);
        newJudgeInfo.sportid = mongoose.Types.ObjectId(sportObj.sportid);
        newJudgeInfo.levelid = mongoose.Types.ObjectId(sportObj.levelid);
        newJudgeInfo.active = sportObj.active;
        newJudgeInfo.addedBy = 'self';
        newJudgeInfo.addedOn = new Date();
        return newJudgeInfo;
    };
    UserModule.CreatePaylianceCusObj = function(paylianceObj) {
        var newPaylianceInfo = new PaylianceCusObj();
        // //console.log(newPaylianceInfo.sportdocname);
        newPaylianceInfo.CID = paylianceObj.CID;
        newPaylianceInfo.UID = paylianceObj.UID;
        newPaylianceInfo.addedOn = new Date();
        return newPaylianceInfo;
    };
    UserModule.CreateNotificationToken = function(paylianceObj) {
        var newNotificationToken = new NotificationTokenObj();
        // //console.log(newPaylianceInfo.sportdocname);
        newNotificationToken.UID = mongoose.Types.ObjectId(paylianceObj.UID);
        newNotificationToken.token = paylianceObj.token;
        return newNotificationToken;
    };
    UserModule.CreateCountry = function(obj) {
        var newCountry = new StateForCountry();
        newCountry.name = obj.name
        newCountry.abbreviation = obj.abbreviation;
        newCountry.country = 'US'
        return newCountry;
    };
    UserModule.CreateTransactionObj = function(transactionObj) {
        var newTransactionObj = new TransactionObj();
        newTransactionObj.RefNum = transactionObj.RefNum;
        newTransactionObj.TransKey = transactionObj.TransKey;
        newTransactionObj.PreviousBalance = transactionObj.PreviousBalance;
        newTransactionObj.ClosingBalance = transactionObj.ClosingBalance;
        newTransactionObj.Amount = transactionObj.Amount;
        newTransactionObj.UID = transactionObj.UID;
        newTransactionObj.Username = transactionObj.Username;
        newTransactionObj.Status = transactionObj.Status;
        newTransactionObj.AuthCode = transactionObj.AuthCode;
        newTransactionObj.BatchNum = transactionObj.BatchNum;
        newTransactionObj.BatchRefNum = transactionObj.BatchRefNum;
        newTransactionObj.BatchKey = transactionObj.BatchKey;
        newTransactionObj.addedOn = new Date();
        return newTransactionObj;
    }
    UserModule.CreatePaylianceACHObj = function(paylianceObj) {
        var newPaylianceInfo = new PaylianceACHObj();
        // //console.log(newPaylianceInfo.sportdocname);
        newPaylianceInfo.AccountID = paylianceObj.AccountID;
        newPaylianceInfo.CID = paylianceObj.CID;
        newPaylianceInfo.UID = paylianceObj.UID;
        newPaylianceInfo.addedOn = new Date();
        newPaylianceInfo.defaultAccount = paylianceObj.isprimary;
        return newPaylianceInfo;
    }

    UserModule.CreateTransactionStatus = function(transactionStatusObj) {
        var newTransactionStatus = new TransactionStatusObj();
        // //console.log(newPaylianceInfo.sportdocname);
        newTransactionStatus.UID = transactionStatusObj.UID;
        newTransactionStatus.Username = transactionStatusObj.Username;
        newTransactionStatus.Status = transactionStatusObj.Status;
        newTransactionStatus.RefNum = transactionStatusObj.RefNum;
        newTransactionStatus.addedOn = new Date();
        return newTransactionStatus;
    }

    UserModule.CreatePayliancePaymentObj = function(paylianceObj) {
        var newPayliancePaymentInfo = new PayliancePaymentObj();
        // //console.log(newPaylianceInfo.sportdocname);
        newPayliancePaymentInfo.Id = paylianceObj.Id;
        newPayliancePaymentInfo.AccountId = paylianceObj.AccountId;
        newPayliancePaymentInfo.Amount = paylianceObj.Amount;
        newPayliancePaymentInfo.IsDebit = paylianceObj.IsDebit;
        newPayliancePaymentInfo.Cvv = paylianceObj.Cvv;
        newPayliancePaymentInfo.PaymentSubType = paylianceObj.PaymentSubType;
        newPayliancePaymentInfo.InvoiceId = paylianceObj.InvoiceId;
        newPayliancePaymentInfo.InvoiceNumber = paylianceObj.InvoiceNumber;
        newPayliancePaymentInfo.PurchaseOrderNumber = paylianceObj.PurchaseOrderNumber;
        newPayliancePaymentInfo.OrderId = paylianceObj.OrderId;
        newPayliancePaymentInfo.Latitude = paylianceObj.Latitude;
        newPayliancePaymentInfo.Longitude = paylianceObj.Longitude;
        newPayliancePaymentInfo.SuccessReceiptOptions = paylianceObj.SuccessReceiptOptions;
        newPayliancePaymentInfo.FailureReceiptOptions = paylianceObj.FailureReceiptOptions;
        newPayliancePaymentInfo.CustomerId = paylianceObj.CustomerId;
        newPayliancePaymentInfo.CustomerFirstName = paylianceObj.CustomerFirstName;
        newPayliancePaymentInfo.CustomerLastName = paylianceObj.CustomerLastName;
        newPayliancePaymentInfo.CustomerCompany = paylianceObj.CustomerCompany;
        newPayliancePaymentInfo.ReferenceId = paylianceObj.ReferenceId;
        newPayliancePaymentInfo.Status = paylianceObj.Status;
        newPayliancePaymentInfo.RecurringScheduleId = paylianceObj.RecurringScheduleId;
        newPayliancePaymentInfo.PaymentType = paylianceObj.PaymentType;
        newPayliancePaymentInfo.ProviderAuthCode = paylianceObj.ProviderAuthCode;
        newPayliancePaymentInfo.TraceNumber = paylianceObj.TraceNumber;
        newPayliancePaymentInfo.PaymentDate = paylianceObj.PaymentDate;
        newPayliancePaymentInfo.ReturnDate = paylianceObj.ReturnDate;
        newPayliancePaymentInfo.EstimatedSettleDate = paylianceObj.EstimatedSettleDate;
        newPayliancePaymentInfo.ActualSettleDate = paylianceObj.ActualSettleDate;
        newPayliancePaymentInfo.CanVoidUntil = paylianceObj.CanVoidUntil;
        newPayliancePaymentInfo.FailureData = paylianceObj.FailureData;
        newPayliancePaymentInfo.IsDecline = paylianceObj.IsDecline;
        newPayliancePaymentInfo.CreatedOn = paylianceObj.CreatedOn;
        newPayliancePaymentInfo.LastModified = paylianceObj.LastModified;
        newPayliancePaymentInfo.RequiresReceipt = paylianceObj.RequiresReceipt;
        newPayliancePaymentInfo.PaymentToken = paylianceObj.PaymentToken;
        return newPayliancePaymentInfo;
    }

    UserModule.CreatePaylianceRemitRequestObj = function(paylianceRemitReqObj) {
        var newPaylianceRemitReqInfo = new PaylianceRemitRequestObj();
        // //console.log(newPaylianceInfo.sportdocname);
        newPaylianceRemitReqInfo.AID = paylianceRemitReqObj.AID;
        newPaylianceRemitReqInfo.CID = paylianceRemitReqObj.CID;
        newPaylianceRemitReqInfo.UID = paylianceRemitReqObj.UID;
        newPaylianceRemitReqInfo.type = paylianceRemitReqObj.type;
        newPaylianceRemitReqInfo.username = paylianceRemitReqObj.username;
        newPaylianceRemitReqInfo.amount = paylianceRemitReqObj.amount;
        newPaylianceRemitReqInfo.addedOn = new Date();
        return newPaylianceRemitReqInfo;
    }

    // UserModule.CreatePayliancePaymentObj = function (paylianceObj) {
    //     var newPaylianceInfo = new PayliancePaymentObj();   
    //     // //console.log(newPaylianceInfo.sportdocname);
    //     newPaylianceInfo.AccountID = paylianceObj.AccountID;
    //     newPaylianceInfo.CID = paylianceObj.CID;
    //     newPaylianceInfo.UID = paylianceObj.UID;
    //     newPaylianceInfo.addedOn = new Date();
    //     return newPaylianceInfo;
    // }
    var _p = UserModule.prototype;

    _p.checkValidationErrors = function(req) {
        req.checkBody('firstName', messageConfig.user.validationErrMessage.firstName).notEmpty();
        req.checkBody('lastName', messageConfig.user.validationErrMessage.lastName).notEmpty();
        req.checkBody('email', messageConfig.user.validationErrMessage.email).notEmpty();
        if (req.body.email) {
            req.checkBody('email', messageConfig.user.validationErrMessage.emailValid).isEmail();
        }
        req.checkBody('userRole', messageConfig.user.validationErrMessage.userRole).notEmpty();
        return req.validationErrors();
    };
    _p.checkJudgeValidationErrors = function(req) {
        req.checkBody('sportName', messageConfig.user.validationErrMessage.firstName).notEmpty();
        req.checkBody('level', messageConfig.user.validationErrMessage.lastName).notEmpty();
        // req.checkBody('file', messageConfig.user.validationErrMessage.email).notEmpty();

        return req.validationErrors();
    }
    _p.getUsers = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = {};
        if (req.query.username) {

        }
        if (req.decoded.user.username !== applicationConfig.user.defaultUsername) {
            query.username = req.decoded.user.username;
        }

        if (req.query.role) {
            query.userRole = req.query.role;
        }

        query.deleted = false;
        var sortOpts = { addedOn: -1 };
        return dataProviderHelper.getAllWithDocumentFieldsPagination(User, query, pagerOpts, documentFields, sortOpts);
    };
    _p.getUsersForSanction = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = [{
                $match: {

                    $and: [

                        { userRole: req.query.role }, { deleted: false }
                    ]

                }


            },
            {
                $lookup: {
                    from: "USAG-Membership-Verification",
                    localField: "_id",
                    foreignField: "Flyp10UserID",
                    as: "memberInfo"
                }
            },
            {
                $unwind: "$memberInfo"
            },

        ];
        var sortOpts = { addedOn: -1 };
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(User, query, pagerOpts, documentFields, sortOpts);
    };

    _p.getAllCompetitor = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = {};


        query.userRole = 3


        query.deleted = false;
        var sortOpts = { addedOn: -1 };
        return dataProviderHelper.getAllWithDocumentFieldsPagination(User, query, pagerOpts, documentFields, sortOpts);
    };
    _p.getAllCompetitorForMap = function(req, next) {
        var pagerOpts = {}
        var query = {};
        query.userRole = 3


        query.deleted = false;
        var sortOpts = { addedOn: -1 };
        return dataProviderHelper.getAllWithDocumentFieldsPagination(User, query, pagerOpts, documentFields, sortOpts);
    };
    _p.checkAndRefundRemittance = function() {
        //console.log('starts ------------------------------------')
        TransactionObj.find({}, function(err, transactions) {
            // //console.log("transactions ", transactions);
            transactions.forEach(transaction => {
                _p.checkTransactionStatus(transaction);
            });
        })
    }
    _p.postCaptcha = function(req, res, next) {
        //console.log(req.body)
        var secret = req.body.secret
        var response = req.body.response
        const options = {
            url: recaptcha + '?secret=' + secret + '&response=' + response + '&&remoteip=REMOTEADD',
            method: 'POST',
            body: '{}',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        const callback = (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                return res.json({
                    success: true,
                    data: body
                })
            } else {
                return res.json({
                    success: false,
                    message: err,
                    resp
                })
            }

        }
        request(options, callback);
    }

    _p.checkTransactionStatus = function(trans) {
        //console.log('for ref num -------> ', trans.RefNum);
        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:usaepay"
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
                    SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                    <SOAP-ENV:Body>
                        <ns1:getTransactionStatus>
                            <Token xsi:type="ns1:ueSecurityToken">
                                <PinHash xsi:type="ns1:ueHash">
                                <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                                <Seed xsi:type="xsd:string">${seed}</Seed>
                                <Type xsi:type="xsd:string">sha1</Type>
                                </PinHash>
                                <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                            </Token>
                            <RefNum xsi:type="xsd:string">${trans.RefNum}</RefNum>
                        </ns1:getTransactionStatus>
                    </SOAP-ENV:Body>
                    </SOAP-ENV:Envelope>`;

        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        const callback = (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                //console.log('Post success ', body);
                const parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    var ReturnedTransactionRes = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getTransactionStatusResponse']['getTransactionStatusReturn'];
                    //console.log('JSON result ', ReturnedTransactionRes['Status']['_']);
                    const transactionStatus = {
                        UID: trans.UID,
                        RefNum: trans.RefNum,
                        Username: trans.Username,
                        Status: trans.Status
                    }
                    const newTransactionStatus = UserModule.CreateTransactionStatus(transactionStatus);
                    dataProviderHelper.save(newTransactionStatus).then(response => {
                        //console.log('Transaction status saved - ', response);
                        let TransactionStatus = ReturnedTransactionRes['Status']['_'];
                        if (TransactionStatus == 'Pending') {
                            //console.log('Status is still pending');
                        } else {
                            // Update transaction status
                            TransactionObj.updateMany({}, { '$set': { "Status": TransactionStatus } }, function(err, resp) {
                                if (err) {
                                    //console.log('Error updating transaction status ', err)
                                }
                                //console.log('Transaction status updated succesfully ', resp)
                                // Reverse amount to users wallet
                                if (TransactionStatus == 'Error' || TransactionStatus == 'Returned' || TransactionStatus == 'Timed out') {
                                    //console.log('Amount needs to be REVERSED');
                                    const Amount = trans.Amount;
                                    const query = {};
                                    query.UID = trans.UID;
                                    query.deleted = false;
                                    UserWallet.find(query, function(err, userWalletInfo) {
                                        if (err) {
                                            //console.log("Error finding user wallet info ", err);
                                        }
                                        //console.log("User wallet info ", userWalletInfo);
                                        const amountToUpdate = parseInt(userWalletInfo.balance, 10) + Amount;
                                        // Update balance
                                        UserWallet.updateMany({ "UID": trans.UID, "deleted": false }, { '$set': { "balance": amountToUpdate } }, function(err, res) {
                                            if (err) {
                                                //console.log("Error updating amount - ", err);
                                            }
                                            //console.log("Amount reversed to users wallet ", res);
                                        })
                                    })
                                }
                            })
                        }
                    }).catch(err => {
                        //console.log('Error saving transaction status - ', err);
                    })
                })
            } else {
                return res.json({
                    success: false,
                    message: err
                })
            }
        }

        request(options, callback);
    }

    _p.getJudgesForScheduling = function(req, res, next) {
        //console.log('starts ------------------------------------')
        var query = {};
        query.userRole = "2";
        query.deleted = false;
        User.aggregate([{ "$match": { "deleted": false, "userRole": "2" } },
            {
                "$lookup": {
                    "from": "PaylianceACHObj",
                    "localField": "paylianceCID",
                    "foreignField": "CID",
                    "as": "accountDetails"
                }
            },
            {
                "$lookup": {
                    "from": "user_wallet",
                    "localField": "_id",
                    "foreignField": "uid",
                    "as": "walletDetails"
                }
            }
        ], function(err, accounts) {
            // //console.log("user accounts ", accounts);
            if (err) {
                //console.log(err);
            }
            // //console.log('find all users ', data);
            for (let i = 0; i < accounts.length; i++) {
                const usersDetails = accounts[i];
                if (usersDetails.accountDetails.length) {
                    if (usersDetails.paylianceCID == 0 || usersDetails.paylianceCID == undefined) {
                        // //console.log('this user has no customer id to show');
                    } else {
                        // //console.log('available users ', usersDetails);
                        var defaultAccount = [];
                        for (let j = 0; j < usersDetails.accountDetails.length; j++) {
                            const accounts = usersDetails.accountDetails[j];
                            if (accounts.defaultAccount) {
                                // //console.log('accounts -----------> ', accounts);
                                defaultAccount.push(accounts);
                                break;
                            }
                        }
                        // //console.log('def account', defaultAccount);
                        if (defaultAccount.length) {
                            // //console.log('user details ---------> ', usersDetails);
                            // //console.log('default account -----------> ', defaultAccount);
                            if (usersDetails.walletDetails.length) {
                                if (parseInt(usersDetails.walletDetails[0].balance, 10) > 0) {
                                    _p.runCustomerTransaction(defaultAccount[0].CID, defaultAccount[0].AccountID, parseInt(usersDetails.walletDetails[0].balance, 10), defaultAccount[0].UID, usersDetails.username)
                                } else {
                                    //console.log('not enough balance to process');
                                }
                            }
                        }
                    }
                }
            }
        })
    };

    _p.runCustomerTransaction = function(cid, accId, amount, uid, uname) {
        //console.log(`cid --> ${cid} accid --> ${accId} amount --> ${amount} uid --> ${uid} username --> ${uname}`)
        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:usaepay"
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
                    SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                    <SOAP-ENV:Body>
                        <ns1:runCustomerTransaction>
                            <Token xsi:type="ns1:ueSecurityToken">
                                <PinHash xsi:type="ns1:ueHash">
                                <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                                <Seed xsi:type="xsd:string">${seed}</Seed>
                                <Type xsi:type="xsd:string">sha1</Type>
                                </PinHash>
                                <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                            </Token>
                            <CustNum xsi:type="xsd:string">${cid}</CustNum>
                            <PaymentMethodID xsi:type="xsd:string">${accId}</PaymentMethodID>
                            <Parameters xsi:type="ns1:CustomerTransactionRequest">
                                <Command xsi:type="xsd:string">checkcredit</Command>
                                <Details xsi:type="ns1:TransactionDetail">
                                <Amount xsi:type="xsd:double">${amount}</Amount>
                                <Description xsi:type="xsd:string"></Description>
                                </Details>
                            </Parameters>
                        </ns1:runCustomerTransaction>
                    </SOAP-ENV:Body>
                    </SOAP-ENV:Envelope>`;

        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        // const callback = (err, resp, body) => {
        //     if(!err && resp.statusCode == 200){
        //         //console.log('Post success ', body);
        //         const parser = new xml2js.Parser({explicitArray: false, trim: true});
        //         parser.parseString(body, (err, result) => {
        //             //console.log('JSON result ', result);
        //             var ReturnedPaymentRes = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:runCustomerTransactionResponse']['runCustomerTransactionReturn'];
        //             //console.log('JSON result ', ReturnedPaymentRes);
        //             PaylianceRemitRequestObj.updateMany({"CID": req.body.CustomerID, "AID": req.body.AccountId}, {"type": 1}, function(err, response){
        //                 if(err){
        //                     //console.log('error updating remit request ', err);
        //                 }
        //                 UserWallet.find({"userid": req.body.UID}, function(err, userWalletInfo){
        //                     if(err){
        //                         //console.log('error retreiving wallet info ', err)
        //                     }
        //                     //console.log('user wallet info =======> ', userWalletInfo)
        //                     const availableBalance = userWalletInfo[0].balance,
        //                     deductedBalance = parseInt(availableBalance,10) - req.body.Amount;
        //                     UserWallet.updateMany({"userid": req.body.UID},{"balance": deductedBalance}, function(err, updateResponse){
        //                         if (err) //console.log('error updating wallet balance ', err);
        //                         //console.log('update response is ', updateResponse);

        //                         // Save transaction response starts -------------------

        //                         const transObj = {
        //                             RefNum: ReturnedPaymentRes.RefNum._,
        //                             TransKey: ReturnedPaymentRes.TransKey._,
        //                             PreviousBalance: availableBalance,
        //                             ClosingBalance: deductedBalance,
        //                             Amount: amountToRemit,
        //                             UID:  req.body.UID,
        //                             Username: req.body.Username,
        //                             AuthCode:  ReturnedPaymentRes.AuthCode._,
        //                             BatchNum:  ReturnedPaymentRes.BatchNum._,
        //                             BatchRefNum:  ReturnedPaymentRes.BatchRefNum._,
        //                             BatchKey:  ReturnedPaymentRes.BatchKey._,
        //                             addedOn: ReturnedPaymentRes.addedOn
        //                         }

        //                         var newTransaction = UserModule.CreateTransactionObj(transObj);

        //                         dataProviderHelper.save(newTransaction).then(saveResponse => {

        //                             //console.log('saved transaction response ', saveResponse);

        //                             return res.json({
        //                                 success: true,
        //                                 message: "Transaction details submitted successfully"
        //                             })
        //                         })

        //                         // Save transaction response ends -------------------
        //                     })
        //                 })

        //             }); 
        //         })
        //     }else{
        //         return res.json({
        //             success: false,
        //             message: err
        //         })
        //     }
        // }

        const callback = (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                //console.log('Post success ', body);
                const parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    //console.log('JSON result ', result);
                    var ReturnedPaymentRes = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:runCustomerTransactionResponse']['runCustomerTransactionReturn'];
                    //console.log('JSON result ', ReturnedPaymentRes);
                    PaylianceRemitRequestObj.updateMany({ "CID": cid, "AID": accId }, { "type": 1 }, function(err, response) {
                        if (err) {
                            //console.log('error updating remit request ', err);
                        }
                        UserWallet.find({ "userid": uid }, function(err, userWalletInfo) {
                            if (err) {
                                //console.log('error retreiving wallet info ', err)
                            }
                            //console.log('user wallet info =======> ', userWalletInfo)
                            const availableBalance = userWalletInfo[0].balance,
                                deductedBalance = parseInt(availableBalance, 10) - amount;
                            UserWallet.updateMany({ "userid": uid }, { "balance": 0 }, function(err, updateResponse) {
                                if (err) {
                                    //console.log('error updating wallet balance ', err);
                                }
                                //console.log('update response is ', updateResponse);

                                // Save transaction response starts -------------------

                                const transObj = {
                                    RefNum: ReturnedPaymentRes.RefNum._,
                                    TransKey: ReturnedPaymentRes.TransKey._,
                                    PreviousBalance: availableBalance,
                                    ClosingBalance: deductedBalance,
                                    Amount: amount,
                                    UID: uid,
                                    Username: uname,
                                    Status: ReturnedPaymentRes.Status._,
                                    AuthCode: ReturnedPaymentRes.AuthCode._,
                                    BatchNum: ReturnedPaymentRes.BatchNum._,
                                    BatchRefNum: ReturnedPaymentRes.BatchRefNum._,
                                    BatchKey: ReturnedPaymentRes.BatchKey._,
                                    addedOn: ReturnedPaymentRes.addedOn
                                }

                                var newTransaction = UserModule.CreateTransactionObj(transObj);

                                dataProviderHelper.save(newTransaction).then(saveResponse => {

                                    //console.log('******* saved transaction response *******', saveResponse);
                                })

                                // Save transaction response ends -------------------
                            })
                        })

                    });
                })
            } else {
                return res.json({
                    success: false,
                    message: err
                })
            }
        }

        request(options, callback);
    }

    _p.remitHistoryById = function(req) {

        //console.log("req.params.docid", req.params.uid);
        var query = {}
        query.UID = req.params.uid;
        return dataProviderHelper.find(TransactionObj, query, documentFieldsRemitHistory)

    }

    _p.remittanceHistory = function(req) {
        const query = [{ "$match": {} },
            {
                "$lookup": {
                    "from": "Flyp10_User",
                    "localField": "Username",
                    "foreignField": "username",
                    "as": "userDetails"
                }
            }
        ];
        return dataProviderHelper.getUsersWithRemitHistory(TransactionObj, query)
    }

    // _p.remitHistoryById = function(req, res, next){ 
    //     //console.log('request body ', req.params.uid);
    //     // return dataProviderHelper.findById(paylianceTransactionModel, req.params.uid)
    //     TransactionObj.find({"UID": req.params.uid}, function(err, remitHistory){
    //         if(err){
    //             //console.log("error getting transaction obj ", err);
    //         }
    //         //console.log("remit history details ", remitHistory);
    //         return res.json({
    //             success:true,
    //             data: remitHistory
    //         })
    //     })
    // }

    _p.getAllUsers = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = {};
        query.userRole = "3";
        query.deleted = false;
        var sortOpts = { addedOn: -1 };
        return dataProviderHelper.getAllWithDocumentFieldsPagination(User, query, pagerOpts, documentFields, sortOpts);
    };

    _p.getUserByID = function(req) {
        documentFields = documentFields + ' twoFactorAuthSharedSecret';
        return dataProviderHelper.findById(User, req.params.userId, documentFields);
    };
    _p.getUserByIDWithUSAGID = function(req, res, next) {
        var query = [{
                $match: {
                    $and: [{ _id: mongoose.Types.ObjectId(req.params.userId) }]
                }

            },


            {
                $lookup: {
                    from: "USAG-Membership-Verification",
                    localField: "_id",
                    foreignField: "Flyp10UserID",
                    as: "MemberInfo"
                }
            },

            { "$unwind": { path: "$MemberInfo", preserveNullAndEmptyArrays: true } },
        ]
        dataProviderHelper.aggregate(User, query).then((response) => {
            var data = response[0];
            console.log('testsire')
            res.json(data)


        });
    };
    _p.getjudgeSportByname = function(req) {
        var query = [{
                $match: {

                    $and: [{ 'deleted': false }, { 'userid': mongoose.Types.ObjectId(req.params.username) }]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sportid",
                    foreignField: "_id",
                    as: "sportinfo"
                }
            },
            {
                $unwind: "$sportinfo"
            },
            {
                $lookup: {
                    from: "Level",
                    localField: "levelid",
                    foreignField: "_id",
                    as: "levelinfo"
                }
            },
            {
                $unwind: "$levelinfo"
            },
            {
                $addFields: { OrgSportName: "$sportinfo.sportName", Orglevel: "$levelinfo.level" }
            }
        ];
        // query.username=req.params.username;
        //query.deleted=false
        return dataProviderHelper.aggregate(JudgeSport, query);

    }
    _p.getUserSportInfoForEventMeetSport = function(req) {
        var query = [{
                $match: {

                    $and: [{ 'deleted': false }, { 'userid': mongoose.Types.ObjectId(req.params.userId) }, { 'sportid': mongoose.Types.ObjectId(req.params.sportId) }]

                }


            },
            {
                "$lookup": {
                    "from": "Flyp10_User",
                    "localField": "userid",
                    "foreignField": "_id",
                    "as": "userDetails"
                }
            }

        ];
        // query.username=req.params.username;
        //query.deleted=false
        return dataProviderHelper.aggregate(JudgeSport, query);

    }
    _p.getSignupuserdetails = function(req) {
        var query = {};
        query._id = req.params.userid;
        query.deleted = false
        return dataProviderHelper.find(User, query);

    }
    _p.getAllExpiredjudges = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        //var query = {};
        //	query.originalfilename={ $exists:true}
        //  query.status='3';
        //  query.deleted = false;
        var sortOpts = { addedOn: -1 };
        var query = [{
                $match: {

                    $and: [

                        { status: '3' }, { originalfilename: { $exists: true } }, { deleted: false }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sportid",
                    foreignField: "_id",
                    as: "sportinfo"
                }
            },
            {
                $unwind: "$sportinfo"
            },
            {
                $lookup: {
                    from: "Level",
                    localField: "levelid",
                    foreignField: "_id",
                    as: "levelinfo"
                }
            },
            {
                $unwind: "$levelinfo"
            }
        ];
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(JudgeSport, query, pagerOpts, documentjudgeFields, sortOpts);
    }
    _p.getAllRejectedjudges = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        // query.status='2';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };
        var query = [{
                $match: {

                    $and: [

                        { status: '2' }, { originalfilename: { $exists: true } }, { deleted: false }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sportid",
                    foreignField: "_id",
                    as: "sportinfo"
                }
            },
            {
                $unwind: "$sportinfo"
            },
            {
                $lookup: {
                    from: "Level",
                    localField: "levelid",
                    foreignField: "_id",
                    as: "levelinfo"
                }
            },
            {
                $unwind: "$levelinfo"
            }
        ];

        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(JudgeSport, query, pagerOpts, documentjudgeFields, sortOpts);
    }

    _p.getAllUnverifiedjudges = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query1 = {
            $or: [
                { status: { $exists: false }, deleted: false, originalfilename: { $exists: true } },
                { status: '0', deleted: false, originalfilename: { $exists: true } }
            ]
        }
        var sortOpts = { addedOn: -1 };

        var query = [{
                $match: {

                    $and: [

                        { $or: [{ status: '0' }, { status: { $exists: false } }] }, { originalfilename: { $exists: true } }, { deleted: false }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sportid",
                    foreignField: "_id",
                    as: "sportinfo"
                }
            },
            {
                $unwind: "$sportinfo"
            },
            {
                $lookup: {
                    from: "Level",
                    localField: "levelid",
                    foreignField: "_id",
                    as: "levelinfo"
                }
            },
            {
                $unwind: "$levelinfo"
            }
        ];

        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(JudgeSport, query, pagerOpts, documentjudgeFields, sortOpts);
        // return dataProviderHelper.getAllWithDocumentFieldsPagination(JudgeSport, query, pagerOpts, documentjudgeFields, sortOpts);
    }
    _p.getAllVerifiedjudges = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };

        var query = [{
                $match: {

                    $and: [

                        { status: '1' }, { originalfilename: { $exists: true } }, { deleted: false }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sportid",
                    foreignField: "_id",
                    as: "sportinfo"
                }
            },
            {
                $unwind: "$sportinfo"
            },
            {
                $lookup: {
                    from: "Level",
                    localField: "levelid",
                    foreignField: "_id",
                    as: "levelinfo"
                }
            },
            {
                $unwind: "$levelinfo"
            }
        ];

        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(JudgeSport, query, pagerOpts, documentjudgeFields, sortOpts);
    }

    _p.getRemitRequests = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = {};
        query.type = "0"
        var sortOpts = { addedOn: -1 };
        return dataProviderHelper.getAllWithDocumentFieldsPagination(PaylianceRemitRequestObj, query, pagerOpts, documentFieldsRemitRequest, sortOpts);
    }

    _p.getjudgeSportByid = function(req) {

        //console.log("req.params.docid", req.params.docid);
        return dataProviderHelper.findById(JudgeSport, req.params.docid, documentjudgeFields)
    }

    _p.patchUserInformation = function(req, res, next) {

        if (!req.body.deleted) {
            if (req.body.password) {
                if (req.body.password.trim().toLowerCase().indexOf(req.user.username) === -1) {
                    _p.changePassword(req, res, next);
                } else {
                    res.status(HTTPStatus.BAD_REQUEST);
                    res.json({
                        message: messageConfig.user.passwordEqUsername
                    });
                }
            } else if (req.body.securityQuestion && req.body.securityAnswer) {
                _p.chageSecurityAnswer(req, res, next);
            } else {
                res.status(HTTPStatus.NOT_MODIFIED);
                res.end();
            }
        } else {
            // //console.log("delete user",req);
            if (req.user.username !== applicationConfig.user.defaultUsername) {
                req.user.deleted = true;
                req.user.deletedBy = req.decoded.user.username;
                req.user.deletedOn = new Date();
                _p.saveMiddleFunc(req, res, req.user, next, messageConfig.user.deleteMessage);
            } else {
                res.status(HTTPStatus.METHOD_NOT_ALLOWED);
                res.json({
                    message: messageConfig.user.superAdminDeleteMessage
                });
            }
        }
    };

    _p.changePassword = function(req, res, next) {
        //Only superadmin user can change the password of all the other users
        //Other users cannot change the passowrd of superadmin user
        //User can change own passwords only.
        if (req.user.username === applicationConfig.user.defaultUsername && req.decoded.user.username !== applicationConfig.user.defaultUsername) {
            res.status(HTTPStatus.FORBIDDEN);
            res.json({
                message: messageConfig.user.notAllowedToChangeSuperAdminPassword
            });
        } else if (req.decoded.user.username !== req.user.username && req.decoded.user.username !== applicationConfig.user.defaultUsername) {
            res.status(HTTPStatus.FORBIDDEN);
            res.json({
                message: messageConfig.user.notAllowedToChangeOthersPassword
            });
        } else {
            _p.modifyPassword(req, res, next)
                .then(function(resultObj) {
                    if (resultObj.error) {
                        res.status(HTTPStatus.BAD_REQUEST);
                        res.json({
                            message: resultObj.message
                        });
                    } else {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.user.passwordUpdateMessage
                        });
                    }
                })
                .catch(function(err) {
                    return next(err);
                });
        }
    };

    _p.modifyPassword = function(req, res, next) {
        var password = req.body.password.toString();
        return new Promise(function(resolve, reject) {
            _p.checkForCommonPassword(req, password)
                .then(function(weakPassword) {
                    if (weakPassword) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.BAD_REQUEST + '", "message": "' + messageConfig.user.weakPassword + '"}');

                    } else {
                        return hasher.createSalt();
                    }
                })
                .then(function(salt) {
                    return [salt, hasher.computeHash(req, res, password, salt)];
                })
                .spread(function(salt, hashPasswordData) {
                    req.user.password = hashPasswordData;
                    req.user.passwordSalt = salt;

                    return dataProviderHelper.save(req.user);
                })
                .then(function() {
                    resolve({
                        error: false
                    });
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    var errorMessage = errorHelper.outputJSONErrorMessage(cancellationErr, next);
                    resolve({
                        error: true,
                        message: errorMessage.message
                    });
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    };

    _p.implementForgotPasswordAction = function(req, res, next) {
        if (req.params.accessToken) {
            var queryOpts = {
                expired: false,
                validUpto: {
                    "$gte": new Date()
                },
                token: req.params.accessToken
            };

            dataProviderHelper.find(PasswordChangeVerifyToken, queryOpts, '')
                .then(function(tokenStatus) {
                    if (tokenStatus && tokenStatus.length > 0) {

                        var _userId = tokenStatus[0].userID;
                        req.params.userId = _userId;
                        passwordChangeVerifyController.updateRegistrationConfirmationToken(req.params.accessToken, _userId)
                            .then(function() {
                                _p.getUserByID(req)
                                    .then(function(userObj) {
                                        if (userObj) {
                                            if (req.body.password.trim().toLowerCase().indexOf(userObj.username) === -1) {
                                                req.user = userObj;
                                                return _p.modifyPassword(req, res, next);
                                            } else {
                                                res.status(HTTPStatus.BAD_REQUEST);
                                                res.json({
                                                    message: messageConfig.user.passwordEqUsername
                                                });
                                            }
                                        } else {
                                            res.status(HTTPStatus.FORBIDDEN);
                                            res.json({
                                                message: messageConfig.user.notAllowedToChangePassword
                                            });
                                        }
                                    })
                                    .then(function(returnObj) {
                                        if (returnObj.error) {
                                            errorHelper.customErrorResponse(res, returnObj.message, next);
                                        } else {
                                            res.status(HTTPStatus.OK);
                                            res.json({
                                                message: messageConfig.user.passwordUpdateMessage
                                            });
                                        }
                                    })
                                    .catch(function(err) {
                                        return next(err);
                                    });
                            })

                    } else {
                        res.status(HTTPStatus.UNAUTHORIZED);
                        res.json({
                            message: messageConfig.user.notAllowedToChangePassword
                        });
                    }
                })


        } else {
            res.status(HTTPStatus.UNAUTHORIZED);
            res.end();
        }
    };

    _p.chageSecurityAnswer = function(req, res, next) {
        var _securityQuestion = req.body.securityQuestion;
        var _securityAnswer = req.body.securityAnswer;

        hasher.createSalt()
            .then(function(salt) {
                return [salt, hasher.computeHash(req, res, _securityAnswer, salt)];
            })
            .spread(function(salt, hashSecurityAnswerData) {
                req.user.securityQuestion = _securityQuestion;
                req.user.securityAnswer = hashSecurityAnswerData;
                req.user.securityAnswerSalt = salt;

                return dataProviderHelper.save(req.user);
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.user.securityAnswerMessage
                });
            })
            .catch(function(err) {
                return next(err);

            });
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
    _p.saveJudgeSport = function(req, res, next) {
        req.body = JSON.parse(req.body.data);
        //console.log(req.body.uploadingfor, 'uploadingfor')
        var errors = _p.checkJudgeValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes,
                val: 0
            });
        } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next)
            var documentinfo = utilityHelper.getDocumentFileInfo(req, null, next);
            var newJudgeSport = UserModule.CreateJudgesSport(modelInfo, req.decoded.user.username, documentinfo);
            var query = {};
            query.levelid = mongoose.Types.ObjectId(modelInfo.levelid);
            query.sportid = mongoose.Types.ObjectId(modelInfo.sportid);
            query.userid = mongoose.Types.ObjectId(modelInfo.userid);
            query.deleted = false;
            //console.log(query);
            dataProviderHelper.checkForDuplicateEntry(JudgeSport, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');
                    } else {
                        return dataProviderHelper.save(newJudgeSport)
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.JudgeSport.saveMessageJudgeSport,
                        val: 1
                    });
                    return join(
                        _p.sendmailToAdmin(req, next)

                    );
                }).catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });
        }

    }
    _p.sendmailToAdmin = function(req, next) {
        let query = {
            _id: req.body.userid,
            deleted: false
        }

        dataProviderHelper.find(User, query).then(function(user) {
            //console.log("userdata", query, user);
            if (user) {
                //console.log(user[0].email);
                var params = {
                    username: user[0].username
                }
                mailController.sendMailToAdmin(req, user[0].email, 'Judge certification added', params, next);


            }
        })

    }
    _p.patchmobJudgeSport = function(req, res, next) {
        /**
           do  changes in patchJudgeSport function also
        */
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        //console.log(modelInfo);
        if (req.body.deleted) {
            // //console.log("delete user",req);         
            req.mobjudgeSport.deleted = true;
            req.mobjudgeSport.deletedBy = req.decoded.user.username;
            req.mobjudgeSport.deletedOn = new Date();
            _p.saveMiddleFunc(req, res, req.mobjudgeSport, next, messageConfig.JudgeSport.deleteMessageJudgeSport)

        } else {
            var query = {};
            query.levelid = mongoose.Types.ObjectId(req.body.levelid);
            query.sportid = mongoose.Types.ObjectId(req.body.sportid);
            query.userid = mongoose.Types.ObjectId(req.body.userid);
            query._id = { $ne: req.params.docid }
            query.deleted = false;
            //console.log(query);
            dataProviderHelper.checkForDuplicateEntry(JudgeSport, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');
                    } else {
                        //console.log("inside update")
                        req.mobjudgeSport.sportName = req.body.sportName;
                        req.mobjudgeSport.level = req.body.level;
                        req.mobjudgeSport.sportid = mongoose.Types.ObjectId(req.body.sportid);
                        req.mobjudgeSport.levelid = mongoose.Types.ObjectId(req.body.levelid);
                        req.mobjudgeSport.docdescription = req.body.docdescription
                        req.mobjudgeSport.updatedBy = req.decoded.user.username;
                        req.mobjudgeSport.updatedOn = new Date();
                        if (req.body.expdate) {
                            req.mobjudgeSport.expdate = req.body.expdate;
                            req.mobjudgeSport.status = req.body.status;
                        }
                        return dataProviderHelper.save(req.mobjudgeSport);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.JudgeSport.updateMessageJudgeSport,
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

    _p.patchJudgeSport = function(req, res, next) {
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        //console.log(modelInfo);
        if (req.body.deleted) {
            // //console.log("delete user",req);         
            req.judgeSport.deleted = true;
            req.judgeSport.deletedBy = req.decoded.user.username;
            req.judgeSport.deletedOn = new Date();
            _p.saveMiddleFunc(req, res, req.judgeSport, next, messageConfig.JudgeSport.deleteMessageJudgeSport)

        } else {
            var query = {};
            query.levelid = mongoose.Types.ObjectId(req.body.levelid);
            query.sportid = mongoose.Types.ObjectId(req.body.sportid);
            query.userid = mongoose.Types.ObjectId(req.body.userid);
            query.uploadingfor = req.body.uploadingfor;
            query._id = { $ne: req.params.docid }
            query.deleted = false;
            //console.log(query);
            dataProviderHelper.checkForDuplicateEntry(JudgeSport, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');
                    } else {
                        //console.log("inside update")
                        req.judgeSport.sportName = req.body.sportName;
                        req.judgeSport.level = req.body.level;
                        req.judgeSport.sportid = mongoose.Types.ObjectId(req.body.sportid);
                        req.judgeSport.levelid = mongoose.Types.ObjectId(req.body.levelid);
                        req.judgeSport.docdescription = req.body.docdescription;
                        req.judgeSport.uploadingfor = req.body.uploadingfor;
                        req.judgeSport.updatedBy = req.decoded.user.username;
                        req.judgeSport.updatedOn = new Date();
                        if (req.body.expdate) {
                            req.judgeSport.expdate = req.body.expdate;
                            req.judgeSport.status = req.body.status;
                        }
                        return dataProviderHelper.save(req.judgeSport);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.JudgeSport.updateMessageJudgeSport,
                    });
                    return join(
                        _p.sendmailToJudgeCertVerification(req, next)

                    );
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });
        }
    };

    _p.sendmailToJudgeCertVerification = function(req, next) {
        if (req.judgeSport.userid && req.body.isVerify) {
            dataProviderHelper.findById(User, req.judgeSport.userid, documentFields).then(
                function(user) {
                    //console.log("dsdsd", user)
                    var params = {
                        name: user.firstName + " " + user.lastName,
                        sport: req.judgeSport.sportName,
                        level: req.judgeSport.level,
                        username: user.username,
                        date: req.body.expdate
                    }
                    if (user.firstName) {
                        mailController.sendMailWithParams(req, user.email, 'Judge certification verified', params, next);
                    }

                }
            )
        }
    }
    _p.addSignUpuserSport = function(req, res, next) {
        var errors = _p.checkJudgeValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes,
                val: 0
            });
        } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next)
            var newJudgeSport = UserModule.CreateUserSport(modelInfo);
            var query = {};
            query.levelid = mongoose.Types.ObjectId(modelInfo.levelid);
            query.sportid = mongoose.Types.ObjectId(modelInfo.sportid);
            query.userid = mongoose.Types.ObjectId(modelInfo.userid);
            query.deleted = false;
            //console.log(query);
            dataProviderHelper.checkForDuplicateEntry(JudgeSport, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');
                    } else {
                        return dataProviderHelper.save(newJudgeSport)
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.user.signupuser,
                        val: 1
                    });
                }).catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });
        }

    }
    _p.userSignUp = function(req, res, next) {

        //console.log('req.body', req.body)
        //console.log('req.body.data', req.body.data)
        req.body = JSON.parse(req.body.data);
        req.checkBody('password', messageConfig.user.validationErrMessage.password).notEmpty();
        const passphrase = niceware.generatePassphrase(8);
        req.body.passphrase = passphrase[0];
        //console.log('passphrase is  ', req.body.passphrase);
        // const passphraseString = passphrase.join();
        // req.body.passphrase = passphraseString.replace(/,/g, ' ');

        // req.checkBody('securityQuestion', messageConfig.user.validationErrMessage.securityQuestion).notEmpty();
        // req.checkBody('securityAnswer', messageConfig.user.validationErrMessage.securityAnswer).notEmpty();

        var errors = _p.checkValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes,
                val: 0
            });
        } else {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);

            // About 3 percent of users derive the password from the username
            // This is not very secure and should be disallowed
            if (modelInfo.password.trim().toLowerCase().indexOf(modelInfo.email) === -1) {

                emailServiceController.getMailServiceConfig()
                    .then(function(resData) {
                        if (resData) {
                            return _p.checkForCommonPassword(req, modelInfo.password);
                        } else {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.BAD_REQUEST + '", "message": "' + messageConfig.emailService.notFound + '"}');
                        }
                    })
                    .then(function(weakPassword) {
                        if (weakPassword) {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.BAD_REQUEST + '", "message": "' + messageConfig.user.weakPassword + '"}');

                        } else {
                            query.username = modelInfo.username.toLowerCase();
                            query.deleted = false;
                            return dataProviderHelper.checkForDuplicateEntry(User, query);
                        }
                    })
                    .then(function(count) {
                        if (count > 0) {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.user.alreadyExists + '"}');
                        } else {
                            // one for password salt and another one for security answer salt
                            return [hasher.createSalt()];
                        }
                    })
                    .spread(function(saltPassword) {
                        return [saltPassword, hasher.computeHash(req, res, modelInfo.password, saltPassword)];
                    })
                    .spread(function(saltPassword, hashPasswordData) {
                        var imageInfo = utilityHelper.getFileInfo(req, null, next);
                        var newUser = UserModule.CreateSignupUser(modelInfo, imageInfo, hashPasswordData, saltPassword);

                        return [newUser, dataProviderHelper.save(newUser)];
                    })
                    // .spread(function (newUser) {
                    //     return userConfirmationTokenController.sendEmailToUser(req, newUser.email, newUser._id);
                    // })
                    .then(function(response) {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.user.saveMessage,
                            val: 1,
                            res: response
                        });
                        return join(
                            _p.sendmailToUser(req, response, next)

                        );
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
                    message: messageConfig.user.passwordEqUsername,
                    val: 0
                });
            }

        }
    };
    _p.getToken = function(req, res, next) {
        //_p.logActivity(req)
        convergeLib.generateToken(req.body.firstname, req.body.lastname, req.body.email, req.body.ssl_card_number, req.body.ssl_exp_date, req.body.ssl_cvv2cvc2, req.body.ssl_avs_address, req.body.ssl_avs_zip, req.body.ssl_city, req.body.ssl_state, req.body.ssl_country)
            .then(function(response) {
                //console.log('response ', response);
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
    _p.Makepayment = function(req, res, next) {
        //_p.logActivity(req)
        convergeLib.collectPaymentByToken(req.body.token, req.body.amount, req.body.invoiceNumber, req.body.description)
            .then(function(response) {
                //console.log('response ', response);
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
    _p.MakeMCCTokenpayment = function(req, res, next) {
        //_p.logActivity(req)
        //console.log("_p.MakeMCCTokenpayment")
        convergeLib.collectMCCPaymentByToken(req.body.token, req.body.amount, req.body.invoiceNumber, req.body.description, req.body.currency)
            .then(function(response) {
                //console.log('response ', response);
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

    _p.logActivity = async function(req) {
        // const requestIp = require('request-ip');

        // const clientIp = requestIp.getClientIp(req); 
        // //console.log('ip',clientIp)

        // let fileName =req.app.get('rootDir')+'/lib/configs/creditcardauthlogfile.txt'
        // //console.log(fileName,"filename")
        // await createlogfile(fileName);
        // try{         
        //         let log="\r\nAddedOn-"+new Date().toString()+",IP-Address-"+clientIp+",RequestBody-"+JSON.stringify(req.body)+",Route-"+req.originalUrl
        //         fs.appendFile(fileName, log, function (err) {
        //           if(err){
        //             //console.log(err)
        //           //console.log('log not saved')
        //           }else{
        //               //console.log('Log saved')
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
                            //console.log(err, 'err')
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                }
            });
        })
    }
    _p.creditCardAuth = function(req, res, next) {
        //console.log('body request ', req.body)
        //_p.logActivity(req); 
        res.status(HTTPStatus.NOT_FOUND);
        res.json({
            message: "Method Not Found"
        });
        // req.body = JSON.parse(req.body.data);
        // convergeLib.verifyCard(req.body.ssl_card_number, req.body.ssl_exp_date, req.body.ssl_cvv2cvc2,req.body.ssl_avs_address,req.body.ssl_avs_zip,req.body.ssl_city,req.body.ssl_state,req.body.ssl_country)
        //         .then(function(response){
        //             //console.log('response ',response);
        //             res.status(HTTPStatus.OK);
        //             res.json({
        //                 response
        //             });
        //         })
        //         .catch(function(err){
        //             console.error('error',err);
        //             res.status(HTTPStatus.BAD_REQUEST);
        //             var _errorsRes = (err.length === 1) ? err[0].msg : err;
        //             res.json({
        //                 message: _errorsRes,
        //                 val:0   
        //             });
        //         });
    }

    // Payliance API integration methods starts here

    _p.getPaylianceCIDByUID = function(req) {

        //console.log("req.params.docid", req.params.uid);
        var query = {}
        query.UID = req.params.uid;
        return dataProviderHelper.find(PaylianceCusObj, query, documentFieldsPayliance)

    }

    _p.getRemitRequestByUID = function(req) {

        //console.log("req.params.uid", req.params.uid);
        var query = {}
        query.UID = req.params.uid;
        return dataProviderHelper.find(PaylianceRemitRequestObj, query, '');

    }

    _p.getuserInfo = function(req) {
        return dataProviderHelper.findById(User, req.params.userid, documentUserFields);
    };

    _p.createCSVforACH = function(req, res, next) {
        //console.log('req body ', req.body);
        var writeStream = fs.createWriteStream("ACH.csv");
        var newLine = "\r\n";
        const fields = ["Account", "Account Type", "Amount", "Routing"];
        const opts = { header: false };
        //console.log('loop starts');
        var csv = json2csv(req.body, opts);
        fs.appendFile('ACH.csv', csv, function(err) {
            // if (err) throw err;
            if (err) {
                res.json({
                    success: false,
                    message: err
                })
            }
            res.json({
                    success: true,
                    message: "ACH file has been generated successfully"
                })
                // //console.log('The "data to append" was appended to file!');
        });
        //console.log('row ends')
        // for(var i=0; i<req.body.length; i++){

        // }
        // //console.log('write stream to close');
        // writeStream.close();
    }

    _p.updateCIDInfo = function(req, res, next) {

        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        // For checking duplicate entry
        var query = {};
        //query.username = modelInfo.username.toLowerCase();
        query._id = { $ne: req.params.userid }
        query.deleted = false;
        //console.log(query)
        //console.log("updateUser ", modelInfo)
        dataProviderHelper.checkForDuplicateEntry(User, query)
            .then(function(count) {
                if (count > 0) {
                    return _p.updateCIDInfoMiddlewareFunc(req, res, modelInfo, next);
                    //throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.user.alreadyExists + '"}');
                } else {
                    //console.log("updateUser", "else")
                    return _p.updateCIDInfoMiddlewareFunc(req, res, modelInfo, next);

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

    _p.updateCIDInfoMiddlewareFunc = function(req, res, modelInfo, next) {
        //console.log("payliance cid update ", modelInfo)
        req.updateCIDInfo.paylianceCID = modelInfo.paylianceCID;
        req.updateCIDInfo.updatedBy = modelInfo.admin;
        req.updateCIDInfo.updatedOn = new Date();
        return dataProviderHelper.save(req.updateCIDInfo);
    };

    _p.paylianceCreateCusObj = function(req, res, next) {

        //console.log('Auth basic for USAePAY ', authkey);

        //console.log('SOAP API hash val ', hashVal);

        //console.log('body request ', req.body)
        // req.body = JSON.parse(req.body)

        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:usaepay"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
           <SOAP-ENV:Body>
              <ns1:addCustomer>
                 <Token xsi:type="ns1:ueSecurityToken">
                    <PinHash xsi:type="ns1:ueHash">
                       <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                       <Seed xsi:type="xsd:string">${seed}</Seed>
                       <Type xsi:type="xsd:string">sha1</Type>
                    </PinHash>
                    <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                 </Token>
                 <CustomerData xsi:type="ns1:CustomerObject">
                    <BillingAddress xsi:type="ns1:Address">
                       <City xsi:type="xsd:string">${req.body.address}</City>
                       <Email xsi:type="xsd:string">${req.body.email}</Email>
                       <FirstName xsi:type="xsd:string">${req.body.firstName}</FirstName>
                       <LastName xsi:type="xsd:string">${req.body.lastName}</LastName>
                       <Phone xsi:type="xsd:string">${req.body.phoneNumber}</Phone>
                    </BillingAddress>
                 </CustomerData>
              </ns1:addCustomer>
           </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;


        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        const callback = (err, resp, body) => {
            if (err) {
                //console.log("err ", err)
                res.json({
                    success: false,
                    msg: err
                })
            }
            //console.log("resp ", resp);
            if (!err && resp.statusCode == 200) {
                //console.log('Post success ', body);
                const parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    //console.log('JSON result ', result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:addCustomerResponse']['addCustomerReturn']['_']);
                    const customerId = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:addCustomerResponse']['addCustomerReturn']['_'];
                    var paylianceCusObj = {
                        CID: customerId,
                        UID: req.body._id,
                    }
                    var newPayliance = UserModule.CreatePaylianceCusObj(paylianceCusObj);
                    var query = {};
                    query.UID = req.body._id;
                    dataProviderHelper.checkForDuplicateEntry(PaylianceCusObj, query)
                        .then(function(count) {
                            //console.log(count)
                            if (count > 0) {
                                //console.log('Customer already exists')
                                // throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');
                                res.json({
                                    success: false,
                                    message: "Customer obj already exists for the user",
                                    CID: null
                                })
                            } else {
                                return dataProviderHelper.save(newPayliance).then(function(response) {
                                    //console.log('response ', response);
                                    res.json({
                                        success: true,
                                        message: "Customer obj created successfully",
                                        CID: customerId
                                    })
                                })
                            }
                        })
                })
            } else {
                return res.json({
                    success: false,
                    message: err
                })
            }
        }

        request(options, callback);
    }

    _p.genPID = function(req, res, next) {

        //console.log('Auth basic for USAePAY ', authkey);

        //console.log('SOAP API hash val ', hashVal);

        // //console.log('body request ', req.body)
        // req.body = JSON.parse(req.body)

        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:usaepay"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
           <SOAP-ENV:Body>
              <ns1:addCustomer>
                 <Token xsi:type="ns1:ueSecurityToken">
                    <PinHash xsi:type="ns1:ueHash">
                       <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                       <Seed xsi:type="xsd:string">${seed}</Seed>
                       <Type xsi:type="xsd:string">sha1</Type>
                    </PinHash>
                    <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                 </Token>
                 <CustomerData xsi:type="ns1:CustomerObject">
                    <BillingAddress xsi:type="ns1:Address">
                       <City xsi:type="xsd:string">${req.query.address}</City>
                       <Email xsi:type="xsd:string">${req.query.email}</Email>
                       <FirstName xsi:type="xsd:string">${req.query.firstName}</FirstName>
                       <LastName xsi:type="xsd:string">${req.query.lastName}</LastName>
                       <Phone xsi:type="xsd:string">${req.query.phoneNumber}</Phone>
                    </BillingAddress>
                 </CustomerData>
              </ns1:addCustomer>
           </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;


        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        const callback = (err, resp, body) => {
            if (err) {
                //console.log("err ", err)
                res.json({
                    success: false,
                    msg: err
                })
            }
            //console.log("resp ", resp);
            if (!err && resp.statusCode == 200) {
                //console.log('Post success ', body);
                const parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    //console.log('JSON result ', result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:addCustomerResponse']['addCustomerReturn']['_']);
                    const customerId = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:addCustomerResponse']['addCustomerReturn']['_'];
                    var paylianceCusObj = {
                        CID: customerId,
                        UID: req.query._id,
                    }
                    var newPayliance = UserModule.CreatePaylianceCusObj(paylianceCusObj);
                    var query = {};
                    query.UID = req.query._id;
                    dataProviderHelper.checkForDuplicateEntry(PaylianceCusObj, query)
                        .then(function(count) {
                            //console.log(count)
                            if (count > 0) {
                                //console.log('Customer already exists')
                                // throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');
                                res.json({
                                    success: false,
                                    message: "Customer obj already exists for the user",
                                    CID: null
                                })
                            } else {
                                return dataProviderHelper.save(newPayliance).then(function(response) {
                                    //console.log('response ', response);
                                    res.json({
                                        success: true,
                                        message: "Customer obj created successfully",
                                        CID: customerId
                                    })
                                })
                            }
                        })
                })
            } else {
                return res.json({
                    success: false,
                    message: err
                })
            }
        }

        request(options, callback);
    }
    _p.batchProcessingWithCSV = function(req, res, next) {
        //console.log('inside batch processing with CSV ', req.body);
        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:ns1="urn:usaepay"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <SOAP-ENV:Body>
        <ns1:createBatchUpload>
        <Token xsi:type="ns1:ueSecurityToken">
        <ClientIP xsi:type="xsd:string">123.123.123.123</ClientIP>
        <PinHash xsi:type="ns1:ueHash">
        <HashValue xsi:type="xsd:string">ef9781f240de9c286f94cb3180f0a6516e9592f9</HashValue>
        <Seed xsi:type="xsd:string">11015516479-test</Seed>
        <Type xsi:type="xsd:string">sha1</Type>
        </PinHash>
        <SourceKey xsi:type="xsd:string">_B4P7C4K2w2ZCQQQXRqrxDj6agrS2NIT</SourceKey>
        </Token>
        <FileName xsi:type="xsd:string">war</FileName>
        <AutoStart xsi:type="xsd:boolean">true</AutoStart>
        <Format xsi:type="xsd:string">csv</Format>
        <Encoding xsi:type="xsd:string">base64</Encoding>
        <Fields SOAP-ENC:arrayType="xsd:string[6]" xsi:type="ns1:stringArray">
        <item xsi:type="xsd:string">command</item>
        <item xsi:type="xsd:string">amount</item>
        <item xsi:type="xsd:string">vcaccount</item>
        <item xsi:type="xsd:string">vcrouting</item>
        </Fields>
        <Data xsi:type="xsd:string">Ik9zY2FyIExvdW5nZSIsNDQ0NDU1NTU2NjY2Nzc3OSwwOTE5LCIxMDEwIEF2ZSBTVCIsOTAwODYsOTAK</Data>
        <OverrideDuplicates xsi:type="xsd:boolean">false</OverrideDuplicates>
        </ns1:createBatchUpload>
        </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;
    }

    _p.submitRemitRequest = function(req, res, next) {
        //console.log('req from server ', req.body);

        var paylianceRemitRequestObj = {
            AID: req.body.AID,
            CID: req.body.CID,
            UID: req.body.UID,
            type: req.body.type,
            amount: req.body.amount,
            username: req.body.username
        }
        var newPayliance = UserModule.CreatePaylianceRemitRequestObj(paylianceRemitRequestObj);
        var query = {};
        query.UID = req.body.UID;
        query.type = req.body.type;
        dataProviderHelper.checkForDuplicateEntry(PaylianceRemitRequestObj, query)
            .then(function(count) {
                //console.log(count)
                if (count > 0) {
                    res.json({
                            success: false,
                            message: "Remitance request already submitted!"
                        })
                        // throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');

                } else {
                    return dataProviderHelper.save(newPayliance).then(function(response) {
                        //console.log('response ', response);
                        res.json({
                                success: true,
                                message: "Remitance request saved successfully"
                            })
                            // return deferred.resolve(body)
                    })
                }
            })
    }

    _p.paylianceCreateACHObj = function(req, res, next) {
        //console.log('req from server ', req.body);

        // var deferred = Q.defer();
        var CID = req.body.customerId[0].CID,
            UID = req.body.userId;

        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:usaepay"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
           <SOAP-ENV:Body>
              <ns1:addCustomerPaymentMethod>
                <Token xsi:type="ns1:ueSecurityToken">
                    <PinHash xsi:type="ns1:ueHash">
                        <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                        <Seed xsi:type="xsd:string">${seed}</Seed>
                        <Type xsi:type="xsd:string">sha1</Type>
                    </PinHash>
                    <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                </Token>         
                 <CustNum xsi:type="xsd:string">${CID}</CustNum>
                 <PaymentMethod xsi:type="ns1:PaymentMethod">
                    <MethodType>ACH</MethodType>
                    <MethodName xsi:type="xsd:string">${req.body.bankName}</MethodName>
                    <RecordType>PPD</RecordType>
                    <AccountType>${req.body.ischecking}</AccountType>
                    <Account>${req.body.accountnumber}</Account>
                    <Routing>${req.body.abanumber}</Routing>
                 </PaymentMethod>
                 <MakeDefault xsi:type="xsd:boolean">${req.body.isprimary}</MakeDefault>
                 <Verify xsi:type="xsd:boolean">false</Verify>
              </ns1:addCustomerPaymentMethod>
           </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;

        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        const callback = (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                //console.log('Post success ', body);
                const parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    //console.log('JSON result ', result);
                    const ReturnedAccNum = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:addCustomerPaymentMethodResponse']['addCustomerPaymentMethodReturn']['_'];
                    //console.log('JSON result ', result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:addCustomerPaymentMethodResponse']['addCustomerPaymentMethodReturn']['_']);
                    // const customerId = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:addCustomerResponse']['addCustomerReturn']['_'];
                    var paylianceCusObj = {
                        AccountID: ReturnedAccNum,
                        CID: CID,
                        UID: UID,
                        isprimary: req.body.isprimary
                    }
                    PaylianceACHObj.updateMany({ "CID": CID }, { "defaultAccount": false }, function(err, response) {
                        if (err) {
                            //console.log('error updating ', err);
                        }
                        //console.log('response from updating false to all ach accounts ', response);
                        var newPayliance = UserModule.CreatePaylianceACHObj(paylianceCusObj);
                        var query = {};
                        query.UID = req.body._id;
                        dataProviderHelper.checkForDuplicateEntry(PaylianceACHObj, query)
                            .then(function(count) {
                                //console.log(count)
                                if (count > 0) {
                                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');

                                } else {
                                    return dataProviderHelper.save(newPayliance).then(function(response) {
                                        //console.log('response ', response);
                                        res.json({
                                                success: true,
                                                message: "Account added successfully"
                                            })
                                            // return deferred.resolve(body)
                                    })
                                }
                            })
                    });

                })
            } else {
                return res.json({
                    success: false,
                    message: err
                })
            }
        }

        request(options, callback);
    }

    _p.rejectRemitRequest = function(req, res, next) {
        //console.log('req body ', req.body);
        const query = {};
        query.UID = req.body.UID;
        query.AID = req.body.AccountId;
        query.CID = req.body.CustomerID;
        //console.log("QUERY ", { "UID": req.body.UID, "AID": req.body.AID })

        // Geeting user's email address
        let queryUser = {}
        queryUser.username = req.body.Username
        User.find(queryUser, function(err, resss) {
            if (err) {
                //console.log('error in finding user block')
            }
            if (resss.length) {
                // Sending mail to user and admin            
                emailServiceController.getMailServiceConfig()
                    .then(function(resData) {
                        if (resData) {
                            PaylianceRemitRequestObj.updateMany(query, { "type": "2" }, function(err, response) {
                                if (err) {
                                    //console.log('error updating field ', err);
                                    res.json({
                                        success: false,
                                        message: err
                                    })
                                }

                                //console.log("Request rejected successfully ", response);
                                res.json({
                                    success: true,
                                    message: "Request reject has been updated successfully"
                                })

                                _p.sendmailForRemitStatus(req, resss[0].email, "Remit Reject")
                            })

                        }
                    })
            } else {
                //console.log('Cannot find user ')
            }
        })



    }

    _p.getCustomerHistoryFromUSAePay = function(req, res, next) {
        //console.log('req from server ', req.body);
        // var amountToRemit = req.body.Amount;
        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:usaepay"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
           <SOAP-ENV:Body>
              <ns1:getCustomerHistory>
                <Token xsi:type="ns1:ueSecurityToken">
                    <PinHash xsi:type="ns1:ueHash">
                        <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                        <Seed xsi:type="xsd:string">${seed}</Seed>
                        <Type xsi:type="xsd:string">sha1</Type>
                    </PinHash>
                    <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                </Token>
                <CustomerNum xsi:type="xsd:string">93136248</CustomerNum>
              </ns1:getCustomerHistory>
           </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;

        //    <Routing xsi:type="xsd:string">${req.body.Routing}</Routing>
        //  <Amount xsi:type="xsd:double">${req.body.Amount}</Amount>

        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        const callback = (err, resp, body) => {
            //console.log('Post success ', body);
            // //console.log('resp ', resp);
            //console.log('err ', err);
            res.send(body)
        }

        request(options, callback);
    }

    _p.getSearchCustomer = function(req, res, next) {
        //console.log('req from server ', req.body);
        // var amountToRemit = req.body.Amount;
        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:usaepay"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
           <SOAP-ENV:Body>
              <ns1:searchTransactions>
                <Token xsi:type="ns1:ueSecurityToken">
                    <PinHash xsi:type="ns1:ueHash">
                        <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                        <Seed xsi:type="xsd:string">${seed}</Seed>
                        <Type xsi:type="xsd:string">sha1</Type>
                    </PinHash>
                    <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                </Token>
                <Search SOAP-ENC:arrayType="ns1:SearchParam[1]" xsi:type="ns1:SearchParamArray">
    <item xsi:type="ns1:SearchParam">
    <Field xsi:type="xsd:string">amount</Field>
    <Type xsi:type="xsd:string">eq</Type>
    <Value xsi:type="xsd:string">5.00</Value>
    </item>
    </Search>
    <MatchAll xsi:type="xsd:boolean">true</MatchAll>
    <Start xsi:type="xsd:integer">0</Start>
    <Limit xsi:type="xsd:integer">10</Limit>
    <Sort xsi:type="xsd:string">created</Sort>
    </ns1:searchTransactions>
           </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;

        //    <Routing xsi:type="xsd:string">${req.body.Routing}</Routing>
        //  <Amount xsi:type="xsd:double">${req.body.Amount}</Amount>

        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        const callback = (err, resp, body) => {
            //console.log('Post success ', body);
            // //console.log('resp ', resp);
            //console.log('err ', err);
            res.send(body)
        }

        request(options, callback);
    }

    _p.paylianceMakePaymentforExistingCustomer = function(req, res, next) {
        //console.log('req.body from accept remit', req.body)




        //console.log('req from server ', req.body);
        var amountToRemit = req.body.Amount;
        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:usaepay"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
           <SOAP-ENV:Body>
              <ns1:runCustomerTransaction>
                <Token xsi:type="ns1:ueSecurityToken">
                    <PinHash xsi:type="ns1:ueHash">
                       <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                       <Seed xsi:type="xsd:string">${seed}</Seed>
                       <Type xsi:type="xsd:string">sha1</Type>
                    </PinHash>
                    <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                 </Token>
                 <CustNum xsi:type="xsd:string">${req.body.CustomerID}</CustNum>
                <PaymentMethodID xsi:type="xsd:string">${req.body.AccountId}</PaymentMethodID>
                <Parameters xsi:type="ns1:CustomerTransactionRequest">
                    <Command xsi:type="xsd:string">checkcredit</Command>
                    <Details xsi:type="ns1:TransactionDetail">
                    <Amount xsi:type="xsd:double">${req.body.Amount}</Amount>
                    <Description xsi:type="xsd:string">${req.body.Description}</Description>
                    </Details>
                </Parameters>
              </ns1:runCustomerTransaction>
           </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;

        //    <Routing xsi:type="xsd:string">${req.body.Routing}</Routing>
        //  <Amount xsi:type="xsd:double">${req.body.Amount}</Amount>

        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        const callback = (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                //console.log('Post success ', body);
                const parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    //console.log('JSON result ', result);
                    var ReturnedPaymentRes = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:runCustomerTransactionResponse']['runCustomerTransactionReturn'];
                    //console.log('ReturnedPaymentRes ResultCode ', ReturnedPaymentRes.ResultCode);
                    if (ReturnedPaymentRes.ResultCode._ == 'A') {
                        PaylianceRemitRequestObj.updateMany({ "CID": req.body.CustomerID, "AID": req.body.AccountId }, { "type": 1 }, function(err, response) {
                            if (err) {
                                //console.log('error updating remit request ', err);
                            }
                            UserWallet.find({ "userid": req.body.UID }, function(err, userWalletInfo) {
                                if (err) {
                                    //console.log('error retreiving wallet info ', err)
                                }
                                //console.log('user wallet info =======> ', userWalletInfo)
                                const availableBalance = userWalletInfo[0].balance,
                                    deductedBalance = parseInt(availableBalance, 10) - req.body.Amount;

                                UserWallet.updateMany({ "userid": req.body.UID }, { "balance": deductedBalance }, function(err, updateResponse) {
                                    if (err) {
                                        //console.log('error updating wallet balance ', err);
                                    }
                                    //console.log('update response is ', updateResponse);

                                    // Save transaction response starts -------------------

                                    const transObj = {
                                        RefNum: ReturnedPaymentRes.RefNum ? ReturnedPaymentRes.RefNum._ : 0,
                                        TransKey: ReturnedPaymentRes.TransKey ? ReturnedPaymentRes.TransKey._ : 'none',
                                        PreviousBalance: availableBalance,
                                        ClosingBalance: deductedBalance,
                                        Amount: amountToRemit,
                                        UID: req.body.UID,
                                        Username: req.body.Username,
                                        Status: ReturnedPaymentRes.Status ? ReturnedPaymentRes.Status._ : "none",
                                        AuthCode: ReturnedPaymentRes.AuthCode ? ReturnedPaymentRes.AuthCode._ : "none",
                                        BatchNum: ReturnedPaymentRes.BatchNum ? ReturnedPaymentRes.BatchNum._ : 0,
                                        BatchRefNum: ReturnedPaymentRes.BatchRefNum ? ReturnedPaymentRes.BatchRefNum._ : 0,
                                        BatchKey: ReturnedPaymentRes.BatchKey ? ReturnedPaymentRes.BatchKey._ : "",
                                        addedOn: ReturnedPaymentRes.addedOn ? ReturnedPaymentRes.addedOn : new Date()
                                    }

                                    var newTransaction = UserModule.CreateTransactionObj(transObj);

                                    dataProviderHelper.save(newTransaction).then(saveResponse => {

                                        //console.log('saved transaction response ', saveResponse);
                                        let queryUser = {}
                                        queryUser.username = req.body.Username
                                        User.find(queryUser, function(err, resss) {
                                            if (err) {
                                                //console.log('error in finding user block')
                                            }
                                            //console.log('res.length', resss)
                                            if (resss.length) {
                                                // Sending mail to user and admin            
                                                emailServiceController.getMailServiceConfig()
                                                    .then(function(resData) {
                                                        if (resData) {

                                                            _p.sendmailForRemitStatus(req, resss[0].email, "Remit Accept")
                                                        }
                                                    })
                                            }
                                        })

                                        return res.json({
                                            success: true,
                                            message: "Transaction details submitted successfully"
                                        })
                                    })

                                    // Save transaction response ends -------------------
                                })
                            })

                        });
                    }
                    // else if(ReturnedPaymentRes.ResultCode._ == 'E'){
                    //     res.json({
                    //         success: false,
                    //         errorDescription: ReturnedPaymentRes.Error._
                    //     })
                    // }
                    else {
                        res.json({
                            success: false,
                            errorCode: ReturnedPaymentRes.ErrorCode._,
                            errorDescription: ReturnedPaymentRes.Error._
                        })
                    }

                })
            } else {
                return res.json({
                    success: false,
                    message: err
                })
            }
        }

        request(options, callback);

        // var deferred = Q.defer();
        // // // make a request to create ACH object in payliance
        // var urlToPost = "https://gatewayapi.payliance.com/api/ReceivablesProPayment/CreatePayment";
        // var CID = req.body.customerId,
        // UID = req.body.userId;

        // var dataToPost = {
        //     "Request": {
        //     "AccountId": req.body.AccountId,
        //     "Amount": req.body.Amount
        //     },
        //     "Auth": {
        //     "UserName": "APIUser153069",
        //     "SecretAccessKey": "iVq1zflOGOtWK2SIyEKuxzLRj5L2FaBGRPv0EnyKEBwUcQ1tNnOKZdC3X7E354qBnbNJ1deXBYrMjK4D87mp0FGy24y3Kf8hOxtoAXwEpHWtqv36u7v5LmPLFxaXs5c0"
        //     }
        // }    

        // return request.post({
        //     url: urlToPost,
        //     form: dataToPost
        // }, function (error, response, body) {
        //     if (error) {
        //         //console.log('ERRRRR ', error);
        //         res.json({
        //             error: error
        //         })
        //         return deferred.reject(error);
        //     }
        //     var paylianceResponse = JSON.parse(body);
        //     //console.log('payliance response for payment ', paylianceResponse);
        //     if(paylianceResponse.Success == true){

        //         // var paylianceCusObj = {
        //         //     AccountID: paylianceResponse.Response.Id,
        //         //     CID: CID,
        //         //     UID: UID,
        //         // }               
        //         var newPayliance = UserModule.CreatePayliancePaymentObj(paylianceResponse.Response);
        //         var query = {};
        //         query.Id = paylianceResponse.Response.Id;
        //         dataProviderHelper.checkForDuplicateEntry(PayliancePaymentObj, query)
        //             .then(function(count){
        //                 //console.log(count)
        //                 if(count > 0){
        //                     throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');

        //                 }else{
        //                     return dataProviderHelper.save(newPayliance).then(function(response){
        //                         //console.log('response ', response);
        //                         res.json({
        //                             success: true,
        //                             message: "Payment object created successfully"
        //                         })
        //                         // return deferred.resolve(body)
        //                     })
        //                 }
        //             })                
        //     }else{
        //         res.json({
        //             success: paylianceResponse.Success,
        //             message: paylianceResponse.Message
        //         })
        //     }
        //     return deferred.resolve(body);

        // });
    }


    _p.paylianceGetAccountDetailsByUID = function(req, res, next) {
        //console.log('req from server ', req.body);

        var deferred = Q.defer();
        // // make a request to create ACH object in payliance
        var urlToPost = "https://gatewayapi.payliance.com/api/ReceivablesProCustomer/AchAccounts";
        var CID = req.body.cid;
        //console.log('CID ----> ', CID);
        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:ns1="urn:usaepay" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <SOAP-ENV:Body>
        <ns1:getCustomerPaymentMethods>
        <Token xsi:type="ns1:ueSecurityToken">
                    <PinHash xsi:type="ns1:ueHash">
                        <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                        <Seed xsi:type="xsd:string">${seed}</Seed>
                        <Type xsi:type="xsd:string">sha1</Type>
                    </PinHash>
                    <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                </Token> 
        <CustNum xsi:type="xsd:string">${CID}</CustNum>
        </ns1:getCustomerPaymentMethods>
        </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;

        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        const callback = (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                //console.log('Post success ', body);
                const parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    //console.log('JSON result ', result);

                    const ReturnedResponse = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getCustomerPaymentMethodsResponse']['getCustomerPaymentMethodsReturn']['item'];
                    //const RetResponse = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getCustomerPaymentMethodsResponse'];
                    const RetResponse = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getCustomerPaymentMethodsResponse']['getCustomerPaymentMethodsReturn'];
                    //console.log('ret res ', RetResponse['$']['SOAP-ENC:arrayType']);

                    let responseStr = RetResponse['$']['SOAP-ENC:arrayType'].toString();

                    responseStr = responseStr.replace('ns1:PaymentMethod[', '');
                    const accountLength = parseInt(responseStr.replace(']', ''), 10);

                    //console.log("accounts length ", accountLength)

                    if (accountLength) {
                        //console.log('returned response ', ReturnedResponse);

                        res.json({
                            success: true,
                            response: ReturnedResponse
                        })
                    } else {
                        res.json({
                            success: false,
                            message: "Please add an account to remit"
                        })
                    }


                })
            } else {
                return res.json({
                    success: false,
                    message: err
                })
            }
        }

        request(options, callback);

        // return request.post({
        //     url: urlToPost,
        //     form: dataToPost
        // }, function (error, response, body) {
        //     if (error) {
        //         //console.log('ERRRRR ', error);
        //         res.json({
        //             error: error
        //         })
        //         return deferred.reject(error);
        //     }
        //     var paylianceResponse = JSON.parse(body);
        //     if(paylianceResponse.Success == true){
        //         res.json({
        //             success: true,
        //             response: paylianceResponse
        //         })                
        //     }else{
        //         res.json({
        //             success: paylianceResponse.Success,
        //             message: paylianceResponse.Message
        //         })
        //     }
        //     return deferred.resolve(body);

        // });
    }

    _p.paylianceGetDefaultAccount = function(req, res, next) {
        //console.log('req from server ', req.body);

        var deferred = Q.defer();
        // // make a request to create ACH object in payliance
        var urlToPost = "https://gatewayapi.payliance.com/api/ReceivablesProCustomer/DefaultAchAccount";
        var CID = req.body.cid;

        var dataToPost = {
            "Request": CID,
            "Auth": {
                "UserName": "APIUser153069",
                "SecretAccessKey": "iVq1zflOGOtWK2SIyEKuxzLRj5L2FaBGRPv0EnyKEBwUcQ1tNnOKZdC3X7E354qBnbNJ1deXBYrMjK4D87mp0FGy24y3Kf8hOxtoAXwEpHWtqv36u7v5LmPLFxaXs5c0"
            }
        }

        return request.post({
            url: urlToPost,
            form: dataToPost
        }, function(error, response, body) {
            if (error) {
                //console.log('ERRRRR ', error);
                res.json({
                    error: error
                })
                return deferred.reject(error);
            }
            var paylianceResponse = JSON.parse(body);
            if (paylianceResponse.Success == true) {
                res.json({
                    success: true,
                    response: paylianceResponse
                })
            } else {
                res.json({
                    success: paylianceResponse.Success,
                    message: paylianceResponse.Message
                })
            }
            return deferred.resolve(body);

        });
    }

    _p.paylianceSetDefaultAccount = function(req, res, next) {
        //console.log('req from server ', req.body);
        // // make a request to create ACH object in payliance
        var CID = req.body.cid[0].CID,
            AccountID = req.body.aid;
        const xml = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:ns1="urn:usaepay" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <SOAP-ENV:Body>
        <ns1:setDefaultPaymentMethod>
        <Token xsi:type="ns1:ueSecurityToken">
                    <PinHash xsi:type="ns1:ueHash">
                        <HashValue xsi:type="xsd:string">${hashVal}</HashValue>
                        <Seed xsi:type="xsd:string">${seed}</Seed>
                        <Type xsi:type="xsd:string">sha1</Type>
                    </PinHash>
                    <SourceKey xsi:type="xsd:string">${apikey}</SourceKey>
                </Token> 
        <CustNum xsi:type="xsd:string">${CID}</CustNum>
        <MethodID>${AccountID}</MethodID>
        </ns1:setDefaultPaymentMethod>
        </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>`;

        const options = {
            url: USAePayUrl,
            method: 'POST',
            body: xml,
            headers: {
                'Content-type': 'text/xml'
            }
        };

        const callback = (err, resp, body) => {
            if (!err && resp.statusCode == 200) {
                //console.log('Post success ', body);
                const parser = new xml2js.Parser({ explicitArray: false, trim: true });
                parser.parseString(body, (err, result) => {
                    //console.log('JSON result ', result);

                    const ReturnedResponse = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:setDefaultPaymentMethodResponse'];

                    //console.log('returned response ', ReturnedResponse);
                    PaylianceACHObj.updateMany({ "CID": CID }, { "defaultAccount": false }, function(err, response) {
                            if (err) {
                                //console.log('update many err ', err);
                            }
                            //console.log('reoooooooooo ', response);
                            if (response.ok == 1) {
                                var query = {};
                                query.CID = CID.toString();
                                query.AccountID = parseInt(AccountID, 10);
                                //console.log('query params ', query);
                                PaylianceACHObj.update(
                                    query, { defaultAccount: true },
                                    function(err, respponse) {
                                        if (err) {
                                            //console.log('error updating default ', err);
                                            return res.json({
                                                success: false,
                                                message: err
                                            })
                                        }
                                        //console.log('response updating default ', respponse);
                                        res.json({
                                            success: true,
                                            response: ReturnedResponse
                                        })
                                    }
                                )
                            }
                        })
                        // dataProviderHelper.checkForDuplicateEntry(JudgeSport, query)
                        // .then(function (count) {
                        //     //console.log(count)
                        //     if(count > 0){
                        //         throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');
                        //     }else{
                        //         //console.log("inside update")
                        //         req.mobjudgeSport.sportName=req.body.sportName;
                        //         req.mobjudgeSport.level=req.body.level;
                        // 		req.mobjudgeSport.sportid=mongoose.Types.ObjectId(req.body.sportid);
                        //         req.mobjudgeSport.levelid=mongoose.Types.ObjectId(req.body.levelid);
                        //         req.mobjudgeSport.docdescription=req.body.docdescription
                        //         req.mobjudgeSport.updatedBy=req.decoded.user.username;
                        //         req.mobjudgeSport.updatedOn=new Date();
                        // 		if(req.body.expdate){
                        // 			req.mobjudgeSport.expdate=req.body.expdate;
                        //             req.mobjudgeSport.status=req.body.status;
                        // 		}
                        //        return dataProviderHelper.save( req.mobjudgeSport) ;
                        //     } 
                        // })
                        // .then(function () {
                        //     res.status(HTTPStatus.OK);
                        //     res.json({
                        //         message: messageConfig.JudgeSport.updateMessageJudgeSport,                               
                        //     });
                        // }) 
                        // .catch(Promise.CancellationError, function (cancellationErr) {
                        //     errorHelper.customErrorResponse(res, cancellationErr, next);
                        // })
                        // .catch(function (err) {
                        //     return next(err);
                        // });                    
                })
            } else {
                return res.json({
                    success: false,
                    message: err
                })
            }
        }

        request(options, callback);
    }

    _p.setNotificationToken = function(req, res, next) {
        //console.log('req body ', req.body);
        const query = {};
        query.UID = mongoose.Types.ObjectId(req.body.UID);
        query.token = req.body.token;
        // query.token={$ne:null};
        dataProviderHelper.checkForDuplicateEntry(NotificationTokenObj, query).then(function(count) {
            if (count > 0) {
                res.json({
                    success: false,
                    message: 'Token already exists for the user'
                });
            } else {
                // one for password salt and another one for security answer salt
                // res.json({
                //     success: true,
                //     message
                // })
                const notificationToken = {
                    UID: req.body.UID,
                    token: req.body.token
                }
                const notificationModel = UserModule.CreateNotificationToken(notificationToken);
                dataProviderHelper.save(notificationModel).then(function(response) {
                    //console.log('response ', response);
                    res.json({
                        success: true,
                        message: 'Notification token saved successfully'
                    })
                })
            }
        })

    }
    _p.getCountry = function(req, res, next) {
        var query = {}
        dataProviderHelper.find(Country, query).then((response) => {
            console.log(response.length)
            if (response.length > 0) {
                res.json({
                    data: response
                })
            }
        })

    }
    _p.getStateForCountry = function(req, res, next) {
        var query = {
            country: req.params.country
        }
        dataProviderHelper.find(StateForCountry, query).then((response) => {
            if (response.length > 0) {
                res.json({
                    data: response
                })
            }
        })
    }
    _p.addcountry = function(req) {

        var countries = [{
                "name": "Alabama",
                "abbreviation": "AL"
            },
            {
                "name": "Alaska",
                "abbreviation": "AK"
            },
            {
                "name": "American Samoa",
                "abbreviation": "AS"
            },
            {
                "name": "Arizona",
                "abbreviation": "AZ"
            },
            {
                "name": "Arkansas",
                "abbreviation": "AR"
            },
            {
                "name": "California",
                "abbreviation": "CA"
            },
            {
                "name": "Colorado",
                "abbreviation": "CO"
            },
            {
                "name": "Connecticut",
                "abbreviation": "CT"
            },
            {
                "name": "Delaware",
                "abbreviation": "DE"
            },
            {
                "name": "District Of Columbia",
                "abbreviation": "DC"
            },
            {
                "name": "Federated States Of Micronesia",
                "abbreviation": "FM"
            },
            {
                "name": "Florida",
                "abbreviation": "FL"
            },
            {
                "name": "Georgia",
                "abbreviation": "GA"
            },
            {
                "name": "Guam",
                "abbreviation": "GU"
            },
            {
                "name": "Hawaii",
                "abbreviation": "HI"
            },
            {
                "name": "Idaho",
                "abbreviation": "ID"
            },
            {
                "name": "Illinois",
                "abbreviation": "IL"
            },
            {
                "name": "Indiana",
                "abbreviation": "IN"
            },
            {
                "name": "Iowa",
                "abbreviation": "IA"
            },
            {
                "name": "Kansas",
                "abbreviation": "KS"
            },
            {
                "name": "Kentucky",
                "abbreviation": "KY"
            },
            {
                "name": "Louisiana",
                "abbreviation": "LA"
            },
            {
                "name": "Maine",
                "abbreviation": "ME"
            },
            {
                "name": "Marshall Islands",
                "abbreviation": "MH"
            },
            {
                "name": "Maryland",
                "abbreviation": "MD"
            },
            {
                "name": "Massachusetts",
                "abbreviation": "MA"
            },
            {
                "name": "Michigan",
                "abbreviation": "MI"
            },
            {
                "name": "Minnesota",
                "abbreviation": "MN"
            },
            {
                "name": "Mississippi",
                "abbreviation": "MS"
            },
            {
                "name": "Missouri",
                "abbreviation": "MO"
            },
            {
                "name": "Montana",
                "abbreviation": "MT"
            },
            {
                "name": "Nebraska",
                "abbreviation": "NE"
            },
            {
                "name": "Nevada",
                "abbreviation": "NV"
            },
            {
                "name": "New Hampshire",
                "abbreviation": "NH"
            },
            {
                "name": "New Jersey",
                "abbreviation": "NJ"
            },
            {
                "name": "New Mexico",
                "abbreviation": "NM"
            },
            {
                "name": "New York",
                "abbreviation": "NY"
            },
            {
                "name": "North Carolina",
                "abbreviation": "NC"
            },
            {
                "name": "North Dakota",
                "abbreviation": "ND"
            },
            {
                "name": "Northern Mariana Islands",
                "abbreviation": "MP"
            },
            {
                "name": "Ohio",
                "abbreviation": "OH"
            },
            {
                "name": "Oklahoma",
                "abbreviation": "OK"
            },
            {
                "name": "Oregon",
                "abbreviation": "OR"
            },
            {
                "name": "Palau",
                "abbreviation": "PW"
            },
            {
                "name": "Pennsylvania",
                "abbreviation": "PA"
            },
            {
                "name": "Puerto Rico",
                "abbreviation": "PR"
            },
            {
                "name": "Rhode Island",
                "abbreviation": "RI"
            },
            {
                "name": "South Carolina",
                "abbreviation": "SC"
            },
            {
                "name": "South Dakota",
                "abbreviation": "SD"
            },
            {
                "name": "Tennessee",
                "abbreviation": "TN"
            },
            {
                "name": "Texas",
                "abbreviation": "TX"
            },
            {
                "name": "Utah",
                "abbreviation": "UT"
            },
            {
                "name": "Vermont",
                "abbreviation": "VT"
            },
            {
                "name": "Virgin Islands",
                "abbreviation": "VI"
            },
            {
                "name": "Virginia",
                "abbreviation": "VA"
            },
            {
                "name": "Washington",
                "abbreviation": "WA"
            },
            {
                "name": "West Virginia",
                "abbreviation": "WV"
            },
            {
                "name": "Wisconsin",
                "abbreviation": "WI"
            },
            {
                "name": "Wyoming",
                "abbreviation": "WY"
            }
        ]
        console.log(countries.length)

        for (var i = 0; i < countries.length; i++) {

            var newcountry = UserModule.CreateCountry(countries[i]);
            dataProviderHelper.save(newcountry)
            console.log(i)
        }


    }

    _p.notificationTokenByID = function(req) {

        //console.log("req.params.docid", req.params.UID);
        var query = {}
        query.UID = mongoose.Types.ObjectId(req.params.UID);
        return dataProviderHelper.find(NotificationTokenObj, query)

    }

    _p.updateNotificationToken = function(req, res, next) {
        //console.log("req body ", req.body);
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        // For checking duplicate entry
        var query = {};
        //query.username = modelInfo.username.toLowerCase();
        query.UID = req.params.UID
            //console.log(query)
            //console.log("update notification token ", modelInfo);
        return _p.updateNotificationTokenMiddlewareFunc(req, res, modelInfo, next);
        dataProviderHelper.checkForDuplicateEntry(NotificationTokenObj, query)
            .then(function(count) {
                if (count > 0) {
                    return _p.updateNotificationTokenMiddlewareFunc(req, res, req.body, next);
                    //throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.user.alreadyExists + '"}');
                } else {
                    //console.log("update NT", "else")
                    return _p.updateNotificationTokenMiddlewareFunc(req, res, req.body, next);

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

    _p.updateNotificationTokenMiddlewareFunc = function(req, res, modelInfo, next) {
        //console.log("payliance cid update ", modelInfo)
        req.tokenInfo.UID = mongoose.Types.ObjectId(modelInfo.UID);
        req.tokenInfo.token = modelInfo.token;
        NotificationTokenObj.updateMany({ "UID": mongoose.Types.ObjectId(modelInfo.UID) }, { "token": modelInfo.token }, function(err, response) {
                if (err) {
                    //console.log('update many err ', err);
                }
                //console.log('reoooooooooo ', response);
                if (response.ok == 1) {
                    return res.json({
                        success: true,
                        message: 'Token has been updated successfully'
                    })
                }
            })
            // return dataProviderHelper.save(req.tokenInfo);       
    };

    _p.saveUsers = function(req, res, next) {
        //console.log('req.body', req.body)
        //console.log('req.body.data', req.body.data)
        req.body = JSON.parse(req.body.data);
        const passphrase = niceware.generatePassphrase(8);
        req.body.passphrase = passphrase[0];
        //console.log('passphrase is  ', req.body.passphrase);
        // const passphraseString = passphrase.join();
        // req.body.passphrase = passphraseString.replace(/,/g, ' ');

        //console.log('user data ', req.body);
        // req.body = JSON.parse(req.body.data);
        //console.log('after Pphrase user data ', req.body);
        req.checkBody('password', messageConfig.user.validationErrMessage.password).notEmpty();
        // req.checkBody('securityQuestion', messageConfig.user.validationErrMessage.securityQuestion).notEmpty();
        // req.checkBody('securityAnswer', messageConfig.user.validationErrMessage.securityAnswer).notEmpty();

        var errors = _p.checkValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes,
                val: 0
            });
        } else {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            //console.log('model info ', modelInfo);
            // About 3 percent of users derive the password from the username
            // This is not very secure and should be disallowed
            if (modelInfo.password.trim().toLowerCase().indexOf(modelInfo.email) === -1) {

                emailServiceController.getMailServiceConfig()
                    .then(function(resData) {
                        if (resData) {
                            return _p.checkForCommonPassword(req, modelInfo.password);
                        } else {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.BAD_REQUEST + '", "message": "' + messageConfig.emailService.notFound + '"}');
                        }
                    })
                    .then(function(weakPassword) {
                        if (weakPassword) {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.BAD_REQUEST + '", "message": "' + messageConfig.user.weakPassword + '"}');

                        } else {
                            query.username = modelInfo.username.toLowerCase();
                            query.deleted = false;
                            return dataProviderHelper.checkForDuplicateEntry(User, query);
                        }
                    })
                    .then(function(count) {
                        if (count > 0) {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.user.alreadyExists + '"}');
                        } else {
                            // one for password salt and another one for security answer salt
                            return [hasher.createSalt()];
                        }
                    })
                    .spread(function(saltPassword) {
                        return [saltPassword, hasher.computeHash(req, res, modelInfo.password, saltPassword)];
                    })
                    .spread(function(saltPassword, hashPasswordData) {
                        var imageInfo = utilityHelper.getFileInfo(req, null, next);
                        var newUser = UserModule.CreateUser(modelInfo, req.decoded.user.username, imageInfo, hashPasswordData, saltPassword);
                        //console.log('PASSWORD CHECK ', newUser);
                        return [newUser, dataProviderHelper.save(newUser)];
                    })
                    // .spread(function (newUser) {
                    //     return userConfirmationTokenController.sendEmailToUser(req, newUser.email, newUser._id);
                    // })
                    .then(function(response) {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.user.saveMessage,
                            val: 1,
                            res: response
                        });
                        return join(
                            _p.sendmailToUser(req, response, next)

                        );
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
                    message: messageConfig.user.passwordEqUsername,
                    val: 0
                });
            }

        }
    };
    _p.sendmailForRemitStatus = function(req, mailId, mailName) {

        var params, paramsAdmin, rejectMsg, rejectMsgAdmin, reason
        if (req.body.reason != undefined) {
            rejectMsg = "Your Request has been rejected by the admin. Please find the reason stated by the admin below,"
            reason = req.body.reason
        } else {
            rejectMsg = "Your Request has been rejected by the admin."
            reason = ""
        }
        if (mailName == 'Remit Reject') {
            params = {
                body: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                            <title>Email</title>
                        </head>
                        <body>
                        <!--wrapper grey-->
                        <table align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                        
                            <!--spacing-->
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <!--First  table section with logo-->
                            <tr>
                                <td align="center" valign="top">
                                    <table width="600">
                                        <tbody>
                        
                                        <tr>
                                            <td align="center" valign="top">
                                                <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0"
                                                       style="overflow:hidden!important; border-radius:3px" width="600">
                                                    <tbody>
                                                    <tr style="
                            background: #be1e2d; line-height: 3.5">
                                                        <td   style="padding:20px !important ;width: 100%; padding:1px 5px 5px 32px;">
                                                            <a href="https://flyp10.com/assets/admin/img/logo-light.png">
                                                            <img style="width:80px;display:block !important;margin:0 auto"
                                                                    src="https://flyp10.com/assets/admin/img/logo-light.png"
                                                                    title="Flyp10 Logo"></a>
                                                        </td>
                        
                                                        <td align="Left" valign="top">
                                                           
                        
                                                        </td>
                                                    </tr>
                        
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                        
                                        </tbody>
                                    </table>
                        
                                    <!--Separate table for header and content-->
                                    <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="600">
                                        <tbody>
                                        <tr>
                                            <td align="center">
                                                <table width="85%">
                                                    <tbody>
                                                    <!--Content header Intro header-->
                                                    <tr>
                                                        <td align="left">
                                                            <h2 style="font-family:Arial;font-style:normal;font-weight:bold;line-height:30px;font-size:24px;color:#333333;">
                                                                Your Remit Request is Rejected!</h2>
                                                        </td>
                                                    </tr>
                        
                                                    <!--para 1-->
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           ${rejectMsg}
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           ${reason}
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                        
                                                    <!--para 2-->
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                        
                        
                                                    </tbody>
                        
                                                </table>
                        
                        
                                            </td>
                        
                                        </tr>
                        
                        
                                        </tbody>
                                    </table>
                        
                                </td> <!--first table section td ending-->
                        
                        
                                <!--outer spacing-->
                            </tr>
                          
                            <!--Second  table section with image-->
                        
                            </tbody>
                        </table> <!-- - main tabel grey bg-->
                        </body>
                        </html>`
            }
            paramsAdmin = {
                body: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                            <title>Email</title>
                        </head>
                        <body>
                        <!--wrapper grey-->
                        <table align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                        
                            <!--spacing-->
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <!--First  table section with logo-->
                            <tr>
                                <td align="center" valign="top">
                                    <table width="600">
                                        <tbody>
                        
                                        <tr>
                                            <td align="center" valign="top">
                                                <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0"
                                                       style="overflow:hidden!important; border-radius:3px" width="600">
                                                    <tbody>
                                                    <tr style="
                            background:#be1e2d; line-height: 3.5">
                                                        <td   style="padding:20px !important ;width: 100%; padding:1px 5px 5px 32px;">
                                                            <a href="https://flyp10.com/assets/admin/img/logo-light.png">
                                                            <img style="width:80px;display:block !important;margin:0 auto"
                                                                    src="https://flyp10.com/assets/admin/img/logo-light.png"
                                                                    title="Flyp10 Logo"></a>
                                                        </td>
                        
                                                        <td align="Left" valign="top">
                                                           
                        
                                                        </td>
                                                    </tr>
                        
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                        
                                        </tbody>
                                    </table>
                        
                                    <!--Separate table for header and content-->
                                    <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="600">
                                        <tbody>
                                        <tr>
                                            <td align="center">
                                                <table width="85%">
                                                    <tbody>
                                                    <!--Content header Intro header-->
                                                    <tr>
                                                        <td align="left">
                                                            <h2 style="font-family:Arial;font-style:normal;font-weight:bold;line-height:30px;font-size:24px;color:#333333;">
                                                                You've Rejected a Remit Request!</h2>
                                                        </td>
                                                    </tr>
                        
                                                    <!--para 1-->
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           You've Rejected a remit request for "${req.body.Username} due to the following reason".
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                        
                                                    <!--para 2-->
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           ${reason}
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                        
                        
                                                    </tbody>
                        
                                                </table>
                        
                        
                                            </td>
                        
                                        </tr>
                        
                        
                                        </tbody>
                                    </table>
                        
                                </td> <!--first table section td ending-->
                        
                        
                                <!--outer spacing-->
                            </tr>
                          
                            <!--Second  table section with image-->
                        
                            </tbody>
                        </table> <!-- - main tabel grey bg-->
                        </body>
                        </html>`
            }
        } else {
            params = {
                body: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                            <title>Email</title>
                        </head>
                        <body>
                        <!--wrapper grey-->
                        <table align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                        
                            <!--spacing-->
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <!--First  table section with logo-->
                            <tr>
                                <td align="center" valign="top">
                                    <table width="600">
                                        <tbody>
                        
                                        <tr>
                                            <td align="center" valign="top">
                                                <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0"
                                                       style="overflow:hidden!important; border-radius:3px" width="600">
                                                    <tbody>
                                                    <tr style="
                            background: #3f52b5; line-height: 3.5">
                                                        <td   style="padding:20px !important ;width: 100%; padding:1px 5px 5px 32px;">
                                                            <a href="https://flyp10.com/assets/admin/img/logo-light.png">
                                                            <img style="width:80px;display:block !important;margin:0 auto"
                                                                    src="https://flyp10.com/assets/admin/img/logo-light.png"
                                                                    title="Flyp10 Logo"></a>
                                                        </td>
                        
                                                        <td align="Left" valign="top">
                                                           
                        
                                                        </td>
                                                    </tr>
                        
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                        
                                        </tbody>
                                    </table>
                        
                                    <!--Separate table for header and content-->
                                    <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="600">
                                        <tbody>
                                        <tr>
                                            <td align="center">
                                                <table width="85%">
                                                    <tbody>
                                                    <!--Content header Intro header-->
                                                    <tr>
                                                        <td align="left">
                                                            <h2 style="font-family:Arial;font-style:normal;font-weight:bold;line-height:30px;font-size:24px;color:#333333;">
                                                                Your Remit Request is Accepted!</h2>
                                                        </td>
                                                    </tr>
                        
                                                    <!--para 1-->
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           Your Remit Request is accepted by the admin.
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                        
                                                    <!--para 2-->
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                        
                        
                                                    </tbody>
                        
                                                </table>
                        
                        
                                            </td>
                        
                                        </tr>
                        
                        
                                        </tbody>
                                    </table>
                        
                                </td> <!--first table section td ending-->
                        
                        
                                <!--outer spacing-->
                            </tr>
                          
                            <!--Second  table section with image-->
                        
                            </tbody>
                        </table> <!-- - main tabel grey bg-->
                        </body>
                        </html>`
            }
            paramsAdmin = {
                body: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                            <title>Email</title>
                        </head>
                        <body>
                        <!--wrapper grey-->
                        <table align="center" bgcolor="#EAECED" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                        
                            <!--spacing-->
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                            </tr>
                            <!--First  table section with logo-->
                            <tr>
                                <td align="center" valign="top">
                                    <table width="600">
                                        <tbody>
                        
                                        <tr>
                                            <td align="center" valign="top">
                                                <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0"
                                                       style="overflow:hidden!important; border-radius:3px" width="600">
                                                    <tbody>
                                                    <tr style="
                            background: #3f52b5; line-height: 3.5">
                                                        <td   style="padding:20px !important ;width: 100%; padding:1px 5px 5px 32px;">
                                                            <a href="https://flyp10.com/assets/admin/img/logo-light.png">
                                                            <img style="width:80px;display:block !important;margin:0 auto"
                                                                    src="https://flyp10.com/assets/admin/img/logo-light.png"
                                                                    title="Flyp10 Logo"></a>
                                                        </td>
                        
                                                        <td align="Left" valign="top">
                                                           
                        
                                                        </td>
                                                    </tr>
                        
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                        
                                        </tbody>
                                    </table>
                        
                                    <!--Separate table for header and content-->
                                    <table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" width="600">
                                        <tbody>
                                        <tr>
                                            <td align="center">
                                                <table width="85%">
                                                    <tbody>
                                                    <!--Content header Intro header-->
                                                    <tr>
                                                        <td align="left">
                                                            <h2 style="font-family:Arial;font-style:normal;font-weight:bold;line-height:30px;font-size:24px;color:#333333;">
                                                                You've Accepted a Remit Request!</h2>
                                                        </td>
                                                    </tr>
                        
                                                    <!--para 1-->
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           You've Accepted a Remit Request for "${req.body.Username}".
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                        
                                                    <!--para 2-->
                                                    <tr>
                                                        <td align="left"
                                                            style="font-family:Arial;font-style:normal;font-weight:normal;line-height:22px;font-size:14px;color:#333333;">
                                                           
                                                        </td>
                                                    </tr>
                                                    <!--spacing-->
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                    </tr>
                        
                        
                                                    </tbody>
                        
                                                </table>
                        
                        
                                            </td>
                        
                                        </tr>
                        
                        
                                        </tbody>
                                    </table>
                        
                                </td> <!--first table section td ending-->
                        
                        
                                <!--outer spacing-->
                            </tr>
                          
                            <!--Second  table section with image-->
                        
                            </tbody>
                        </table> <!-- - main tabel grey bg-->
                        </body>
                        </html>`
            }


        }
        //console.log('from accept block')

        mailController.sendMailWithParams(req, mailId, mailName, params);
        mailController.sendMailToAdmin(req, mailId, mailName, paramsAdmin);

    }
    _p.sendmailToUser = function(req, response, next) {
        if (response) {
            if (response.length > 0) {
                //console.log(response);
                var params = {
                    username: response[0].firstName + " " + response[0].lastName,
                    link: "https://flyp10.com/activation/" + response[0]._id
                }
                mailController.sendMailWithParams(req, response[0].email, 'User Activation', params, next);
            }
        }

    }
    _p.updateUser = function(req, res, next) {
        req.body = JSON.parse(req.body.data);
        //console.log('reques tbofy ', req.body);

        var errors = _p.checkValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);


            // For checking duplicate entry
            var query = {};
            query.username = modelInfo.username.toLowerCase();
            query._id = { $ne: req.params.userId }
            query.deleted = false;
            //  //console.log(query)
            dataProviderHelper.checkForDuplicateEntry(User, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.user.alreadyExists + '"}');
                    } else {
                        if (modelInfo.username !== applicationConfig.user.defaultUsername) {
                            return _p.updateUserMiddlewareFunc(req, res, modelInfo, next);
                        } else {
                            res.status(HTTPStatus.METHOD_NOT_ALLOWED);
                            res.json({
                                message: messageConfig.user.superAdminUpdateMessage
                            });
                        }
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
    };
    _p.updateJudgeSport = function(req, res, next) {
        req.body = JSON.parse(req.body.data);

        var errors = _p.checkJudgeValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);


            // For checking duplicate entry
            var query = {};

            query._id = { $ne: req.params.docid }
            query.levelid = mongoose.Types.ObjectId(modelInfo.levelid);
            query.sportid = mongoose.Types.ObjectId(modelInfo.sportid);
            query.userid = mongoose.Types.ObjectId(modelInfo.userid);
            query.uploadingfor = modelInfo.uploadingfor;
            query.deleted = false;
            //  //console.log(query)
            dataProviderHelper.checkForDuplicateEntry(JudgeSport, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.JudgeSport.alreadyExistsJudgeSport + '"}');
                    } else {
                        return _p.updateUserSportMiddlewareFunc(req, res, modelInfo, next);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.JudgeSport.updateMessageJudgeSport
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
    _p.updateUserSportMiddlewareFunc = function(req, res, modelInfo, next) {
        var documentinfo = utilityHelper.getFileInfo(req, req.judgeSport, next);
        req.judgeSport.username = modelInfo.username;
        req.judgeSport.sportName = modelInfo.sportName;
        req.judgeSport.level = modelInfo.level;
        req.judgeSport.levelid = mongoose.Types.ObjectId(modelInfo.levelid);
        req.judgeSport.sportid = mongoose.Types.ObjectId(modelInfo.sportid);
        req.judgeSport.userid = mongoose.Types.ObjectId(modelInfo.userid);
        req.judgeSport.active = modelInfo.active;
        req.judgeSport.docName = documentinfo._documentName;
        req.judgeSport.docdescription = modelInfo.docdescription;
        req.judgeSport.originalfilename = modelInfo.sportdocname;
        req.judgeSport.docProperties = {
            docExtension: documentinfo._documentMimeType,
            docPath: documentinfo._documentPath
        };
        req.judgeSport.updatedBy = req.decoded.user.username;;
        req.judgeSport.updatedOn = new Date();

        return dataProviderHelper.save(req.judgeSport);
    };

    _p.updateUserMiddlewareFunc = function(req, res, modelInfo, next) {
        var imageInfo = utilityHelper.getFileInfo(req, req.user, next);
        //console.log(imageInfo)
        //console.log(modelInfo.alwaysSharedRoutine, "sdsd")
        req.user.firstName = modelInfo.firstName;
        req.user.lastName = modelInfo.lastName;
        req.user.email = modelInfo.email;
        req.user.alwaysSharedRoutine = modelInfo.alwaysSharedRoutine ? modelInfo.alwaysSharedRoutine : 'N';
        req.user.country = modelInfo.country ? modelInfo.country : 'United States';
        req.user.EligibleJudgeForMyFlyp10Routine = modelInfo.EligibleJudgeForMyFlyp10Routine ? modelInfo.EligibleJudgeForMyFlyp10Routine : false;
        req.user.username = modelInfo.username;
        req.user.phoneNumber = modelInfo.phoneNumber;
        req.user.passphrase = modelInfo.passphrase ? modelInfo.passphrase.toLowerCase() : modelInfo.passphrase;
        req.user.dob = modelInfo.dob;
        req.user.active = modelInfo.active;
        req.user.address = modelInfo.address;
        req.user.userRole = modelInfo.userRole;
        req.user.updatedBy = req.decoded.user.username;
        req.user.updatedOn = new Date();
        req.user.imageName = imageInfo._imageName;
        req.user.imageProperties.imageExtension = imageInfo._imageExtension;
        req.user.imageProperties.imagePath = imageInfo._imagePath;
        return dataProviderHelper.save(req.user);
    };

    _p.checkForCommonPassword = function(req, inputPwd) {
        var dictionaryList = {};
        var exists = true;
        var passwordConfigFilePath = req.app.get('rootDir') + '/lib/list/10k_most_common.txt';

        //Check for most common passwords
        return new Promise(function(resolve, reject) {
            fs.readFile(passwordConfigFilePath, 'utf8', function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    data = data.split('\n');
                    data.forEach(function(password) {
                        dictionaryList[password] = true;
                    });
                    //Check if the inputted password is marked as weak password in the file or not, if not then exists bit set to false
                    if (!dictionaryList[inputPwd]) {
                        exists = false;
                    }
                    resolve(exists);
                }
            });

        });
    };

    _p.verifySecurityAnswer = function(req, res, next) {
        req.checkBody('username', messageConfig.user.validationErrMessage.email).notEmpty();
        // req.checkBody('email', messageConfig.user.validationErrMessage.email).notEmpty();
        // req.checkBody('securityQuestion', messageConfig.user.validationErrMessage.securityQuestion).notEmpty();
        // req.checkBody('securityAnswer', messageConfig.user.validationErrMessage.securityAnswer).notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {
            var query = {};
            query.username = req.body.username.trim().toLowerCase();
            query.deleted = false;
            //   query.securityQuestion = req.body.securityQuestion;
            var sensitiveUserFields = '_id email username firstName lastName userConfirmed securityQuestion securityAnswer securityAnswerSalt blocked active';


            return new Promise(function(resolve, reject) {
                dataProviderHelper.findOne(User, query, sensitiveUserFields)
                    .then(function(userObj) {
                        if (userObj) {
                            if (userObj.active) {
                                if (!userObj.blocked) {
                                    return [userObj, req.body.username];
                                    //return [userObj, hasher.computeHash(req, res, req.body.securityAnswer, userObj.securityAnswerSalt)];
                                } else {
                                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.UNAUTHORIZED + '", "message": "' + messageConfig.login.blockMessage + '"}');
                                }
                            } else {
                                throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.UNAUTHORIZED + '", "message": "' + messageConfig.login.accountNotConfirmed + '"}');
                            }

                        } else {
                            //console.log("hi", userObj)
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.UNAUTHORIZED + '", "message": "' + messageConfig.user.notAuthorizedForSecurityAnswerUpdate + '"}');
                        }
                    })
                    .spread(function(userObj, username) {
                        if (username.trim().toLowerCase() === userObj.username.trim().toLowerCase()) {
                            return passwordChangeVerifyController.sendEmailToConfirmPasswordChangeAction(req, userObj.email, userObj._id, userObj, next);
                            return true;

                        } else {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.UNAUTHORIZED + '", "message": "' + messageConfig.user.notAuthorizedForSecurityAnswerUpdate + '"}');
                        }
                    })
                    .then(function(data) {
                        resolve(data);
                    })
                    .catch(Promise.CancellationError, function(cancellationErr) {
                        errorHelper.customErrorResponse(res, cancellationErr, next);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            });
        }
    };

    _p.verifyTwoFactorAuthentication = function(dataObj, userId) {
        var updateOpts = {
            twoFactorAuthEnabled: dataObj.twoFactorAuthEnabled,
            twoFactorAuthSharedSecret: dataObj.twoFactorAuthSharedSecret
        };
        var queryOpts = { _id: userId };
        var multiOpts = false;

        return dataProviderHelper.updateModelData(User, queryOpts, updateOpts, multiOpts);
    };

    _p.disableTwoFactorAuthentication = function(req, res, next) {
        var _userId = '';
        if (req.params) {
            _userId = req.params.userId;
        }
        var updateOpts = {
            twoFactorAuthEnabled: false,
            twoFactorAuthSharedSecret: ""
        };
        var queryOpts = { _id: _userId };
        var multiOpts = false;

        return dataProviderHelper.updateModelData(User, queryOpts, updateOpts, multiOpts)
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.twoFactorAuthentication.disabled
                });
            })
            .catch(function(err) {
                return next(err);

            });
    };

    _p.blockUser = function(_userId) {
        var queryOpts = {
            _id: _userId
        };
        var updateOpts = {
            blocked: true,
            blockedOn: new Date()
        };
        var multiOpts = false;

        return dataProviderHelper.updateModelData(User, queryOpts, updateOpts, multiOpts);
    };

    _p.findUserInfoByUserName = function(username) {
        var query = {};
        query.username = username;
        query.deleted = false;
        //console.log("inside ")
        return dataProviderHelper.findOne(User, query, '');
    };
    _p.removeNotificationToken = function(req, res, next) {
        var query = {
            UID: mongoose.Types.ObjectId(req.body.UID),
            token: req.body.Token
        };
        //console.log(query)
        return dataProviderHelper.removeModelData(NotificationTokenObj, query)


    }
    _p.resendActivation = function(req, res, next) {
        //console.log(req.body)
        var query = {
            username: req.body.username,
            deleted: false
        };
        dataProviderHelper.find(User, query)
            .then(function(userObj) {

                if (userObj) {
                    if (userObj.length > 0) {
                        //console.log(userObj[0]);

                        res.status(HTTPStatus.OK);
                        res.json({
                            success: true,
                        });
                        return join(
                            _p.sendmailToUser(req, userObj, next)

                        );
                    } else {
                        return res.send({ success: false })
                    }
                } else {
                    return res.send({ success: false })
                }


            }).catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })



    }

    _p.downloadJudgeSportdoc = function(req, res, next) {

        var fileName1 = req.params.filename; // file name 
        var documentFilePath = '/mnt/volume_sfo2_01/public/uploads/judges/documents/' + fileName1
            //console.log("getJudgesSportdoc", documentFilePath)

        res.download(documentFilePath);
        // var file = documentFilePath;
        // var filename = path.basename(file);
        // var mimetype = mime.lookup(file);
        // res.set('Content-disposition', 'attachment; filename=' + filename);
        // //console.log('mimetype', filename,documentFilePath);
        // res.set('Content-type', mimetype);
        // var filestream = fs.createReadStream(file);
        // filestream.pipe(res);


    }
    _p.updateExpiredStatus = function(req, res, next) {
        var query = {};
        query.deleted = false;
        dataProviderHelper.find(JudgeSport, query)
            .then(function(judgeSport) {
                //console.log(judgeSport.length)
                for (var i = 0; i < judgeSport.length; i++) {
                    var expdate = judgeSport[i].expdate;
                    if (expdate) {
                        expdate = new Date(expdate);
                        //console.log(expdate)
                        var formatDate = expdate.getFullYear() + '-' + addZ(expdate.getMonth() + 1) + '-' + addZ(expdate.getDate());
                        var ExpiredDate = new Date(formatDate);
                        var date = new Date()
                        var formatDate1 = date.getFullYear() + '-' + addZ(date.getMonth() + 1) + '-' + addZ(date.getDate());
                        var currentDate = new Date(formatDate1);
                        //console.log(ExpiredDate, currentDate)
                        if (ExpiredDate.getTime() <= currentDate.getTime()) {
                            //console.log('condition true', ExpiredDate, currentDate)
                            var query = {}
                            query.expdate = judgeSport[i].expdate;
                            //console.log('Exdate', query.expdate)

                            JudgeSport.update(
                                query, { status: '3' },
                                function(err, respponse) {
                                    if (err) {
                                        //console.log('error updating default ', err);
                                        return res.json({
                                            success: false,
                                            message: err
                                        })

                                    }
                                })


                        }



                    }
                }
            })
    }
    _p.getAllCollections = function(req) {
        var collection = collectionConfig.getCollections;
        //console.log(collection)
        return collection;
    }

    _p.getCollection = function(req) {
        var query = {};
        var modelname = req.query.name;
        //console.log(modelname)
        var collection = collectionConfig.getCollections;
        //console.log(collection)
        var c = collection.find((c) => c.name == modelname);
        //console.log(c.model);
        var Schema = mongoose.Schema;
        return dataProviderHelper.find(mongoose.model(modelname, new Schema({}), modelname), query, '');
    }

    _p.getHTML = function(req) {
        var queryOption = {};

        queryOption = {
            htmlContentTitle: req.params.page,
            active: true
        };
        var documentFields = '_id htmlContentTitle htmlModuleContent active addedOn';
        return dataProviderHelper.findOne(HtmlModuleContent, queryOption, documentFields);
    };
    _p.getCreditCardLogfile = function(req) {
        var filepath = req.app.get('rootDir') + '/lib/configs/creditcardauthlogfile.txt'
        var data = fileOperations.readFile(filepath)

        return data;

    }
    _p.getUsrdetailsbyusername = function(req) {
        var query = {};
        query.username = req.params.name;
        query.deleted = false;
        return dataProviderHelper.find(User, query);
    };
    _p.getAppversion = function(req, res, next) {
        var query = {};

        dataProviderHelper.find(AppVersion, query).then((response) => {
            res.json(response)
        });
    }
    return {
        getUsers: _p.getUsers,
        getUsersForSanction: _p.getUsersForSanction,
        getAllUsers: _p.getAllUsers,
        getUserByID: _p.getUserByID,
        patchUserInformation: _p.patchUserInformation,
        saveUsers: _p.saveUsers,
        creditCardAuth: _p.creditCardAuth,
        userSignUp: _p.userSignUp,
        addSignUpuserSport: _p.addSignUpuserSport,
        updateUser: _p.updateUser,
        verifySecurityAnswer: _p.verifySecurityAnswer,
        verifyTwoFactorAuthentication: _p.verifyTwoFactorAuthentication,
        disableTwoFactorAuthentication: _p.disableTwoFactorAuthentication,
        blockUser: _p.blockUser,
        findUserInfoByUserName: _p.findUserInfoByUserName,
        implementForgotPasswordAction: _p.implementForgotPasswordAction,
        saveJudgeSport: _p.saveJudgeSport,
        getjudgeSportByname: _p.getjudgeSportByname,
        getUserSportInfoForEventMeetSport: _p.getUserSportInfoForEventMeetSport,
        downloadJudgeSportdoc: _p.downloadJudgeSportdoc,
        patchJudgeSport: _p.patchJudgeSport,
        patchmobJudgeSport: _p.patchmobJudgeSport,
        getjudgeSportByid: _p.getjudgeSportByid,
        updateJudgeSport: _p.updateJudgeSport,
        updateExpiredStatus: _p.updateExpiredStatus,
        getAllVerifiedjudges: _p.getAllVerifiedjudges,
        getAllUnverifiedjudges: _p.getAllUnverifiedjudges,
        getAllExpiredjudges: _p.getAllExpiredjudges,
        getAllRejectedjudges: _p.getAllRejectedjudges,
        getHTML: _p.getHTML,
        getToken: _p.getToken,
        getSignupuserdetails: _p.getSignupuserdetails,
        Makepayment: _p.Makepayment,
        paylianceCreateCusObj: _p.paylianceCreateCusObj,
        getPaylianceCIDByUID: _p.getPaylianceCIDByUID,
        paylianceCreateACHObj: _p.paylianceCreateACHObj,
        paylianceGetAccountDetailsByUID: _p.paylianceGetAccountDetailsByUID,
        paylianceSetDefaultAccount: _p.paylianceSetDefaultAccount,
        paylianceMakePaymentforExistingCustomer: _p.paylianceMakePaymentforExistingCustomer,
        paylianceGetDefaultAccount: _p.paylianceGetDefaultAccount,
        submitRemitRequest: _p.submitRemitRequest,
        getRemitRequestByUID: _p.getRemitRequestByUID,
        getRemitRequests: _p.getRemitRequests,
        updateCIDInfo: _p.updateCIDInfo,
        getUsrdetailsbyusername: _p.getUsrdetailsbyusername,
        getuserInfo: _p.getuserInfo,
        createCSVforACH: _p.createCSVforACH,
        batchProcessingWithCSV: _p.batchProcessingWithCSV,
        remitHistoryById: _p.remitHistoryById,
        remittanceHistory: _p.remittanceHistory,
        rejectRemitRequest: _p.rejectRemitRequest,
        setNotificationToken: _p.setNotificationToken,
        notificationTokenByID: _p.notificationTokenByID,
        updateNotificationToken: _p.updateNotificationToken,
        removeNotificationToken: _p.removeNotificationToken,
        resendActivation: _p.resendActivation,
        genPID: _p.genPID,
        getCustomerHistoryFromUSAePay: _p.getCustomerHistoryFromUSAePay,
        getSearchCustomer: _p.getSearchCustomer,
        sendmailForRemitStatus: _p.sendmailForRemitStatus,
        MakeMCCTokenpayment: _p.MakeMCCTokenpayment,
        getAllCompetitor: _p.getAllCompetitor,
        getAllCompetitorForMap: _p.getAllCompetitorForMap,
        getAllCollections: _p.getAllCollections,
        getCollection: _p.getCollection,
        postCaptcha: _p.postCaptcha,
        getCreditCardLogfile: _p.getCreditCardLogfile,
        getAppversion: _p.getAppversion,
        getCountry: _p.getCountry,
        getStateForCountry: _p.getStateForCountry,
        getUserByIDWithUSAGID: _p.getUserByIDWithUSAGID

    };

})();

module.exports = userController;