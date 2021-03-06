var teamManagementController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        TeamMemberModel = require('../models/team.management.server.model'),
        User = require('../models/user.server.model'),
        TeamMember = TeamMemberModel.TeamManagement,
        TeamMate = TeamMemberModel.TeamMate,
        utilityHelper = require('../helpers/utilities.helper'),
        errorHelper = require('../helpers/error.helper'),
        Promise = require("bluebird");

    var documentFields = '_id teamMemberName email phoneNumber facebookURL twitterURL googlePlusURL linkedInURL address designation description hierarchyOrder imageName active',
        documentTeammateFields = '_id UID FID status';

    function TeamManagementModule() {}

    TeamManagementModule.CreateTeamMember = function(teamObj, hierarchyOrder, loggedInUser, imageInfo) {
        var teamManagementInfo = new TeamMember();

        teamManagementInfo.teamMemberName = teamObj.teamMemberName;
        teamManagementInfo.email = teamObj.email;
        teamManagementInfo.phoneNumber = teamObj.phoneNumber;
        teamManagementInfo.facebookURL = teamObj.facebookURL;
        teamManagementInfo.twitterURL = teamObj.twitterURL;
        teamManagementInfo.googlePlusURL = teamObj.googlePlusURL;
        teamManagementInfo.linkedInURL = teamObj.linkedInURL;
        teamManagementInfo.address = teamObj.address;
        teamManagementInfo.designation = teamObj.designation;
        teamManagementInfo.description = teamObj.description;
        teamManagementInfo.hierarchyOrder = hierarchyOrder;
        teamManagementInfo.active = teamObj.active;
        teamManagementInfo.imageName = imageInfo._imageName;
        teamManagementInfo.imageProperties = {
            imageExtension: imageInfo._imageExtension,
            imagePath: imageInfo._imagePath
        };
        teamManagementInfo.addedBy = loggedInUser;
        teamManagementInfo.addedOn = new Date();

        return teamManagementInfo;
    };

    TeamManagementModule.AddTeamMate = function(teamObj, loggedInUser) {
        var teamMateInfo = new TeamMate();

        teamMateInfo.UID = teamObj.UID;
        teamMateInfo.FID = teamObj.FID;
        teamMateInfo.status = teamObj.status;
        teamMateInfo.addedBy = loggedInUser;
        teamMateInfo.addedOn = new Date();

        return teamMateInfo;
    };


    var _p = TeamManagementModule.prototype;


    _p.checkValidationErrors = function(req) {

        req.checkBody('teamMemberName', messageConfig.teamMember.validationErrMessage.teamMemberName).notEmpty();
        req.checkBody('email', messageConfig.teamMember.validationErrMessage.email).notEmpty();
        req.checkBody('email', messageConfig.teamMember.validationErrMessage.emailValid).isEmail();
        req.checkBody('designation', messageConfig.teamMember.validationErrMessage.designation).notEmpty();
        if (req.body.facebookURL) {
            req.checkBody('facebookURL', messageConfig.teamMember.validationErrMessage.facebookURLValid).isURL();
        }
        if (req.body.twitterURL) {
            req.checkBody('twitterURL', messageConfig.teamMember.validationErrMessage.twitterURLValid).isURL();
        }
        if (req.body.googlePlusURL) {
            req.checkBody('googlePlusURL', messageConfig.teamMember.validationErrMessage.gPlusURLValid).isURL();
        }
        if (req.body.linkedInURL) {
            req.checkBody('linkedInURL', messageConfig.teamMember.validationErrMessage.linkedInURLValid).isURL();
        }

        return req.validationErrors();
    };

    _p.getTeamMembers = function(req, next) {
        //Get pagination options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};
        // matches anything that  starts with the inputted team member's name, case insensitive
        if (req.query.teamMemberName) {
            query.teamMemberName = { $regex: new RegExp('.*' + req.query.teamMemberName, "i") };
        }
        if (req.query.active) {
            query.active = req.query.active;
        }
        query.deleted = false;

        return dataProviderHelper.getAllWithDocumentFieldsPagination(TeamMember, query, pagerOpts, documentFields, { hierarchyOrder: 1 });


    };

    _p.getTeamMemberInfoByID = function(req) {
        var selectFields = documentTeammateFields;

        return dataProviderHelper.findById(TeamMember, req.params.teamMemberId, selectFields);
    };

    _p.updateTeamMateInfo = function(req, res, next) {
        //console.log('req.body ==============> ', req.body);
        // req.body = JSON.parse(req.body.data);
        // var errors = _p.checkValidationErrors(req);

        // if (errors) {
        //     res.status(HTTPStatus.BAD_REQUEST);
        //     res.json({
        //         message: errors
        //     });
        // } else {

        // }
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);

        _p.updateTeamMateMiddlewareFunc(req, res, req.body, next)
            .then(function(data) {
                //console.log('update res info ', data);
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.teamMember.updateMessage,
                    savedData: data
                });
            })
            .catch(function(err) {
                return next(err);
            });
    };

    _p.updateTeamMateMiddlewareFunc = function(req, res, modelInfo, next) {
        //console.log('modelinfo ', modelInfo);
        //console.log('req.teamMateInfo ', req.teamMateInfo);

        req.teamMateInfo.UID = modelInfo.UID;
        req.teamMateInfo.FID = modelInfo.FID;
        req.teamMateInfo.status = modelInfo.status;
        req.teamMateInfo.updatedBy = req.decoded.user.username;
        req.teamMateInfo.updatedOn = new Date();

        return dataProviderHelper.notificationSave(req.teamMateInfo);
    };

    _p.patchTeamMemberInfo = function(req, res, next) {
        req.teamMemberInfo.deleted = true;
        req.teamMemberInfo.deletedOn = new Date();
        req.teamMemberInfo.deletedBy = req.decoded.user.username;

        dataProviderHelper.save(req.teamMemberInfo)
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.teamMember.deleteMessage
                });
            })
            .catch(function(err) {
                return next(err);
            });
    };

    _p.addTeamMate = function(req, res, next) {
        // req.body = JSON.parse(req.body.data);
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        var teamMateInfo = TeamManagementModule.AddTeamMate(modelInfo, req.decoded.user.username);
        dataProviderHelper.notificationSave(teamMateInfo).then(function(data) {
                //console.log('add res info ', data);
                res.status(HTTPStatus.OK);
                res.json({
                    status: HTTPStatus.OK,
                    message: 'Your request to add as teammate has been sent successfully!',
                    savedData: data
                });
            })
            .catch(function(err) {
                return next(err);
            });
    }

    var ObjectId = require('mongodb').ObjectID;

    _p.getTeammatesById = function(req, next) {
        let UID = ObjectId(req.params.UID);
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // //console.log('req.query', req)
        var query = {};
        // //console.log('sport name req', req.query.sportName);

        // matches anything that  starts with the inputted sport name, case insensitive
        if (req.params.UID) {
            query.UID = { $regex: new RegExp('.*' + UID, "i") };
            // query.UID = req.params.UID
        }

        return dataProviderHelper.findAll(TeamMate, query);
    };

    _p.getRequestsByFID = function(req, next) {
        let FID = ObjectId(req.params.FID);
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // //console.log('req.query', req)
        var query = {};
        // //console.log('sport name req', req.query.sportName);

        // matches anything that  starts with the inputted sport name, case insensitive
        if (req.params.FID) {
            query.FID = { $regex: new RegExp('.*' + FID, "i") };
            // query.UID = req.params.UID
        }
        return dataProviderHelper.findAll(TeamMate, query);
    };

    _p.getTeammateById = function(req) {
        //console.log(req.params.reqid) 
        return dataProviderHelper.findById(TeamMate, req.params.reqid, documentTeammateFields);
    };

    //  _p.getTeamMemberInfoByUsername = function (req) {
    //     var selectFields = documentTeammateFields;

    //     return dataProviderHelper.findOneUsername(TeamMate, {username: req.params.username});
    // };

    _p.getTeamMemberInfoByUsername = function(req) {
        var query = {};
        query.username = req.params.username;
        query.deleted = false
        return dataProviderHelper.find(User, query);
    }

    _p.getReqInfoByUserID = function(req, res, next) {
        //Get pagination options
        // var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};


        return dataProviderHelper.getAllValById(TeamMate, req.params.uid, documentTeammateFields);
    }

    _p.getAcceptedByUID = function(req, res, next) {
        //Get pagination options
        // var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};
        query.UID = req.params.UID;
        query.status = "2";
        var tempArr = [];
        return TeamMate.find(query).then(data => {
            // tempArr = data;
            //console.log('accepted by UID ', tempArr);
            return TeamMate.find({ FID: req.params.UID, status: "2" }).then(response => {
                //console.log('accepted by FID ', response);
                tempArr.concat(response)
                tempArr = [...data, ...response];
                //console.log('overall accepted ==> ', tempArr);
                return res.json({
                    success: true,
                    response: tempArr,
                    message: 'Teammates retrieved succesfully'
                })
            })
        })

    }

    _p.postTeamMemberInfo = function(req, res, next) {
        req.body = JSON.parse(req.body.data);
        var errors = _p.checkValidationErrors(req);

        //Check for validation errors
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.email = modelInfo.email.toLowerCase();
            query.deleted = false;

            dataProviderHelper.checkForDuplicateEntry(TeamMember, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.teamMember.alreadyExists + '"}');
                    } else {

                        var limitOpts = 1;
                        var sortOpts = { hierarchyOrder: -1 };
                        var queryOpts = { deleted: false };
                        //Check to see that largest hierarchy order so that next added person's hierarchy order will be the existing largest value  plus one.
                        return dataProviderHelper.getLatestData(TeamMember, queryOpts, 'hierarchyOrder', sortOpts, limitOpts);
                    }
                })
                .then(function(maxValueObj) {
                    var hierarchyOrder = 0;
                    if (maxValueObj && maxValueObj.length > 0) {
                        hierarchyOrder = maxValueObj[0].hierarchyOrder;
                    }
                    hierarchyOrder = hierarchyOrder + 1;
                    var imageInfo = utilityHelper.getFileInfo(req, null, next);
                    var teamManagementInfo = TeamManagementModule.CreateTeamMember(modelInfo, hierarchyOrder, req.decoded.user.username, imageInfo);

                    return dataProviderHelper.save(teamManagementInfo);
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.teamMember.saveMessage
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

    _p.updateTeamMemberInfo = function(req, res, next) {
        req.body = JSON.parse(req.body.data);
        var errors = _p.checkValidationErrors(req);

        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);

            //Check to see if the team member's email address matches previously saved data, if matches no need to check for duplicacy, else need to perform duplication check action
            if (req.teamMemberInfo.email !== modelInfo.email.toLowerCase()) {
                var query = {};

                // For checking duplicate entry
                query.email = modelInfo.email.toLowerCase();
                query.deleted = false;

                dataProviderHelper.checkForDuplicateEntry(TeamMember, query)
                    .then(function(count) {
                        if (count > 0) {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.teamMember.alreadyExists + '"}');
                        } else {
                            return _p.updateTeamMiddlewareFunc(req, res, modelInfo, next);
                        }
                    })
                    .then(function() {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.teamMember.updateMessage
                        });
                    })
                    .catch(Promise.CancellationError, function(cancellationErr) {
                        errorHelper.customErrorResponse(res, cancellationErr, next);
                    })
                    .catch(function(err) {
                        return next(err);
                    });
            } else {
                _p.updateTeamMiddlewareFunc(req, res, modelInfo, next)
                    .then(function() {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.teamMember.updateMessage
                        });
                    })
                    .catch(function(err) {
                        return next(err);
                    });
            }
        }
    };

    _p.updateTeamMiddlewareFunc = function(req, res, modelInfo, next) {
        var imageInfo = utilityHelper.getFileInfo(req, req.teamMemberInfo, next);

        req.teamMemberInfo.teamMemberName = modelInfo.teamMemberName;
        req.teamMemberInfo.email = modelInfo.email;
        req.teamMemberInfo.phoneNumber = modelInfo.phoneNumber;
        req.teamMemberInfo.facebookURL = modelInfo.facebookURL;
        req.teamMemberInfo.twitterURL = modelInfo.twitterURL;
        req.teamMemberInfo.googlePlusURL = modelInfo.googlePlusURL;
        req.teamMemberInfo.linkedInURL = modelInfo.linkedInURL;
        req.teamMemberInfo.address = modelInfo.address;
        req.teamMemberInfo.designation = modelInfo.designation;
        req.teamMemberInfo.description = modelInfo.description;
        req.teamMemberInfo.active = modelInfo.active;
        req.teamMemberInfo.imageName = imageInfo._imageName;
        req.teamMemberInfo.imageProperties.imageExtension = imageInfo._imageExtension;
        req.teamMemberInfo.imageProperties.imagePath = imageInfo._imagePath;
        req.teamMemberInfo.updatedBy = req.decoded.user.username;
        req.teamMemberInfo.updatedOn = new Date();

        return dataProviderHelper.save(req.teamMemberInfo);
    };

    _p.updateTeamMemberHierarchy = function(req, res, next) {
        var _hierarchyValue = 0;
        if (req.params.hierarchyValue) {
            _hierarchyValue = req.params.hierarchyValue;
        }
        var searchOpts = {};
        var sortOpts = {};
        var queryOpts = {};
        //Check to see if the team member's hierarchy order is to be increased or decreased, if sort up action is applied, then hierarchy order needs to be subtracted by 1 else if the sort down action is applied, then hierarchy order needs to be added by 1.
        if (req.body.sort === "up") {
            searchOpts = { $lt: _hierarchyValue };
            sortOpts = { hierarchyOrder: -1 };
        } else if (req.body.sort === "down") {
            searchOpts = { $gt: _hierarchyValue };
            sortOpts = { hierarchyOrder: 1 };
        }
        queryOpts = {
            hierarchyOrder: searchOpts,
            deleted: false
        }

        //Get the team member object according to hierarchy sort action, if up, get the team member whose hierarchy order is the nearest value in the downward direction.

        var limitOpts = 1;
        dataProviderHelper.getLatestData(TeamMember, queryOpts, 'hierarchyOrder', sortOpts, limitOpts)
            .then(function(memberObj) {
                if (memberObj && memberObj.length > 0) {
                    return [memberObj, dataProviderHelper.updateModelData(TeamMember, { _id: memberObj[0]._id }, { hierarchyOrder: _hierarchyValue }, false)];
                } else {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.NOT_FOUND + '", "message": "' + messageConfig.teamMember.notFound + '"}');
                }
            })
            .spread(function(memberObj) {
                _hierarchyValue = memberObj[0].hierarchyOrder;
                return dataProviderHelper.updateModelData(TeamMember, { _id: req.params.sortId }, { hierarchyOrder: _hierarchyValue }, false);
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.teamMember.sortMessage
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });
    };

    return {
        getTeamMembers: _p.getTeamMembers,
        getTeamMemberInfoByID: _p.getTeamMemberInfoByID,
        getTeammatesById: _p.getTeammatesById,
        patchTeamMemberInfo: _p.patchTeamMemberInfo,
        postTeamMemberInfo: _p.postTeamMemberInfo,
        updateTeamMemberInfo: _p.updateTeamMemberInfo,
        updateTeamMemberHierarchy: _p.updateTeamMemberHierarchy,
        addTeamMate: _p.addTeamMate,
        updateTeamMateInfo: _p.updateTeamMateInfo,
        getTeammateById: _p.getTeammateById,
        getRequestsByFID: _p.getRequestsByFID,
        getTeamMemberInfoByUsername: _p.getTeamMemberInfoByUsername,
        getAcceptedByUID: _p.getAcceptedByUID
    };

})();

module.exports = teamManagementController;