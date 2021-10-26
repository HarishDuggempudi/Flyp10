var eventController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        hasher = require('../auth/hasher'),
        applicationConfig = require('../configs/application.config'),
        Faq = require('../models/faq.server.model'),
        EventModel = require("../models/eventmeet.server.model.js"),
        EventMeet = EventModel.EventSportMeet,
        UserEventsMeet = EventModel.UserEvent,
        EventList = require("../models/eventlist.server.model.js"),
        EventMeetCoachMapping = require("../models/eventmeetcoachmapping.server.model.js"),
        EventMeetGroup = require("../models/eventmeetgroup.server.model.js"),
        utilityHelper = require('../helpers/utilities.helper'),
        errorHelper = require('../helpers/error.helper'),
        EventMeetModel = require('../models/eventmeet.model'),
        EnrollEventMeetModel = require('../models/enroll.mode'),
        EventMeetForJudges = require('../models/eventMeetForJudges.server.model'),
        Routine = require('../models/routine.server.model'),
        Promise = require("bluebird"),
        fs = Promise.promisifyAll(require('fs'));
    var moment = require("moment");
    var mongoose = require('mongoose');
    var documentFields = '_id question answer assignedTo active ';

    function EventModule() {}

    EventModule.CreateEventMeeet = function(eventObj, loggedInUser) {
        var neweventInfo = new EventMeet();
        neweventInfo.title = eventObj.title;
        neweventInfo.userid = eventObj.userid;
        neweventInfo.sportName = eventObj.sportName;
        neweventInfo.sportid = mongoose.Types.ObjectId(eventObj.sportid);
        neweventInfo.address = eventObj.address;
        neweventInfo.state = eventObj.state;
        neweventInfo.city = eventObj.city;
        neweventInfo.start = eventObj.start;
        neweventInfo.end = eventObj.end;
        neweventInfo.Nod = eventObj.Nod;
        neweventInfo.active = eventObj.active;
        neweventInfo.addedBy = loggedInUser;
        neweventInfo.addedOn = new Date();
        return neweventInfo;
    };
    EventModule.CreateEventMeeetCoachMapping = function(eventObj) {
        var neweventInfo = new EventMeetCoachMapping();
        neweventInfo.eventId = eventObj.eventId;
        neweventInfo.userId = eventObj.userId;
        neweventInfo.active = eventObj.active;
        neweventInfo.addedBy = eventObj.addedBy;
        neweventInfo.addedOn = new Date();
        return neweventInfo;
    };
    EventModule.CreateEventMeetGroup = function(eventObj) {
        var neweventInfo = new EventMeetGroup();
        neweventInfo.eventId = eventObj.eventId;
        neweventInfo.competitors = eventObj.competitors;
        neweventInfo.active = eventObj.active;
        neweventInfo.groupName = eventObj.groupName;
        neweventInfo.addedBy = eventObj.addedBy;
        neweventInfo.addedOn = new Date();
        return neweventInfo;
    };
    EventModule.CreateEventMeeetNew = function(eventObj) {
        var neweventInfo = new EventMeetModel();
        neweventInfo.EventName = eventObj.EventName
        neweventInfo.StartDate = eventObj.StartDate
        neweventInfo.EndDate = eventObj.EndDate
        neweventInfo.Sport = eventObj.Sports
        neweventInfo.Events = eventObj.Events
        neweventInfo.Levels = eventObj.Levels
        neweventInfo.SportName = eventObj.SportName
        neweventInfo.Country = eventObj.Country
        neweventInfo.State = eventObj.State
        neweventInfo.Judges = eventObj.SportDetails
            // neweventInfo.Judges = eventObj.Judges
        neweventInfo.NjudgePrice = eventObj.NjudgePrice
        neweventInfo.NcompetitorPrice = eventObj.NcompetitorPrice
        neweventInfo.NtechnicianPrice = eventObj.NtechnicianPrice
        neweventInfo.SjudgePrice = eventObj.SjudgePrice
        neweventInfo.ScompetitorPrice = eventObj.ScompetitorPrice
        neweventInfo.StechnicianPrice = eventObj.StechnicianPrice
        neweventInfo.active = eventObj.active
        neweventInfo.SanctionMeet = eventObj.SanctionMeet ? true : false
        neweventInfo.EventLevel = eventObj.EventLevel ? eventObj.EventLevel : '0';
        return neweventInfo;
    };
    EventModule.CreateenrollEventMeet = function(eventObj) {

        var neweventInfo = new EnrollEventMeetModel();
        neweventInfo.eventMeetId = eventObj._id
        neweventInfo.judgeId = eventObj.Judges
        neweventInfo.sportId = eventObj.Sport
        neweventInfo.eventId = eventObj.Events
        neweventInfo.levelId = eventObj.Levels
        neweventInfo.userId = eventObj.userId
        return neweventInfo;
    };
    EventModule.CreateUserEventMeeet = function(eventObj, loggedInUser) {
        var neweventInfo = new UserEventsMeet();
        neweventInfo.title = eventObj.title;
        neweventInfo.userid = mongoose.Types.ObjectId(eventObj.userid);
        neweventInfo.sportid = mongoose.Types.ObjectId(eventObj.sportid);
        neweventInfo.eventid = mongoose.Types.ObjectId(eventObj._id);
        // neweventInfo.sportName = eventObj.sportName;	
        // neweventInfo.address = eventObj.address;
        // neweventInfo.state = eventObj.state;
        // neweventInfo.city = eventObj.city;
        // neweventInfo.start = eventObj.start;
        // neweventInfo.end = eventObj.end;	
        // neweventInfo.Nod = eventObj.Nod;
        neweventInfo.active = eventObj.active;
        neweventInfo.addedBy = loggedInUser;
        neweventInfo.addedOn = new Date();
        return neweventInfo;
    };

    EventModule.CreateEventList = function(eventObj, loggedInUser) {
        var neweventInfo = new EventList();
        neweventInfo.title = eventObj.title;
        neweventInfo.userid = eventObj.userid;
        neweventInfo.sportName = eventObj.sportName;
        neweventInfo.address = eventObj.address;
        neweventInfo.state = eventObj.state;
        neweventInfo.city = eventObj.city;
        neweventInfo.start = eventObj.start;
        neweventInfo.end = eventObj.end;
        neweventInfo.Nod = eventObj.Nod;
        neweventInfo.active = eventObj.active;
        neweventInfo.addedBy = loggedInUser;
        neweventInfo.addedOn = new Date();
        return neweventInfo;
    };
    var _p = EventModule.prototype;

    _p.checkValidationErrors = function(req) {
        //  console.log(req.body)
        req.checkBody('question', messageConfig.user.validationErrMessage.firstName).notEmpty();
        req.checkBody('answer', messageConfig.user.validationErrMessage.lastName).notEmpty();
        req.checkBody('assignedTo', messageConfig.user.validationErrMessage.email).notEmpty();
        return req.validationErrors();
    };
    _p.checkEventValidationErrors = function(req) {
        //  console.log(req.body)
        req.checkBody('title', messageConfig.eventManager.validationErrMessage.eventTitle).notEmpty();
        req.checkBody('sportid', messageConfig.eventManager.validationErrMessage.Sport).notEmpty();
        req.checkBody('start', messageConfig.eventManager.validationErrMessage.startDate).notEmpty();
        req.checkBody('end', messageConfig.eventManager.validationErrMessage.endDate).notEmpty();
        req.checkBody('state', messageConfig.eventManager.validationErrMessage.venueAddress).notEmpty();
        req.checkBody('city', messageConfig.eventManager.validationErrMessage.venueAddress).notEmpty();
        return req.validationErrors();
    };
    _p.checkEventMapValidationErrors = function(req) {
        //   console.log(req.body)
        req.checkBody('eventId', messageConfig.eventManager.validationErrMessage.eventId).notEmpty();
        req.checkBody('userId', messageConfig.eventManager.validationErrMessage.userId).notEmpty();

        return req.validationErrors();
    };
    _p.checkUserEventValidationErrors = function(req) {
        //  console.log(req.body)
        req.checkBody('userid', messageConfig.eventManager.validationErrMessage.eventTitle).notEmpty();
        req.checkBody('sportid', messageConfig.eventManager.validationErrMessage.Sport).notEmpty();
        req.checkBody('_id', messageConfig.eventManager.validationErrMessage.startDate).notEmpty();
        return req.validationErrors();
    };
    _p.checkEventListValidationErrors = function(req) {
        //   console.log(req.body)
        req.checkBody('event', messageConfig.eventManager.validationErrMessage.eventTitle).notEmpty();
        req.checkBody('state', messageConfig.user.validationErrMessage.firstName).notEmpty();
        req.checkBody('city', messageConfig.user.validationErrMessage.firstName).notEmpty();
        return req.validationErrors();
    };

    _p.getFaqByID = function(req) {
        // console.log(req.params.faqid)

        return dataProviderHelper.findById(Faq, req.params.faqid, documentFields);
    };

    _p.updateEvent = function(req, res, next) {
        if (req.body.title) {
            //    console.log('req.body ', req.body);
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.title = req.params.event;
            query._id = { $ne: modelInfo._id }
            query.deleted = false;
            //    console.log('########## query ', query)
            //    console.log('modelInfo ', modelInfo)
            // return _p.updateEventFunc(req, res, modelInfo);
            dataProviderHelper.checkForDuplicateEntry(EventMeet, query)
                .then(function(count) {
                    //    console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.faq.alreadyExistsFaq + '"}');
                    } else {
                        //       console.log("inside update")
                        return _p.updateEventFunc(req, res, modelInfo);
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

    _p.updateEventFunc = function(req, res, modelInfo) {
        req.eventlistByEvent.title = modelInfo.title;
        req.eventlistByEvent.userid = modelInfo.userid;
        req.eventlistByEvent.sportName = modelInfo.sportName;
        req.eventlistByEvent.sportid = mongoose.Types.ObjectId(modelInfo.sportid);
        req.eventlistByEvent.address = modelInfo.address;
        req.eventlistByEvent.state = modelInfo.state;
        req.eventlistByEvent.city = modelInfo.city;
        req.eventlistByEvent.start = modelInfo.start;
        req.eventlistByEvent.end = modelInfo.end;
        req.eventlistByEvent.Nod = modelInfo.Nod;
        req.eventlistByEvent.active = modelInfo.active;
        return dataProviderHelper.save(req.eventlistByEvent);
    };


    _p.patchEvent = function(req, res, next) {


        var _query = {
            'title': req.params.event,
            'deleted': false
        };
        //    console.log("sdsdsd", req.body)
        // if(req.routinelist.routinestatus!='1'){
        dataProviderHelper.checkForDuplicateEntry(EventMeet, _query)
            .then(function(count) {

                if (count > 1) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.routineDeleteDeny + '"}');
                } else {
                    // req.routinelist.routinestatus=req.body.routinestatus;
                    // if(req.body.routinestatus=='1'){
                    //     req.routinelist.score=req.body.score;
                    //     req.routinelist.comment=req.body.comment;
                    //     req.routinelist.dod=req.body.dod
                    // }else{
                    //     req.routinelist.score='0';
                    // }    
                    // req.routinelist.judgedBy=req.body.judgedBy
                    // req.routinelist.judgedOn=req.body.judgedOn
                    req.eventlistByEvent.deleted = true;
                    dataProviderHelper.save(req.eventlistByEvent)
                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.routine.deleteMessageroutine
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });

        // }else{
        //         res.status(HTTPStatus.BAD_REQUEST);
        //         res.json({
        //             message: messageConfig.routine.routineDeleteDeny
        //         });
        //    }

    }


    _p.getAllEvent = function(req) {
        var query = [{
                $match: { 'deleted': false }

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
            }
        ]
        return dataProviderHelper.aggregate(EventMeet, query);
    };

    _p.getallEventList = function(req) {
        var query = {};
        query.deleted = false;
        return dataProviderHelper.find(EventList, query);
    };

    _p.getAllUserEventList = function(req) {
        var query = {};
        query.deleted = false;
        return dataProviderHelper.find(UserEventsMeet, query);
    };
    _p.getAssignedEventMeetForJudges = function(req) {

        var query = {};
        query.judgeId = req.params.judgeid;
        query.judged = false,
            query.assigned = true;
        return dataProviderHelper.find(EventMeetForJudges, query);
    };
    _p.getEventMeetRoutineID = function(req) {

        var query = {};
        query.routineId = req.params.routineID;
        query.judgeId = req.body.jid;
        return dataProviderHelper.find(EventMeetForJudges, query);
    };

    _p.getEventJudgeDetails = function(req) {
        var query = [{
                $match: {
                    $and: [{ 'deleted': false }, { 'routineId': mongoose.Types.ObjectId(req.params.routineID) }, { 'judgeId': mongoose.Types.ObjectId(req.body.jid) }]
                }

            },
            {
                $lookup: {
                    from: "EventMeet",
                    localField: "eventId",
                    foreignField: "_id",
                    as: "eventmeetInfo"
                }
            },
            {
                $unwind: "$eventmeetInfo"
            }
        ]

        return dataProviderHelper.aggregate(EventMeetForJudges, query);
    };

    _p.updateroutinejudgedStatus = function(req) {

        setTimeout(function() {
            var _query = {
                'routineId': req.body._id,
                'deleted': false
            };


            dataProviderHelper.find(EventMeetForJudges, _query).then(function(res) {
                    // console.log(res)
                    let routineArr = res ? res : []
                    let judgedarr = [];
                    let pendingarr = [];
                    let technician = [];
                    let score = 0;
                    let length = routineArr.length;
                    if (routineArr.length > 0) {
                        judgedarr = routineArr.filter(item => item.judged == true)
                        pendingarr = routineArr.filter(item => item.judged == false)
                            //  console.log('judgedarr,pendingarr', judgedarr, pendingarr)
                            //  console.log('judgedarr,pendingarr', judgedarr.length, pendingarr.length,length);

                        technician = routineArr.filter(item => item.isTechnician == '1');
                        if (technician.length > 0) {
                            length = length - 1;
                        }
                        //  console.log('judgedarr,pendingarr', judgedarr.length, pendingarr.length,length);

                        if (pendingarr.length == 0) {
                            for (let i = 0; i < routineArr.length; i++) {

                                let temp = routineArr[i];
                                //  console.log(temp,'technicianjudge')
                                if (temp.hasOwnProperty('isTechnician') && temp.isTechnician == '1') {
                                    routineArr.splice(i, 1)
                                        // length = length -1;
                                } else {
                                    let num1 = Number(temp.score)
                                    num1 = isNaN(num1) ? 0 : num1;
                                    score = score + num1;
                                    //  console.log('score in event meet',length)
                                    if (i == routineArr.length - 1) {
                                        score = Number(score / length)
                                        score = Number(score.toFixed(3))
                                            //   console.log('score', score)
                                        let update = { $set: { "routinestatus": "1", "score": score } }
                                        let Query = { _id: mongoose.Types.ObjectId(req.body._id) }
                                            //completed=false;
                                            //    console.log('update', update)
                                            //  console.log('Query', Query)
                                        try {
                                            dataProviderHelper.updateMany(Routine, Query, update);
                                            try {
                                                //   console.log('notification')

                                                _p.sendNotification(req)
                                            } catch (e) {

                                            }

                                        } catch (e) {
                                            // console.log('Querycatch', e)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }).catch(Promise.CancellationError, function(cancellationErr) {
                    //errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    //return next(err);
                });

        }, 5000)

    }
    _p.sendNotification = function(req) {

        //console.log(req.body._id,'sendNotification')
        var query = [{ $match: { '_id': mongoose.Types.ObjectId(req.body._id), 'deleted': false } },

            {

                $lookup: {

                    from: 'Flyp10_User',
                    localField: 'uid',
                    foreignField: '_id',
                    as: "UserInformation"

                }

            },
            { $unwind: "$UserInformation" },
            {

                $lookup: {

                    from: 'NotificationToken',
                    localField: 'UserInformation._id',
                    foreignField: 'UID',
                    as: "tokenInfomation"

                }

            },
            { $unwind: "$tokenInfomation" },

        ]
        dataProviderHelper.aggregate(Routine, query).then(function(routine) {
            // console.log("userdata", routine);

            if (routine.length > 0) {
                //  console.log("userdata", routine);
                // console.log(routine[0].token);
                let body = {

                        "notification": {
                            "title": "New Notification from Judge",
                            "body": routine[0].UserInformation.username + ',  Your routine "' + routine[0].title + '" performance was judged.',
                            "sound": "default",
                            "click_action": "FCM_PLUGIN_ACTIVITY",
                            "icon": "fcm_push_icon"
                        },
                        "data": {
                            "param1": "value1",
                            "param2": "value2"
                        },
                        "to": routine[0].tokenInfomation.token,
                        "priority": "high",
                        "restricted_package_name": ""
                    }
                    //  console.log('notification body', body)

                const callback = (err, resp, body) => {
                    if (!err && resp.statusCode == 200) {
                        //   console.log("success")
                    } else {
                        //   console.log("failure")
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





                //mailController.sendMail(req,user[0].email,'New Routine uploaded' ,next);
            }
        })


        .catch(Promise.CancellationError, function(cancellationErr) {
                //errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                //return next(err);
            });

    }
    _p.patchEventMeetRoutine = function(req, res, next) {


        var _query = {
            'judged': false,
            'routineId': mongoose.Types.ObjectId(req.params.routineID)
        };
        //   console.log("sdsdsd", req.body)
        // if(req.routinelist.routinestatus!='1'){
        dataProviderHelper.checkForDuplicateEntry(EventMeetForJudges, _query)
            .then(function(count) {

                if (count == 0) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "Routine already judged."}');
                } else {
                    req.MeetRoutine.routinestatus = req.body.routinestatus;
                    if (req.body.routinestatus == '1') {
                        req.MeetRoutine.score = req.body.score;
                        req.MeetRoutine.comments = req.body.comment;
                        req.MeetRoutine.dod = req.body.dod
                    } else {
                        req.MeetRoutine.score = '0';
                    }
                    req.MeetRoutine.judged = true;
                    req.MeetRoutine.judgedOn = req.body.judgedOn;

                    dataProviderHelper.save(req.MeetRoutine)
                }
            })
            .then(function() {
                _p.updateroutinejudgedStatus(req)
                res.status(HTTPStatus.OK);
                res.json({

                    message: "Routine Updated Sucessfully ."
                });

            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });

        // }else{
        //         res.status(HTTPStatus.BAD_REQUEST);
        //         res.json({
        //             message: messageConfig.routine.routineDeleteDeny
        //         });
        //    }

    }

    _p.patchAssignedStatusInEventMeetForJudges = function(req, res, next) {


        var _query = {
            'judged': false,
            'routineId': mongoose.Types.ObjectId(req.params.routineID)
        };
        dataProviderHelper.checkForDuplicateEntry(EventMeetForJudges, _query)
            .then(function(count) {

                if (count == 0) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "Routine already judged."}');
                } else {
                    // console.log(  req.MeetRoutine)
                    if (req.body.assigned) {
                        req.MeetRoutine.assigned = true;
                    }

                    //  console.log(req.MeetRoutine)  
                    //  console.log(req.MeetRoutine.assigned)

                    dataProviderHelper.save(req.MeetRoutine)
                }
            })

        .catch(function(err) {
            return next(err);
        });

        // }else{
        //         res.status(HTTPStatus.BAD_REQUEST);
        //         res.json({
        //             message: messageConfig.routine.routineDeleteDeny
        //         });
        //    }

    }

    _p.getfutureevntbyuserid = function(req) {
        var query = [{
                    $match: {

                        $and: [{ 'deleted': false }, { 'userid': mongoose.Types.ObjectId(req.params.userid) }]

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
                        from: "Flyp10_User",
                        localField: "userid",
                        foreignField: "_id",
                        as: "userinfo"
                    }
                },
                {
                    $unwind: "$userinfo"
                }, {
                    $lookup: {
                        from: "EventSportsMeet",
                        localField: "eventid",
                        foreignField: "_id",
                        as: "eventinfo"
                    }
                },
                {
                    $unwind: "$eventinfo"
                },
                {
                    "$project": {
                        "start": "$eventinfo.start",
                        "end": "$eventinfo.end",
                        "title": "$eventinfo.title",
                        "Nod": "$eventinfo.Nod",
                        "userid": "$userid",
                        "sportid": "$sportid",
                        "sportName": "$sportinfo.sportName",
                        "state": "$eventinfo.state",
                        "city": "$eventinfo.city",
                        "eventid": "$eventid",
                    }
                }

            ]
            //query.userid=req.params.userid;
            //query.deleted=false;
        return dataProviderHelper.aggregate(UserEventsMeet, query);
    };
    _p.getevntbyuseridandeventid = function(req) {
        var query = [{
                    $match: {

                        $and: [{ 'deleted': false }, { 'userid': mongoose.Types.ObjectId(req.params.userid) }, { 'eventid': mongoose.Types.ObjectId(req.params.eventid) }]

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
                        from: "Flyp10_User",
                        localField: "userid",
                        foreignField: "_id",
                        as: "userinfo"
                    }
                },
                {
                    $unwind: "$userinfo"
                }, {
                    $lookup: {
                        from: "EventSportsMeet",
                        localField: "eventid",
                        foreignField: "_id",
                        as: "eventinfo"
                    }
                },
                {
                    $unwind: "$eventinfo"
                },
                {
                    "$project": {
                        "start": "$eventinfo.start",
                        "end": "$eventinfo.end",
                        "title": "$eventinfo.title",
                        "Nod": "$eventinfo.Nod",
                        "userid": "$userid",
                        "sportid": "$sportid",
                        "sportName": "$sportinfo.sportName",
                        "state": "$eventinfo.state",
                        "city": "$eventinfo.city",
                        "eventid": "$eventid",
                    }
                }

            ]
            // query.userid=req.params.userid;
            // query.eventid=req.params.eventid
            // query.deleted=false;
        return dataProviderHelper.aggregate(UserEventsMeet, query);
    };
    _p.getEventlistByevent = function(req) {
        var query = {};
        query.deleted = false;
        query._id = req.params.event;
        //  console.log(query);
        return dataProviderHelper.find(EventMeet, query);
    };

    _p.getEventMeetByuserID = function(req) {
        var query = [{
                    $match: {

                        $and: [{ 'deleted': false }, { 'userid': mongoose.Types.ObjectId(req.params.userid) }]

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
                        from: "Flyp10_User",
                        localField: "userid",
                        foreignField: "_id",
                        as: "userinfo"
                    }
                },
                {
                    $unwind: "$userinfo"
                }, {
                    $lookup: {
                        from: "EventSportsMeet",
                        localField: "eventid",
                        foreignField: "_id",
                        as: "eventinfo"
                    }
                },
                {
                    $unwind: "$eventinfo"
                },
                {
                    "$project": {
                        "start": "$eventinfo.start",
                        "end": "$eventinfo.end",
                        "title": "$eventinfo.title",
                        "Nod": "$eventinfo.Nod",
                        "userid": "$userid",
                        "sportid": "$sportid",
                        "sportName": "$sportinfo.sportName",
                        "state": "$eventinfo.state",
                        "city": "$eventinfo.city",
                        "eventid": "$eventid",
                    }
                }

            ]
            //query.userid=req.params.userid;
            //query.deleted=false;
        return dataProviderHelper.aggregate(UserEventsMeet, query);
    };
    _p.getEventMeetCoachMapping = function(req, res) {
        //   console.log("gfgfgfg")
        //  console.log(req.query.eventId)/
        // var query = [
        //     {
        //         $match: {
        //             $and: [{ 'deleted': false }, { 'eventId': mongoose.Types.ObjectId(req.query.eventId) }]
        //         }
        //     }
        // ]
        EventMeetCoachMapping.find({ 'eventId': mongoose.Types.ObjectId(req.query.eventId) }, function(err, response) {

            res.json({
                success: true,
                result: response
            })

        })

    };
    _p.getEventmeetGroupByeventId = function(req, res) {

        EventMeetGroup.find({ 'eventId': mongoose.Types.ObjectId(req.query.eventId) }, function(err, response) {
            if (err) {
                res.json({
                    success: false,
                    result: err
                })
            } else {
                res.json({
                    success: true,
                    result: response
                })
            }


        })

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
    _p.saveNewEventList = function(req, res, next) {
        //req.body = JSON.parse(req.body);
        var errors = _p.checkEventValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes
            });
        } else {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            // console.log("modelInfo", modelInfo)
            query.title = modelInfo.title;
            query.userid = modelInfo.userid;
            query.deleted = false;
            // console.log(query)
            return dataProviderHelper.checkForDuplicateEntry(EventList, query).then(function(count) {
                    //   console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.eventManager.alreadyExists + '"}');
                    } else {
                        var newEventList = EventModule.CreateEventList(modelInfo, req.decoded.user.username);
                        return [newEventList, dataProviderHelper.save(newEventList)];
                    }
                }).then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.eventManager.saveMessage
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
    _p.addEventMeet = function(req, res, next) {
        var eventMeet = EventModule.CreateEventMeeetNew(req.body)

        //  console.log('eventmett', eventMeet)

        EventMeetModel.find({ EventName: req.body.EventName }, function(err, response) {
            if (response.length) {
                res.json({
                    success: false,
                    message: "Duplicate Event Name"
                })
            } else {
                eventMeet.save(function(err, response) {
                    if (!err) {
                        res.json({
                            success: true,
                            message: "Event Meet Added Successfully"
                        })
                    } else {
                        res.json({
                            success: false,
                            message: "Cannot add Event Meet"
                        })
                    }

                })
            }
        })


    }

    function addZ(n) { return n < 10 ? '0' + n : '' + n; }
    _p.getEnrolledEventMeetById = function(req, res, next) {

        var date1 = new Date();
        var formatDate1 = date1.getFullYear() + '-' + addZ(date1.getMonth() + 1) + '-' + addZ(date1.getDate());
        var formatDate2 = date1.getFullYear() + '-' + addZ(date1.getMonth() + 1) + '-' + addZ(date1.getDate() - 1);
        var startDate = new Date(formatDate1)
        var endDate = new Date(formatDate2);

        var query = [{
                $match: {
                    $and: [{ deleted: false }, { userId: mongoose.Types.ObjectId(req.params.id) }]
                }

            },


            {
                $lookup: {
                    from: "EventMeet",
                    localField: "eventMeetId",
                    foreignField: "_id",
                    as: "MeetInfo"
                }
            },

            { "$unwind": "$MeetInfo" },
            {

                $match: {
                    $and: [{ 'MeetInfo.deleted': false }, { 'MeetInfo.EndDate': { $gte: endDate } }]
                }


            }


        ]
        EnrollEventMeetModel.aggregate(query, function(err, response) {
            if (!err) {
                res.json({
                    success: true,
                    result: response
                })
            } else {
                res.json({
                    success: false,
                    msg: "Unable to load event meet details.",
                    err: err
                })
            }

        })

    }
    _p.getEnrolledEventMeetByIdStartEndDate = function(req, res, next) {

        var date1 = new Date();
        var formatDate1 = date1.getFullYear() + '-' + addZ(date1.getMonth() + 1) + '-' + addZ(date1.getDate());
        var formatDate2 = date1.getFullYear() + '-' + addZ(date1.getMonth() + 1) + '-' + addZ(date1.getDate() - 1);
        var startDate = new Date(formatDate1)
        var endDate = new Date(formatDate2);

        var query = [{
                $match: {
                    $and: [{ deleted: false }, { userId: mongoose.Types.ObjectId(req.params.id) }]
                }

            },


            {
                $lookup: {
                    from: "EventMeet",
                    localField: "eventMeetId",
                    foreignField: "_id",
                    as: "MeetInfo"
                }
            },

            { "$unwind": "$MeetInfo" },
            {

                $match: {
                    $and: [{ 'MeetInfo.deleted': false }, { 'MeetInfo.StartDate': { $lte: startDate } }, { 'MeetInfo.EndDate': { $gte: endDate } }]
                }


            }


        ]
        EnrollEventMeetModel.aggregate(query, function(err, response) {
            if (!err) {
                res.json({
                    success: true,
                    result: response
                })
            } else {
                res.json({
                    success: false,
                    msg: "Unable to load event meet details.",
                    err: err
                })
            }

        })

    }
    _p.checkisEnrolledEvent = function(req, res, next) {

        EnrollEventMeetModel.find({ userId: mongoose.Types.ObjectId(req.params.userID), eventMeetId: mongoose.Types.ObjectId(req.params.eventID) }, function(err, response) {
            res.json({
                success: true,
                result: response
            })
        })

    }
    _p.getAllEventMeet = function(req, res, next) {

        // console.log('req.decoded.user.username',req.decoded.user._id)
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var sortOpts = { addedOn: -1 };
        dataProviderHelper.getAllWithDocumentFieldsPagination(EventMeetModel, { deleted: false }, pagerOpts, null, sortOpts).then(resp => {
            if (!resp) {
                res.json({
                    success: false,
                    message: "Cannot get EventMeet"
                })
            } else {

                res.json({
                    success: true,
                    response: resp
                })
            }
        })



    }
    _p.getEventMeetForMap = function(req, res, next) {

        var date = new Date().toISOString();


        var query = [{
                $match: {
                    $and: [{ active: true },
                        { EndDate: { $gt: new Date() } }
                    ]
                }

            }, ]
            //   console.log(query);
        EventMeetModel.aggregate(query, function(err, response) {
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
    _p.getLowerEventMeet = function(req, res, next) {

        var date = new Date().toISOString();


        var query = [{
                $match: {
                    $and: [{ active: true },
                        { EventLevel: '0' },
                        { EndDate: { $gt: new Date() } }
                    ]
                }

            }, ]
            // console.log(query);
        EventMeetModel.aggregate(query, function(err, response) {
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


    _p.updateEventMeet = function(req, res, next) {

        //  console.log(req.body)
        EventMeetModel.update({ _id: req.params.eventId }, { $set: req.body }, function(err, response) {

            if (!err) {
                res.json({
                    success: true,
                    message: "Event Meet Updated Successfully"
                })
            } else {
                res.json({
                    success: false,
                    message: "Cannot Update Event Meet"
                })
            }
        })

    }
    _p.updateMeetdeventRoutineStatus = function(req, res, next) {


        EventMeetForJudges.update({ _id: req.body._id }, { $set: { routinestatus: '0', judged: false } }, function(err, response) {

            if (!err) {
                res.json({
                    success: true,
                    message: "Routine Status Updated Successfully"
                })
            } else {
                res.json({
                    success: false,
                    message: "Unable to update routine status."
                })
            }
        })

    }
    _p.getEventMeet = function(req, res, next) {


        EventMeetModel.find({ _id: req.params.eventId }, function(err, response) {
            if (!err) {
                res.json({
                    success: true,
                    result: response[0]
                })
            } else {
                res.json({
                    success: false,
                    message: "Cannot Get Event Meet"
                })
            }
        })

    }
    _p.getEnrolledEventMeet = function(req, res, next) {
        EnrollEventMeetModel.find({ deleted: false }, function(err, response) {


            //   console.log('response', response)

            res.json({
                success: true,
                result: response
            })

        })

    }
    _p.enrollEventMeet = function(req, res, next) {

        var enrollEvent = EventModule.CreateenrollEventMeet(req.body)
            // console.log('it came', enrollEvent)
        enrollEvent.save(function(err, response) {
            //  console.log('err', err)
            // console.log('response', response)
            if (!err) {
                res.json({
                    success: true,
                    result: "Successfully Enrolled"
                })
            } else {
                res.json({
                    success: false,
                    message: "Cannot Enroll Event Meet"
                })
            }
        })

    }
    _p.removeEventList = function(req, res, next) {
        var query = {};
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        query._id = req.params.eventid;
        //    console.log("query", query)
        dataProviderHelper.removeModelData(UserEventsMeet, query).then(function() {
            res.status(HTTPStatus.OK);
            res.json({
                    message: messageConfig.eventManager.deleteMessage
                }).catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });

        })
    }

    _p.removeEventMeetCoachMappingList = function(req, res, next) {
        var query = {};
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        query.userId = req.query.userId;
        query.eventId = req.query.eventId;
        //   console.log("querygfghgfj", query)
        dataProviderHelper.removeModelData(EventMeetCoachMapping, query).then(function() {
            res.status(HTTPStatus.OK);
            res.json({
                    message: messageConfig.eventManager.deleteMessage
                }).catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });

        })
    }
    _p.removeEventMeetGroup = function(req, res, next) {
        var query = {};
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        query.eventId = req.body.eventId;
        query.groupName = req.body.groupName
        dataProviderHelper.removeModelData(EventMeetGroup, query).then(function() {
            res.status(HTTPStatus.OK);
            res.json({
                    message: messageConfig.eventManager.deleteMessage
                }).catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });

        })
    }
    _p.saveEventMeet = function(req, res, next) {
        //req.body = JSON.parse(req.body);
        var errors = _p.checkEventValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes
            });
        } else {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            //     console.log("modelInfo", modelInfo)
            query.title = modelInfo.title;
            query.sportid = modelInfo.sportid;
            query.deleted = false;
            return dataProviderHelper.checkForDuplicateEntry(EventMeet, query).then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.eventManager.alreadyExists + '"}');
                    } else {
                        var newEvent = EventModule.CreateEventMeeet(modelInfo, req.decoded.user.username);
                        return [newEvent, dataProviderHelper.save(newEvent)];
                    }
                }).then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.eventManager.saveMessage
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


    //req.body = JSON.parse(req.body);
    _p.saveEventMeetCoachMapping = function(req, res, next) {
        var errors = _p.checkEventMapValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes
            });
        } else {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            //  console.log("modelInfo", modelInfo)
            query.eventId = modelInfo.eventId;
            query.userId = modelInfo.userId;
            query.deleted = false;
            return dataProviderHelper.checkForDuplicateEntry(EventMeetCoachMapping, query).then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.eventManager.alreadyExists + '"}');
                    } else {
                        //console.log(req.decoded.user.username)
                        var newEvent = EventModule.CreateEventMeeetCoachMapping(modelInfo);
                        //  console.log(newEvent)
                        return [newEvent, dataProviderHelper.save(newEvent)];
                    }
                }).then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.eventManager.saveMessage
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
    _p.saveEventMeetGroup = function(req, res, next) {

        var query = {};

        query.eventId = req.body.eventId;
        query.groupName = req.body.groupName;
        query.deleted = false;
        return dataProviderHelper.checkForDuplicateEntry(EventMeetGroup, query).then(function(count) {
                if (count > 0) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.eventManager.alreadyExists + '"}');
                } else {
                    //console.log(req.decoded.user.username)
                    var newEvent = EventModule.CreateEventMeetGroup(req.body);
                    //  console.log(newEvent)
                    return [newEvent, dataProviderHelper.save(newEvent)];
                }
            }).then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.eventManager.saveMessage
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });

    };
    _p.saveUserEventMeet = function(req, res, next) {
        //req.body = JSON.parse(req.body);
        var errors = _p.checkUserEventValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes
            });
        } else {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            //    console.log("modelInfo", modelInfo)
            query.title = modelInfo.title;
            query.deleted = false;
            query.userid = modelInfo.userid;
            return dataProviderHelper.checkForDuplicateEntry(UserEventsMeet, query).then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.eventManager.alreadyExists + '"}');
                    } else {
                        var newEvent = EventModule.CreateUserEventMeeet(modelInfo, req.decoded.user.username);
                        return [newEvent, dataProviderHelper.save(newEvent)];
                    }
                }).then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.eventManager.saveMessage
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


    _p.getEventForJudges = function(req, res, next) {
        var query = [{
                    $match: {
                        $and: [{ deleted: false }, { $or: [{ routinestatus: '0' }, { routinestatus: '5' }] }, { isConverted: '2' }]
                    }

                },


                {
                    $lookup: {
                        from: "EventMeetForJudging",
                        localField: "_id",
                        foreignField: "routineId",
                        as: "judgeInfo"
                    }
                },

                { "$unwind": "$judgeInfo" },


                {
                    $match: {
                        $and: [{ 'judgeInfo.judged': false }, { 'judgeInfo.judgeId': mongoose.Types.ObjectId(req.params.judgeId) }]
                    }

                },
                {
                    $lookup: {
                        from: "EventMeet",
                        localField: "judgeInfo.eventId",
                        foreignField: "_id",
                        as: "eventmeetInfo"
                    }
                },
                { "$unwind": "$eventmeetInfo" },


            ]
            //    console.log(query, 'judgeInfo.judgeId', mongoose.Types.ObjectId(req.params.judgeId))
        Routine.aggregate(query, function(err, response) {
            if (err) {
                res.json({
                    success: false,
                    message: "Cannot get judges",
                    err: 'err'
                })
            } else {

                res.json({
                    success: true,
                    result: response
                })
            }
        })
    }

    _p.getEventMeetCoachMappingForUser = function(req, res, next) {
        //    console.log("eventmeet")
        var query = [{
                $match: {
                    $and: [{ deleted: false }, { userId: mongoose.Types.ObjectId(req.query.userId) }]
                }

            },

            {
                $lookup: {
                    from: "EventMeet",
                    localField: "eventId",
                    foreignField: "_id",
                    as: "eventMeetCoachMapping"
                }
            },

            { "$unwind": "$eventMeetCoachMapping" },

        ]

        EventMeetCoachMapping.aggregate(query, function(err, response) {
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
    _p.getMappedCompetitorsForeventmeet = function(req, res, next) {

        var query = [{
                $match: {
                    $and: [{ deleted: false }, { eventId: mongoose.Types.ObjectId(req.query.eventId) }]
                }

            },

            {
                $lookup: {
                    from: "Flyp10_User",
                    localField: "userId",
                    foreignField: "_id",
                    as: "competitors"
                }
            },

            { "$unwind": "$competitors" },

        ]

        EventMeetCoachMapping.aggregate(query, function(err, response) {
            if (err) {
                res.json({
                    success: false,
                    message: "Cannot get competitors"
                })
            } else {

                res.json({
                    success: true,
                    result: response
                })
            }
        })
    }
    _p.getReviewRoutine = function(req, res, next) {
        var query = [{
                    $match: {
                        $and: [{ deleted: false }, { $or: [{ routinestatus: '3' }, { routinestatus: '4' }] }, { judged: true }]
                    }

                },


                {
                    $lookup: {
                        from: "Routine",
                        localField: "routineId",
                        foreignField: "_id",
                        as: "routineinfo"
                    }
                },

                { "$unwind": "$routineinfo" },

                {
                    $lookup: {
                        from: "Flyp10_User",
                        localField: "judgeId",
                        foreignField: "_id",
                        as: "judgeInfo"
                    }
                },
                { "$unwind": "$judgeInfo" },
                {
                    $lookup: {
                        from: "EventMeet",
                        localField: "eventId",
                        foreignField: "_id",
                        as: "MeetInfo"
                    }
                },

                { "$unwind": "$MeetInfo" },



            ]
            //console.log(query,'judgeInfo.judgeId',mongoose.Types.ObjectId(req.params.judgeId))
        EventMeetForJudges.aggregate(query, function(err, response) {
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
    _p.getEventRoutineDetails = function(req, res, next) {
        var query = [{
                    $match: {
                        $and: [{ deleted: false }, { _id: mongoose.Types.ObjectId(req.body.routineID) }]
                    }

                },


                {
                    $lookup: {
                        from: "EventMeetForJudging",
                        localField: "_id",
                        foreignField: "routineId",
                        as: "judgeInfo"
                    }
                },

                { "$unwind": "$judgeInfo" },
                {
                    $match: {
                        $and: [{ 'judgeInfo.judged': false }, { 'judgeInfo.judgeId': mongoose.Types.ObjectId(req.params.judgeId) }]
                    }

                },


            ]
            //   console.log(query, 'judgeInfo.judgeId', mongoose.Types.ObjectId(req.params.judgeId))
        Routine.aggregate(query, function(err, response) {
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
    _p.getEventJudgesCount = function(req, res, next) {


        EventMeetForJudges.find({ routineId: req.params.routineId }, function(err, response) {
            if (!err) {
                res.json({
                    success: true,
                    result: response
                })
            } else {
                res.json({
                    success: false,
                    message: "Cannot Get Event Meet"
                })
            }
        })

    }
    _p.getJudgedEventMeetRoutine = function(req, res, next) {
        var query = [{
                    $match: {
                        $and: [{ deleted: false }, { judged: true }, { judgeId: mongoose.Types.ObjectId(req.params.judgeId) }]
                    }

                },


                {
                    $lookup: {
                        from: "Routine",
                        localField: "routineId",
                        foreignField: "_id",
                        as: "routineInfo"
                    }
                },

                { "$unwind": "$routineInfo" }



            ]
            //console.log(query,'judgeInfo.judgeId',mongoose.Types.ObjectId(req.params.judgeId))
        EventMeetForJudges.aggregate(query, function(err, response) {
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

    return {
        getAllEvent: _p.getAllEvent,
        saveEventMeet: _p.saveEventMeet,
        saveEventMeetCoachMapping: _p.saveEventMeetCoachMapping,
        saveEventMeetGroup: _p.saveEventMeetGroup,
        getEventMeetCoachMapping: _p.getEventMeetCoachMapping,
        getEventmeetGroupByeventId: _p.getEventmeetGroupByeventId,
        getallEventList: _p.getallEventList,
        saveNewEventList: _p.saveNewEventList,
        getEventMeetByuserID: _p.getEventMeetByuserID,
        getEventlistByevent: _p.getEventlistByevent,
        updateEvent: _p.updateEvent,
        patchEvent: _p.patchEvent,
        saveUserEventMeet: _p.saveUserEventMeet,
        getAllUserEventList: _p.getAllUserEventList,
        removeEventList: _p.removeEventList,
        removeEventMeetCoachMappingList: _p.removeEventMeetCoachMappingList,
        removeEventMeetGroup: _p.removeEventMeetGroup,
        getfutureevntbyuserid: _p.getfutureevntbyuserid,
        getevntbyuseridandeventid: _p.getevntbyuseridandeventid,
        addEventMeet: _p.addEventMeet,
        updateEventMeet: _p.updateEventMeet,
        getEventMeet: _p.getEventMeet,
        getAllEventMeet: _p.getAllEventMeet,
        getEventMeetForMap: _p.getEventMeetForMap,
        getLowerEventMeet: _p.getLowerEventMeet,
        enrollEventMeet: _p.enrollEventMeet,
        getEnrolledEventMeet: _p.getEnrolledEventMeet,
        getEnrolledEventMeetById: _p.getEnrolledEventMeetById,
        getEnrolledEventMeetByIdStartEndDate: _p.getEnrolledEventMeetByIdStartEndDate,
        getEventForJudges: _p.getEventForJudges,
        getEventMeetCoachMappingForUser: _p.getEventMeetCoachMappingForUser,
        getEventMeetRoutineID: _p.getEventMeetRoutineID,
        getEventJudgeDetails: _p.getEventJudgeDetails,
        getAssignedEventMeetForJudges: _p.getAssignedEventMeetForJudges,
        patchEventMeetRoutine: _p.patchEventMeetRoutine,
        patchAssignedStatusInEventMeetForJudges: _p.patchAssignedStatusInEventMeetForJudges,
        getEventRoutineDetails: _p.getEventRoutineDetails,
        getEventJudgesCount: _p.getEventJudgesCount,
        getJudgedEventMeetRoutine: _p.getJudgedEventMeetRoutine,
        checkisEnrolledEvent: _p.checkisEnrolledEvent,
        getReviewRoutine: _p.getReviewRoutine,
        updateMeetdeventRoutineStatus: _p.updateMeetdeventRoutineStatus,
        getMappedCompetitorsForeventmeet: _p.getMappedCompetitorsForeventmeet,
        sendNotification: _p.sendNotification

    };

})();

module.exports = eventController;