var routineController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        hasher = require('../auth/hasher'),
        routineFilePath = '/mnt/volume_sfo2_01/public/uploads/user/routine/source/',
        applicationConfig = require('../configs/application.config'),
        Routine = require('../models/routine.server.model'),
        TechnicianRoutine = require('../models/Technician_Routine.model'),
        RoutineComment = require('../models/routine.judgesnotes'),
        TechnicianComment = require('../models/routine.techniciannotes'),
        JudgesSport = require('../models/Judge-Sportdetail.server.model'),
        Mapping = require('../models/sport.server.model').MappingModel,
        LibraryComment = require('../models/library.comment.model'),
        RoutineJudgeMap = require('../models/routine-judgeMapping'),
        Banner = require("../models/banner.server.model"),
        eventMeetForJudging = require('../models/eventMeetForJudges.server.model'),
        // eventmeetgroupRoutine =  require('../models/eventmeetgrouproutine.model'),
        EventMeetForJudges = require('../models/eventMeetForJudges.server.model'),
        utilityHelper = require('../helpers/utilities.helper'),
        JudgeSport = require('../models/Judge-Sportdetail.server.model'),
        errorHelper = require('../helpers/error.helper'),
        Promise = require("bluebird"),
        fs = Promise.promisifyAll(require('fs')),
        ffmpegPath = require('@ffmpeg-installer/ffmpeg').path,
        ffprobePath = require('@ffprobe-installer/ffprobe').path,
        FfmpegCommand = require('fluent-ffmpeg'),
        path = require('path'),
        User = require('../models/user.server.model'),
        JudgeSport = require('../models/Judge-Sportdetail.server.model'),
        Payliance = require('../models/payliance.mgmt.server.modal'),
        EventMeetJudgeMap = require('../models/EventMeet-Judge-Map.model'),
        eventController = require('./event.meet.server'),
        NotificationTokenObj = Payliance.notificationToken;
    FfmpegCommand.setFfmpegPath(ffmpegPath);
    FfmpegCommand.setFfprobePath(ffprobePath);
    var mailController = require('./mail.server.controller');
    var join = Promise.join;
    const hbjs = require('handbrake-js');
    var mongoose = require('mongoose');
    var request = require('request');
    var ShareRoutine = require('../models/sharedroutine.server.model');
    var routineFields = '_id title sport nd level event duration submissionfor scoretype originalfilename thumbnailPath description videofilename submittedBy submittedOn routinestatus description userid filetype filesize scoretype score judgedBy comment dod athlete view sportid sid lid eid uid awards assignedTo submittedByID teammate isConverted assignedOn addedOn judgedOn isResubmitted sourceID uploadingType eventMeetId'
    var technicianFields = '_id scoretype status  scoretype score judgedBy comment dod uploadingType'
    var routineStatusFields = '_id technician_status nd thumbnailPath eventlevelRank EventMeetName overallRank levelRank eventmeetRank SanctionRoutine title sport level event duration submissionfor scoretype originalfilename thumbnailPath description videofilename submittedBy submittedOn routinestatus description userid filetype filesize scoretype score judgedBy comment dod athlete view sportid sid lid eid uid awards assignedTo submittedByID teammate isConverted assignedOn isResubmitted sourceID uploadingType eventMeetId'
    var bannerdocumentFields = '_id title subtitle type filename filepath active addedOn deleted deletedOn deletedBy'

    function RoutineModule() {}

    RoutineModule.CreateRoutine = function(routineObj, id, loggedInUser, routineinfo, convertedfileName) {
        //console.log("inside create Routine")
        var newRoutineinfo = new Routine();
        newRoutineinfo.title = routineObj.title ? replaceSpecialCharaters(routineObj.title) : '';
        newRoutineinfo.sport = routineObj.sport ? replaceSpecialCharaters(routineObj.sport) : '';
        newRoutineinfo.level = routineObj.level;
        newRoutineinfo.event = routineObj.event;
        newRoutineinfo.sportid = routineObj.sportid;
        newRoutineinfo.sid = mongoose.Types.ObjectId(routineObj.sid);
        newRoutineinfo.lid = mongoose.Types.ObjectId(routineObj.lid);
        newRoutineinfo.eid = mongoose.Types.ObjectId(routineObj.eid);
        newRoutineinfo.uid = mongoose.Types.ObjectId(routineObj.uid);
        newRoutineinfo.submittedByID = mongoose.Types.ObjectId(routineObj.submittedByID);
        newRoutineinfo.userid = routineObj.userid;
        newRoutineinfo.duration = routineObj.duration;
        newRoutineinfo.description = routineObj.description;
        newRoutineinfo.submissionfor = routineObj.submissionfor;
        newRoutineinfo.scoretype = routineObj.scoretype;
        newRoutineinfo.thumbnailPath = routineObj.thumbnailPath;
        newRoutineinfo.originalfilename = routineObj.originalfilename;
        newRoutineinfo.videofilename = routineinfo._documentPath;
        newRoutineinfo.submittedBy = routineObj.submittedBy;
        newRoutineinfo.routinestatus = routineObj.routinestatus;
        newRoutineinfo.filetype = routineObj.filetype;
        newRoutineinfo.filesize = routineObj.filesize;
        newRoutineinfo.active = routineObj.active;
        newRoutineinfo.state = routineObj.state;
        newRoutineinfo.athlete = routineObj.athlete;
        newRoutineinfo.submittedOn = new Date();
        newRoutineinfo.SanctionRoutine = routineObj.SanctionRoutine ? routineObj.SanctionRoutine : false;
        newRoutineinfo.SanctionID = routineObj.SanctionID ? routineObj.SanctionID : '';
        newRoutineinfo.EventMeetName = routineObj.EventName ? routineObj.EventName : '';
        newRoutineinfo.technician_status = routineObj.technician_status ? routineObj.technician_status : "0"
        newRoutineinfo.routineProperty = {
            routineExtension: routineinfo._documentMimeType,
            routinePath: routineinfo._documentPath
        };
        if (routineObj.submissionfor == '2') {
            newRoutineinfo.teammate = routineObj.teammate;
        }

        newRoutineinfo.addedBy = loggedInUser;
        newRoutineinfo.addedOn = new Date();
        newRoutineinfo.isConverted = '1';
        newRoutineinfo.isResubmitted = '0';
        //  newRoutineinfo.sourceID=routineObj.sourceID?routineObj.sourceID:'';
        newRoutineinfo.convertedfileName = convertedfileName;
        newRoutineinfo.uploadingType = routineObj.uploadingType ? routineObj.uploadingType : '1';

        newRoutineinfo.eventMeetId = id ? id : ''
        return newRoutineinfo;
    };
    RoutineModule.CreateTechnicianRoutine = function(routineObj, loggedInUser) {
        //console.log("inside create Routine")
        var newRoutineinfo = new TechnicianRoutine();
        newRoutineinfo.routineid = mongoose.Types.ObjectId(routineObj.routineid);
        newRoutineinfo.scoretype = routineObj.scoretype;
        newRoutineinfo.status = routineObj.status;
        newRoutineinfo.addedBy = loggedInUser;
        newRoutineinfo.addedOn = new Date();
        newRoutineinfo.uploadingType = routineObj.uploadingType ? routineObj.uploadingType : '1';
        return newRoutineinfo;
    };

    RoutineModule.CreateEventMeetForJudging = function(eventObj, loggedInUser) {
        var newComment = new eventMeetForJudging();
        newComment.eventId = eventObj.eventId;
        newComment.judgeId = eventObj.judgeId;
        newComment.routineId = eventObj.routineId;
        newComment.type = eventObj.type;
        newComment.isTechnician = eventObj.isTechnician;
        newComment.judgePanel = eventObj.judgePanel ? eventObj.judgePanel : '';
        newComment.judgePanelid = eventObj.judgePanelid ? eventObj.judgePanelid : '';
        newComment.resubmit = eventObj.resubmit ? true : false;
        newComment.resubmitComment = eventObj.resubmitComment ? eventObj.resubmitComment : ''

        return newComment;
    }

    RoutineModule.CreateJudgedRoutine = function(routineObj, loggedInUser, routineinfo, convertedfileName) {
        //   //console.log("inside create Routine")
        var newRoutineinfo = new Routine();
        newRoutineinfo.title = routineObj.title;
        newRoutineinfo.sport = routineObj.sport;
        newRoutineinfo.level = routineObj.level;
        newRoutineinfo.event = routineObj.event;
        newRoutineinfo.sportid = routineObj.sportid;
        newRoutineinfo.sid = mongoose.Types.ObjectId(routineObj.sid);
        newRoutineinfo.lid = mongoose.Types.ObjectId(routineObj.lid);
        newRoutineinfo.eid = mongoose.Types.ObjectId(routineObj.eid);
        newRoutineinfo.uid = mongoose.Types.ObjectId(routineObj.uid);
        newRoutineinfo.submittedByID = mongoose.Types.ObjectId(routineObj.submittedByID);
        newRoutineinfo.userid = routineObj.userid;
        newRoutineinfo.duration = routineObj.duration;
        newRoutineinfo.description = routineObj.description;
        newRoutineinfo.submissionfor = routineObj.submissionfor;
        newRoutineinfo.scoretype = routineObj.scoretype;
        newRoutineinfo.thumbnailPath = routineObj.thumbnailPath;
        newRoutineinfo.originalfilename = routineObj.originalfilename;
        newRoutineinfo.videofilename = routineObj.videofilename;
        newRoutineinfo.submittedBy = routineObj.submittedBy;
        newRoutineinfo.routinestatus = routineObj.routinestatus;
        newRoutineinfo.filetype = routineObj.filetype;
        newRoutineinfo.filesize = routineObj.filesize;
        newRoutineinfo.active = routineObj.active;
        newRoutineinfo.state = routineObj.state;
        newRoutineinfo.athlete = routineObj.athlete;
        newRoutineinfo.technician_status = routineObj.technician_status ? routineObj.technician_status : "0"
        newRoutineinfo.submittedOn = new Date();


        newRoutineinfo.routineProperty = { routineExtension: routineObj.routinePropertystring1, routinePath: routineObj.routinePropertystring2 };
        if (routineObj.submissionfor == '2') {
            newRoutineinfo.teammate = routineObj.teammate;
        }
        newRoutineinfo.addedBy = loggedInUser;
        newRoutineinfo.addedOn = new Date();
        newRoutineinfo.isConverted = '2'
        newRoutineinfo.isResubmitted = '1'
        newRoutineinfo.sourceID = mongoose.Types.ObjectId(routineObj.sourceID)
        newRoutineinfo.convertedfileName = routineObj.convertedfileName;
        //  //console.log('routineObj',routineObj)
        // //console.log('newRoutineinfo',newRoutineinfo)
        return newRoutineinfo;
    };
    RoutineModule.Createcomment = function(commentObj, loggedInUser) {
        var newComment = new RoutineComment();
        newComment.comment = commentObj.comment ? replaceSpecialCharaters(commentObj.comment) : '';
        newComment.overallComment = commentObj.comment ? commentObj.comment : '';
        newComment.time = commentObj.time;
        newComment.element = commentObj.element ? replaceSpecialCharaters(commentObj.element) : '';;
        newComment.factor = commentObj.factor;
        newComment.skillvalue = commentObj.skillvalue;
        newComment.execution = commentObj.execution;
        newComment.state = commentObj.state;
        newComment.factor = commentObj.factor;
        newComment.bonus = commentObj.bonus;
        newComment.total = commentObj.total;
        newComment.judgeid = mongoose.Types.ObjectId(commentObj.judgeid);
        newComment.userid = mongoose.Types.ObjectId(commentObj.userid);
        newComment.routineid = mongoose.Types.ObjectId(commentObj.routineid);
        newComment.routinetitle = commentObj.routinetitle;
        newComment.judgename = commentObj.judgename;
        newComment.sport = commentObj.sport;
        newComment.level = commentObj.level;
        newComment.event = commentObj.event;
        newComment.read = false;
        newComment.active = true;
        newComment.addedBy = loggedInUser;
        newComment.addedOn = new Date();
        newComment.judgePanel = commentObj.judgePanel ? commentObj.judgePanel : '';
        newComment.judgePanelid = commentObj.judgePanelid ? commentObj.judgePanelid : '';
        //console.log(newComment, "newComment")
        return newComment;
    }
    RoutineModule.CreateTechniciancomment = function(commentObj, loggedInUser) {
        var newComment = new TechnicianComment();
        newComment.comment = commentObj.comment ? replaceSpecialCharaters(commentObj.comment) : '';
        newComment.time = commentObj.time;
        newComment.element = commentObj.element ? replaceSpecialCharaters(commentObj.element) : '';
        newComment.factor = commentObj.factor;
        newComment.skillvalue = commentObj.skillvalue;
        newComment.execution = commentObj.execution;
        newComment.state = commentObj.state;
        newComment.factor = commentObj.factor;
        newComment.bonus = commentObj.bonus;
        newComment.total = commentObj.total;
        newComment.judgeid = mongoose.Types.ObjectId(commentObj.judgeid);
        newComment.userid = mongoose.Types.ObjectId(commentObj.userid);
        newComment.routineid = mongoose.Types.ObjectId(commentObj.routineid);
        newComment.routinetitle = commentObj.routinetitle;
        newComment.judgename = commentObj.judgename;
        newComment.sport = commentObj.sport;
        newComment.level = commentObj.level;
        newComment.event = commentObj.event;
        newComment.read = false;
        newComment.active = true;
        newComment.addedBy = loggedInUser;
        newComment.addedOn = new Date();
        //console.log(newComment, "newComment")
        return newComment;
    }

    RoutineModule.CreateLibraryComment = function(commentObj, loggedInUser) {
        var newComment = new LibraryComment();
        newComment.uid = mongoose.Types.ObjectId(commentObj.uid);
        newComment.uname = commentObj.uname;
        newComment.rid = commentObj.rid;
        newComment.submittedBy = commentObj.submittedBy;
        newComment.comment = commentObj.comment ? replaceSpecialCharaters(commentObj.comment) : '';
        newComment.type = commentObj.type;
        newComment.active = commentObj.active;
        newComment.avatar = commentObj.avatar;
        newComment.addedBy = loggedInUser;
        newComment.addedOn = new Date();
        return newComment;
    }

    RoutineModule.CreateBanner = function(videoObj, loggedInUser, videoinfo) {
        var newBannerinfo = new Banner();
        //console.log(videoObj, videoinfo._documentPath);
        newBannerinfo.title = videoObj.title;
        newBannerinfo.subtitle = videoObj.subtitle;
        newBannerinfo.filename = videoObj.filename;
        newBannerinfo.filepath = videoinfo._documentPath ? videoinfo._documentPath.replace("/mnt/volume_sfo2_01/", "") : "";
        newBannerinfo.filetype = videoinfo._documentMimeType;
        newBannerinfo.type = videoObj.type;
        /* if(videoinfo._documentPath =='' ){
            newBannerinfo.filepath = videoObj.filepath;
            newBannerinfo.filetype = videoObj.filetype; 
           //console.log("videoObj.filepath",videoObj.filepath)
        }else{
            newBannerinfo.filepath = videoinfo._documentPath;
            newBannerinfo.filetype = videoinfo._documentMimeType;   
            //console.log("videoinfo._documentPath",videoinfo._documentPath)     
        }
     */
        newBannerinfo.active = videoObj.active;
        newBannerinfo.addedBy = loggedInUser;
        newBannerinfo.addedOn = new Date();
        return newBannerinfo;
    };

    RoutineModule.CreateRoutineJudgeMap = function(routineObj, loggedInUser) {
        var newRoutineJudgeMap = new RoutineJudgeMap();
        newRoutineJudgeMap.routineid = mongoose.Types.ObjectId(routineObj.sourceID);
        newRoutineJudgeMap.judgeid = mongoose.Types.ObjectId(routineObj.assignedTo);
        newRoutineJudgeMap.addedOn = new Date();
        return newRoutineJudgeMap;
    };


    RoutineModule.CreateShareRoutine = function(sharedObj, loggedInUser, routineinfo, convertedfileName) {
        //console.log("inside create CreateShareRoutine", sharedObj)
        var shareRoutineinfo = new ShareRoutine();
        shareRoutineinfo.RoutineID = mongoose.Types.ObjectId(sharedObj.RoutineID);
        shareRoutineinfo.SubmittedBy = mongoose.Types.ObjectId(sharedObj.SubmittedBy);
        shareRoutineinfo.sharedwith = sharedObj.sharedwith;
        shareRoutineinfo.addedBy = loggedInUser;
        shareRoutineinfo.addedOn = new Date();
        //console.log("inside create CreateShareRoutine", shareRoutineinfo)
        return shareRoutineinfo;
    };

    function replaceSpecialCharaters(comment) {
        //console.log(comment)
        comment = comment.replace(/&amp;/g, "&");
        comment = comment.replace(/&gt;/g, ">");
        comment = comment.replace(/&lt;/g, "<");
        comment = comment.replace(/&quot;/g, '"');
        //comment = comment.replace(/&#039;/g, "'");
        //console.log(comment);
        return (comment)


    }
    var _p = RoutineModule.prototype;

    _p.checkValidationErrors = function(req) {
        req.checkBody('sport', messageConfig.user.validationErrMessage.firstName).notEmpty();
        req.checkBody('level', messageConfig.user.validationErrMessage.lastName).notEmpty();
        req.checkBody('userid', messageConfig.user.validationErrMessage.email).notEmpty();
        req.checkBody('originalfilename', messageConfig.user.validationErrMessage.userRole).notEmpty();
        return req.validationErrors();
    };
    _p.checkCommentValidationErrors = function(req) {
        req.checkBody('comment', messageConfig.user.validationErrMessage.firstName).notEmpty();
        req.checkBody('judgeid', messageConfig.user.validationErrMessage.lastName).notEmpty();
        req.checkBody('userid', messageConfig.user.validationErrMessage.email).notEmpty();
        req.checkBody('routineid', messageConfig.user.validationErrMessage.userRole).notEmpty();
        return req.validationErrors();
    };
    _p.checkbannerValidationErrors = function(req) {
        req.checkBody('type', messageConfig.user.validationErrMessage.firstName).notEmpty();
        req.checkBody('filename', messageConfig.user.validationErrMessage.email).notEmpty();
        return req.validationErrors();
    };
    _p.getRoutineByID = function(req) {
        //console.log(req.params.userid)
        var query = {}
        query.userid = req.params.userid;
        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.find(Routine, query);
    };
    _p.awardRoutine = function() {
        ////console.log("triggered");
        var query = [

            {
                $match: {
                    $and: [
                        { routinestatus: "1" },
                        { awards: { $exists: false } },
                        { deleted: false }
                    ]
                }
            },
            {
                $group: {
                    _id: { "sport": "$sport", "level": "$level", "event": "$event" },
                    count: { $sum: 1 },
                    groupedItem: { $push: "$$ROOT" }
                }
            },
            { $sort: { count: -1 } }

        ]
        var judgedroutine = []
        dataProviderHelper.aggregate(Routine, query).then(function(routine) {

            judgedroutine = routine;
            for (let i = 0; i < judgedroutine.length; i++) {
                var temp = judgedroutine[i];
                // //console.log(temp.count)

                if (temp.count > 0) {
                    var descJudgedroutine = temp.groupedItem.sort(function(a, b) { return Number(b.score) - Number(a.score) });
                    _p.checkEligibleRoutine(descJudgedroutine);
                }

            }

            // //console.log(routine.length);
        });

        return judgedroutine;
    }

    _p.eventsScoreById = function(req, res, next) {
        //console.log('++++++++++++++++ REQ ++++++++++++++++++ ', req.body);
        var query = [{
                $match: {
                    $and: [{ "userid": req.body.uid, "routinestatus": "1" }]
                }
            },
            {
                $group: {
                    _id: { "sport": "$sport", "level": "$level", "event": "$event" },
                    count: { $sum: 1 },
                    groupedItem: { $push: "$$ROOT" }
                }
            },
            { $sort: { count: -1 } }
        ]
        Routine.aggregate(query, function(err, result) {
            //console.log('result ', result);
            res.send(result)
        })
    }

    _p.sportDetailsByUsername = function(req, res, next) {
        //console.log('req params data ', req.params.username);
        const query = [{
                $match: {
                    $and: [{ "username": req.params.username }]
                },
            },
            {
                $group: {
                    _id: { "sportName": "$sportName", "level": "$level" },
                    count: { $sum: 1 },
                    groupedItem: { $push: "$$ROOT" }
                }
            },
            { $sort: { count: -1 } }
        ]

        JudgeSport.aggregate(query, function(err, sportDetails) {
            if (err) {
                res.json({
                    success: false,
                    message: err
                })
            }
            //console.log('sport details ', sportDetails);
            res.json({
                success: true,
                data: sportDetails
            })
        })
    }
    _p.replaceAllIds = function(req, res, next) {
        RoutineComment.find({ "userid": "5bc08d4328593428d85fca15" }, function(err, result) {
            if (err) {
                res.json({
                    success: false,
                    response: err
                })
            }
            result.forEach(document => {
                var routineId = mongoose.Types.ObjectId(document.routineid);
                var oldId = document.routineid;
                RoutineComment.remove({ _id: document._id }, (err, result) => {
                    if (err) {
                        //console.log('err removing doc ', err);
                        res.json({
                            success: false,
                            response: err
                        })
                    }
                    //console.log('doc removed successfully ', err);
                    res.json({
                        success: true,
                        response: result
                    })
                });
                document.routineid = routineId;
                //console.log('document ---> ', document);
                // var commentObj = RoutineModule.Createcomment(modelInfo,req.decoded.user.username); 
                // var commentObj = RoutineModule.Createcomment(document,req.decoded.user.username) 
                var newDoc = new RoutineComment(document);
                RoutineComment.save(newDoc, (err, result) => {
                    if (err) {
                        //console.log('err saving doc ', err);
                        res.json({
                            success: false,
                            response: err
                        })
                    }
                    //console.log('doc saved successfully ', err);
                    res.json({
                        success: true,
                        response: result
                    })
                });
                // RoutineComment.remove({ routineid : oldId }); 
                // RoutineComment.insert(document, (err, resp) => { 
                //     if(err){ 
                //         //console.log("error inserting fields"); 
                //     } 
                //     //console.log("Successfully inserted ", resp); 
                // });  
                // RoutineComment.remove({ routineid : oldId }, (err, resp) => { 
                //     if(err){ 
                //         //console.log("error removing fields"); 
                //     } 
                //     //console.log("Successfully removed ", resp); 
                // }); 
            })
        })
    }

    _p.sortByState = function(req, res, next) {
        //console.log('req params ', req.body);
        const passedState = req.body.state;
        const query = [
            { $lookup: { from: "Flyp10_User", localField: "uid", foreignField: "_id", as: "userDetails" } },
            { $unwind: "$userDetails" },
            { $addFields: { "state": "$userDetails.address" } },
            { $match: { "state": passedState } },
            {
                $group: {
                    _id: { "sport": "$sport", "level": "$level", "event": "$event", "state": "$state" },
                    count: { $sum: 1 },
                    groupedItem: { $push: "$$ROOT" }
                }
            },
            { $sort: { count: -1 } }
        ]

        Routine.aggregate(query, function(err, result) {
            if (err) {
                res.json({
                    success: false,
                    message: err
                })
            }
            //console.log('result details ', result);
            res.json({
                success: true,
                data: result
            })
        })
    }

    _p.routineScoresByUID = function(req, res, next) {
        //console.log('req params data ', req.params.UID);
        const query = [{
                $match: {
                    $and: [{ "userid": req.params.UID, "routinestatus": "1" }]
                },
            },
            {
                $group: {
                    _id: { "sport": "$sport", "level": "$level", "event": "$event" },
                    count: { $sum: 1 },
                    groupedItem: { $push: "$$ROOT" }
                }
            },
            { $sort: { count: -1 } }
        ]

        Routine.aggregate(query, function(err, sportDetails) {
            if (err) {
                res.json({
                    success: false,
                    message: err
                })
            }
            //console.log('sport details ', sportDetails);
            res.json({
                success: true,
                data: sportDetails
            })
        })
    }

    _p.getEventsForAnalyticsFilterByDays = function(req, res, next) {
        //console.log('req.body ---> ', req.body);
        const days = req.body.days;
        var query = [{
                $match: {
                    addedOn: { $gte: new Date((new Date().getTime() - (days * 24 * 60 * 60 * 1000))) },
                    $and: [{ "userid": req.body.uid, "routinestatus": "1" }]
                },
            },
            {
                $group: {
                    _id: { "sport": "$sport", "level": "$level", "event": "$event" },
                    count: { $sum: 1 },
                    groupedItem: { $push: "$$ROOT" }
                }
            },
            { $sort: { count: -1 } }
        ]

        Routine.aggregate(query, function(err, result) {
            //console.log('result ', result);
            res.send(result)
        })
    }

    _p.filterTrackingChartByDaysAndUid = function(req, res, next) {
        //console.log('req.body ---> ', req.body);
        const days = req.body.days;
        var query = [{
                $match: {
                    addedOn: { $gte: new Date((new Date().getTime() - (days * 24 * 60 * 60 * 1000))) },
                    $and: [{ "userid": req.body.uid, "routinestatus": "1" }]
                },
            },
            {
                $group: {
                    _id: { "element": "$element", "sport": "$sport", "level": "$level", "event": "$event" },
                    count: { $sum: 1 },
                    groupedItem: { $push: "$$ROOT" }
                }
            },
            { $sort: { count: -1 } }
        ]

        Routine.aggregate(query, function(err, result) {
            //console.log('result ', result);
            res.send(result)
        })
    }

    _p.filterByDateJudgedRoutineByUid = function(req, res, next) {
        //console.log('req.body ---> ', req.body);
        const days = req.body.days;
        var query = [{
                $match: {
                    addedOn: { $gte: new Date((new Date().getTime() - (days * 24 * 60 * 60 * 1000))) },
                    $and: [{ "userid": req.body.uid }]
                },
            },
            {
                $group: {
                    _id: { "element": "$element", "sport": "$sport", "level": "$level", "event": "$event" },
                    count: { $sum: 1 },
                    groupedItem: { $push: "$$ROOT" }
                }
            },
            { $sort: { count: -1 } }
        ]

        RoutineComment.aggregate(query, function(err, result) {
            //console.log('result ', result);
            res.send(result)
        })
    }
    _p.getElementsValueSummary = function(req, res, next) {
        //console.log('req.body ', req.body);
        // req.body = JSON.parse(req.body);
        var matchObj = {};
        let forDays = null;
        let uidArr = [];
        if (req.body.uid && !req.body.state) {
            req.body.uid.forEach(uid => {
                //console.log("uid ", mongoose.Types.ObjectId(uid))
                uidArr.push(mongoose.Types.ObjectId(uid))
            })
        } else if (req.body.uid && req.body.state) {
            req.body.uid = req.body.uid;
        }
        //console.log("uid returned ", uidArr);
        if (req.body.sport) matchObj.sport = req.body.sport;
        if (req.body.level) matchObj.level = req.body.level;
        if (req.body.event) matchObj.event = req.body.event;
        if (req.body.state) matchObj.state = req.body.state;
        if (req.body.days) {
            forDays = new Date(new Date().valueOf() - (req.body.days * (1000 * 60 * 60 * 24)));
        } else {
            forDays = new Date(new Date().valueOf() - (1 * (1000 * 60 * 60 * 24)));
        }

        //console.log('object to update is ', matchObj);
        //console.log('Days passed ', forDays);
        let query = [];

        if (req.body.state) {
            query = [
                // {$match: {
                //     $and:[{
                //         "state": req.body.state,
                //         "uid": {$ne: req.body.uid},
                //         "deleted": false, "addedOn":{"$gte":forDays}}]
                //     } 
                // },
                {
                    $match: {
                        "state": req.body.state,
                        "userid": { $ne: mongoose.Types.ObjectId(req.body.uid) },
                        "deleted": false,
                        "addedOn": { "$gte": forDays }
                    }
                },
                { $sort: { total: -1 } },
                {
                    $group: {
                        _id: { "element": "$element", "sport": "$sport", "level": "$level", "event": "$event", "state": "$state" },
                        count: { $sum: 1 },
                        average: { $avg: "$total" },
                        max: { $max: "$total" },
                        min: { $min: "$total" },
                        groupedItem: { $push: "$$ROOT" }
                    }
                },
                //     {$unwind: "$groupedItem"},
                {
                    $project: {
                        "element": "$_id.element",
                        "sport": "$_id.sport",
                        "level": "$_id.level",
                        "event": "$_id.event",
                        "state": "$_id.state",
                        "count": "$count",
                        "average": "$average",
                        "max": "$max",
                        "min": "$min",
                        "groupedItem": "$groupedItem",
                        "userTemp": { $arrayElemAt: ['$groupedItem', 0] },
                        "userTempTwo": { $arrayElemAt: ['$groupedItem', -1] },
                        "maxValRoutineId": "$userTemp.routineid",
                        "minValRoutineId": "$userTempTwo.routineid",
                        "userDetails": "$userTemp.userDetails"
                    }
                },
                {
                    $project: {
                        "element": "$_id.element",
                        "sport": "$_id.sport",
                        "level": "$_id.level",
                        "event": "$_id.event",
                        "state": "$_id.state",
                        "count": "$count",
                        "average": "$average",
                        "max": "$max",
                        "min": "$min",
                        "maxValRoutineId": "$userTemp.routineid",
                        "minValRoutineId": "$userTempTwo.routineid",
                        "groupedItem": "$groupedItem",
                        "userState": "$userTemp.userDetails.address",
                        "userDetails": "$userTemp.userDetails"
                    }
                },
                { $sort: { count: -1 } },
                { '$match': matchObj }
            ]
        } else {
            query = [{
                    $match: {
                        $and: [{
                            "userid": { $in: uidArr },
                            "deleted": false,
                            "addedOn": { "$gte": forDays }
                        }]
                    }
                },
                {
                    "$lookup": {
                        "from": "Flyp10_User",
                        "localField": "userid",
                        "foreignField": "_id",
                        "as": "userDetails"
                    }
                },
                { "$unwind": "$userDetails" },
                { $sort: { total: -1 } },
                {
                    $group: {
                        _id: { "element": "$element", "sport": "$sport", "level": "$level", "event": "$event", "state": "$state" },
                        count: { $sum: 1 },
                        average: { $avg: "$total" },
                        max: { $max: "$total" },
                        min: { $min: "$total" },
                        groupedItem: { $push: "$$ROOT" }
                    }
                },
                //     {$unwind: "$groupedItem"},
                {
                    $project: {
                        "element": "$_id.element",
                        "sport": "$_id.sport",
                        "level": "$_id.level",
                        "event": "$_id.event",
                        "state": "$_id.state",
                        "count": "$count",
                        "average": "$average",
                        "max": "$max",
                        "min": "$min",
                        "groupedItem": "$groupedItem",
                        "userTemp": { $arrayElemAt: ['$groupedItem', 0] },
                        "userTempTwo": { $arrayElemAt: ['$groupedItem', -1] },
                        "maxValRoutineId": "$userTemp.routineid",
                        "minValRoutineId": "$userTempTwo.routineid",
                        "userDetails": "$userTemp.userDetails"
                    }
                },
                {
                    $project: {
                        "element": "$_id.element",
                        "sport": "$_id.sport",
                        "level": "$_id.level",
                        "event": "$_id.event",
                        "state": "$_id.state",
                        "count": "$count",
                        "average": "$average",
                        "max": "$max",
                        "min": "$min",
                        "maxValRoutineId": "$userTemp.routineid",
                        "minValRoutineId": "$userTempTwo.routineid",
                        "groupedItem": "$groupedItem",
                        "userState": "$userTemp.userDetails.address",
                        "userDetails": "$userTemp.userDetails"
                    }
                },
                { $sort: { count: -1 } },
                { '$match': matchObj }
            ]
        }

        //  query.routinestatus="1";
        //console.log(query)

        RoutineComment.aggregate(query, function(err, result) {
            if (err) {
                //console.log('error ', err);
            }
            //console.log('result ', result);
            res.send(result)
        })
    }

    _p.eventsScoreById = function(req, res, next) {
        //console.log('req.dbody ======> ', req.body);
        var matchObj = {};
        let forDays = null;
        let uidArr = [];
        // if(req.body.uid){
        //     req.body.uid.forEach(uid => {
        //         //console.log("uid ", mongoose.Types.ObjectId(uid))
        //         uidArr.push(mongoose.Types.ObjectId(uid))
        //     })
        // }        

        if (req.body.uid && !req.body.state) {
            req.body.uid.forEach(uid => {
                //console.log("uid ", mongoose.Types.ObjectId(uid))
                uidArr.push(mongoose.Types.ObjectId(uid))
            })
        } else if (req.body.uid && req.body.state) {
            req.body.uid = req.body.uid;
        }

        //console.log("uid returned ", uidArr);
        if (req.body.sport) matchObj.sport = req.body.sport;
        if (req.body.level) matchObj.level = req.body.level;
        if (req.body.event) matchObj.event = req.body.event;
        if (req.body.state) matchObj.state = req.body.state;
        if (req.body.days) {
            forDays = new Date(new Date().valueOf() - (req.body.days * (1000 * 60 * 60 * 24)));
        } else {
            forDays = new Date(new Date().valueOf() - (1 * (1000 * 60 * 60 * 24)));
        }

        //console.log('object to update is ', matchObj);
        //console.log('Days passed ', forDays);

        var query = [];

        if (req.body.state) {
            //console.log('state query assigned');
            query = [
                // {$match: {
                //     $and:[{
                //         "state": req.body.state,
                //         "uid": {$ne: req.body.uid},
                //         "deleted": false,"routinestatus": "1", "addedOn":{"$gte":forDays}}]
                //     } 
                // },
                {
                    $match: {
                        "state": req.body.state,
                        "userid": { $ne: req.body.uid },
                        "deleted": false,
                        "routinestatus": "1",
                        "judgedOn": { "$gte": forDays }
                    }
                },
                { $sort: { score: -1 } },
                {
                    $group: {
                        _id: { "sport": "$sport", "level": "$level", "event": "$event", "state": "$state" },
                        count: { $sum: 1 },
                        average: { $avg: "$score" },
                        max: { $max: "$score" },
                        min: { $min: "$score" },
                        groupedItem: { $push: "$$ROOT" }
                    }
                },
                {
                    $project: {
                        "sport": "$_id.sport",
                        "level": "$_id.level",
                        "event": "$_id.event",
                        "state": "$_id.state",
                        "count": "$count",
                        "average": "$average",
                        "max": "$max",
                        "min": "$min",
                        "groupedItem": "$groupedItem",
                        "userTemp": { $arrayElemAt: ['$groupedItem', 0] },
                        "userTempTwo": { $arrayElemAt: ['$groupedItem', -1] }
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "sport": "$_id.sport",
                        "level": "$_id.level",
                        "event": "$_id.event",
                        "state": "$_id.state",
                        "count": "$count",
                        "average": "$average",
                        "max": "$max",
                        "min": "$min",
                        "maxValRoutineId": "$userTemp._id",
                        "minValRoutineId": "$userTempTwo._id",
                        "groupedItem": "$groupedItem",
                    }
                },
                { $sort: { count: -1 } },
                { '$match': matchObj }
            ];
        } else {
            //console.log('uid query assigned');
            query = [{
                    $match: {
                        $and: [{
                            "uid": { $in: uidArr },
                            "deleted": false,
                            "routinestatus": "1",
                            "judgedOn": { "$gte": forDays }
                        }]
                    }
                },

                {
                    "$lookup": {
                        "from": "Flyp10_User",
                        "localField": "uid",
                        "foreignField": "_id",
                        "as": "userDetails"
                    }
                },
                { "$unwind": "$userDetails" },
                { $sort: { score: -1 } },
                {
                    $group: {
                        _id: { "sport": "$sport", "level": "$level", "event": "$event", "state": "$state", },
                        count: { $sum: 1 },
                        average: { $avg: "$score" },
                        max: { $max: "$score" },
                        min: { $min: "$score" },
                        groupedItem: { $push: "$$ROOT" }
                    }
                },
                {
                    $project: {
                        "sport": "$_id.sport",
                        "level": "$_id.level",
                        "event": "$_id.event",
                        "state": "$_id.state",
                        "count": "$count",
                        "average": "$average",
                        "max": "$max",
                        "min": "$min",
                        "groupedItem": "$groupedItem",
                        "userTemp": { $arrayElemAt: ['$groupedItem', 0] },
                        "userTempTwo": { $arrayElemAt: ['$groupedItem', -1] },
                        "userDetails": "$userTemp.userDetails"
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "sport": "$_id.sport",
                        "level": "$_id.level",
                        "event": "$_id.event",
                        "state": "$_id.state",
                        "count": "$count",
                        "average": "$average",
                        "max": "$max",
                        "min": "$min",
                        "maxValRoutineId": "$userTemp._id",
                        "minValRoutineId": "$userTempTwo._id",
                        "userState": "$userTemp.userDetails.address",
                        "groupedItem": "$groupedItem",
                    }
                },
                { $sort: { count: -1 } },
                { '$match': matchObj }
            ];
        }

        Routine.aggregate(query, function(err, result) {
            if (err) {
                //console.log('err running query --> ', err)
            }
            //console.log('result ', result);
            res.send(result)
        })
    }

    _p.getEventsBySportLevel = function(req, res, next) {

        var query = [
            { $match: { "sport": req.body.sport } },
            { $unwind: "$level" },
            { $match: { "level": req.body.level } },
            { $unwind: "$mappingFieldsVal" },
            {
                $project: {
                    "_id": 0,
                    "event": "$mappingFieldsVal.event"
                }
            }
        ]

        //console.log("query ", query)

        Mapping.aggregate(query, function(err, result) {
            if (err) {
                //console.log("error ret ", err);
            }
            //console.log('result ', result);
            res.send(result)
        })

    }

    _p.getUserMappedSportsLevelsEvents = function(req, res, next) {
        var query = [
            { $match: { "userid": mongoose.Types.ObjectId(req.body.uid) } },
            {
                $lookup: {
                    from: "Mapping",
                    localField: "sportName",
                    foreignField: "sport",
                    as: "mappedWithSports"
                }
            },
            { $unwind: "$mappedWithSports" },
            { $unwind: "$mappedWithSports.level" },
            { $unwind: "$mappedWithSports.mappingFieldsVal" },
            {
                $project: {
                    "level": "$level",
                    "sportName": "$sportName",
                    "userid": "$userid",
                    "sportid": "$sportid",
                    "levelid": "$levelid",
                    "event": "$mappedWithSports.mappingFieldsVal.event"
                }
            }, {
                $group: {
                    _id: { "level": "$level", "sportName": "$sportName", "event": "$event" },
                }
            },
            {
                $project: {
                    "_id": 0,
                    "level": "$_id.level",
                    "sportName": "$_id.sportName",
                    "event": "$_id.event"
                }
            }
        ];

        JudgesSport.aggregate(query, function(err, result) {
            //console.log('result ', result);
            res.send(result)
        })
    }

    _p.judgedRoutineByUid = function(req, callback) {
        var matchObj = {};
        let forDays = null;

        if (req.body.sport) matchObj._id.sport = req.body.sport;
        if (req.body.level) matchObj._id.level = req.body.level;
        if (req.body.event) matchObj._id.event = req.body.event;
        if (req.body.state) matchObj._id.userDetails.address = req.body.state;
        if (req.body.days) {
            switch (req.body.days) {
                case (1):
                    {
                        forDays = new Date(new Date().valueOf() - (1 * (1000 * 60 * 60 * 24)));
                        break;
                    }
                case (7):
                    {
                        forDays = new Date(new Date().valueOf() - (7 * (1000 * 60 * 60 * 24)));
                        break;
                    }
                case (30):
                    {
                        forDays = new Date(new Date().valueOf() - (30 * (1000 * 60 * 60 * 24)));
                        break;
                    }
                case (90):
                    {
                        forDays = new Date(new Date().valueOf() - (90 * (1000 * 60 * 60 * 24)));
                        break;
                    }
            }
        } else {
            forDays = new Date(new Date().valueOf() - (1 * (1000 * 60 * 60 * 24)));
        }

        //console.log('object to update is ', matchObj);
        //console.log('Days passed ', forDays);

        var query = [

                {
                    $match: {
                        $and: [{ "userid": mongoose.Types.ObjectId(req.params.uid), "deleted": false, "addedOn": { "$gte": forDays } }]
                    }
                },
                {
                    "$lookup": {
                        "from": "Flyp10_User",
                        "localField": "userid",
                        "foreignField": "_id",
                        "as": "userDetails"
                    }
                },
                { "$unwind": "$userDetails" },
                {
                    $group: {
                        _id: { "element": "$element", "sport": "$sport", "level": "$level", "event": "$event", "userDetails": "$userDetails" },
                        count: { $sum: 1 },
                        average: { $avg: "$total" },
                        max: { $max: "$total" },
                        min: { $min: "$total" },
                        groupedItem: { $push: "$$ROOT" }
                    }
                },
                { $sort: { count: -1 } },
                { $match: matchObj },

            ]
            //  query.routinestatus="1";
            //console.log(query)

        RoutineComment.aggregate(query, callback);
    };

    //     _p.judgedRoutineByUid=function (req, callback) {
    //         var query = [
    //             {$match: {
    //                     $and:[{"userid": req.params.uid, "deleted": false}]
    //                 }
    //             },
    //             {$group: {
    //                 _id :{"element":"$element", "sport":"$sport", "level":"$level", "event":"$event"}, 
    //                 count: {$sum: 1},
    //                 groupedItem: { $push:"$$ROOT"}
    //             }},
    //                 { $sort: { count: -1 } }   

    //        ]
    //         //  query.routinestatus="1";
    //          //console.log(query)

    //          RoutineComment.aggregate(query, callback);
    //    };
    _p.getJudgedRoutineByJudgename = function(req) {
        //console.log(req.params.userid)
        /*  var query={}
         query.judgedBy=req.params.userid;
         query.routinestatus={$ne:'0'} */
        var query = {
            $and: [
                { routinestatus: { $ne: '0' }, deleted: false, assignedTo: req.params.userid },
                { routinestatus: { $ne: '2' }, deleted: false, assignedTo: req.params.userid }
            ]
        }

        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.find(Routine, query);
    }

    _p.getRoutineCommentByrid = function(req) {
        //console.log(req.params.userid)
        var query = {}
        query.routineid = req.params.userid;
        if (req.params.judgeID) {
            query.judgeid = req.params.judgeID
        }

        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.find(RoutineComment, query);
    }

    _p.getFlyp10RoutineCommentByrid = function(req) {
        //console.log(req.params.routineId)
        var query = {}
        query.routineid = req.params.routineId;
        // query.judgeid=req.params.judgeID
        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.find(RoutineComment, query);
    }

    _p.getEventMeetRoutineCommentByPanel = function(req, res, next) {
        //console.log(req.params.routineid)
        var query = [{
                $match: {
                    $and: [{ 'deleted': false }, { 'routineid': mongoose.Types.ObjectId(req.params.routineid) }]
                }

            },
            {

                $lookup: {
                    from: "EventMeetForJudging",
                    let: { judgeid: "$judgeid", judgePanel: "$judgePanel" },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$judgeId", "$$judgeid"] },
                                        { $eq: ["$judgePanel", "$$judgePanel"] },
                                        { $eq: ["$routineId", mongoose.Types.ObjectId(req.params.routineid)] }
                                    ]
                                }
                            }
                        },

                    ],
                    as: "eventmeetforjudgingInfo"
                }
            },

            { "$unwind": "$eventmeetforjudgingInfo" },
            {
                $group: {
                    _id: { "judgeid": "$judgeid", "judgePanel": "$judgePanel" },
                    comment: { $push: "$$ROOT" }
                }
            },
            {
                $group: {
                    _id: { judgePanel: "$_id.judgePanel" },
                    PanelCommentsbyjudge: { $push: "$$ROOT" }
                }
            }


        ]

        RoutineComment.aggregate(query, function(err, comment) {
            res.json({
                success: true,
                result: comment
            })
        })




    }
    _p.getRoutineCommentbyEventroutineid = function(req, res, next) {
        //console.log(req.params.routineId)
        var query = [{
                $match: {
                    $and: [{ deleted: false }, { judged: true }, { routineId: mongoose.Types.ObjectId(req.params.routineId) }]
                }

            },



            {
                $lookup: {
                    from: "Routinecomment",
                    localField: "judgeId",
                    foreignField: "judgeid",
                    as: "commentInfo"
                }
            },

            { "$unwind": "$commentInfo" },

            {
                $match: {
                    $and: [{ 'commentInfo.deleted': false }, { 'commentInfo.routineid': mongoose.Types.ObjectId(req.params.routineId) }]
                }

            },
            {
                $group: {
                    _id: "$commentInfo.judgeid",
                    commentInfo: { $push: "$$ROOT" },

                }
            },


        ]

        EventMeetForJudges.aggregate(query, function(err, comment) {
            res.json({
                success: true,
                result: comment
            })
        })

        // let query = [ 

        //     {$match:{
        //         "routineId":mongoose.Types.ObjectId(req.params.routineId),'deleted':false
        //     }},

        //     { "$project": {
        //         _id : 0 ,
        //         "judgeid": "$judgeId",
        //         "routineid":"$routineId"

        //     }},       
        // ]

        // EventMeetForJudges.aggregate(query,function(err,judges){
        //     if(err){

        //     }else{
        //         let aggQuery = [
        //             {$match:{
        //                 $or: judges
        //             }},
        //             { $group : {
        //                 _id : "$judgeid",
        //                 commentInfo: { $push : "$$ROOT" }
        //             }},
        //         ]
        //        RoutineComment.aggregate(aggQuery,function(err,routineComment){

        //         let queryDOD = [ 

        //             {$match:{
        //                 "routineId":mongoose.Types.ObjectId(req.params.routineId),'deleted':false
        //             }},

        //             { "$project": {
        //                 _id : 0,
        //                 "judgeid": "$judgeId",
        //                 "routineid":"$routineId",
        //                 "comments":"$comments",
        //                 "dod":"$dod"

        //             }},       
        //         ]
        //         EventMeetForJudges.aggregate(queryDOD,function(err,dod){

        //             let comment = routineComment

        //             //console.log('dod length',dod,comment)

        //             for(let i=0;i<dod.length;i++){
        //                 for(let j=0;j<comment.length;j++){
        //                     //console.log('id compare',dod[i].judgeid,comment[j]._id )
        //                     if(dod[i].judgeid == comment[j]._id ){
        //                         //console.log('it came')
        //                         comment[j].dod = dod[i].dod
        //                         comment[j].comments = dod[i].comments

        //                     }
        //                 }

        //                 //console.log('comment',comment)

        //                 // if(i==dod.length-1){
        //                 //     res.json({
        //                 //         success:true,
        //                 //         result:comment
        //                 //        }
        //                 //         )
        //                 // }
        //             }


        //         })




        //        });
        //     }
        // })



    }

    _p.getRoutineCommentForEventMeet = function(req) {
        //console.log(req.params.routineid)
        var query = [{
                $match: {
                    $and: [{ deleted: false }, { judged: true }, { routineId: mongoose.Types.ObjectId(req.params.routineid) }, { isTechnician: '0' }]
                }

            }

        ]

        return dataProviderHelper.aggregate(EventMeetForJudges, query);




    }
    _p.getEventMeetOverallCommentByPanel = function(req) {
        var query = [{
                $match: {
                    $and: [{ deleted: false }, { judged: true }, { routineId: mongoose.Types.ObjectId(req.params.routineid) }, { isTechnician: '0' }]
                }

            }, {
                $group: {
                    _id: { "judgePanel": "$judgePanel", "judgePanelid": "$judgePanelid" },
                    groupedItem: { $push: "$$ROOT" }
                }
            }

        ]

        return dataProviderHelper.aggregate(EventMeetForJudges, query);

    }

    _p.getRoutine = function(req) {
        var query = {}
        query.deleted = false;
        return dataProviderHelper.find(Routine, query);
    }

    _p.getAllNewRoutine = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var uploadingType;
        if (req.query.type == 'flyp10') {
            uploadingType = '1'
        } else {
            uploadingType = '2'
        }
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };

        var query = [{
                $match: {

                    $and: [

                        { routinestatus: '0' }, { deleted: false }, { uploadingType: uploadingType }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sid",
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
                    localField: "uid",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            { $sort: { addedOn: -1 } }
        ];
        //console.log(query)
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
    }
    _p.getTeammateRoutines = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        //console.log(req.decoded.user._id, "sdsd")
        var sortOpts = { addedOn: -1 };

        var query = [{
                $match: {

                    $and: [

                        { submissionfor: '2' }, { deleted: false }, { submittedByID: mongoose.Types.ObjectId(req.decoded.user._id) }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sid",
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
                    localField: "uid",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            { $sort: { addedOn: -1 } }
        ];
        //console.log(query)
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
    }
    _p.getEventMeetNewRoutine = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };

        var query = [{
                $match: {

                    $and: [

                        { $or: [{ routinestatus: '0' }, { routinestatus: '5' }] }, { deleted: false }, { eventMeetId: req.params.eventMeetId }
                    ]

                }


            },
            {
                $lookup: {
                    from: "EventMeetForJudging",
                    let: { routineId: "$_id" },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$judged", true] },
                                        { $eq: ["$routineId", "$$routineId"] }
                                    ]
                                }
                            }
                        },

                    ],
                    as: "judgeInfo"
                }
            },
            {
                $addFields: {
                    judgedCount: {
                        $size: "$judgeInfo"
                    }
                }
            },
            {
                $lookup: {
                    from: "Flyp10_User",
                    localField: "uid",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $lookup: {
                    from: "USAG-Membership-Verification",
                    localField: "uid",
                    foreignField: "Flyp10UserID",
                    as: "MemberInfo"
                }
            },

            { "$unwind": { path: "$MemberInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "EventMeet-Athlete-Reservation",
                    let: { usagId: "$MemberInfo.MemberID", sanctionId: "$SanctionID" },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$SanctionID", "$$sanctionId"] },
                                        { $eq: ["$USAGID", "$$usagId"] },
                                        { $eq: ["$deleted", false] }
                                    ]
                                }
                            }
                        },


                    ],
                    as: "athleteInfo"

                }
            },
            {
                $lookup: {
                    from: "EventMeet-Coach-Reservation",
                    let: { usagId: "$MemberInfo.MemberID", sanctionId: "$SanctionID" },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$SanctionID", "$$sanctionId"] },
                                        { $eq: ["$USAGID", "$$usagId"] },
                                        { $eq: ["$deleted", false] }
                                    ]
                                }
                            }
                        },


                    ],
                    as: "coachInfo"

                }
            },
            { $sort: { addedOn: -1 } },
            { $match: { "judgedCount": { $eq: 0 } } }
        ];
        //console.log(query)
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
    }
    _p.getSanctionEventMeetRoutines = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };

        var query = [{
                    $match: {

                        $and: [

                            { routinestatus: '1' }, { deleted: false }, { eventMeetId: req.params.eventMeetId }
                        ]

                    }


                },
                {
                    $lookup: {
                        from: "Flyp10_User",
                        localField: "uid",
                        foreignField: "_id",
                        as: "userInfo"
                    }
                },
                {
                    $unwind: "$userInfo"
                },
                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "uid",
                        foreignField: "Flyp10UserID",
                        as: "MemberInfo"
                    }
                },

                { "$unwind": { path: "$MemberInfo", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "EventMeet-Athlete-Reservation",
                        let: { usagId: "$MemberInfo.MemberID", sanctionId: "$SanctionID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", "$$sanctionId"] },
                                            { $eq: ["$USAGID", "$$usagId"] },
                                            { $eq: ["$deleted", false] }
                                        ]
                                    }
                                }
                            },


                        ],
                        as: "athleteInfo"

                    }
                },
                {
                    $lookup: {
                        from: "EventMeet-Coach-Reservation",
                        let: { usagId: "$MemberInfo.MemberID", sanctionId: "$SanctionID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", "$$sanctionId"] },
                                            { $eq: ["$USAGID", "$$usagId"] },
                                            { $eq: ["$deleted", false] }
                                        ]
                                    }
                                }
                            },


                        ],
                        as: "coachInfo"

                    }
                },
            ]
            //console.log(query)
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
    }

    _p.getRoutineJudges = function(req, next) {

        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };

        var query = [{
                $match: {

                    $and: [

                        { routineId: mongoose.Types.ObjectId(req.params.routineid) }, { deleted: false }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Flyp10_User",
                    localField: "judgeId",
                    foreignField: "_id",
                    as: "userinfo"
                }
            },
            {
                $unwind: "$userinfo"
            },

        ];


        //console.log(query)
        return dataProviderHelper.aggregate(EventMeetForJudges, query);
    }
    _p.getAllassignedRoutine = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };

        var query = [{
                $match: {

                    $and: [

                        { routinestatus: '2' }, { deleted: false }, { uploadingType: '1' }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sid",
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
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            { $sort: { addedOn: -1 } }
        ];
        // //console.log(query)
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
    }
    _p.getAllinCompleteRoutine = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };

        var query = [{
                $match: {

                    $and: [

                        { routinestatus: '3' }, { deleted: false }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sid",
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
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            { $sort: { addedOn: -1 } }
        ];
        // //console.log(query)
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
    }
    _p.getAllinAppeopriateRoutine = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };

        var query = [{
                $match: {

                    $and: [

                        { routinestatus: '4' }, { deleted: false }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sid",
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
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            { $sort: { addedOn: -1 } }
        ];
        // //console.log(query)
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
    }
    _p.getAllJudgedRoutine = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query;
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };
        var uploadingType;
        if (req.query.type == 'flyp10') {
            uploadingType = '1'
            query = [{
                    $match: {

                        $and: [

                            { routinestatus: '1' }, { deleted: false }, { uploadingType: uploadingType }
                        ]

                    }


                },
                {
                    $lookup: {
                        from: "Sport",
                        localField: "sid",
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
                        localField: "judgedBy",
                        foreignField: "username",
                        as: "userInfo"
                    }
                },
                { "$unwind": { path: "$userInfo", preserveNullAndEmptyArrays: true } },
                { $sort: { addedOn: -1 } }
            ];
            return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
        } else {
            uploadingType = '2'
            query = {
                routinestatus: "1",
                deleted: false,
                uploadingType: uploadingType
            }
            return dataProviderHelper.getAllWithDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
        }

        // //console.log(query)

    }

    _p.getJudgedEventMeetRoutines = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query;
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };
        var uploadingType;

        uploadingType = '2'
        query = {
            routinestatus: "1",
            deleted: false,
            uploadingType: uploadingType,
            eventMeetId: req.params.eventMeetId
        }

        return dataProviderHelper.getAllWithDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);


        // //console.log(query)

    }
    _p.getEventmeetQueueRoutine = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };
        var uploadingType;

        var query = [{
                $match: {

                    $and: [

                        { $or: [{ routinestatus: '0' }, { routinestatus: '5' }] }, { deleted: false }, { uploadingType: '2' }
                    ]

                }


            },
            {
                $lookup: {
                    from: "Flyp10_User",
                    localField: "uid",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sid",
                    foreignField: "_id",
                    as: "sportinfo"
                }
            },
            {
                $unwind: "$sportinfo"
            },
            {
                $lookup: {
                    from: "EventMeetForJudging",
                    let: { routineId: "$_id" },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$judged", true] },
                                        { $eq: ["$routineId", "$$routineId"] }
                                    ]
                                }
                            }
                        },

                    ],
                    as: "judgeInfo"
                }
            },
            { $sort: { addedOn: -1 } },
            {
                $project: {
                    routine: "$$ROOT",
                    judgedCount: { $size: "$judgeInfo" }
                }
            },

            { $match: { "judgedCount": { $gt: 0 } } }
        ];
        // //console.log(query)
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
    }
    _p.getEventmeetQueueRoutineByID = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        // var query = {};
        //query.originalfilename={ $exists:true}
        //  query.status='1';
        // query.deleted = false;
        var sortOpts = { addedOn: -1 };
        var uploadingType;

        var query = [{
                $match: {

                    $and: [

                        { $or: [{ routinestatus: '0' }, { routinestatus: '5' }] }, { deleted: false }, { eventMeetId: req.params.eventMeetId }, { uploadingType: '2' }
                    ]

                }


            },

            {
                $lookup: {
                    from: "EventMeetForJudging",
                    let: { routineId: "$_id" },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$judged", true] },
                                        { $eq: ["$routineId", "$$routineId"] }
                                    ]
                                }
                            }
                        },

                    ],
                    as: "judgeInfo"
                }
            },
            {
                $lookup: {
                    from: "Flyp10_User",
                    localField: "uid",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $lookup: {
                    from: "USAG-Membership-Verification",
                    localField: "uid",
                    foreignField: "Flyp10UserID",
                    as: "MemberInfo"
                }
            },

            { "$unwind": { path: "$MemberInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "EventMeet-Athlete-Reservation",
                    let: { usagId: "$MemberInfo.MemberID", sanctionId: "$SanctionID" },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$SanctionID", "$$sanctionId"] },
                                        { $eq: ["$USAGID", "$$usagId"] },
                                        { $eq: ["$deleted", false] }
                                    ]
                                }
                            }
                        },


                    ],
                    as: "athleteInfo"

                }
            },
            {
                $lookup: {
                    from: "EventMeet-Coach-Reservation",
                    let: { usagId: "$MemberInfo.MemberID", sanctionId: "$SanctionID" },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$SanctionID", "$$sanctionId"] },
                                        { $eq: ["$USAGID", "$$usagId"] },
                                        { $eq: ["$deleted", false] }
                                    ]
                                }
                            }
                        },


                    ],
                    as: "coachInfo"

                }
            },

            { $sort: { addedOn: -1 } },
            {
                $project: {
                    routine: "$$ROOT",
                    judgedCount: { $size: "$judgeInfo" }
                }
            },

            { $match: { "judgedCount": { $gt: 0 } } }
        ];
        // //console.log(query)
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Routine, query, pagerOpts, routineFields, sortOpts);
    }
    _p.getbannerdetails = function(req, next) {

        var query = {}
        query.deleted = false;
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        return dataProviderHelper.getAllWithDocumentFieldsPagination(Banner, query, pagerOpts, bannerdocumentFields, { addedOn: -1 });

        // return dataProviderHelper.find(Banner,query);
    }
    _p.getAllRoutinecomment = function(req) {
        var query = {}
        query.deleted = false;
        return dataProviderHelper.find(RoutineComment, query);
    }
    _p.getAllTechnicianRoutinecomment = function(req) {
        var query = {}
        query.deleted = false;
        return dataProviderHelper.find(TechnicianComment, query);
    }
    _p.getRoutinedetailBystatus = function(req) {
        //console.log(req.params.routinestatus)
        var query = {}
        query.routinestatus = '' + req.params.routinestatus;
        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.find(Routine, query);
    }
    _p.getVerifiedsportsByjudgeID = function(req) {
        //console.log(req.params.judgeid)
        // var query={}
        // query.status='1';
        // query.userid=req.params.judgeid;
        // query.deleted=false; 
        // //console.log(query)
        var query = [{
                $match: {

                    $and: [{ 'deleted': false }, { 'userid': mongoose.Types.ObjectId(req.params.judgeid) }, { 'status': '1' }]

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
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.aggregate(JudgeSport, query);
    }
    _p.getroutinebysportsandlevel = function(req) {
        var query = [

            {
                $match: {
                    $and: [{ 'deleted': false }, { routinestatus: '0' }, { isConverted: '2' }, { uploadingType: '1' }, { sid: mongoose.Types.ObjectId(req.params.sport) }, { lid: mongoose.Types.ObjectId(req.params.level) }]
                }

            },

            {
                $lookup: {
                    from: "Flyp10_User",
                    localField: "uid",
                    foreignField: "_id",
                    as: "userinfo"
                }
            },

            { "$unwind": "$userinfo" },

            {
                $lookup: {
                    from: "RoutineJudgesMap",
                    localField: "sourceID",
                    foreignField: "routineid",
                    as: "sourceinfo"
                }
            }



        ]
        query.routinestatus = '0';
        /* query.sid=mongoose.Types.ObjectId(req.params.sport);
        query.lid=mongoose.Types.ObjectId(req.params.level);
        query.deleted=false; */
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.aggregate(Routine, query);
    }
    _p.getAssignedroutine = function(req) {
        //console.log(req.params.judgeid)
        var query = {}
        query.routinestatus = '2';
        query.assignedTo = req.params.judgeid;
        query.deleted = false;
        //console.log(query);
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.find(Routine, query);
    }

    _p.getsingleRoutineByID = function(req) {
        //console.log(req.params.routineid)
        var query = {}
        query._id = req.params.routineid;
        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.findById(Routine, mongoose.Types.ObjectId(req.params.routineid), routineFields);
    };
    _p.getsingleTechnicianRoutineByID = function(req) {
        //console.log(req.params.routineid)
        var query = {}
        query.routineid = mongoose.Types.ObjectId(req.params.routineid);
        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.find(TechnicianRoutine, query, technicianFields);
    };
    _p.getTechnicianRoutineComment = function(req) {
        //console.log(req.params.routineid)
        var query = {}
        query.routineid = mongoose.Types.ObjectId(req.params.routineid);
        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.find(TechnicianComment, query);
    };


    _p.getLibraryVideoByVID = function(req) {
        //console.log(req.params.vid)
        var query = {}
        query._id = req.params.vid;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.findById(Routine, req.params.vid, routineFields);
    };


    _p.getsingleRoutinedetailByID = function(req) {
        //console.log(req.params.routineid)
        var query = {}
        query._id = req.params.routineid;
        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.findById(Routine, req.params.routineid, routineStatusFields);
    };
    _p.getsingleRoutineTechniciandetailByID = function(req) {
        //console.log(req.params.routineid)
        var query = {}
        query._id = req.params.routineid;
        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.findById(Routine, req.params.routineid, routineStatusFields);
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

    function convertRoutine(documentName, req) {
        //console.log('inside convert routine')
        var completed = true;
        var routineScr = "/mnt/volume_sfo2_01/public/uploads/user/routine/source/" + documentName;
        var convertfilename = "/mnt/volume_sfo2_01/public/uploads/user/routine/" + path.parse(documentName).name + '.mp4';
        var filename = path.parse(documentName).name;
        hbjs.spawn({ input: routineScr, output: convertfilename })
            .on('error', err => {
                //console.log(err)
                let update = { $set: { "isConverted": "3" } }
                let Query = { convertedfileName: filename }
                completed = false;
                try {
                    dataProviderHelper.updateMany(Routine, Query, update).then((response) => {
                        if (response && response.nModified == 0) {
                            try {
                                _p.logActivity("convertRoutine:Routine is not updated,nModified is 0,Error occured while converting, Query => " + JSON.stringify(Query))
                            } catch (e) {

                            }

                        }
                    });
                } catch (e) {
                    try {
                        _p.logActivity("convertRoutine:Routine is not updated,CatchError => " + e + 'Query =>' + JSON.stringify(Query))
                    } catch (e) {

                    }
                }

            })
            .on('progress', progress => {
                //  //console.log(
                //  'Percent complete: %s, ETA: %s',
                //  progress.percentComplete,
                //  progress.eta
                //  )
            }).on('complete', progress => {
                //console.log('completed');
                if (completed == true) {
                    let videofilename = "public/uploads/user/routine/" + path.parse(documentName).name + '.mp4'
                    let update = { $set: { "isConverted": "2", videofilename: videofilename } }
                    let Query = { convertedfileName: filename }
                    try {
                        dataProviderHelper.updateMany(Routine, Query, update).then((response) => {
                            if (response && response.nModified == 0) {
                                try {
                                    _p.logActivity("convertRoutine:Routine is not updated,nModified is 0,Query => " + JSON.stringify(Query))
                                } catch (e) {

                                }
                            }
                        });
                        // delete file named 'source'
                        if (fs.existsSync(routineScr)) {
                            fs.unlink(routineScr, function(err) {
                                if (err) throw err;
                                // if no error, file has been deleted successfully
                                //console.log('File deleted!');
                                if (req.body.uploadingType == '1') {
                                    _p.sendJugdge(req, '')
                                }
                            });
                        }


                    } catch (e) {
                        try {
                            _p.logActivity("convertRoutine:Routine is not updated,CatchError => " + e + 'Query =>' + JSON.stringify(Query))
                        } catch (e) {

                        }
                    }

                } else {
                    //console.log("not completed")
                }

            })

    };

    function moveSourceFolder(documentName, req) {
        //console.log('inside move to source folder')
        var completed = false;
        var routineScr = "/mnt/volume_sfo2_01/public/uploads/user/routine/source/" + documentName;
        var convertfilename = "/mnt/volume_sfo2_01/public/uploads/user/routine/" + path.parse(documentName).name + '.mp4';
        var filename = path.parse(documentName).name;
        let videofilename = "public/uploads/user/routine/" + path.parse(documentName).name + '.mp4';
        let update = { $set: { "isConverted": "2", videofilename: videofilename } }
        let Query = { convertedfileName: filename }
            //console.log(update, Query)
        try {

            // dataProviderHelper.updateMany(Routine,Query,update);
            fs.rename(routineScr, convertfilename, function(err) {
                if (!err) {
                    dataProviderHelper.updateMany(Routine, Query, update).then((response) => {
                        if (response && response.nModified == 0) {
                            try {
                                _p.logActivity("moveSourceFolder:Routine is not updated,nModified is 0,Query => " + JSON.stringify(Query))
                            } catch (e) {}
                        }
                    });
                    // delete file named 'source'
                } else {
                    try {
                        _p.logActivity("moveSourceFolder:moving source file is failed,Query => " + JSON.stringify(Query))
                    } catch (e) {

                    }
                }
                if (req.body && req.body.uploadingType == '1') {
                    _p.sendJugdge(req, '')
                }
                //console.log('Successfully renamed - AKA moved!')
            })

        } catch (e) {
            try {
                _p.logActivity("moveSourceFolder:Routine is not updated,CatchError => " + e + 'Query =>' + JSON.stringify(Query))
            } catch (e) {

            }
        }


    };
    _p.logActivity = async function(logmsg) {
        // var root = __dirname.split('\\');
        // root.pop();
        // var rootPath = root.join('/')
        var date = formatDate()
        let fileName = '/mnt/volume_sfo2_01/errorlog/log_' + date + '.txt'
        await createlogfile(fileName);
        try {
            let log = '\r\n' + logmsg
            fs.appendFile(fileName, log, function(err) {
                if (err) {
                    console.log(err)
                        // console.log('log not saved')
                }
            });

        } catch (e) {

        }
    }

    function formatDate() {
        var date = new Date()
        return addZ(date.getMonth() + 1) + addZ(date.getDate()) + addZ(date.getFullYear())
    }

    function addZ(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function createlogfile(fileName) {
        return new Promise(function(resolve, reject) {
            fs.exists(fileName, function(exists) {
                if (exists) {
                    resolve();
                } else {
                    fs.writeFile(fileName, '', function(err, data) {
                        if (err) {
                            //    console.log(err, 'err')
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                }
            });
        })
    }
    _p.convertRoutineByName = function(req, res, next) {
        var completed = true;
        var routineScr = "/mnt/volume_sfo2_01/public/uploads/user/routine/" + req.query.path;
        var convertfilename = "/mnt/volume_sfo2_01/public/uploads/user/routine/" + path.parse(req.query.filename).name + 'converted.mp4';
        var filename = path.parse(req.query.filename).name;
        var error;
        //var filename=path.parse(documentName).name;
        //console.log(path.parse(req.query.filename).name, "sdsd")
        //console.log(routineScr)
        hbjs.spawn({ input: routineScr, output: convertfilename })
            .on('error', err => {
                console.log(err)
                error = err;
                let update = { $set: { "isConverted": "3" } }
                let Query = { _id: mongoose.Types.ObjectId(req.params.routineID) }
                completed = false;
                try {
                    dataProviderHelper.updateMany(Routine, Query, update);
                } catch (e) {

                }

            })
            .on('progress', progress => {
                //console.log(
                //     'Percent complete: %s, ETA: %s',
                //     progress.percentComplete,
                //     progress.eta
                // )
            }).on('complete', progress => {
                //console.log('completed');
                if (completed == true) {
                    let videofilename = "public/uploads/user/routine/" + path.parse(req.query.filename).name + 'converted.mp4';
                    let update = { $set: { "isConverted": "2", videofilename: videofilename } }
                    let Query = { _id: mongoose.Types.ObjectId(req.params.routineID) }
                    try {
                        dataProviderHelper.updateMany(Routine, Query, update);
                        // delete file named 'source'
                        // fs.unlink(routineScr, function (err) {
                        //     if (err) throw err;
                        //     // if no error, file has been deleted successfully
                        //     //console.log('File deleted!');
                        // });
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: "Conversion Completed"
                        });
                    } catch (e) {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: "Conversion completed but update failed"
                        });
                    }

                } else {
                    //console.log("not completed")
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: "Conversion failed",
                        err: error
                    });
                }

            })
    }
    _p.saveRoutine = function(req, res, next) {

        //console.log('params ', req.body);
        let data = req.body.data ? JSON.parse(req.body.data) : req.body
            //console.log('data ', data);

        req.body = data;
        req.body.uploadingType = req.body.uploadingType ? req.body.uploadingType : '1'
            //console.log('save RRRRR req ', req.body);

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
            //  //console.log('routine data to save ', modelInfo);
            query.title = modelInfo.title.toLowerCase();
            query.deleted = false;
            return dataProviderHelper.checkForDuplicateEntry(Routine, query).then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.alreadyExistsroutine + '"}');
                    } else {
                        var routineInfo = utilityHelper.getDocumentFileInfo(req, null, next);
                        if (routineInfo._documentName) {
                            var routineScr = "/mnt/volume_sfo2_01/public/uploads/user/routine/source/" + routineInfo._documentName;
                            var ext = modelInfo.originalfilename.substring(modelInfo.originalfilename.lastIndexOf('.') + 1)
                                //console.log('extension', ext)
                            if (ext == 'mp4' || ext == 'MP4') {
                                routineScr = "/mnt/volume_sfo2_01/public/uploads/user/routine/" + routineInfo._documentName;
                            }
                            var filename = 'thumbnail-' + path.parse(routineInfo._documentName).name + '.png';

                            console.log('outside thumbnail', routineScr)
                            console.log('check thumbnail', fs.existsSync(routineScr))

                            setTimeout(() => {

                                
                            if (fs.existsSync(routineScr)) {

                                console.log('inside thumbnail if')
                                try {
                                    FfmpegCommand(routineScr)
                                        .on('error', function(err) {
                                            console.log('an error happened: ' + err.message);
                                        })
                                        .screenshots({
                                            timestamps: ['2%'],
                                            filename: filename,
                                            folder: '/mnt/volume_sfo2_01/public/thumbnail',
                                            size: '306x182'
                                        });
                                } catch (e) {
                                    //console.log(e)
                                    console.log("exception occurred on thumpnail creation",e)
                                }

                            } else {
                                console.log('inside thumbnail else')
                                try {
                                    FfmpegCommand("/mnt/volume_sfo2_01/public/uploads/user/routine/" + routineInfo._documentName)
                                        .on('error', function(err) {
                                            console.log('an error happened: ' + err.message);
                                        })
                                        .screenshots({
                                            timestamps: ['2%'],
                                            filename: filename,
                                            folder: '/mnt/volume_sfo2_01/public/thumbnail',
                                            size: '306x182'
                                        });
                                } catch (e) {
                                  console.log("exception occurred on thumpnail creation",e)
                                }

                            }
                                
                            }, 3000);

                            modelInfo.thumbnailPath = "public/thumbnail/" + filename;

                            var ext = modelInfo.originalfilename.substring(modelInfo.originalfilename.lastIndexOf('.') + 1)
                                //console.log('extension', ext)
                            if (ext) {
                                //console.log(ext)
                                if (ext.toString().toLowerCase() != 'mp4') {
                                    convertRoutine(routineInfo._documentName, req);
                                } else {
                                    //   moveSourceFolder(routineInfo._documentName, req)
                                }
                            } else {

                                convertRoutine(routineInfo._documentName, req);
                            }
                        }

                        ////console.log('event meet id from dave routine', req.body.eventMeetId._id)
                        if (req.body.uploadingType == '1' || !req.body.uploadingType) {
                            req.body.eventMeetId = { _id: '' }
                                // if (req.body.sportid == applicationConfig.sports.WFigureSkating || req.body.sportid == applicationConfig.sports.MFigureSkating) {
                                //     modelInfo.technician_status = '0'
                                // } else {
                                //     modelInfo.technician_status = '2'
                                // }
                        }
                        let eventMeetId
                        if (req.body.uploadingType == '2' && req.body.isIOS) {
                            eventMeetId = JSON.parse(req.body.eventMeetId)
                        } else {
                            eventMeetId = req.body.eventMeetId
                        }
                        var convertedfileName = path.parse(routineInfo._documentName).name;
                        //For Sanction Routine;
                        modelInfo.EventName = eventMeetId.EventName;
                        if (eventMeetId.SanctionMeet && eventMeetId.SanctionID) {
                            ////console.log('res,tes',eventMeetId.SanctionMeet)
                            modelInfo.SanctionRoutine = true;
                            modelInfo.SanctionID = eventMeetId.SanctionID;
                            modelInfo.EventName = eventMeetId.EventName;
                        }

                        var newRoutine = RoutineModule.CreateRoutine(modelInfo, eventMeetId._id, req.decoded.user.username, routineInfo, convertedfileName);
                        //console.log('newroutine', newRoutine)
                        return [newRoutine, dataProviderHelper.save(newRoutine).then(async(routineResponse) => {

                            if (routineInfo._documentName) {
                                var ext = modelInfo.originalfilename.substring(modelInfo.originalfilename.lastIndexOf('.') + 1)
                                    //console.log('extension', ext)
                                if (ext) {
                                    //console.log(ext)
                                    if (ext.toString().toLowerCase() != 'mp4') {
                                        // convertRoutine(routineInfo._documentName, req);
                                    } else {
                                        moveSourceFolder(routineInfo._documentName, req)
                                    }
                                }
                            }



                            if (req.body.uploadingType == '2') {
                                let eventMeetId
                                if (req.body.uploadingType == '2' && req.body.isIOS) {
                                    eventMeetId = JSON.parse(req.body.eventMeetId)
                                } else {
                                    eventMeetId = req.body.eventMeetId
                                }
                                if (eventMeetId.SanctionMeet && eventMeetId.SanctionID) {

                                    await EventMeetJudgeMapping(req, routineResponse._id, )

                                } else {
                                    let judges
                                    if (req.body.isIOS) {
                                        judges = JSON.parse(req.body.judges)
                                    } else {
                                        judges = req.body.judges
                                    }
                                    //console.log('judges', judges)
                                    for (let i = 0; i < judges.length; i++) {
                                        let body = {
                                            eventId: eventMeetId._id,
                                            judgeId: judges[i],
                                            routineId: routineResponse._id,
                                            isTechnician: '0'
                                        }
                                        if (eventMeetId.EventLevel != '1') {
                                            try {
                                                sendNotification(judges[i])
                                            } catch (e) {

                                            }
                                        }

                                        //console.log('before assigning to judges body', body)
                                        var eventforjudging = RoutineModule.CreateEventMeetForJudging(body)
                                        eventforjudging.save()


                                    }
                                }

                            }

                            if (req.body.sportid == applicationConfig.sports.WFigureSkating || req.body.sportid == applicationConfig.sports.MFigureSkating) {

                                if (req.body.uploadingType == '2' && req.body.technician && eventMeetId.EventLevel == '1') {
                                    let body = {
                                        eventId: eventMeetId._id,
                                        judgeId: req.body.technician,
                                        routineId: routineResponse._id,
                                        isTechnician: '1'
                                    }
                                    try {
                                        sendNotification(req.body.technician);
                                    } catch (e) {

                                    }
                                    var eventforjudging = RoutineModule.CreateEventMeetForJudging(body)
                                    eventforjudging.save()
                                }

                                let body = {
                                        routineid: routineResponse._id,
                                        scoretype: req.body.scoretype,
                                        status: '0',
                                        uploadingType: req.body.uploadingType
                                    }
                                    //console.log('before assigning to judges body', body)
                                var technicianRoutine = RoutineModule.CreateTechnicianRoutine(body, req.decoded.user.username)
                                technicianRoutine.save();
                            }

                        })];
                    }
                }).then(function() {

                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.routine.saveMessageroutine

                    });
                    return join(
                        _p.sendmailToUserupdated(req, next),
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

    function EventMeetJudgeMapping(req, routineid) {
        return new Promise((resolve, reject) => {
            var eventMeetId;
            if (req.body.uploadingType == '2' && req.body.isIOS) {
                eventMeetId = JSON.parse(req.body.eventMeetId)
            } else {
                eventMeetId = req.body.eventMeetId
            }
            var query = {};
            query.sportId = mongoose.Types.ObjectId(req.body.sid)
            query.eventId = mongoose.Types.ObjectId(req.body.eid)
            query.levelId = mongoose.Types.ObjectId(req.body.lid)
            query.eventmeetId = mongoose.Types.ObjectId(eventMeetId._id)

            dataProviderHelper.find(EventMeetJudgeMap, query).then((judgesmap) => {
                if (judgesmap.length) {
                    //console.log('judgespanel', judgesmap)
                    var judgesbyPanel = judgesmap[0].JudgesbyPanel;
                    for (var i = 0; i < judgesbyPanel.length; i++) {
                        var panel = judgesbyPanel[i].PanelName;
                        var panelId = judgesbyPanel[i].Panel;
                        var judges = judgesbyPanel[i].Judges
                        for (var j = 0; j < judges.length; j++) {
                            let body = {
                                    eventId: eventMeetId._id,
                                    judgeId: judges[j],
                                    routineId: routineid,
                                    judgePanel: panel,
                                    judgePanelid: panelId,
                                    isTechnician: '0'
                                }
                                //console.log('judges', body)
                            try {
                                sendNotification(judges[j])
                            } catch (e) {

                            }
                            var eventforjudging = RoutineModule.CreateEventMeetForJudging(body)
                            eventforjudging.save();

                        }

                        if (i == judgesbyPanel.length - 1) {
                            resolve()
                        }
                    }
                } else {
                    resolve()
                }
            })

        })
    }
    _p.saveTechnicianRoutine = function(req, res, next) {

        //console.log('params ', req.body);
        let data = req.body.data ? JSON.parse(req.body.data) : req.body
            //console.log('data ', data);

        req.body = data;
        req.body.uploadingType = req.body.uploadingType ? req.body.uploadingType : '1'
        var query = {};
        var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        //  //console.log('routine data to save ', modelInfo);
        query.routineid = mongoose.Types.ObjectId(req.body.routineid)
        query.deleted = false;
        return dataProviderHelper.checkForDuplicateEntry(TechnicianRoutine, query).then(function(count) {
                if (count > 0) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.alreadyExistsroutine + '"}');
                } else {

                    var newRoutine = RoutineModule.CreateTechnicianRoutine(modelInfo, req.decoded.user.username);
                    //console.log('newroutine', newRoutine)
                    return dataProviderHelper.save(commentObj);
                }
            }).then(function() {

                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.routine.saveMessageroutine
                });
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
            //console.log("userdata", query, user);
            if (user) {
                //console.log(user[0].email);
                mailController.sendMail(req, user[0].email, 'New Routine uploaded', next);
            }
        })
        if (req.body.uploadingType == '1') {
            _p.sendJugdge(req, '')
        }

    }
    _p.sendmailToUserupdated = function(req, next) {
        let query = {
            _id: req.body.userid,
            deleted: false
        }

        dataProviderHelper.find(User, query).then(function(user) {
                //console.log("userdata", query, user);
                if (user) {
                    //console.log(user[0].email);
                    mailController.sendMail(req, user[0].email, 'New Routine uploaded', next);
                }
            })
            //_p.sendJugdge(req,next);
    }
    _p.sendJugdge = function(req, next) {
        //console.log("sendjudges eventmeet")

        let sid = mongoose.Types.ObjectId(req.body.sid)
        let lid = mongoose.Types.ObjectId(req.body.lid)
        var query = [


            {

                $lookup: {

                    from: 'Flyp10_User',
                    localField: 'userid',
                    foreignField: '_id',
                    as: "UserInformation"

                }

            },
            { $unwind: "$UserInformation" },

            { $match: { 'status': '1', 'deleted': false, 'UserInformation.userRole': '2', 'sportid': sid, 'levelid': lid } },

            {

                $lookup: {

                    from: 'NotificationToken',
                    localField: 'UserInformation._id',
                    foreignField: 'UID',
                    as: "tokenInfomation"

                }

            },
            { $unwind: "$tokenInfomation" }

        ]
        dataProviderHelper.aggregate(JudgesSport, query).then(function(user) {
            //console.log("userdata for judges notification", user);
            if (user) {
                let userlength = user.length ? user.length : 0

                if (userlength > 0) {
                    if (sid == applicationConfig.sports.WFigureSkating || sid == applicationConfig.sports.MFigureSkating) {
                        //console.log('figure skating')
                        for (let i = 0; i < user.length; i++) {
                            //console.log(user[i].tokenInfomation.token);
                            if (user[i].UserInformation.EligibleJudgeForMyFlyp10Routine) {
                                if (user[i].uploadingfor == '1' || user[i].uploadingfor == '3') {
                                    let body = {

                                            "notification": {
                                                "title": "Flyp10 routines available",
                                                "body": user[i].UserInformation.username + ',  A new routine that meet your profile and are waiting for a score on Flyp10.',
                                                "sound": "default",
                                                "click_action": "FCM_PLUGIN_ACTIVITY",
                                                "icon": "fcm_push_icon"
                                            },
                                            "data": {
                                                "param1": "value1",
                                                "param2": "value2"
                                            },
                                            "to": user[i].tokenInfomation.token,
                                            "priority": "high",
                                            "restricted_package_name": ""
                                        }
                                        //console.log('notification body', body)

                                    const callback = (err, resp, body) => {
                                        if (!err && resp.statusCode == 200) {
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
                            }
                        }
                    } else {
                        //console.log('flyp10-routine judges')
                        for (let i = 0; i < user.length; i++) {
                            if (user[i].UserInformation.EligibleJudgeForMyFlyp10Routine) {
                                console.log(user[i].username, 'EligibleJudgeForMyFlyp10Routine')
                                    //console.log('flyp10-routine judges token')
                                    //console.log(user[i].tokenInfomation.token);
                                let body = {

                                        "notification": {
                                            "title": "Flyp10 routines available",
                                            "body": user[i].UserInformation.username + ',  A new routine that meet your profile and are waiting for a score on Flyp10.',
                                            "sound": "default",
                                            "click_action": "FCM_PLUGIN_ACTIVITY",
                                            "icon": "fcm_push_icon"
                                        },
                                        "data": {
                                            "param1": "value1",
                                            "param2": "value2"
                                        },
                                        "to": user[i].tokenInfomation.token,
                                        "priority": "high",
                                        "restricted_package_name": ""
                                    }
                                    //console.log('notification body', body)

                                const callback = (err, resp, body) => {
                                    if (!err && resp.statusCode == 200) {
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
                        }
                    }
                }


                //mailController.sendMail(req,user[0].email,'New Routine uploaded' ,next);
            }
        })
    }

    function sendNotification(id) {
        ////console.log(id,"judgeId")
        // console.log('eventmeetjudges')
        console.log("it came to notification")

        var query = [




            { $match: { 'UID': mongoose.Types.ObjectId(id) } },

            {

                $lookup: {

                    from: 'Flyp10_User',
                    localField: 'UID',
                    foreignField: '_id',
                    as: "UserInformation"

                }

            },
            { $unwind: "$UserInformation" },


        ]
        dataProviderHelper.aggregate(NotificationTokenObj, query).then(function(notification) {
            console.log("userdata", notification, "eventmeet");
            if (notification.length > 0) {
                console.log(notification);
                //console.log(notification[0].UserInformation.username)

                notification.forEach(element=>{
                    let body = {

                        "notification": {
                            "title": "Flyp10 routines available",
                            "body": element.UserInformation.username + ',  A new routine that meet your profile and are waiting for a score on Flyp10.',
                            "sound": "default",
                            "click_action": "FCM_PLUGIN_ACTIVITY",
                            "icon": "fcm_push_icon"
                        },
                        "data": {
                            "param1": "value1",
                            "param2": "value2"
                        },
                        "to": element.token,
                        "priority": "high",
                        "restricted_package_name": ""
                    }
                    //console.log('notification body', body)

                const callback = (err, resp, body) => {

                    console.log('err notification',err)
                    // console.log('resp notification',resp)
                    console.log('body notification',body)
                    if (!err && resp.statusCode == 200) {
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
                })
               





                //mailController.sendMail(req,user[0].email,'New Routine uploaded' ,next);
            }
        }).catch(function(err) {
            return next(err);
        });
    }
    _p.getJudgesSportDetails = function(req, res, next) {
        let sid = mongoose.Types.ObjectId(req.params.sid)
        let lid = mongoose.Types.ObjectId(req.params.lid)
        let assignedTo = mongoose.Types.ObjectId(req.params.assignedTo)
        var query = [{
                $lookup: {
                    from: 'Flyp10_User',
                    localField: 'userid',
                    foreignField: '_id',
                    as: "UserInformation"
                }

            },
            { $unwind: "$UserInformation" },

            { $match: { 'deleted': false, 'UserInformation.userRole': '2', 'sportid': sid, 'levelid': lid, 'userid': assignedTo } },

        ]
        dataProviderHelper.aggregate(JudgesSport, query).then(function(user) {
            //console.log("userdata", user);
            if (user) {
                res.status(HTTPStatus.OK);
                res.json({
                    result: user
                });
            }

        })
    }
    _p.saveBanner = function(req, res, next) {
        req.body = JSON.parse(req.body.data);
        var errors = _p.checkbannerValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            var _errorsRes = (errors.length === 1) ? errors[0].msg : errors;
            res.json({
                message: _errorsRes
            });
        } else {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            query.type = modelInfo.type;
            query.deleted = false;
            return dataProviderHelper.checkForDuplicateEntry(Banner, query).then(function(count) {
                    if (count > 0) {
                        /* var query={}
                        query.deleted=false;
                        dataProviderHelper.removeModelData(Banner,query).then(function () {
                            var bannerInfo = utilityHelper.getDocumentFileInfo(req, null, next);
                            //console.log("bannerInfo",bannerInfo)
                            var newBanner = RoutineModule.CreateBanner(modelInfo, req.decoded.user.username, bannerInfo);
                            //console.log("newBanner",newBanner);
                            return [newBanner, dataProviderHelper.save(newBanner)];
                        })
                        */
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.banner.alreadyExistsBanner + '"}');
                    } else {
                        var bannerInfo = utilityHelper.getDocumentFileInfo(req, null, next);
                        var newBanner = RoutineModule.CreateBanner(modelInfo, req.decoded.user.username, bannerInfo);
                        return [newBanner, dataProviderHelper.save(newBanner)];
                    }
                }).then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.banner.saveMessageBanner
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
    _p.updateJudgeQueue = function(req, res, next) {
        var query = {};
        query.judgeId = req.body.judgeId,
            query.routineId = req.body.routineId,
            query.judgePanelid = req.body.judgePanelId,
            query.deleted = false;

        dataProviderHelper.find(EventMeetForJudges, query).then((eventmeetjudge) => {
            if (eventmeetjudge.length > 0) {
                if (req.body.resubmit) {
                    eventmeetjudge[0].resubmitComment = req.body.resubmitComment;
                    eventmeetjudge[0].resubmit = true;
                    eventmeetjudge[0].judged = false;
                    eventmeetjudge[0].routinestatus = '0';
                    eventmeetjudge[0].score = '0';
                    eventmeetjudge[0].comments = '';
                } else {
                    eventmeetjudge[0].deleted = true
                }
                dataProviderHelper.save(eventmeetjudge[0]);
                res.json({
                    success: true
                })
            } else {
                res.json({
                    success: false
                })
            }
        })

    }
    _p.addJudgeQueue = function(req, res, next) {

        var query = {};
        query.judgeId = req.body.judgeid,
            query.routineId = req.body.routineId,
            query.judgePanelid = req.body.judgePanelId,
            query.deleted = false;
        dataProviderHelper.find(EventMeetForJudges, query).then((eventmeetjudge) => {
            //console.log(eventmeetjudge, 'sdsdswewe')
            if (eventmeetjudge.length > 0) {
                res.json({
                    success: false,
                })
            } else {
                let body = {
                        eventId: req.body.eventId,
                        judgeId: req.body.judgeid,
                        routineId: req.body.routineId,
                        judgePanel: req.body.judgePanel,
                        judgePanelid: req.body.judgePanelId,
                        isTechnician: '0',
                        resubmit: true,
                        resubmitComment: req.body.resubmitComment
                    }
                    //console.log('judges', body)
                try {
                    sendNotification(req.body.judgeId)
                } catch (e) {

                }
                // var eventforjudging = RoutineModule.CreateEventMeetForJudging(body)
                // //console.log(eventforjudging,"dffdf")
                // eventforjudging.save();
                res.json({
                    success: true
                })
            }
        })



    }

    _p.updateroutinestatus = function(req, res, next) {
        //console.log(req.params.routineid)
        let update = { $set: { "routinestatus": "5", "score": '0' } }
        let Query = { _id: mongoose.Types.ObjectId(req.params.routineid) }
        try {
            dataProviderHelper.updateMany(Routine, Query, update);
            res.json({
                success: true
            })
        } catch (e) {
            res.json({
                success: false
            })
        }
    }
    _p.patchRoutineStatusInformation = function(req, res, next) {


        var _query = {
            '_Id': req.params.routineid,
            'deleted': false
        };
        //console.log("sdsdsd", req.body)
        if (req.routinelist.routinestatus != '1') {
            dataProviderHelper.checkForDuplicateEntry(Routine, _query)
                .then(function(count) {

                    if (count > 1) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.routineDeleteDeny + '"}');
                    } else {
                        req.routinelist.routinestatus = req.body.routinestatus;
                        if (req.body.routinestatus == '1') {
                            req.routinelist.score = req.body.score;
                            req.routinelist.comment = req.body.comment ? replaceSpecialCharaters(req.body.comment) : '';
                            req.routinelist.dod = req.body.dod
                        } else if (req.body.routinestatus == '2') {
                            req.routinelist.assignedTo = mongoose.Types.ObjectId(req.body.assignedTo);
                            //console.log(req.routinelist, "req.routinelist", Date.now)
                            req.routinelist.assignedOn = Date.now();
                        } else if (req.body.routinestatus == '0') {
                            req.routinelist.assignedTo = null;
                        } else {
                            req.routinelist.score = '0';
                        }
                        req.routinelist.judgedBy = req.body.judgedBy
                        req.routinelist.judgedOn = req.body.judgedOn;
                        if (req.body.technician_status) {
                            req.routinelist.technician_status = req.body.technician_status;
                        }
                        if (req.routinelist.sportid != applicationConfig.sports.WFigureSkating && req.routinelist.sportid != applicationConfig.sports.MFigureSkating) {
                            req.routinelist.technician_status = '0'
                        }
                        dataProviderHelper.save(req.routinelist)
                    }
                })
                .then(function() {
                    // res.status(HTTPStatus.OK);
                    // res.json({
                    //     message: messageConfig.routine.deleteMessageroutine
                    // });

                    if (req.body.routinestatus == '1') {
                        //console.log(req.routinelist)
                        let modelInfo = {

                        }
                        if (req.routinelist.isResubmitted ? req.routinelist.isResubmitted : '0' == '1') {
                            modelInfo = {
                                sourceID: req.routinelist.sourceID,
                                assignedTo: req.routinelist.assignedTo
                            }
                        } else {
                            modelInfo = {
                                sourceID: req.routinelist._id,
                                assignedTo: req.routinelist.assignedTo
                            }
                        }
                        var newRoutineJudgeMap = RoutineModule.CreateRoutineJudgeMap(modelInfo, req.decoded.user.username);
                        dataProviderHelper.save(newRoutineJudgeMap);
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.routine.deleteMessageroutine
                        });

                    } else {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.routine.deleteMessageroutine
                        });

                    }
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
                message: messageConfig.routine.routineDeleteDeny
            });
        }

    }

    _p.patchRoutineComment = function(req, res, next) {
        let update = { $set: { "deleted": true } }
        let Query = { "judgeid": mongoose.Types.ObjectId(req.query.judgeId), "judgePanelid": req.query.judgePanelId, "routineid": mongoose.Types.ObjectId(req.query.routineId) }
            //console.log(req.query.judgeId, req.query.routineId)
        try {
            dataProviderHelper.updateMany(RoutineComment, Query, update);
            res.json({
                success: true
            })
        } catch (e) {

        }
    }
    _p.judgeRoutineComment = function(req, res, next) {

        let query = { deleted: false, "judgeid": mongoose.Types.ObjectId(req.query.judgeId), "judgePanelid": req.query.judgePanelId, "routineid": mongoose.Types.ObjectId(req.query.routineId) }
            //console.log(req.query.judgeId, req.query.routineId)
        dataProviderHelper.find(RoutineComment, query).then((comment) => {
            if (comment.length > 0) {
                res.json(comment)
            } else {
                res.json([])
            }
        })
    }
    _p.patchRoutineTechnicianStatusInformation = function(req, res, next) {


        var _query = {
            '_id': mongoose.Types.ObjectId(req.params.routineid),
            'deleted': false
        };
        //console.log(_query, "jdfhkdjfhd", req.routinelist)
        if (req.routinelist.routinestatus != '1') {
            dataProviderHelper.checkForDuplicateEntry(Routine, _query)
                .then(function(count) {
                    //console.log(count, "jdfhkdjfhd")
                    if (count > 1) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.routineDeleteDeny + '"}');
                    } else {
                        req.routinelist.technician_status = req.body.technician_status;
                        if (req.body.assignedTo) {
                            req.routinelist.assignedTo = mongoose.Types.ObjectId(req.body.assignedTo);
                            //console.log(req.routinelist, "req.routinelist", Date.now)
                            req.routinelist.assignedOn = Date.now();
                        } else {
                            req.routinelist.score = '0';
                        }
                        if (req.body.technician_status == '2') {
                            //console.log('notification')
                            _p.getEventMeetJudges(req);
                        }
                        //console.log(req.routinelist, "response")
                        dataProviderHelper.save(req.routinelist);
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: {}
                        });

                    }
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
                message: messageConfig.routine.routineDeleteDeny
            });
        }

    }

    _p.getEventMeetJudges = function(req, res, next) {
        ////console.log(_query,"judges")
        var _query = {
            'routineId': mongoose.Types.ObjectId(req.body._id),
            'isTechnician': '0',
            'deleted': false
        };

        //console.log(_query, "judges")
        dataProviderHelper.find(EventMeetForJudges, _query).then(function(res) {
            //console.log(res, "judges")
            if (res) {
                let routineArr = res ? res : [];
                for (let i = 0; i < routineArr.length; i++) {
                    try {
                        //console.log(routineArr[i])
                        sendNotification(routineArr[i].judgeId);
                    } catch (e) {

                    }
                }

            }
        })
    }
    _p.patchRoutineAssignedStatusInformation = function(req, res, next) {
        var _query = {
            '_Id': req.params.routineid,
            'deleted': false
        };
        //console.log("sdsdsd", req.body)
        if (req.routinelists.routinestatus != '1') {
            dataProviderHelper.checkForDuplicateEntry(Routine, _query)
                .then(function(count) {

                    if (count > 1) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.routineDeleteDeny + '"}');
                    } else {
                        req.routinelists.routinestatus = req.body.routinestatus;
                        if (req.body.routinestatus == '1') {
                            req.routinelists.score = req.body.score;
                            req.routinelists.comment = req.body.comment ? replaceSpecialCharaters(req.body.comment) : '';
                            req.routinelists.dod = req.body.dod
                        } else if (req.body.routinestatus == '2') {
                            req.routinelists.assignedTo = mongoose.Types.ObjectId(req.body.assignedTo);
                            req.routinelists.assignedOn = Date.now()
                        } else if (req.body.routinestatus == '0') {
                            req.routinelists.assignedTo = null
                        } else {
                            req.routinelists.score = '0';
                        }
                        req.routinelists.judgedBy = req.body.judgedBy
                        req.routinelists.judgedOn = req.body.judgedOn;
                        if (req.body.technician_status) {
                            req.routinelists.technician_status = req.body.technician_status
                        }
                        if (req.routinelists.sportid != applicationConfig.sports.WFigureSkating && req.routinelists.sportid != applicationConfig.sports.MFigureSkating) {
                            req.routinelists.technician_status = '0'
                        }
                        dataProviderHelper.save(req.routinelists)
                    }
                })
                .then(function() {
                    // res.status(HTTPStatus.OK);
                    // res.json({
                    //     message: messageConfig.routine.deleteMessageroutine
                    // });


                    if (req.body.routinestatus == '1') {

                        let modelInfo = {

                        }
                        if (req.routinelists.isResubmitted ? req.routinelists.isResubmitted : '0' == '1') {
                            modelInfo = {
                                sourceID: req.routinelists.sourceID,
                                assignedTo: req.routinelists.assignedTo
                            }
                        } else {
                            modelInfo = {
                                sourceID: req.routinelists._id,
                                assignedTo: req.routinelists.assignedTo
                            }
                        }
                        var newRoutineJudgeMap = RoutineModule.CreateRoutineJudgeMap(modelInfo, req.decoded.user.username);
                        dataProviderHelper.save(newRoutineJudgeMap);
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.routine.deleteMessageroutine
                        });

                    } else {
                        res.status(HTTPStatus.OK);
                        res.json({
                            message: messageConfig.routine.deleteMessageroutine
                        });

                    }
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
                message: messageConfig.routine.routineDeleteDeny
            });
        }

    }
    _p.updateLibraryView = function(req, res, next) {
        //console.log("sdsdsd", req.body)
        req.libraryVideoView.view = req.body.view;
        dataProviderHelper.save(req.libraryVideoView);


    }
    _p.updateLibraryViewformob = function(req, res, next) {
        //console.log("sdsdsd", req.body)
        req.Mobroutine.view = req.body.view;
        dataProviderHelper.save(req.Mobroutine);


    }
    _p.updatebannermidilewarefunc = function(req, res, modelInfo, next) {
        var videoinfo = utilityHelper.getDocumentFileInfo(req, req.bannerObj, next);
        //console.log(videoinfo)
        req.bannerObj.title = modelInfo.title;
        req.bannerObj.subtitle = modelInfo.subtitle;
        req.bannerObj.filename = modelInfo.filename;
        req.bannerObj.filepath = videoinfo._documentPath ? videoinfo._documentPath.replace("/mnt/volume_sfo2_01/", "") : '';
        req.bannerObj.filetype = videoinfo._documentMimeType;
        req.bannerObj.type = modelInfo.type;
        req.bannerObj.updatedBy = req.decoded.user.username;;
        req.bannerObj.updatedOn = new Date();
        //console.log(req.bannerObj);
        return dataProviderHelper.save(req.bannerObj);
    };

    _p.updatebanner = function(req, res, next) {
        req.body = JSON.parse(req.body.data);
        var errors = _p.checkbannerValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);


            // For checking duplicate entry
            var query = {};
            query.type = modelInfo.type;
            query._id = { $ne: req.params.bannerid }
            query.deleted = false;
            //  //console.log(query)
            dataProviderHelper.checkForDuplicateEntry(Banner, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.banner.alreadyExistsBanner + '"}');
                    } else {
                        return _p.updatebannermidilewarefunc(req, res, modelInfo, next);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.banner.updateMessageBanner
                    });
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });


        }
    }
    _p.getBannerdetailByID = function(req) {
        return dataProviderHelper.findById(Banner, req.params.bannerid, bannerdocumentFields);
    }
    _p.getBannerInfobyType = function(req) {
        //console.log(req.params.bannerid)
        var query = {}
        query.type = req.params.bannerid;
        query.deleted = false;
        //console.log(query)
        ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.find(Banner, query);
    }
    _p.getPremiumUsersRoutine = function(req, next) {

        var query = [

            {
                $match: {
                    $and: [{ 'deleted': false }, { routinestatus: '1' }]
                }

            },

            {
                $lookup: {
                    from: "Flyp10_User",
                    localField: "uid",
                    foreignField: "_id",
                    as: "userinfo"
                }
            },

            { "$unwind": "$userinfo" },


            {
                $match: {

                    $and: [{ 'userinfo.deleted': false }, { 'userinfo.subtype': { $exists: true, $eq: '3' } }]

                }
            }


        ]
        return dataProviderHelper.aggregate(Routine, query);
    }
    _p.patchBanner = function(req, res, next) {
        if (req.body.deleted) {
            req.bannerObj.deleted = true;
            req.bannerObj.deletedOn = new Date();
            req.bannerObj.deletedBy = req.decoded.user.username;
            var query = {};
            query._id = req.params.bannerid;
            query.deleted = false;
            dataProviderHelper.checkForDuplicateEntry(Banner, query)
                .then(function(count) {

                    if (count > 1) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.banner.bannerDeleteDeny + '"}');
                    } else {
                        dataProviderHelper.save(req.bannerObj)
                    }
                }).then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.banner.deleteMessageBanner
                    });
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });
        } else {
            var query = {};
            query._id = { $ne: req.params.bannerid };
            query.type = req.body.type
            query.deleted = false;
            dataProviderHelper.checkForDuplicateEntry(Banner, query)
                .then(function(count) {
                    //console.log(count);
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.banner.alreadyExistsBanner + '"}');
                    } else {
                        req.bannerObj.title = req.body.title;
                        req.bannerObj.subtitle = req.body.subtitle;
                        req.bannerObj.type = req.body.type;
                        dataProviderHelper.save(req.bannerObj)
                    }
                }).then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.banner.updateMessageBanner
                    });
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });
        }
    }
    _p.patchRoutineInformation = function(req, res, next) {
        req.singleroutine.deleted = true;
        req.singleroutine.deletedOn = new Date();
        req.singleroutine.deletedBy = req.decoded.user.username;

        var _query = {
            '_Id': req.params.routineid,
            'deleted': false
        };
        //  //console.log("sdsdsd",req.singleroutine.routinestatus=='0')
        if (req.singleroutine.routinestatus == 0) {
            dataProviderHelper.checkForDuplicateEntry(Routine, _query)
                .then(function(count) {

                    if (count > 1) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.routineDeleteDeny + '"}');
                    } else {
                        dataProviderHelper.save(req.singleroutine)
                            //_p.removeEventMeetForJudging(req)
                        removeEventMeetForJudging(req)
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

        } else if (req.singleroutine.routinestatus == '1') {
            console.log("routinestatus is one")
            dataProviderHelper.checkForDuplicateEntry(Routine, _query)
                .then(function(count) {

                    if (count > 1) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.routineDeleteDeny + '"}');
                    } else {
                        dataProviderHelper.save(req.singleroutine)
                            // _p.removeEventMeetForJudging(req)
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

        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.routine.routineDeleteDeny
            });
        }
        _p.removeEventMeetForJudging = function(req, res, next) {
            var query = {};
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            query.routineId = req.params.routineid;
            dataProviderHelper.removeModelData(EventMeetForJudges, query).then(function() {
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
    }

    function removeEventMeetForJudging(req) {
        var query = {};
        //var modelInfo = utilityHelper.sanitizeUserInput(req, next);
        query.routineId = req.params.routineid;
        dataProviderHelper.removeModelData(EventMeetForJudges, query).then(function() {

        })
    }
    _p.patchTechnicianRoutineInformation = function(req, res, next) {

        req.singleroutine[0].judgeid = mongoose.Types.ObjectId(req.body.judgeid);
        req.singleroutine[0].comment = req.body.comment ? req.body.comment : ''
        req.singleroutine[0].score = req.body.score ? req.body.score : '0'
        req.singleroutine[0].dod = req.body.dod ? req.body.dod : '0'
        req.singleroutine[0].status = req.body.status;
        req.singleroutine[0].judgedOn = req.body.judgedOn
        req.singleroutine[0].judgedBy = req.body.judgedBy
            //console.log('routinecomment', req.singleroutine[0])
        var _query = {
            'routineid': mongoose.Types.ObjectId(req.params.routineid),
            'deleted': false
        };
        //  //console.log("sdsdsd",req.singleroutine.routinestatus=='0')


        dataProviderHelper.checkForDuplicateEntry(TechnicianRoutine, _query)
            .then(function(count) {

                if (count > 1) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.routineDeleteDeny + '"}');
                } else {

                    dataProviderHelper.save(req.singleroutine[0]);
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



    }
    _p.postComment = function(req, res, next) {
        if (req.body.element) {
            ////console.log(req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            //  //query.element = req.body.element
            // query.comment = req.body.comment;
            // query.routineid = req.body.routineid;
            // query.time = req.body.time;
            // query.deleted = false;
            // dataProviderHelper.checkForDuplicateEntry(RoutineComment, query)
            //     .then(function (count) {
            //         if (count > 0) {
            //             throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.elementgroup.alreadyExistsElementgroup + '"}');
            //         } else {
            //           ;
            //         }
            //     })

            var commentObj = RoutineModule.Createcomment(modelInfo, req.decoded.user.username);
            //console.log(commentObj, "postcomment")
            dataProviderHelper.save(commentObj)
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.elementgroup.saveMessageElementgroup
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
                message: messageConfig.elementgroup.fieldRequiredElementgroup
            });
        }
    };
    _p.postTechnicianComment = function(req, res, next) {
        if (req.body.element) {
            ////console.log(req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            // query.element = req.body.element
            // query.comment = req.body.comment;
            // query.routineid = req.body.routineid;
            // query.time = req.body.time;
            // query.deleted = false;
            // dataProviderHelper.checkForDuplicateEntry(TechnicianComment, query)
            //     .then(function (count) {
            //         if (count > 0) {
            //             throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.elementgroup.alreadyExistsElementgroup + '"}');
            //         } else {

            //         }
            //     })
            var commentObj = RoutineModule.CreateTechniciancomment(modelInfo, req.decoded.user.username);
            dataProviderHelper.save(commentObj)
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.elementgroup.saveMessageElmentgroup
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
                message: messageConfig.elementgroup.fieldRequiredElementgroup
            });
        }
    };
    _p.getLibraryComments = function(req) {
        var query = {}
        query.active = true;
        return dataProviderHelper.find(LibraryComment, query);
    }
    _p.getLibraryCommentsByRID = function(req) {
        // //console.log('param value ============> ', req.params.rid)
        var query = [{
                    $match: {
                        rid: req.params.rid,
                        active: true
                    }
                },
                {
                    $lookup: {
                        from: "Flyp10_User",
                        localField: "uid",
                        foreignField: "_id",
                        as: "userinfo"
                    }
                },
                { $sort: { addedOn: -1 } },
                { $unwind: "$userinfo" }
            ]
            // query.rid=req.params.rid;
            //query.active=true;
            // //console.log(query)
            ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.aggregateDesc(LibraryComment, query);
    };
    _p.postLibraryComment = function(req, res, next) {
        if (req.body.uid) {
            //console.log(req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.uid = req.body.uid;
            query.uname = req.body.uname;
            query.rid = req.body.rid;
            query.submittedBy = req.body.submittedBy;
            query.comment = req.body.comment;
            query.type = req.body.type;
            query.active = req.body.active;
            query.addedBy = req.body.addedBy;
            query.addedOn = req.body.addedOn;

            dataProviderHelper.checkForDuplicateEntry(LibraryComment, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + "Same comment already exists" + '"}');
                    } else {
                        var commentObj = RoutineModule.CreateLibraryComment(modelInfo, req.decoded.user.username);
                        //console.log(commentObj)
                        return dataProviderHelper.save(commentObj);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: "Comment saved successfully"
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
                message: messageConfig.elementgroup.fieldRequiredElementgroup
            });
        }
    };
    _p.deleteRoutinefile = function(req) {
        //console.log(req.params.username)
        var query = {}
        query.submittedBy = req.params.username
            //console.log(query)
            ////console.log(dataProviderHelper.findAll(Routine,query)) 
        return dataProviderHelper.find(Routine, query, routineFields);
    };

    _p.uploadjudgedRoutine = function(req, res, next) {
        //req.body = JSON.parse(req.body.data);
        //  //console.log('save RRRRR req ', req.body);

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
            //  //console.log('routine data to save ', modelInfo);
            query.title = modelInfo.title.toLowerCase();
            query.deleted = false;
            return dataProviderHelper.checkForDuplicateEntry(Routine, query).then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.alreadyExistsroutine + '"}');
                    } else {
                        // if (req.body.uploadingType == '1' || !req.body.uploadingType) {
                        //     req.body.eventMeetId = { _id: '' }
                        //     if (req.body.sportid == applicationConfig.sports.WFigureSkating || req.body.sportid == applicationConfig.sports.MFigureSkating) {
                        //         modelInfo.technician_status = '0'
                        //     } else {
                        //         modelInfo.technician_status = '2'
                        //     }
                        // }
                        var newRoutine = RoutineModule.CreateJudgedRoutine(modelInfo, req.decoded.user.username);
                        //var newRoutineJudgeMap = RoutineModule.CreateRoutineJudgeMap(modelInfo, req.decoded.user.username);

                        return [newRoutine, dataProviderHelper.save(newRoutine)];
                    }
                }).then(function() {
                    let query1 = {}
                    if (modelInfo.assignedTo !== "null") {
                        console.log(modelInfo.assignedTo, "sjdhskj")
                        query1.routineid = mongoose.Types.ObjectId(modelInfo.sourceID);
                        query1.judgeid = mongoose.Types.ObjectId(modelInfo.assignedTo);
                        dataProviderHelper.checkForDuplicateEntry(RoutineJudgeMap, query1).then(function(count) {
                            if (count > 0) {
                                res.status(HTTPStatus.OK);
                                res.json({
                                    message: messageConfig.routine.saveMessageroutine
                                });
                            } else {
                                var newRoutineJudgeMap = RoutineModule.CreateRoutineJudgeMap(modelInfo, req.decoded.user.username);
                                dataProviderHelper.save(newRoutineJudgeMap);
                                res.status(HTTPStatus.OK);
                                res.json({
                                    message: messageConfig.routine.saveMessageroutine
                                });
                            }

                        });
                    } else {
                        res.json({
                            message: messageConfig.routine.saveMessageroutine
                        });
                    }

                    return join(
                        _p.sendmailToUser(req, next),

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
    _p.mapRoutineJudge = function(req, next) {
        //  //console.log(req.params.routineid)
        if (req.body.routinestatus == '1') {

            let modelInfo = {

            }
            if (req.routinelists.sourceID) {
                modelInfo = {
                    sourceID: req.routinelists.sourceID,
                    assignedTo: req.routinelists.assignedTo
                }
            } else {
                modelInfo = {
                    sourceID: req.routinelists._id,
                    assignedTo: req.routinelists.assignedTo
                }
            }
            var newRoutineJudgeMap = RoutineModule.CreateRoutineJudgeMap(modelInfo, req.decoded.user.username);
            dataProviderHelper.save(newRoutineJudgeMap)
        }

    }
    _p.insertSharedRoutine = function(req, res, next) {
        if (req.body.RoutineID) {
            //console.log('req.body.sharedwith', req.body.sharedwith)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.RoutineID = mongoose.Types.ObjectId(req.body.RoutineID);
            query.SubmittedBy = mongoose.Types.ObjectId(req.body.SubmittedBy);
            //console.log(req.query)
            dataProviderHelper.checkForDuplicateEntry(ShareRoutine, query)
                .then(function(count) {
                    if (count > 0) {
                        let updatequery = { RoutineID: mongoose.Types.ObjectId(req.body.RoutineID) }
                        let updatedValue = {
                            $push: {
                                sharedwith: {
                                    $each: req.body.sharedwith,
                                }
                            }
                        }
                        return dataProviderHelper.updateOnebyID(ShareRoutine, updatequery, updatedValue);
                    } else {
                        var sharedObj = RoutineModule.CreateShareRoutine(req.body, req.decoded.user.username);

                        return dataProviderHelper.save(sharedObj);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: "Routine Shared Successfully"
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
                message: "Error occured while processing your request."
            });
        }
    };
    _p.getsharedRoutinebyUID = function(req) {
        // //console.log('param value ============> ', req.params.rid)
        var query = [{
                    $match: {
                        SubmittedBy: mongoose.Types.ObjectId(req.params.UID)

                    }
                },
                {
                    $lookup: {
                        from: "Routine",
                        localField: "RoutineID",
                        foreignField: "_id",
                        as: "rountineInfo"
                    }
                },
                { $sort: { addedOn: -1 } },
                { $unwind: "$rountineInfo" }
            ]
            // query.rid=req.params.rid;
            //query.active=true;
            //console.log(query)
            ////console.log(dataProviderHelper.findAll(Routine,query))
        return dataProviderHelper.aggregateDesc(ShareRoutine, query);
    };
    _p.getEventMeetRoutine = function(req) {
        // //console.log('param value ============> ', req.params.rid)
        var query = {};
        query.eventMeetId = req.params.eventmeetId;
        query.deleted = false
            //console.log(query)
        return dataProviderHelper.find(Routine, query);
    };
    _p.patchRoutineUserId = function(req) {

        var eventMeetRoutineList = req.routinelist;
        for (var i = 0; i < eventMeetRoutineList.length; i++) {
            //console.log(eventMeetRoutineList[i], "testlist", i)
            eventMeetRoutineList[i].userid = "5f4f2e7865498e09e4f6e39e",
                dataProviderHelper.save(eventMeetRoutineList[i])
        }

    }
    _p.updateeteventmeetjudgingfromxlsx = async function(req, res) {
            const excelToJson = require('convert-excel-to-json');
            const fs = require('fs');
            var path = req.app.get('rootDir') + '/lib/configs/TwoSanctionUpdates.xlsx';
            const result = excelToJson({
                source: fs.readFileSync(path) // fs.readFileSync return a Buffer
            });



            //var RoutineSSC = result.RoutinecommentSSC;
            var RoutineSSC = result.Sheet1;
            var eventmeetjudging = []
                // res.json({
                //     data: RoutineSSC
                // })


            var i = 2;
            while (i < 18) {

                // RoutineSSC[i] = ''
                console.log("sdsd")
                var ej = await getData(RoutineSSC[i]);
                var req = {}
                req.body = {}
                    // console.log(routine[i].routine._id)
                req['body']['_id'] = RoutineSSC[i].D;
                //console.log(req.body._id, i)
                eventController.updateroutinejudgedStatus(req);

                console.log(i)

                i++


            }
        }
        // var i =1;
        // while (i < RoutineSSC.length) {

    // var ej = await getData(RoutineSSC[i]);
    // //console.log(ej,i,"rr")
    // if (ej) {
    //      ej.score = RoutineSSC[i].AU;
    //      ej.scoretype ='1'
    //      dataProviderHelper.save(ej);
    //     i++;
    // }
    // }
    // var i =1;
    // while (i < EventMeetForJudgingSSC.length) {

    // var ej = await getData(EventMeetForJudgingSSC[i]);
    // //console.log(ej,i,"rr")
    // if (ej) {
    //     ej.score = EventMeetForJudgingSSC[i].D;
    //     dataProviderHelper.save(ej);
    //     i++;
    // }


    //}

    // }
    // function postcommentr(data,routine){
    //     return new Promise((resolve, reject) => {
    //     var newComment = new RoutineComment();
    //     newComment.comment = data.M ? replaceSpecialCharaters(data.M): '';
    //     newComment.overallComment = data.O ? data.O : '';
    //     newComment.time = data.E?data.E:'.00';
    //     newComment.element = data.S? replaceSpecialCharaters(data.S):'';
    //     newComment.factor = data.T?data.T:'1';
    //     newComment.skillvalue = data.L ?data.L:'0';
    //     newComment.execution = data.U;
    //     newComment.state = data.N;
    //     newComment.bonus = data.A?data.A:'0';
    //     newComment.total = data.Q;
    //     newComment.judgeid = mongoose.Types.ObjectId(data.V);
    //     newComment.userid = mongoose.Types.ObjectId(routine.userid);
    //     newComment.routineid = mongoose.Types.ObjectId(data.X);
    //     newComment.routinetitle = data.D;
    //     newComment.judgename = data.Y;
    //     newComment.sport = data.R;
    //     newComment.level = data.H;
    //     newComment.event = data.K;
    //     newComment.read = data.I == 'TRUE'?true:false;
    //     newComment.active = data.G == 'TRUE'?true:false;
    //     newComment.addedBy = data.P;
    //     newComment.addedOn = new Date();


    //  resolve(newComment)
    //     })
    // }
    function getData(data) {
        // //console.log(data)
        return new Promise((resolve, reject) => {
            var query = {}
            console.log(data)
            query.judgeId = mongoose.Types.ObjectId(data.E)
            query._id = mongoose.Types.ObjectId(data.A)
            dataProviderHelper.find(EventMeetForJudges, query).then((res) => {
                console.log(res, "res")
                if (res.length > 0) {
                    res[0].ND = data.B;
                    res[0].score = data.C;
                    res[0].judged = true;
                    dataProviderHelper.save(res[0]);
                    resolve(res[0])

                }
                if (res.length == 0) {
                    resolve('')
                }

            })
        });

    }

    _p.getUnconvertedRoutine = function(req, res, text) {
        var query = [

            {
                $match: {
                    $and: [

                        { deleted: false }, {
                            $or: [{ isConverted: '1' }, { isConverted: '3' }]
                        }
                    ]
                }
            },
            {
                $project: {
                    routineId: '$_id',
                    videofilename: '$videofilename',
                    addedOn: '$addedOn',
                    isConverted: '$isConverted'
                }
            }

        ]
        Routine.aggregate(query, function(err, result) {
            if (err) {
                res.json({
                    success: false,
                    message: err
                })
            }
            //console.log('result details ', result);
            res.json({
                success: true,
                count: result.length,
                data: result
            })
        })
    }

    _p.getRoutineByEventLevel = function(req, res, next) {
            var query = {}
            query.lid = mongoose.Types.ObjectId(req.query.lid)
            query.eid = mongoose.Types.ObjectId(req.query.eid)
            query.eventMeetId = req.query.eventMeetId;
            dataProviderHelper.find(Routine, query).then((response) => {
                res.json(response);
            })
        }
        // function getRoutineData(rid) {
        //     // //console.log(data)
        //      return new Promise((resolve, reject) => {
        //          var query = {}
        //        //  //console.log(data['N'])
        //          query._id= mongoose.Types.ObjectId(rid)
        //              dataProviderHelper.findOne(Routine,query).then((res) => {
        //                //  //console.log(res,"res")
        //              resolve(res)
        //          })
        //      });

    //  }
    _p.checkExistingRoutine = function(req, res, next) {
        var eventMeetId;
        if (req.body.uploadingType == '2' && req.body.isIOS) {
            eventMeetId = JSON.parse(req.body.eventMeetId)
        } else {
            eventMeetId = req.body.eventMeetId
        }
        var query = [{
                $match: {
                    $and: [
                        { sid: mongoose.Types.ObjectId(req.body.sid) },
                        { uid: mongoose.Types.ObjectId(req.body.uid) },
                        { lid: mongoose.Types.ObjectId(req.body.lid) },
                        { eid: mongoose.Types.ObjectId(req.body.eid) },
                        { eventMeetId: eventMeetId._id },
                        { deleted: false }
                    ]

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

        ]
        dataProviderHelper.aggregate(Routine, query).then((response) => {
            res.json({
                success: true,
                response: response
            })

        })
    }
    _p.updateFinalScorewithNeutralDeduction = function(req, res, next) {
        var routineId = req.params.routineId;
        var query = {
            _id: mongoose.Types.ObjectId(routineId)
        }
        dataProviderHelper.findOne(Routine, query).then((routine) => {
            routine.nd = req.body.nd;
            routine.score = routine.score - Number(routine.nd);
            dataProviderHelper.save(routine);
            res.json({
                success: true

            })
        })


    }
    return {
        getRoutine: _p.getRoutine,
        saveRoutine: _p.saveRoutine,
        saveTechnicianRoutine: _p.saveTechnicianRoutine,
        checkExistingRoutine: _p.checkExistingRoutine,
        getSanctionEventMeetRoutines: _p.getSanctionEventMeetRoutines,
        getRoutineJudges: _p.getRoutineJudges,
        getRoutineByID: _p.getRoutineByID,
        getsingleRoutineByID: _p.getsingleRoutineByID,
        getsingleTechnicianRoutineByID: _p.getsingleTechnicianRoutineByID,
        getTechnicianRoutineComment: _p.getTechnicianRoutineComment,
        patchRoutineInformation: _p.patchRoutineInformation,
        getsingleRoutinedetailByID: _p.getsingleRoutinedetailByID,
        getsingleRoutineTechniciandetailByID: _p.getsingleRoutineTechniciandetailByID,
        patchRoutineStatusInformation: _p.patchRoutineStatusInformation,
        updateroutinestatus: _p.updateroutinestatus,
        addJudgeQueue: _p.addJudgeQueue,
        updateJudgeQueue: _p.updateJudgeQueue,
        patchRoutineComment: _p.patchRoutineComment,
        judgeRoutineComment: _p.judgeRoutineComment,
        patchRoutineTechnicianStatusInformation: _p.patchRoutineTechnicianStatusInformation,
        patchRoutineAssignedStatusInformation: _p.patchRoutineAssignedStatusInformation,
        patchTechnicianRoutineInformation: _p.patchTechnicianRoutineInformation,
        getJudgedRoutineByJudgename: _p.getJudgedRoutineByJudgename,
        getAllRoutinecomment: _p.getAllRoutinecomment,
        getAllTechnicianRoutinecomment: _p.getAllTechnicianRoutinecomment,
        postComment: _p.postComment,
        postTechnicianComment: _p.postTechnicianComment,
        getRoutineCommentByrid: _p.getRoutineCommentByrid,
        getRoutinedetailBystatus: _p.getRoutinedetailBystatus,
        saveBanner: _p.saveBanner,
        getbannerdetails: _p.getbannerdetails,
        getLibraryComments: _p.getLibraryComments,
        postLibraryComment: _p.postLibraryComment,
        getLibraryCommentsByRID: _p.getLibraryCommentsByRID,
        getVerifiedsportsByjudgeID: _p.getVerifiedsportsByjudgeID,
        getroutinebysportsandlevel: _p.getroutinebysportsandlevel,
        getAssignedroutine: _p.getAssignedroutine,
        updateLibraryView: _p.updateLibraryView,
        patchBanner: _p.patchBanner,
        getBannerdetailByID: _p.getBannerdetailByID,
        updatebanner: _p.updatebanner,
        getBannerInfobyType: _p.getBannerInfobyType,
        getLibraryVideoByVID: _p.getLibraryVideoByVID,
        updateLibraryViewformob: _p.updateLibraryViewformob,
        getPremiumUsersRoutine: _p.getPremiumUsersRoutine,
        judgedRoutineByUid: _p.judgedRoutineByUid,
        eventsScoreById: _p.eventsScoreById,
        filterByDateJudgedRoutineByUid: _p.filterByDateJudgedRoutineByUid,
        getEventsForAnalyticsFilterByDays: _p.getEventsForAnalyticsFilterByDays,
        sportDetailsByUsername: _p.sportDetailsByUsername,
        routineScoresByUID: _p.routineScoresByUID,
        filterTrackingChartByDaysAndUid: _p.filterTrackingChartByDaysAndUid,
        sortByState: _p.sortByState,
        replaceAllIds: _p.replaceAllIds,
        getUnconvertedRoutine: _p.getUnconvertedRoutine,
        getElementsValueSummary: _p.getElementsValueSummary,
        getUserMappedSportsLevelsEvents: _p.getUserMappedSportsLevelsEvents,
        getEventsBySportLevel: _p.getEventsBySportLevel,
        convertRoutineByName: _p.convertRoutineByName,
        getRoutineByEventLevel: _p.getRoutineByEventLevel,
        uploadjudgedRoutine: _p.uploadjudgedRoutine,
        getAllNewRoutine: _p.getAllNewRoutine,
        getEventMeetNewRoutine: _p.getEventMeetNewRoutine,
        getAllJudgedRoutine: _p.getAllJudgedRoutine,
        getEventmeetQueueRoutine: _p.getEventmeetQueueRoutine,
        getEventmeetQueueRoutineByID: _p.getEventmeetQueueRoutineByID,
        getAllassignedRoutine: _p.getAllassignedRoutine,
        getAllinCompleteRoutine: _p.getAllinCompleteRoutine,
        getAllinAppeopriateRoutine: _p.getAllinAppeopriateRoutine,
        deleteRoutinefile: _p.deleteRoutinefile,
        insertSharedRoutine: _p.insertSharedRoutine,
        getsharedRoutinebyUID: _p.getsharedRoutinebyUID,
        getTeammateRoutines: _p.getTeammateRoutines,
        getFlyp10RoutineCommentByrid: _p.getFlyp10RoutineCommentByrid,
        getRoutineCommentbyEventroutineid: _p.getRoutineCommentbyEventroutineid,
        getRoutineCommentForEventMeet: _p.getRoutineCommentForEventMeet,
        getEventMeetRoutineCommentByPanel: _p.getEventMeetRoutineCommentByPanel,
        getEventMeetOverallCommentByPanel: _p.getEventMeetOverallCommentByPanel,
        getJudgesSportDetails: _p.getJudgesSportDetails,
        getEventMeetJudges: _p.getEventMeetJudges,
        removeEventMeetForJudging: _p.removeEventMeetForJudging,
        getEventMeetRoutine: _p.getEventMeetRoutine,
        patchRoutineUserId: _p.patchRoutineUserId,
        updateFinalScorewithNeutralDeduction: _p.updateFinalScorewithNeutralDeduction,
        getJudgedEventMeetRoutines: _p.getJudgedEventMeetRoutines,
        updateeteventmeetjudgingfromxlsx: _p.updateeteventmeetjudgingfromxlsx

    };

})();

module.exports = routineController;