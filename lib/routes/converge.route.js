var ConvergeRoutes = (function() {

    'use strict';
    var dataProviderHelper = require('../data/mongo.provider.helper'),
        UserWallet = require('../models/wallet.server.model');
    var HTTPStatus = require('http-status'),
        express = require('express'),
        tokenAuthMiddleware = require('../middlewares/token.authentication.middleware'),
        roleAuthMiddleware = require('../middlewares/role.authorization.middleware'),
        messageConfig = require('../configs/api.message.config'),
        convergeController = require('../controllers/converge.server.controller'),
        routineFilePath = './public/uploads/user/routine/',
        uploaddocPrefix = 'routine',
        docfileUploadHelper = require('../helpers/file.upload.helper')('', routineFilePath, uploaddocPrefix),
        documentUploader = docfileUploadHelper.documentUploader,
        //  fileUploadHelper = require('../helpers/file.upload.helper')(routineFilePath, '', uploadPrefix),
        //  uploader = fileUploadHelper.uploader,

        ConvergeRouter = express.Router();

    ConvergeRouter.route('/flyp10convergeApires/')



    .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getconvergeTransaction)
        .post(convergeController.saveConvergeResponse);


    ConvergeRouter.route('/recruiter-verified/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getVerifiedRecruiter);
    ConvergeRouter.route('/recruiter-unverified/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getUnVerifiedRecruiter);
    ConvergeRouter.route('/recruiter-rejected/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getRejectedRecruiter);

    ConvergeRouter.route('/userwallet/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getUserWallet)
        .post(convergeController.saveUserWallet);

    ConvergeRouter.route('/getAllUserWalletInfo/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllUserWallet)

    ConvergeRouter.route('/convergeerrorlog/')
        .post(convergeController.saveConvergeerrorlog);

    ConvergeRouter.use('/walletinfo/:userid', function(req, res, next) {
        convergeController.getWalletinfo(req)
            .then(function(walletInfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (walletInfo) {
                    req.walletInfo = walletInfo;
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

    ConvergeRouter.route('/walletinfo/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.walletInfo);
        })

    ConvergeRouter.route('/transaction/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getTransaction)
        .post(convergeController.saveTransaction);

    ConvergeRouter.route('/gentokenafterpayment/')
        .post(convergeController.gentokenAfterPayment);

    ConvergeRouter.route('/getSessionTokenForHPP/')
        .post(convergeController.getSessionTokenForHPP);

    ConvergeRouter.route('/postccinfo/')
        .post(tokenAuthMiddleware.authenticate, convergeController.SaveCCinfo);
    ConvergeRouter.route('/postccinfoForCard/')
        .post(convergeController.SaveCCinfo);

    ConvergeRouter.route('/makeasdefaultcard/')
        .post(convergeController.makeAsDefault);

    ConvergeRouter.use('/getccinfo/:userid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        convergeController.getCardByuserid(req)
            .then(function(cardlist) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (cardlist) {
                    req.cardlist = cardlist;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.card.notfound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    ConvergeRouter.route('/getccinfo/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.cardlist);
        })
    ConvergeRouter.use('/getccinfobyid/:docid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        convergeController.getccinfobyid(req)
            .then(function(cardlistinfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (cardlistinfo) {
                    req.cardlistinfo = cardlistinfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.card.notfound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    ConvergeRouter.route('/getccinfobyid/:docid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.cardlistinfo);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, convergeController.patchCCInfo);
    ConvergeRouter.route('/judgewallet/')
        .get(getJudgeWallet);

    ConvergeRouter.use('/transactioninfo/:userid', function(req, res, next) {
        convergeController.getTransactioninfo(req)
            .then(function(transactionInfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (transactionInfo) {
                    req.transactionInfo = transactionInfo;
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

    ConvergeRouter.route('/transactioninfo/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.transactionInfo);
        })

    ConvergeRouter.use('/updateconvergeinfo/:userid', function(req, res, next) {
        convergeController.getuserInfo(req)
            .then(function(updateUserInfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log("eererer",updateUserInfo);
                if (updateUserInfo) {
                    req.updateUserInfo = updateUserInfo;
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

    ConvergeRouter.route('/updateconvergeinfo/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.updateUserInfo);
        })
        .put(convergeController.updateUser);


    ConvergeRouter.use('/updateSub/:userid', function(req, res, next) {
        convergeController.getuserInfo(req)
            .then(function(updateUserInfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log("eererer",updateUserInfo);
                if (updateUserInfo) {
                    req.updatesubUserInfo = updateUserInfo;
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

    ConvergeRouter.route('/updateSub/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.updatesubUserInfo);
        })
        .put(convergeController.updatesubUser);


    ConvergeRouter.use('/verfyRecruiter/:userid', function(req, res, next) {
        convergeController.getuserInfo(req)
            .then(function(RecruiterInfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log("eererer",RecruiterInfo);
                if (RecruiterInfo) {
                    req.RecruiterInfo = RecruiterInfo;
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

    ConvergeRouter.route('/verfyRecruiter/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.RecruiterInfo);
        })
        .put(convergeController.updateRecruiter);

    ConvergeRouter.use('/confirmuser/:userid', function(req, res, next) {
        convergeController.getuserInfo(req)
            .then(function(confirmUser) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log("eererer",confirmUser);
                if (confirmUser) {
                    req.confirmUser = confirmUser;
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

    ConvergeRouter.route('/confirmuser/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.confirmUser);
        })
        .put(convergeController.confirmUser);


    ConvergeRouter.route('/infobyToken/')
        .post(convergeController.getinfobyToken);

    //function declaration to return user list to the client, if exists, else return not found message
    function getconvergeTransaction(req, res, next) {
        convergeController.getFaq(req, next)
            .then(function(convegeResponeList) {
                //if exists, return data in json format
                if (convegeResponeList) {
                    res.status(HTTPStatus.OK);
                    res.json(convegeResponeList);
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

    function getJudgeWallet(req, res, next) {
        convergeController.getJudgeWallet(req, next)
            .then(function(convegeResponeList) {
                //if exists, return data in json format
                if (convegeResponeList) {
                    res.status(HTTPStatus.OK);
                    res.json(convegeResponeList);
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

    function getUserWallet(req, res, next) {
        convergeController.getUserWallet(req, next)
            .then(function(userWalletList) {
                //if exists, return data in json format
                if (userWalletList) {
                    res.status(HTTPStatus.OK);
                    res.json(userWalletList);
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

    function getAllUserWallet(req, res, next) {
        convergeController.getAllUserWallet(req, next)
            .then(function(userWalletList) {
                //if exists, return data in json format
                if (userWalletList) {
                    res.status(HTTPStatus.OK);
                    res.json(userWalletList);
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

    function getVerifiedRecruiter(req, res, next) {
        convergeController.getVerifiedRecruiter(req, next)
            .then(function(UserList) {
                //if exists, return data in json format
                if (UserList) {
                    res.status(HTTPStatus.OK);
                    res.json(UserList);
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

    function getUnVerifiedRecruiter(req, res, next) {
        convergeController.getUnVerifiedRecruiter(req, next)
            .then(function(UserList) {
                //if exists, return data in json format
                if (UserList) {
                    res.status(HTTPStatus.OK);
                    res.json(UserList);
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

    function getRejectedRecruiter(req, res, next) {
        convergeController.getRejectedRecruiter(req, next)
            .then(function(UserList) {
                //if exists, return data in json format
                if (UserList) {
                    res.status(HTTPStatus.OK);
                    res.json(UserList);
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

    function getTransaction(req, res, next) {
        convergeController.getTransacton(req, next)
            .then(function(transactionList) {
                //if exists, return data in json format
                if (transactionList) {
                    res.status(HTTPStatus.OK);
                    res.json(transactionList);
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


    return ConvergeRouter;

})();

module.exports = ConvergeRoutes;