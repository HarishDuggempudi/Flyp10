var userRoutes = (function() {

    'use strict';

    var HTTPStatus = require('http-status'),
        express = require('express'),
        tokenAuthMiddleware = require('../middlewares/token.authentication.middleware'),
        roleAuthMiddleware = require('../middlewares/role.authorization.middleware'),
        messageConfig = require('../configs/api.message.config'),
        userController = require('../controllers/user.server.controller'),
        collectionController = require('../controllers/collection.server.controller'),
        imageFilePath = '/mnt/volume_sfo2_01/public/uploads/images/users/',
        uploadPrefix = 'user',
        documentFilePath = '/mnt/volume_sfo2_01/public/uploads/judges/documents/',
        uploaddocPrefix = 'Judge-Sportdoc',
        docfileUploadHelper = require('../helpers/file.upload.helper')('', documentFilePath, uploaddocPrefix),
        documentUploader = docfileUploadHelper.documentUploader,
        fileUploadHelper = require('../helpers/file.upload.helper')(imageFilePath, '', uploadPrefix),
        uploader = fileUploadHelper.uploader,
        usaGYMcontroller = require('../controllers/usa-gym.server.controller'),
        VersionModel = require('../models/version.model.js'),
        userRouter = express.Router();
    // promise = require('core-js/modules/es.promise'), 
    // includes = require('core-js/modules/es.string.includes'), 
    // assign = require('core-js/modules/es.object.assign'), 
    // keys = require('core-js/modules/es.object.keys'), 
    // symbol = require('core-js/modules/es.symbol'),
    // iterator = require('core-js/modules/es.symbol.async-iterator'),
    //  regenerator = require('regenerator-runtime/runtime')
    userRouter.route('/user/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getUsers)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('avatar'), fileUploadHelper.imageUpload, userController.saveUsers);
    userRouter.route('/userForSanction/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getUsersForSanction)

    userRouter.route('/getAllCompetitor/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllCompetitor)


    userRouter.route('/country/')
        .get(userController.getCountry)
    userRouter.route('/getStateForCountry/:country')
        .get(userController.getStateForCountry)

    userRouter.route('/getAllCompetitorForMap/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllCompetitorForMap)

    userRouter.route('/users/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllUsers)

    userRouter.route('/getAppversion/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.getAppversion)

    userRouter.route('/remittanceHistory/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, remittanceHistory)

    userRouter.route('/paylianceCreateCustomer/')
        // .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllUsers)
        .post(userController.paylianceCreateCusObj);

    userRouter.route('/paylianceCreateACH/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.paylianceCreateACHObj);

    // userRouter.route('/remitHistoryById/')
    // .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.remitHistoryById);

    userRouter.route('/createCSVforACH/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.createCSVforACH);

    userRouter.route('/paylianceGetAccountDetailsByUID/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.paylianceGetAccountDetailsByUID);

    userRouter.route('/getCustomerHistoryFromUSAePay/')
        .post(userController.getCustomerHistoryFromUSAePay);

    userRouter.route('/getSearchCustomer/')
        .post(userController.getSearchCustomer);

    // incomplete route and controller function
    userRouter.route('/paylianceMakePaymentforExistingCustomer/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.paylianceMakePaymentforExistingCustomer);

    // Get payliance customers default bank account
    userRouter.route('/paylianceGetDefaultAccount/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.paylianceGetDefaultAccount);

    // submit payliance remitance request
    userRouter.route('/submitRemitRequest/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.submitRemitRequest);

    // submit payliance remitance request
    userRouter.route('/rejectRemitRequest/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.rejectRemitRequest);

    userRouter.route('/batchProcessingWithCSV/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, documentUploader.single('documentName'), userController.batchProcessingWithCSV);

    userRouter.route('/paylianceSetDefaultAccount')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.paylianceSetDefaultAccount);

    userRouter.route('/setNotificationToken')
        .post(userController.setNotificationToken);

    // userRouter.route('/setNotificationToken/:UID')

    userRouter.use('/notificationTokenByID/:UID', function(req, res, next) {
        userController.notificationTokenByID(req)
            .then(function(tokenInfo) {
                //console.log("PCID >>>>>>>>> ",tokenInfo)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (tokenInfo) {
                    req.tokenInfo = tokenInfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: "No notification token found for the user"
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    })
    userRouter.route('/notificationTokenByID/:UID')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.tokenInfo);
        })
        .put(userController.updateNotificationToken);

    userRouter.route('/removetoken')

    .post(userController.removeNotificationToken);

    userRouter.route('/resendActivation')

    .post(userController.resendActivation);


    userRouter.use('/remitHistoryById/:uid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        userController.remitHistoryById(req)
            .then(function(transactionInfo) {
                //console.log("PCID >>>>>>>>> ",transactionInfo)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (transactionInfo) {
                    req.transactionInfo = transactionInfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: "No Payliance object found for the user"
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    userRouter.route('/remitHistoryById/:uid')
        .get(function(req, res) {
            //console.log("transactionInfo ", req.transactionInfo);
            res.status(HTTPStatus.OK);
            res.json(req.transactionInfo);
        })

    userRouter.use('/getPaylianceCID/:uid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        userController.getPaylianceCIDByUID(req)
            .then(function(paylianceInfo) {
                //console.log("PCID >>>>>>>>> ",paylianceInfo)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (paylianceInfo) {
                    req.paylianceInfo = paylianceInfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: "No Payliance object found for the user"
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    userRouter.route('/getPaylianceCID/:uid')
        .get(function(req, res) {
            //console.log("paylianceInfo ", req.paylianceInfo);
            res.status(HTTPStatus.OK);
            res.json(req.paylianceInfo);
        })

    userRouter.route('/getRemitRequests/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getRemitRequests)

    userRouter.use('/getRemitRequestByUID/:uid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        userController.getRemitRequestByUID(req)
            .then(function(remitInfo) {
                //console.log("PCID >>>>>>>>> ",remitInfo)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (remitInfo) {
                    req.remitInfo = remitInfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: "No Payliance object found for the user"
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    userRouter.route('/getRemitRequestByUID/:uid')
        .get(function(req, res) {
            //console.log("paylianceInfo ", req.remitInfo);
            res.status(HTTPStatus.OK);
            res.json(req.remitInfo);
        })
    userRouter.route('/postCaptcha')
        .post(userController.postCaptcha)
    userRouter.route('/getCollection')
        .get(getCollection);
    userRouter.route('/getCollectionDataAndKeys')
        .get(getCollectionDataAndKeys)

    userRouter.route('/exportCollection')
        .post(collectionController.exportCollection);

    userRouter.route('/getAllCollections')
        .get(getAllCollections)

    function getCollectionDataAndKeys(req, res, next) {
        collectionController.getCollection(req)
            .then(function(collections) {

                var collectiondata = collections;
                var modelname = req.query.name;
                if (collectiondata.length > 0) {
                    collectionController.getCollectionKeys(req).then(function(collectionKeys) {
                            var collectionkeys = collectionKeys[0].keys;
                            if (req.query.name == 'USAG-Members') {
                                collectionkeys = ['Email', 'Flyp10UserID', 'MemberID', '_id']
                            }

                            if (collectionkeys.length > 0) {
                                res.status(HTTPStatus.OK);
                                res.json({
                                    success: true,
                                    data: collectiondata,
                                    key: collectionkeys
                                });
                            } else {
                                res.status(HTTPStatus.NOT_FOUND);
                                res.json({
                                    message: messageConfig.user.notFound
                                });
                            }

                        })
                        .catch(function(err) {
                            return next(err);
                        });
                }
            })


    }

    function getAllCollections(req, res, next) {
        var collections = collectionController.getAllCollections(req)

        //console.log(collections,'function')
        if (collections) {

            res.status(HTTPStatus.OK);
            res.json({
                data: collections
            });
        } else {
            res.status(HTTPStatus.NOT_FOUND);
            res.json({
                message: messageConfig.htmlModule.notFound
            });
        }

    }

    function getCollection(req, res, next) {
        collectionController.getCollection(req)
            .then(function(collections) {

                var collectiondata = collections;
                var modelname = req.query.name;
                if (collectiondata.length > 0) {
                    var excel = require('exceljs/dist/es5');
                    let workbook = new excel.Workbook();
                    let worksheet = workbook.addWorksheet(modelname);

                    collectionController.getCollectionKeys(req).then(function(collectionKeys) {
                            var header = collectionKeys[0].keys;
                            //console.log(header)
                            worksheet.addRow().values = header
                            collectiondata.forEach(function(item) {
                                var valueArray = [];
                                header.forEach(function(key) {
                                    if (item[key] == undefined) { item[key] = '' }
                                    valueArray.push(item[key])
                                })
                                worksheet.addRow().values = valueArray; // add the array as a row in sheet
                            })
                            res.setHeader(
                                "Content-Type",
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            );
                            res.setHeader(
                                "Content-Disposition",
                                "attachment; filename=" + modelname + ".xlsx"
                            );
                            return workbook.xlsx.write(res).then(function() {
                                res.status(HTTPStatus.OK).end();

                            });
                            // res.sendFile(res, function(err){
                            //     //console.log('---------- error downloading file: ', err);
                            // });

                        })
                        .catch(function(err) {
                            return next(err);
                        });
                }
            })
    }

    userRouter.route('/creditcardauth/')
        .post(tokenAuthMiddleware.authenticate, userController.creditCardAuth);

    userRouter.route('/creditcardauthverification/')
        .post(userController.creditCardAuth);
    /*  judges and user sport profile route for web */
    userRouter.use('/user/judge/sporteditor/:docid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        userController.getjudgeSportByid(req)
            .then(function(user) {
                //console.log("user",user)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (user) {
                    req.judgeSport = user;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    userRouter.route('/user/judge/sporteditor/:docid')
        .get(function(req, res) {
            //console.log("getjudgeSportByid");
            res.status(HTTPStatus.OK);
            res.json(req.judgeSport);
        })
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, documentUploader.single('documentName'), userController.updateJudgeSport)
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.patchJudgeSport);
    userRouter.route('/gettoken/')
        .post(tokenAuthMiddleware.authenticate, userController.getToken);

    userRouter.route('/gettokenForCard/')
        .post(userController.getToken);
    userRouter.route('/makepayment/')
        .post(userController.Makepayment);

    userRouter.route('/makemcctokenpayment/')
        .post(userController.MakeMCCTokenpayment);

    /** html content page start here*/
    userRouter.use('/htmlpageinfo/:page', function(req, res, next) {
        userController.getHTML(req)
            .then(function(pageContent) {
                //console.log("user",pageContent)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (pageContent) {
                    req.pageContent = pageContent;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.htmlModule.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    userRouter.route('/htmlpageinfo/:page')
        .get(function(req, res) {
            //console.log("getjudgeSportByid");
            res.status(HTTPStatus.OK);
            res.json(req.pageContent);
        })
        /** html content page end here*/
        /** get userdetails by username start here*/
    userRouter.use('/getusrdetailsbyusername/:name', function(req, res, next) {
        userController.getUsrdetailsbyusername(req)
            .then(function(usedtls) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (usedtls) {
                    req.usedtls = usedtls;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    userRouter.route('/getusrdetailsbyusername/:name')
        .get(function(req, res) {
            ////console.log("getjudgeSportByid");
            res.status(HTTPStatus.OK);
            res.json(req.usedtls);
        })
        /** get userdetails by username start here end here*/
        /** get signup userdetail using id*/



    userRouter.use('/signupuserinfo/:userid', function(req, res, next) {
        userController.getSignupuserdetails(req)
            .then(function(signupDetails) {
                //console.log("user",signupDetails)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (signupDetails) {
                    req.signupDetails = signupDetails;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.htmlModule.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    userRouter.route('/signupuserinfo/:userid')
        .get(function(req, res) {
            ////console.log("getjudgeSportByid");
            res.status(HTTPStatus.OK);
            res.json(req.signupDetails);
        })
        /** end here */
        /* judges and user sport profile route for mobile */

    userRouter.use('/mobsporteditor/:docid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        userController.getjudgeSportByid(req)
            .then(function(user) {
                //console.log("user",user)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (user) {
                    req.mobjudgeSport = user;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    userRouter.route('/mobsporteditor/:docid')
        .get(function(req, res) {
            //console.log("getjudgeSportByid");
            res.status(HTTPStatus.OK);
            res.json(req.mobjudgeSport);
        })
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, documentUploader.single('documentName'), userController.updateJudgeSport)
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.patchmobJudgeSport)
        /* judges Verfication Routes */
    userRouter.route('/user/verifiedjudges')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllVerifiedjudges);
    userRouter.route('/user/unverifiedjudges')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllUnverifiedjudges);
    userRouter.route('/user/expiredjudges')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllExpiredjudges);
    userRouter.route('/user/rejectedjudges')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllRejectedjudges);

    /* user signup*/
    userRouter.route('/signup')

    .post(uploader.single('avatar'), fileUploadHelper.imageUpload, userController.userSignUp);
    userRouter.route('/user/signup')
        .post(uploader.single('avatar'), fileUploadHelper.imageUpload, userController.userSignUp);
    userRouter.route('/user/signup/addsport')
        .post(userController.addSignUpuserSport);
    userRouter.route('/signupaddsport')
        .post(userController.addSignUpuserSport);
    userRouter.route('/user/judge/downloadfile/:filename')
        .get(userController.downloadJudgeSportdoc)
    userRouter.route('/genPID')
        .get(userController.genPID)
    userRouter.route('/mobjudge/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, documentUploader.single('documentName'), userController.saveJudgeSport);
    userRouter.route('/user/judge/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, documentUploader.single('documentName'), userController.saveJudgeSport);
    //middleware function that will get the judge Sport object for each of the routes defined downwards for routes matching /api/:userId
    userRouter.use('/user/judge/:username', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        userController.getjudgeSportByname(req)
            .then(function(user) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (user) {
                    req.user = user;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });


    userRouter.route('/getUserSportInfoForEventMeetSport/:userId/:sportId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, documentUploader.single('documentName'), getUserSportInfoForEventMeetSport)
    userRouter.route('/user/judge/:username')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.user);
        })
    userRouter.route('/getCreditCardLogfile')
        .get(function(req, res, next) {
            userController.getCreditCardLogfile(req, res, next).then((response) => {
                res.status(HTTPStatus.OK);
                res.json(response);
            })
        })
        //middleware function that will get the user object for each of the routes defined downwards for routes matching /api/:userId
    userRouter.use('/user/:userId', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        userController.getUserByID(req)
            .then(function(user) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (user) {
                    req.user = user;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    userRouter.use('/updateCID/:userid', function(req, res, next) {
        userController.getuserInfo(req)
            .then(function(updateUserInfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log("eererer",updateUserInfo);
                if (updateUserInfo) {
                    req.updateCIDInfo = updateUserInfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.Amount.notfound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });



    userRouter.get('/version', function(req, res) {
        VersionModel.find({}, function(err, response) {

            if (!err) {
                res.json({
                    success: true,
                    result: response
                })
            }

        })


    })

    userRouter.route('/updateCID/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.updateCIDInfo);
        })
        .put(userController.updateCIDInfo);

    userRouter.route('/user/:userId')

    .get(function(req, res) {
        res.status(HTTPStatus.OK);
        res.json(req.user);
    })

    .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.patchUserInformation)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('avatar'), fileUploadHelper.imageUpload, userController.updateUser);

    userRouter.route('/userwithusagid/:userId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, userController.getUserByIDWithUSAGID)

    userRouter.route('/change-password/verify/')

    /**
     * @api {post} /api/change-password/verify/ Post data to the server to check for password change authorization
     * @apiPermission admin
     * @apiName verifyPasswordChangeRequest
     * @apiGroup User
     * @apiDescription Post the combination of email, security question and security answer to check for password change authorization, if combination is correct, then user is allowed to change the password,else not authorized to change pasword
     * @apiVersion 0.0.1
     *
     *
     * @apiExample {curl} Example usage:
     *
     *
     * curl \
     * -v \
     * -X POST  \
     * http://localhost:3000/api/change-password/verify/ \
     * -H 'Content-Type: application/json' \
     * -H "x-access-token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c2JlYXQuY29tIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiX2lkIjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwidXNlckNvbmZpcm1lZCI6ZmFsc2UsImJsb2NrZWQiOmZhbHNlLCJkZWxldGVkIjpmYWxzZSwiYWRkZWRPbiI6IjIwMTYtMDctMDhUMDc6NTQ6MDMuNzY2WiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjpmYWxzZSwidXNlclJvbGUiOiJhZG1pbiIsImFjdGl2ZSI6dHJ1ZX0sImNsYWltcyI6eyJzdWJqZWN0IjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwiaXNzdWVyIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwicGVybWlzc2lvbnMiOlsic2F2ZSIsInVwZGF0ZSIsInJlYWQiLCJkZWxldGUiXX0sImlhdCI6MTQ2OTE5MzE0MiwiZXhwIjoxNDY5MjEzMTQyLCJpc3MiOiI1NzdmNWMxYjU4Njk5MDJkNjdlYjIyYTgifQ.oxQ3PAr2FVGUNiVXpRGK0cpKjfDe6b2K1Dkl_cOE6W4Mtk6HRrI0bNyzkkuwp7DWhWAwgJWRTVR4irw2AkjjmQ" \
     * -d '{"email":"testnodecms@gmail.com","securityQuestion":"favorite movie","securityAnswer":"Harry Potter"}'
     *
     *
     *
     *
     * @apiSuccess {String} message A password change confirmation email has been sent to your email.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "message": "An email has been sent to your email address that contains the link to change your password.Please check your email"
     *       }
     *
     *
     *
     * @apiError  (BadRequest) {String[]} message validation errors due to not entering values for  mandatory fields email address, security question and answer to that question
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *
     *     {
     *       "message":[
     *                      {"param":"email","msg":"Email is required"},
     *                      {"param":"securityQuestion","msg":"Security question is required"},
     *                      {"param":"securityAnswer","msg":"Security answer is required"}
     *                 ]
     *     }
     *
     *
     *
     * @apiError  (UnAuthorizedError)  {String} message  User account is blocked
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are currently blocked. Please check email forwarded to your email and click the link."
     *     }
     *
     *
     * @apiError  (UnAuthorizedError) {String} message user account registration is not confirmed yet.Please click check your email and click the confirmation link
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *
     *     {
     *       "message": "User account not confirmed. Please check your email and click on the link sent to you in the confirmation email to verify your account."
     *     }
     *
     *
     * @apiError  (UnAuthorizedError) {String} message Not authorized to change the password
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *
     *     {
     *       "message": "You are not authorized to change the password. Please enter the correct combination of data to be able to change the password"
     *     }
     *
     *
     *
     *
     * @apiError (InternalServerError)  {String} message  Internal Server Error
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "message": "Internal Server Error"
     *     }
     *
     */

    .post(verifyPasswordChangeRequest);


    userRouter.route('/change-password/confirm/:accessToken')

    /**
     * @api {patch} /api/change-password/confirm/:accessToken  Updates  user's password information to the  database
     * @apiPermission public
     * @apiName implementForgotPasswordAction
     * @apiGroup User
     *
     *
     * @apiParam {String} accessToken  Password verify access token
     *
     *   @apiParamExample {json} Request-Example:
     *     {
     *       "accessToken": "57833052319c2cae0defc7b5"
     *     }
     *
     *
     *
     * @apiDescription Updates user's password information data to the database
     * @apiVersion 0.0.1
     *
     * @apiExample {curl} Example usage:
     *
     *
     *
     * curl \
     * -v \
     * -X PATCH  \
     * http://localhost:3000/api/change-password/confirm/5791fc7cf7b57f69796ef444 \
     * -H 'Content-Type: application/json' \
     * -d '{"password":"nodecms@123"}'
     *
     * @apiSuccess {String} message Password changed successfully.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "message": "Password changed successfully"
     *       }
     *
     *
     * @apiError  (BadRequest) {String} message password must not be same as username of the user
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *
     *     {
     *       "message": "Password must not contain the username"
     *     }
     *
     *
     * @apiError  (BadRequest) {String} message password must be strong and must contain commonly used passwords to enforce password security
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *
     *     {
     *       "message": "Password is very weak. Please try the combination of lowercase alphabets, uppercase alphabets, numbers, symbols and a minimum of 8 characters long password"
     *     }
     *
     *
     * @apiError (InternalServerError)  {String} message  Internal Server Error
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "message": "Internal Server Error"
     *     }
     *
     */

    .patch(userController.implementForgotPasswordAction);

    function getUserSportInfoForEventMeetSport(req, res, next) {
        userController.getUserSportInfoForEventMeetSport(req, next)
            .then(function(userSport) {
                if (userSport) {
                    res.status(HTTPStatus.OK);
                    res.json({
                        result: userSport
                    });
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        result: ""
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function remittanceHistory(req, res, next) {
        userController.remittanceHistory(req, next)
            .then(function(getRemittanceHistory) {
                //console.log("REMIT REQ LIST ", getRemittanceHistory);
                //if exists, return data in json format
                if (getRemittanceHistory) {
                    res.status(HTTPStatus.OK);
                    res.json(getRemittanceHistory);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: "No transactions found"
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    //function declaration to return user list to the client, if exists, else return not found message
    function getUsers(req, res, next) {
        userController.getUsers(req, next)
            .then(function(userList) {
                //console.log("USER LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getUsersForSanction(req, res, next) {
        userController.getUsersForSanction(req, next)
            .then(function(userList) {
                //console.log("USER LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllCompetitor(req, res, next) {
        userController.getAllCompetitor(req, next)
            .then(function(userList) {
                //console.log("USER LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllCompetitorForMap(req, res, next) {
        userController.getAllCompetitorForMap(req, next)
            .then(function(userList) {
                //console.log("USER LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    //function declaration to return user list to the client, if exists, else return not found message
    function getAllUsers(req, res, next) {
        userController.getAllUsers(req, next)
            .then(function(userList) {
                //console.log("ALL USERS LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllUsers(req, res, next) {
        userController.getAllUsers(req, next)
            .then(function(userList) {
                //console.log("ALL USERS LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }
    // function for getting verified and un verified  and expired judges sport profile

    function getAllVerifiedjudges(req, res, next) {
        userController.getAllVerifiedjudges(req, next)
            .then(function(userList) {
                //console.log("ALL USERS LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getRemitRequests(req, res, next) {
        userController.getRemitRequests(req, next)
            .then(function(getRemitRequests) {
                //console.log("REMIT REQ LIST ", getRemitRequests);
                //if exists, return data in json format
                if (getRemitRequests) {
                    res.status(HTTPStatus.OK);
                    res.json(getRemitRequests);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllUnverifiedjudges(req, res, next) {
        userController.getAllUnverifiedjudges(req, next)
            .then(function(userList) {
                //console.log("ALL USERS LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllExpiredjudges(req, res, next) {
        userController.getAllExpiredjudges(req, next)
            .then(function(userList) {
                //console.log("ALL USERS LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllRejectedjudges(req, res, next) {
        userController.getAllRejectedjudges(req, next)
            .then(function(userList) {
                //console.log("ALL USERS LIST", userList);
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    //function declaration to verify password change request , if data combination of security question,, security answer and username correct, then send password change confirmation email else return not allowed message
    function verifyPasswordChangeRequest(req, res, next) {
        userController.verifySecurityAnswer(req, res, next)
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.user.passwordChangeConfirmationEmail
                });
            })
            .catch(function(err) {
                return next(err);
            });
    }

    return userRouter;

})();

module.exports = userRoutes;