const { notificationToken } = require('../models/payliance.mgmt.server.modal');
const userServerModel = require('../models/user.server.model');

var NotificationManagementController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        Notification = require('../models/notifications.management.server.model'),
        User = require('../models/user.server.model'),
        utilityHelper = require('../helpers/utilities.helper'),
        errorHelper = require('../helpers/error.helper'),
        Promise = require("bluebird"),
        request = require('request'),
        Payliance = require('../models/payliance.mgmt.server.modal'),
        NotificationTokenObj = Payliance.notificationToken,
		mongoose = require('mongoose');


    var documentFields = '_id UID type read message notificationProperties';

    function NotificationManagementModule() {}

    NotificationManagementModule.CreateNotification = function(notificationObj, loggedInUser) {
        var notificationManagementInfo = new Notification();

        notificationManagementInfo.UID = notificationObj.UID;
        notificationManagementInfo.type = notificationObj.type;
        notificationManagementInfo.read = notificationObj.read;
        notificationManagementInfo.message = notificationObj.message;
        notificationManagementInfo.notificationProperties = notificationObj.notificationProperties;
        notificationManagementInfo.addedBy = loggedInUser;
        notificationManagementInfo.addedOn = new Date();

        return notificationManagementInfo;
    };

    NotificationManagementModule.AddTeamMate = function(teamObj, loggedInUser) {
        var teamMateInfo = new TeamMate();

        teamMateInfo.UID = teamObj.UID;
        teamMateInfo.FID = teamObj.FID;
        teamMateInfo.status = teamObj.status;
        teamMateInfo.addedBy = loggedInUser;
        teamMateInfo.addedOn = new Date();

        return teamMateInfo;
    };


    var _p = NotificationManagementModule.prototype;


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
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.teamMember.updateMessage
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

        return dataProviderHelper.save(req.teamMateInfo);
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
        var teamMateInfo = NotificationManagementModule.AddTeamMate(modelInfo, req.decoded.user.username);
        dataProviderHelper.save(teamMateInfo).then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    status: HTTPStatus.OK,
                    message: 'Your request to add as teammate has been sent successfully!'
                });
            })
            .catch(function(err) {
                return next(err);
            });
    }

    _p.saveNotification = function(req, res, next) {
        //console.log('req body save notification ', req.body)
        // req.body = JSON.parse(req.body);
        //console.log('saved notification ', req.body);
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        var notificationInfo = NotificationManagementModule.CreateNotification(req.body, req.decoded.user.username);
        dataProviderHelper.save(notificationInfo).then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    status: HTTPStatus.OK,
                    message: 'Notification has been sent successfully!'
                });
                let query
                if (req.body.type == '3' || req.body.type == '4' || req.body.type == '5') {
                    query = {
                        _id: req.body.UID,
                        deleted: false
                    }
                } else {
                    query = {
                        _id: req.body.notificationProperties.FID,
                        deleted: false
                    }
                }
                let Tokenquery = {
                        UID: req.body.UID

                    }
                    //console.log('tokenquery',Tokenquery)
                dataProviderHelper.find(User, query).then(function(user) {
                    //console.log("userdata azar",query,user);
                    if (user) {
                        dataProviderHelper.find(NotificationTokenObj, Tokenquery).then(function(tokenList) {
                            //console.log("tokenlist",tokenList)
                            for (let i = 0; i < tokenList.length; i++) {
                                var message;
                                var title;
                                if (req.body.type == '0') {
                                    title = "New notification from " + user[0].username
                                    message = user[0].username + " wants to be your teammate"

                                } else if (req.body.type == '1') {
                                    title = "New notification from " + user[0].username
                                    message = user[0].username + " has accepted your teammate request"

                                } else if (req.body.type == '2') {
                                    title = "New notification from " + user[0].username
                                    message = user[0].username + " has declined your teammate request"

                                } else if (req.body.type == '3') {
                                    title = "New notification from Judge"
                                    message = req.body.message

                                } else if (req.body.type == '4') {
                                    title = "New notification from Judge"
                                    message = req.body.message
                                } else if (req.body.type == '5') {
                                    title = "New notification from Judge"
                                    message = req.body.message

                                }
                                let body = {

                                        "notification": {
                                            "title": title,
                                            "body": message,
                                            "sound": "default",
                                            "click_action": "FCM_PLUGIN_ACTIVITY",
                                            "icon": "fcm_push_icon"
                                        },
                                        "data": {
                                            "param1": "value1",
                                            "param2": "value2"
                                        },
                                        "to": tokenList[i].token,
                                        "priority": "high",
                                        "restricted_package_name": ""
                                    }
                                    //console.log('notification body',body)

                                const callback = (err, resp, body) => {
                                    if (!err && resp.statusCode == 200) {
                                        //console.log(body,"firebasenotification")
                                        //console.log("success")
                                    } else {
                                        //console.log(body,"firebasenotification")
                                        //console.log("failure")
                                    }
                                }
                                const options = {
                                    url: 'https://fcm.googleapis.com/fcm/send',
                                    method: 'POST',
                                    body: body,
                                    json: true,
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Authorization': 'key=AAAADOoGBAk:APA91bGsBasgwjWqqSHcMwro3hGTrZ97TcG1CYk7xExoEn2oW7i4VJq-mPKrBD9ESNYToNrJg0RxJ44PyBg2jQz3c60KkG9ttZ1JqS2c_-89ogikydrcBLBVyIfPyG5SyM8JN9DZUMRC'
                                    }

                                };
                                request(options, callback)
                            }


                        })


                    }
                })
            })
            .catch(function(err) {
                return next(err);
            });
    }

    _p.updateNotification = function(req, res, next) {
        // req.body = JSON.parse(req.body);
        //console.log('req.body ==============> ', req);
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);

        _p.updateNotificationMiddlewareFunc(req, res, req.body, next)
            .then(function() {


                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.teamMember.updateMessage
                });
                let query;

                query = {
                    _id: req.body.notificationProperties.FID,
                    deleted: false
                }


                let Tokenquery = {
                        UID: req.body.UID

                    }
                    //console.log('tokenquery',Tokenquery)
                dataProviderHelper.find(User, query).then(function(user) {
                    //console.log("userdata azar",query,user);
                    if (user) {
                        dataProviderHelper.find(NotificationTokenObj, Tokenquery).then(function(tokenList) {
                            //console.log("tokenlist",tokenList)
                            for (let i = 0; i < tokenList.length; i++) {
                                var message;
                                var title;
                                if (req.body.type == '0') {
                                    title = "New notification from " + user[0].username
                                    message = user[0].username + " wants to be your teammate"

                                } else if (req.body.type == '1') {
                                    title = "New notification from " + user[0].username
                                    message = user[0].username + " has accepted your teammate request"

                                } else if (req.body.type == '2') {
                                    title = "New notification from " + user[0].username
                                    message = user[0].username + " has declined your teammate request"

                                } else if (req.body.type == '3') {
                                    title = "New notification from Judge"
                                    message = req.body.message

                                } else if (req.body.type == '4') {
                                    title = "New notification from Judge"
                                    message = req.body.message
                                } else if (req.body.type == '5') {
                                    title = "New notification from Judge"
                                    message = req.body.message

                                }
                                let body = {

                                        "notification": {
                                            "title": title,
                                            "body": message,
                                            "sound": "default",
                                            "click_action": "FCM_PLUGIN_ACTIVITY",
                                            "icon": "fcm_push_icon"
                                        },
                                        "data": {
                                            "param1": "value1",
                                            "param2": "value2"
                                        },
                                        "to": tokenList[i].token,
                                        "priority": "high",
                                        "restricted_package_name": ""
                                    }
                                    //console.log('notification body',body)

                                const callback = (err, resp, body) => {
                                    if (!err && resp.statusCode == 200) {
                                        //console.log('firebasenotification')
                                        //console.log("success")
                                    } else {
                                        //console.log("failure")
                                    }
                                }
                                const options = {
                                    url: 'https://fcm.googleapis.com/fcm/send',
                                    method: 'POST',
                                    body: body,
                                    json: true,
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Authorization': 'key=AAAADOoGBAk:APA91bGsBasgwjWqqSHcMwro3hGTrZ97TcG1CYk7xExoEn2oW7i4VJq-mPKrBD9ESNYToNrJg0RxJ44PyBg2jQz3c60KkG9ttZ1JqS2c_-89ogikydrcBLBVyIfPyG5SyM8JN9DZUMRC'
                                    }

                                };
                                request(options, callback)
                            }


                        })


                    }
                })
            })
            .catch(function(err) {
                return next(err);
            });
    };

    _p.updateNotificationMiddlewareFunc = function(req, res, modelInfo, next) {

        //  req.notificationManagementInfo[0];
        var notificationInfo = modelInfo;

        req.notificationManagementInfo.UID = notificationInfo.UID;
        req.notificationManagementInfo.type = notificationInfo.type;
        req.notificationManagementInfo.read = notificationInfo.read;
        req.notificationManagementInfo.message = notificationInfo.message;
        req.notificationManagementInfo.notificationProperties.FID = notificationInfo.notificationProperties.FID;
        req.notificationManagementInfo.notificationProperties.RID = notificationInfo.notificationProperties.RID;
        req.notificationManagementInfo.updatedBy = req.decoded.user.username;
        req.notificationManagementInfo.updatedOn = new Date();

        return dataProviderHelper.save(req.notificationManagementInfo);
    };

    _p.getAllNotifications = function(req, next) {
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};

        // //console.log('person name', req.query.personName);

        query.deleted = false;

        return dataProviderHelper.find(Notification, query);
    };

    var ObjectId = require('mongodb').ObjectID;

    _p.getNotificationByRID = function(req, next) {
        let RID = ObjectId(req.params.RID);
        return Notification.find({ "notificationProperties.RID": req.params.RID })
    };

    _p.getNotificationByFID = function(req, next) {
        // let RID = ObjectId(req.params.RID);
        return Notification.find({ "notificationProperties.FID": req.params.FID })
    };

    _p.getNotificationByUID = function(req, next) {
        // let RID = ObjectId(req.params.RID);
        return Notification.find({ "UID": req.params.UID, "read": false })
    };

    _p.getReadNotificationByUID = function(req, next) {
        // let RID = ObjectId(req.params.RID);
        return Notification.find({ "UID": req.params.UID, "read": true })
    };

    var ObjectId = require('mongodb').ObjectID;

    _p.getNotificationByNID = function(req, next) {
        let NID = ObjectId(req.params.NID);
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // //console.log('req.query', req)
        var query = {};
        // //console.log('sport name req', req.query.sportName);

        // matches anything that  starts with the inputted sport name, case insensitive
        if (req.params.NID) {
            query._id = NID;
            // query.UID = req.params.UID
        }

        return dataProviderHelper.findAll(Notification, query);
    };

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

    _p.getTeammateById = function(req) {
        //console.log(req.params.reqid) 
        return dataProviderHelper.findById(TeamMate, req.params.reqid, documentTeammateFields);
    };

    function escapeRegex(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};

    _p.getUserForSendNotifications = function(req, res, next) {

        let regex, condOR

        console.log('req.body.searchString',req.body.searchString)

        regex = new RegExp(escapeRegex(req.body.searchString), 'gi');

        userServerModel.find({username:regex}, function(err, response) {
            if (err) {
                res.json({
                    success: false,
                    message: "Cannot get judges"
                })
            } else {

                res.json({
                    success: true,
                    result: response
                })
            }
        })
    }

    _p.sendNotificationToUsers = function(req, res, next) {

     
        var user = req.body.user;
        var isSendMessageFail = false;
        var i = 0;
        //console.log(user.length)
      
            //   //console.log(i,"index")
            //   //console.log(user[i].token);

            if(user.length){

               
                user.forEach(element=>{

                    notificationToken.find({UID:mongoose.Types.ObjectId(element)},function(err,results){

                        if(results.length){

                            results.forEach(elementNot=>{

                               
                                    let body = {
            
                                        "notification": {
                                            "title": "Flyp10",
                                            "body": req.body.message,
                                            "sound": "default",
                                            "click_action": "FCM_PLUGIN_ACTIVITY",
                                            "icon": "fcm_push_icon"
                                        },
                                        "data": {
                                            "param1": "value1",
                                            "param2": "value2"
                                        },
                                        "to": elementNot.token,
                                        "priority": "high",
                                        "restricted_package_name": ""
                                    }
                                    //       //console.log('notification body',body)
                    
                                const callback = (err, resp, body) => {
            
                                    console.log('body',body)
                                    console.log('err',err)
                                    if (!err && resp.statusCode == 200) {
                                        //console.log("success");
                                        // if(i === (user.length-1)) {
                                        //    res.json({
                                        //        success: true
                                        //    })
                    
                                        // }
                
                                     
                    
                                    } else {
                                        //console.log("failure");
                                        //console.log(err)
                                        // isSendMessageFail = true;
                                        // res.json({
                                        //     success: false
                                        // })
                                    }
                                }
                                const options = {
                                    url: 'https://fcm.googleapis.com/fcm/send',
                                    method: 'POST',
                                    body: body,
                                    json: true,
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Authorization': 'key=AAAADOoGBAk:APA91bGsBasgwjWqqSHcMwro3hGTrZ97TcG1CYk7xExoEn2oW7i4VJq-mPKrBD9ESNYToNrJg0RxJ44PyBg2jQz3c60KkG9ttZ1JqS2c_-89ogikydrcBLBVyIfPyG5SyM8JN9DZUMRC'
                                    }
                    
                                };
                                request(options, callback);
                                
                            })

                        }


                    })


                   

                  
               
                  

                })

                res.json({
                    success: true
                })
            }else{
                res.json({
                    success: true
                })
            }
          
            

        
    }

    _p.sendNotification = function(req, res, next) {

        //console.log('notification req.body',req.body)
        let body = {

                "notification": {
                    "title": "New Notification has arrived",
                    "body": "Notification Body",
                    "sound": "default",
                    "click_action": "FCM_PLUGIN_ACTIVITY",
                    "icon": "fcm_push_icon"
                },
                "data": {
                    "param1": "value1",
                    "param2": "value2"
                },
                "to": token,
                "priority": "high",
                "restricted_package_name": ""
            }
            //   let options = new HttpHeaders().set('Content-Type','application/json');

        //   this.http.post("https://fcm.googleapis.com/fcm/send",body,{
        //     headers: options.set('Authorization', 'key=AAAADOoGBAk:APA91bGsBasgwjWqqSHcMwro3hGTrZ97TcG1CYk7xExoEn2oW7i4VJq-mPKrBD9ESNYToNrJg0RxJ44PyBg2jQz3c60KkG9ttZ1JqS2c_-89ogikydrcBLBVyIfPyG5SyM8JN9DZUMRC'),
        //   })
        //     .subscribe();
        return true;

    }

    _p.getTeamMemberInfoByUsername = function(req) {
        var query = {};
        query.username = req.params.username;
        query.deleted = false
        return dataProviderHelper.find(User, query);
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
                    var teamManagementInfo = NotificationManagementModule.CreateTeamMember(modelInfo, hierarchyOrder, req.decoded.user.username, imageInfo);

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
        saveNotification: _p.saveNotification,
        updateNotification: _p.updateNotification,
        getAllNotifications: _p.getAllNotifications,
        getNotificationByRID: _p.getNotificationByRID,
        getNotificationByFID: _p.getNotificationByFID,
        getNotificationByNID: _p.getNotificationByNID,
        getNotificationByUID: _p.getNotificationByUID,
        getReadNotificationByUID: _p.getReadNotificationByUID,
        sendNotification: _p.sendNotification,
        getUserForSendNotifications: _p.getUserForSendNotifications,
        sendNotificationToUsers: _p.sendNotificationToUsers

        // getTeammatesById: _p.getTeammatesById,
        // patchTeamMemberInfo: _p.patchTeamMemberInfo,
        // postTeamMemberInfo: _p.postTeamMemberInfo,
        // updateTeamMemberInfo: _p.updateTeamMemberInfo,
        // updateTeamMemberHierarchy: _p.updateTeamMemberHierarchy,
        // addTeamMate: _p.addTeamMate,
        // updateTeamMateInfo:_p.updateTeamMateInfo,
        // getTeammateById:_p.getTeammateById,
        // getRequestsByFID:_p.getRequestsByFID,
        // getTeamMemberInfoByUsername: _p.getTeamMemberInfoByUsername
    };

})();

module.exports = NotificationManagementController;