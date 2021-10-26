var Routes = (function() {

    'use strict';

    var HTTPStatus = require('http-status'),
        express = require('express'),
        tokenAuthMiddleware = require('../middlewares/token.authentication.middleware'),
        roleAuthMiddleware = require('../middlewares/role.authorization.middleware'),
        messageConfig = require('../configs/api.message.config'),
        routineController = require('../controllers/routine.server.controller'),
        routineFilePath = '/mnt/volume_sfo2_01/public/uploads/user/routine/source/',
        Routine = require('../models/routine.server.model'),
        mongoose = require('mongoose'),
        uploaddocPrefix = 'routine',
        docfileUploadHelper = require('../helpers/file.upload.helper')('', routineFilePath, uploaddocPrefix),
        documentUploader = docfileUploadHelper.documentUploader,
        Promise = require("bluebird"),
        fs = Promise.promisifyAll(require('fs')),
        usaGYMcontroller = require('../controllers/usa-gym.server.controller'),
        usagGYMRouter = express.Router();


    usagGYMRouter.route('/meet-sanction/')
        .post(sanctionActions);
    usagGYMRouter.route('/verifyUSAGYMAPI/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, usaGYMcontroller.verifyMembership);
    usagGYMRouter.route('/sanction-reservations/')
        .post(sanctionreservationActions);
    usagGYMRouter.route('/meet-reservations/')
        .post(reservationActions);
    usagGYMRouter.route('/getUSAGverificationMemberID/:userid')
        .get(usaGYMcontroller.getUSAGverificationMemberID)
    usagGYMRouter.route('/getSanctionByMemberID/:memberid')
        .get(usaGYMcontroller.getSanctionByMemberID)
    usagGYMRouter.route('/getscores/')
        .get(usaGYMcontroller.getSanctionScores);
    usagGYMRouter.route('/getSanctionByID/:sid')
        .get(usaGYMcontroller.getSanctionByID)
    usagGYMRouter.route('/updateSanctionByID/:sid')
        .patch(usaGYMcontroller.patchSanction)
    usagGYMRouter.route('/sanction/')
        .get(usaGYMcontroller.getAllSanction)
    usagGYMRouter.route('/getusagmeetInfo/:sanctionID')
        .get(usaGYMcontroller.usagmeetInfo)
    usagGYMRouter.route('/getusagmeetscore/:sanctionID')
        .get(usaGYMcontroller.usagmeetscore)


    usagGYMRouter.route('/getSanctionInfoBySanctionID/:sid')
        .get(usaGYMcontroller.getSanctionInfoBySanctionID)
    usagGYMRouter.route('/getSanctionByAdminMemberID/:AdminID')
        .get(usaGYMcontroller.getSanctionInfoBySanctionID)

    usagGYMRouter.route('/getSanctionJudges/:sanctionid')
        .get(usaGYMcontroller.getSanctionJudges)

    usagGYMRouter.route('/getSanctionFlyp10UserStatus/:sanctionid')
        .get(usaGYMcontroller.getSanctionFlyp10UserStatus)

    usagGYMRouter.route('/EnrollEventMeetForSanctionOrganizerAdminstrators')
        .post(usaGYMcontroller.EnrollEventMeetForSanctionOrganizerAdminstrators)

    usagGYMRouter.route('/checkMeetDirectorOrAdmin')
        .get(usaGYMcontroller.checkMeetDirectorOrAdmin)


    usagGYMRouter.route('/getSanctionMemberIDByFlyp10UserID/:memberID')
        .get(usaGYMcontroller.getSanctionMemberIDByFlyp10UserID)
    usagGYMRouter.route('/getUSAGVerificationMemberIDByFlyp10UserID/:userid')
        .get(usaGYMcontroller.getUSAGVerificationMemberIDByFlyp10UserID)

    usagGYMRouter.route('/updateUSAGMember/:userid')
        .patch(usaGYMcontroller.updateUSAGMember)

    function sanctionreservationActions(req, res, next) {
        if (req.body && req.body.Sanction) {
            sanctionActions(req, res, next)
        } else if (req.body && req.body.Reservation) {
            reservationActions(req, res, next)
        } else if (req.body && req.body.Judges) {
            judgesActions(req, res, next)
        } else {
            var response = {
                ResponseStatus: "0"
            }
            res.json(response);
        }
    }

    function sanctionActions(req, res, next) {
        usaGYMcontroller.saveUSAGrequest(req, res, next);
        var response = {
            TxnType: "Sanction",
            SanctionID: req.body.Sanction.SanctionID,
            SanctionURL: "",
            ResponseStatus: {
                "ErrorCode": "0",
                Message: "OK"
            }
        }
        if (req.body.Action == "Add") {
            usaGYMcontroller.postSanctionData(req, res, next).then(function(sanction) {
                res.status(HTTPStatus.OK);
                if (sanction.success) {
                    response['Existing-Flyp10-Member'] = sanction.ExistingFlyp10User
                    response['Non-Existing-Flyp10-Member'] = sanction.NonExistingFlyp10User
                    res.json(response);
                } else {
                    response.ResponseStatus.ErrorCode = sanction.errorcode
                    response.ResponseStatus.Message = sanction.message
                    res.json(response);
                }

            }).catch(function(err) {
                return next(err);
            });
        } else if (req.body.Action == "Delete") {
            usaGYMcontroller.getSanctionData(req, res, next).then(function(sanction) {
                req.sanctionData = sanction;
                if (sanction) {
                    usaGYMcontroller.removeSanctionData(req, res, next).then(function(sanction1) {
                        res.status(HTTPStatus.OK);
                        res.json(response);
                    }).catch(function(err) {
                        return next(err);
                    });
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    response.ResponseStatus.ErrorCode = '404',
                        response.ResponseStatus.Message = 'Not found'
                    res.json(response)
                }
            }).catch(function(err) {
                return next(err);
            });
        } else if (req.body.Action == "ChangeVendor") {
            usaGYMcontroller.getSanctionData(req, res, next).then(function(sanction) {
                req.sanctionData = sanction;
                if (sanction) {
                    usaGYMcontroller.changevendorSanctionData(req, res, next).then(function() {
                        res.status(HTTPStatus.OK);
                        res.json(response);
                    }).catch(function(err) {
                        return next(err);
                    });
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    response.ResponseStatus.ErrorCode = '404',
                        response.ResponseStatus.Message = 'Not found'
                    res.json(response)
                }
            })
        } else if (req.body.Action == "Update") {
            usaGYMcontroller.getSanctionData(req, res, next).then(function(sanction) {
                req.sanctionData = sanction;
                if (sanction) {
                    usaGYMcontroller.updateSanctionData(req, res, next).then(function(sanction1) {
                        res.status(HTTPStatus.OK);
                        console.log(sanction1, "dfdf")
                        response['Existing-Flyp10-Member'] = sanction1.ExistingFlyp10User
                        response['Non-Existing-Flyp10-Member'] = sanction1.NonExistingFlyp10User
                        res.json(response);

                    }).catch(function(err) {
                        return next(err);
                    });
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    response.ResponseStatus.ErrorCode = '404',
                        response.ResponseStatus.Message = 'Not found'
                    res.json(response)
                }
            }).catch(function(err) {
                return next(err);
            });

        } else {
            res.status(HTTPStatus.NOT_FOUND);
            response.ResponseStatus.ErrorCode = '404',
                response.ResponseStatus.Message = 'Action not found'
            res.json(response)
        }
    }

    async function judgesActions(req, res, next) {
        usaGYMcontroller.saveUSAGrequest(req, res, next);
        var response = {
            TxnType: "Judges",
            ReservationID: [],
            ResponseStatus: {
                "ErrorCode": "0",
                Message: "OK"
            }
        }
        if (req.body.Action == "Add") {
            var judges = await usaGYMcontroller.postJudgesData(req, res, next)
            console.log(judges, 'judges')
            response.ReservationID = judges.ReservationID,
                response['Existing-Flyp10-Member'] = judges.ExistingFlyp10User
            response['Non-Existing-Flyp10-Member'] = judges.NonExistingFlyp10User

            res.json(response);


        } else if (req.body.Action == "Update") {

            usaGYMcontroller.updateJudgesData(req, res, next).then(function(judges) {
                res.status(HTTPStatus.OK);
                response.ReservationID = judges.ReservationID;
                response['Existing-Flyp10-Member'] = judges.ExistingFlyp10User
                response['Non-Existing-Flyp10-Member'] = judges.NonExistingFlyp10User
                res.json(response);

            }).catch(function(err) {
                return next(err);
            });
        } else {
            res.status(HTTPStatus.NOT_FOUND);
            response.ResponseStatus.ErrorCode = '404',
                response.ResponseStatus.Message = 'Action not found'
            res.json(response)
        }
    }

    function reservationActions(req, res, next) {
        usaGYMcontroller.saveUSAGrequest(req, res, next);
        var response = {
            TxnType: "Reservation",
            ReservationID: [],
            ResponseStatus: {
                "ErrorCode": "0",
                Message: "OK"
            }
        }
        if (req.body.Action == "Add") {
            usaGYMcontroller.postReservationData(req, res, next).then(function(reservation) {
                    usaGYMcontroller.sanctionEventMeetmapping(req, res, next);
                    res.status(HTTPStatus.OK);
                    console.log(reservation)
                    if (reservation.success == false) {
                        response.ResponseStatus.ErrorCode = reservation.errorcode
                        response.ResponseStatus.Message = reservation.message
                        res.json(response);

                    } else {
                        response.ReservationID = reservation.ReservationID;
                        response['Existing-Flyp10-Member'] = reservation.ExistingFlyp10User
                        response['Non-Existing-Flyp10-Member'] = reservation.NonExistingFlyp10User

                        res.json(response);
                    }


                })
                .catch(function(err) {
                    return next(err);
                });
        } else if (req.body.Action == "Update") {
            usaGYMcontroller.getReservationData(req, res, next).then(function(reservation) {
                req.reservationData = reservation;

                if (reservation) {
                    usaGYMcontroller.updateReservationData(req, res, next).then(function(reservation1) {
                        usaGYMcontroller.sanctionEventMeetmapping(req, res, next)
                        response.ReservationID = reservation1.ReservationID;
                        response['Existing-Flyp10-Member'] = reservation1.ExistingFlyp10User
                        response['Non-Existing-Flyp10-Member'] = reservation1.NonExistingFlyp10User
                        res.status(HTTPStatus.OK);

                        res.json(response);


                    }).catch(function(err) {
                        return next(err);
                    });
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    response.ResponseStatus.ErrorCode = '404',
                        response.ResponseStatus.Message = 'Not found'
                    res.json(response)
                }
            }).catch(function(err) {
                return next(err);
            });

        } else {
            res.status(HTTPStatus.NOT_FOUND);
            response.ResponseStatus.ErrorCode = '404',
                response.ResponseStatus.Message = 'Action not found'
            res.json(response)
        }
    }
    return usagGYMRouter;

})();

module.exports = Routes;