const { resolve } = require('bluebird');

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
        Sanction = require('../models/eventmeet-sanction.model'),
        SanctionAdministrator = require('../models/sanction-administrators.model'),
        EventMeetForJudges = require('../models/eventMeetForJudges.server.model'),
        Routine = require('../models/routine.server.model'),
        CoachReservation = require('../models/eventmeet-coach-reservation.model'),
        AthleteReservation = require('../models/eventmeet-athlete-reservation.model'),
        USAGMemberVerification = require('../models/USAG-membership-verification.model'),
        EventMeetJudgeMap = require('../models/EventMeet-Judge-Map.model'),
        EventMeetSwapJudge = require("../models/eventmeet-swap-judge.model"),
        EventMeetStartCode = require('../models/eventmeet-startcode.model'),
        ScoreCalculation = require('../models/USAG-Score-Calculation.model'),
        TeamMemberModel = require('../models/team.management.server.model'),
        User = require('../models/user.server.model'),
        TeamMember = TeamMemberModel.TeamManagement,
        TeamMate = TeamMemberModel.TeamMate,
        sportModel = require('../models/sport.server.model'),
        SportEvent = sportModel.EventModal,
        Notification = require('../models/notifications.management.server.model'),
        ShareRoutine = require('../models/sharedroutine.server.model'),
        Payliance = require('../models/payliance.mgmt.server.modal'),
        EventMeetJudgeMap = require('../models/EventMeet-Judge-Map.model'),
        USAGEventMeetJudges = require('../models/USAG-Eventmeet-Judges.model'),
        NotificationTokenObj = Payliance.notificationToken,

        _ = require('lodash'),
        Promise = require("bluebird"),
        fs = Promise.promisifyAll(require('fs'));
    var request = require('request');
    //var jsPDF = require('jspdf');
    var moment = require("moment");
    var mongoose = require('mongoose');
    var mailHelper = require('../helpers/mail.helper');
    var mailController = require('./mail.server.controller');
    var documentFields = '_id question answer assignedTo active ';
    var userdocumentFields = '_id firstName alwaysSharedRoutine lastName email username phoneNumber mobileNumber passphrase active userRole imageName twoFactorAuthEnabled  blocked userConfirmed  addedOn imageProperties securityQuestion address dob cardToken subtype paylianceCID subStart subEnd promocode recruiterStatus isUSCitizen country referrer referralType';

    function EventModule() {}
    EventModule.CreateNotification = function(notificationObj, loggedInUser) {
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
    EventModule.CreateShareRoutine = function(sharedObj, loggedInUser, routineinfo, convertedfileName) {
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

    EventModule.CreateEventMeetJudgeMap = function(eventObj, loggedInUser) {
        //console.log(eventObj, "fdfdf")
        var neweventInfo = new EventMeetJudgeMap();
        neweventInfo.eventmeetId = mongoose.Types.ObjectId(eventObj.eventmeetId);
        neweventInfo.sportId = mongoose.Types.ObjectId(eventObj.sportId);
        neweventInfo.eventId = mongoose.Types.ObjectId(eventObj.eventId);
        neweventInfo.levelId = mongoose.Types.ObjectId(eventObj.levelId);
        neweventInfo.JudgesbyPanel = eventObj.JudgesbyPanel;
        neweventInfo.levelName = eventObj.levelName;
        neweventInfo.eventName = eventObj.eventName;
        neweventInfo.addedBy = loggedInUser;
        neweventInfo.addedOn = new Date();
        return neweventInfo;
    };
    EventModule.CreateEventMeetSwapJudge = function(eventObj, loggedInUser) {
        //console.log(eventObj, "fdfdf")
        var neweventInfo = new EventMeetSwapJudge();
        neweventInfo.eventmeetId = mongoose.Types.ObjectId(eventObj.eventmeetId);
        neweventInfo.sportId = mongoose.Types.ObjectId(eventObj.sportId);
        neweventInfo.eventId = mongoose.Types.ObjectId(eventObj.eventId);
        neweventInfo.levelId = mongoose.Types.ObjectId(eventObj.levelId);
        neweventInfo.judgeIdChangeFrom = mongoose.Types.ObjectId(eventObj.judgeIdChangeFrom);
        neweventInfo.judgeIdChangeTo = mongoose.Types.ObjectId(eventObj.judgeIdChangeTo);
        neweventInfo.reasonForSwap = eventObj.reason;
        neweventInfo.panel = eventObj.panel;
        neweventInfo.addedBy = loggedInUser;
        neweventInfo.addedOn = new Date();
        return neweventInfo;
    };

    EventModule.CreateUSAGEventMeetJudges = function(eventObj, loggedInUser) {
        //console.log(eventObj, "fdfdf")
        var neweventInfo = new USAGEventMeetJudges();
        neweventInfo.eventmeetId = mongoose.Types.ObjectId(eventObj.eventmeetId);
        neweventInfo.sportId = mongoose.Types.ObjectId(eventObj.sportId);
        neweventInfo.eventId = mongoose.Types.ObjectId(eventObj.eventId);
        neweventInfo.levelId = mongoose.Types.ObjectId(eventObj.levelId);
        neweventInfo.judgeId = mongoose.Types.ObjectId(eventObj.judgeId);
        neweventInfo.judgePanelId = eventObj.judgePanelId;
        neweventInfo.judgePanel = eventObj.judgePanel;
        neweventInfo.levelName = eventObj.levelName;
        neweventInfo.eventName = eventObj.eventName;
        neweventInfo.addedBy = loggedInUser;
        neweventInfo.addedOn = new Date();
        return neweventInfo;
    };
    EventModule.CreateEventMeetStartCode = function(eventObj, loggedInUser) {

        var neweventInfo = new EventMeetStartCode();
        neweventInfo.eventmeetId = mongoose.Types.ObjectId(eventObj.eventmeetId);
        neweventInfo.startcode = eventObj.startcode;
        neweventInfo.createdBy = loggedInUser;
        neweventInfo.createdOn = new Date();
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
        neweventInfo.SanctionMeet = eventObj.SanctionMeet ? eventObj.SanctionMeet : false
        neweventInfo.SanctionID = eventObj.SanctionID ? eventObj.SanctionID : '';
        neweventInfo.Createdby = eventObj.Createdby ? mongoose.Types.ObjectId(eventObj.Createdby) : '';
        neweventInfo.EventLevel = eventObj.EventLevel ? eventObj.EventLevel : '0';
        neweventInfo.scoretype = eventObj.scoretype ? eventObj.scoretype : '';
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
        //console.log(req.body)
        req.checkBody('question', messageConfig.user.validationErrMessage.firstName).notEmpty();
        req.checkBody('answer', messageConfig.user.validationErrMessage.lastName).notEmpty();
        req.checkBody('assignedTo', messageConfig.user.validationErrMessage.email).notEmpty();
        return req.validationErrors();
    };
    _p.checkEventValidationErrors = function(req) {
        //console.log(req.body)
        req.checkBody('title', messageConfig.eventManager.validationErrMessage.eventTitle).notEmpty();
        req.checkBody('sportid', messageConfig.eventManager.validationErrMessage.Sport).notEmpty();
        req.checkBody('start', messageConfig.eventManager.validationErrMessage.startDate).notEmpty();
        req.checkBody('end', messageConfig.eventManager.validationErrMessage.endDate).notEmpty();
        req.checkBody('state', messageConfig.eventManager.validationErrMessage.venueAddress).notEmpty();
        req.checkBody('city', messageConfig.eventManager.validationErrMessage.venueAddress).notEmpty();
        return req.validationErrors();
    };
    _p.checkEventMapValidationErrors = function(req) {
        //console.log(req.body)
        req.checkBody('eventId', messageConfig.eventManager.validationErrMessage.eventId).notEmpty();
        req.checkBody('userId', messageConfig.eventManager.validationErrMessage.userId).notEmpty();

        return req.validationErrors();
    };
    _p.checkUserEventValidationErrors = function(req) {
        //console.log(req.body)
        req.checkBody('userid', messageConfig.eventManager.validationErrMessage.eventTitle).notEmpty();
        req.checkBody('sportid', messageConfig.eventManager.validationErrMessage.Sport).notEmpty();
        req.checkBody('_id', messageConfig.eventManager.validationErrMessage.startDate).notEmpty();
        return req.validationErrors();
    };
    _p.checkEventListValidationErrors = function(req) {
        //console.log(req.body)
        req.checkBody('event', messageConfig.eventManager.validationErrMessage.eventTitle).notEmpty();
        req.checkBody('state', messageConfig.user.validationErrMessage.firstName).notEmpty();
        req.checkBody('city', messageConfig.user.validationErrMessage.firstName).notEmpty();
        return req.validationErrors();
    };

    _p.getFaqByID = function(req) {
        //console.log(req.params.faqid)

        return dataProviderHelper.findById(Faq, req.params.faqid, documentFields);
    };

    function rankingOnEventLevelRoutine(eventmeetId, lid, eid) {
        return new Promise((resolve, reject) => {
            var query = {};
            //   query.eventMeetId = '5f901644cc758242d898f6b7';
            query.eventMeetId = eventmeetId;
            query.lid = mongoose.Types.ObjectId(lid);
            query.eid = mongoose.Types.ObjectId(eid);
            query.routinestatus = '1'
            dataProviderHelper.find(Routine, query).then((routinelist) => {
                if (routinelist.length) {
                    routinelist.sort((a, b) => {
                        return b.score - a.score;
                    });
                    for (var j = 0; j < routinelist.length; j++) {

                        let update = { $set: { "eventlevelRank": j + 1 } }
                        let Query = { _id: mongoose.Types.ObjectId(routinelist[j]._id) }
                        dataProviderHelper.updateMany(Routine, Query, update);
                        if (j == routinelist.length - 1) {
                            resolve();
                        }
                    }
                } else {
                    resolve()
                }
            })
        })

    }

    function rankingOnEventmeetRoutine(eventmeetId) {
        return new Promise((resolve, reject) => {
            var query = {};
            query.eventMeetId = eventmeetId;
            query.routinestatus = '1'
            dataProviderHelper.find(Routine, query).then((routinelist) => {
                if (routinelist.length) {
                    routinelist.sort((a, b) => {
                        return b.score - a.score;
                    });
                    for (var j = 0; j < routinelist.length; j++) {

                        let update = { $set: { "eventmeetRank": j + 1 } }
                        let Query = { _id: mongoose.Types.ObjectId(routinelist[j]._id) }
                        dataProviderHelper.updateMany(Routine, Query, update);
                        if (j == routinelist.length - 1) {
                            resolve();
                        }
                    }
                } else {
                    resolve()
                }
            })
        })

    }
    _p.getRankingForEventMeetlevel = async function(req, res, next) {
        var query = {};
        var EventMeetLevelRoutines = [];

        var routinelist = await getRoutineBylevel(req.query.eventMeetId, req.query.lid)
            //console.log("rotuinefdfdf", routinelist.length)
        if (routinelist.length > 0) {

            for (var i = 0; i < routinelist.length; i++) {

                var userRoutines = await routinelist.filter((routine) => routine.userid == routinelist[i].userid)
                if (userRoutines.length > 0) {
                    let userscore = 0;
                    await userRoutines.forEach((userroutine, j) => {
                        userscore = userscore + userroutine.score;
                        if (j == userRoutines.length - 1) {
                            let data = {
                                athlete: userRoutines[0].athlete,
                                score: userscore.toFixed(3),
                                USAGID: userRoutines[0].MemberInfo ? userRoutines[0].MemberInfo.MemberID : '',

                                userid: userRoutines[0].userid
                            }
                            if (userRoutines[0].athleteInfo.length > 0) {
                                // console.log(userRoutines[0].athleteInfo[0])
                                data.firstName = userRoutines[0].athleteInfo[0].FirstName ? userRoutines[0].athleteInfo[0].FirstName : ''
                                data.lastName = userRoutines[0].athleteInfo[0].LastName ? userRoutines[0].athleteInfo[0].LastName : ''
                                data.name = userRoutines[0].athleteInfo[0].Name ? userRoutines[0].athleteInfo[0].Name : ''
                            } else if (userRoutines[0].coachInfo.length > 0) {
                                // console.log(userRoutines[0].coachInfo[0])
                                data.firstName = userRoutines[0].coachInfo[0].FirstName ? userRoutines[0].coachInfo[0].FirstName : ''
                                data.lastName = userRoutines[0].coachInfo[0].LastName ? userRoutines[0].coachInfo[0].LastName : ''
                                data.name = userRoutines[0].coachInfo[0].Name ? userRoutines[0].coachInfo[0].Name : ''
                            } else {
                                data.firstName = userRoutines[0].userInfo.firstName ? userRoutines[0].userInfo.firstName : ''
                                data.lastName = userRoutines[0].userInfo.lastName ? userRoutines[0].userInfo.lastName : ''
                                data.name = userRoutines[0].userInfo.firstName + ' ' + userRoutines[0].userInfo.lastName
                            }
                            //console.log(data)
                            EventMeetLevelRoutines.push(data);

                            //console.log(routinelist, "testuserid")
                        }
                    })
                    if (i == routinelist.length - 1) {
                        EventMeetLevelRoutines.sort((a, b) => {
                            return b.score - a.score;
                        });
                        //_.uniq(EventMeetLevelRoutines, 'userid');
                        var Ranking = [];
                        EventMeetLevelRoutines.filter(function(data) {
                            var i = Ranking.findIndex(x => x.userid == data.userid);
                            if (i <= -1) {
                                Ranking.push(data);
                            }
                            return null;
                        });
                        Ranking = await ranking(Ranking);
                        Ranking.sort((a, b) => {
                            return a.rank - b.rank
                        });
                        res.json(Ranking)
                    }
                }
            }
        } else {
            res.json([])
        }



    }
    _p.getRankingForEventMeetAlllevel = async function(req, res, next) {
        var eventmeet = await getEventmeetbyID(req.params.eventmeetId);
        //console.log(eventmeet, "eventmmett")
        var levels = eventmeet.Levels;
        var Ranking = [];
        for (var l = 0; l < levels.length; l++) {
            //console.log(l, "fdfd")
            var EventMeetLevelRoutines = [];
            var routinelist = await getRoutineBylevel(req.params.eventmeetId, levels[l])

            ////console.log("fhfhgfh",routinelist)
            if (routinelist.length > 0) {
                for (var i = 0; i < routinelist.length; i++) {
                    var userRoutines = await routinelist.filter((routine) => routine.userid == routinelist[i].userid)

                    if (userRoutines.length > 0) {

                        let userscore = 0;
                        await userRoutines.forEach((userroutine, j) => {
                            userscore = userscore + userroutine.score;
                            if (j == userRoutines.length - 1) {
                                let data = {
                                    athlete: userRoutines[0].athlete,
                                    score: userscore.toFixed(3),
                                    USAGID: userRoutines[0].MemberInfo ? userRoutines[0].MemberInfo.MemberID : '',
                                    userid: userRoutines[0].userid,
                                    rank: ''
                                }
                                if (userRoutines[0].athleteInfo.length > 0) {
                                    //console.log(userRoutines[0].athleteInfo[0])
                                    data.firstName = userRoutines[0].athleteInfo[0].FirstName ? userRoutines[0].athleteInfo[0].FirstName : ''
                                    data.lastName = userRoutines[0].athleteInfo[0].LastName ? userRoutines[0].athleteInfo[0].LastName : ''
                                    data.name = userRoutines[0].athleteInfo[0].Name ? userRoutines[0].athleteInfo[0].Name : ''
                                } else if (userRoutines[0].coachInfo.length > 0) {
                                    //console.log(userRoutines[0].coachInfo[0])
                                    data.firstName = userRoutines[0].coachInfo[0].FirstName ? userRoutines[0].coachInfo[0].FirstName : ''
                                    data.lastName = userRoutines[0].coachInfo[0].LastName ? userRoutines[0].coachInfo[0].LastName : ''
                                    data.name = userRoutines[0].coachInfo[0].Name ? userRoutines[0].coachInfo[0].Name : ''
                                } else {
                                    data.firstName = userRoutines[0].userInfo.firstName ? userRoutines[0].userInfo.firstName : ''
                                    data.lastName = userRoutines[0].userInfo.lastName ? userRoutines[0].userInfo.lastName : ''
                                    data.name = userRoutines[0].userInfo.firstName + ' ' + userRoutines[0].userInfo.lastName
                                }

                                //       //console.log(data,"datascore",i)
                                EventMeetLevelRoutines.push(data);

                                //       //console.log(i,"testuserid")
                            }
                        })
                        if (i == routinelist.length - 1) {
                            var users = [];
                            EventMeetLevelRoutines.filter(function(data) {
                                var i = users.findIndex(x => x.userid == data.userid);
                                if (i <= -1) {
                                    users.push(data);
                                }
                                return null;
                            });

                            users = await ranking(users);
                            users.sort((a, b) => {
                                return a.rank - b.rank
                            });

                            let levelrank = {
                                    levelName: routinelist[0].level,
                                    users: users
                                }
                                //    //console.log(levelrank,"levelrank")
                            Ranking.push(levelrank)
                                //  //console.log(l,"levels",Ranking)
                                //console.log(l, levels.length, "check")
                            if (l == levels.length - 1) {
                                //console.log(l, "levels-trt", Ranking)
                                res.json(Ranking)
                            }

                        }
                    }
                }
            } else {
                if (l == levels.length - 1) {
                    //console.log(l, "levels-trt", Ranking)
                    res.json(Ranking)
                }
            }



        }
    }

    function ranking(arr) {
        return new Promise((resolve, reject) => {
            var f = (a, b) => b.score - a.score
            const sorted = arr.slice().sort(f)
            var rank = arr.map(x => sorted.findIndex(s => f(x, s) === 0) + 1)
            arr.forEach((user, i) => {
                user.rank = rank[i];
                if (i == Array.length - 1) {
                    resolve(arr)
                }
            })

        })
    }
    //       function rankingOnEventMeetLevelRoutine(eventMeetId,lid) {
    //         return new Promise((resolve,reject)=>{
    //             var query ={};
    //         var EventMeetLevelRoutines =[];
    //         //console.log(req.query,"query")
    //        query.eventMeetId = eventMeetId;
    //        query.lid = mongoose.Types.ObjectId(lid);
    //        query.routinestatus ='1'
    //           dataProviderHelper.find(Routine,query).then(async (routinelist)=>{
    //             if(routinelist.length > 0) {
    //                 for(var i = 0;i< routinelist.length;i++) {
    //                  var userRoutines = await routinelist.filter((routine)=> routine.userid == routinelist[i].userid)
    //                 if(userRoutines.length > 0) {
    //                     let userscore = 0;
    //                     await userRoutines.forEach((userroutine,j)=>{
    //                         userscore = userscore+ userroutine.score;
    //                         if(j == userRoutines.length-1) {
    //                             let data = {
    //                                 athlete : userRoutines[0].athlete,
    //                                 score :userscore,
    //                                 userid :userRoutines[0].userid
    //                             }
    //                             EventMeetLevelRoutines.push(data);

    //                          }
    //                      })
    //                     if(i == routinelist.length - 1){
    //                         EventMeetLevelRoutines.sort((a, b) => {
    //                             return b.score - a.score;
    //                         });
    //                         //_.uniq(EventMeetLevelRoutines, 'userid');
    //                         var Ranking = [];
    //                         EventMeetLevelRoutines.filter(function(data){
    //                           var i = Ranking.findIndex(x => x.userid == data.userid);
    //                           if(i <= -1){
    //                             Ranking.push(data);
    //                           }
    //                           return null;
    //                         });
    //                         Ranking = await ranking(Ranking);
    //                         Ranking.sort((a, b) => {
    //                            return a.rank - b.rank
    //                        });
    //                        for(var j = 0;j< Ranking.length;j++) {

    //                         let update = { $set: { "levelRank": j+1 } }
    //                         let Query = { _id: mongoose.Types.ObjectId(routinelist[j]._id) }
    //                             dataProviderHelper.updateMany(Routine, Query, update);
    //                        if(j == Ranking.length - 1) {
    //                         resolve();
    //                        }
    //                     }

    //                      }
    //                      }
    //                 }
    // }
    //           else {

    //           }

    //         })
    //         })


    //       }

    //       function rankingOnEventLevelRoutine(eventMeetId,lid) {
    //         return new Promise((resolve,reject)=>{
    //             var routinelist =[];
    //             let users =[]
    //             var Ranking =[];
    //             routinelist = await getRoutineByEventLevel(req.query.lid,req.query.eid,req.query.eventMeetId);
    //             if(routinelist['length']) {
    //                 for(var k = 0;k<routinelist['length'];k++){
    //                     let user = {
    //                      athlete : routinelist[k].athlete,
    //                      score :routinelist[k].score,
    //                      userid :routinelist[k].userid,
    //                      routineid:routinelist[k]._id,
    //                      rank:''
    //                     }
    //                     users.push(user);
    //                     if(k == routinelist['length'] -1){
    //                         users = await ranking(users);
    //                         users.sort((a, b) => {
    //                            return a.rank - b.rank
    //                        });
    //                         let rank = {
    //                             eventName : routinelist[0].event,
    //                             levelName : routinelist[0].level,
    //                             users: users
    //                         }
    //                         Ranking.push(rank);
    //                         for(var j = 0;j< users.length;j++) {
    //                             let update = { $set: { "eventlevelRank": users[j].rank } }
    //                             let Query = { _id: mongoose.Types.ObjectId(users[j].routineid) }
    //                                 dataProviderHelper.updateMany(Routine, Query, update);
    //                            if(j == users.length - 1) {
    //                             resolve();
    //                            }
    //                     }
    //                 }           

    //                     }

    //                      }






    //         })


    //       }
    function getEventmeetbyID(id) {
        return new Promise((resolve, reject) => {
            var query = {};
            query._id = mongoose.Types.ObjectId(id);
            dataProviderHelper.findOne(EventMeetModel, query).then((res) => {
                resolve(res)
            })
        })

    }
    _p.getRankingForEventMeet = async function(req, res, next) {

        var eventmeet = await getEventmeetbyID(req.params.eventmeetId);
        //console.log(eventmeet, "eventmmett")
        var levels = eventmeet.Levels;
        var events = eventmeet.Events;
        var Ranking = [];
        for (var i = 0; i < levels.length; i++) {
            for (var j = 0; j < events.length; j++) {
                let users = []
                var routinelist = []
                routinelist = await getRoutineByEventLevel(levels[i], events[j], eventmeet._id);
                if (routinelist['length']) {
                    for (var k = 0; k < routinelist['length']; k++) {

                        let user = {
                            athlete: routinelist[k].athlete,
                            score: routinelist[k].score,
                            USAGID: routinelist[k].MemberInfo ? routinelist[k].MemberInfo.MemberID : '',
                            userid: routinelist[k].userid,
                            eventlevelRank: routinelist[k].eventlevelRank,
                            rank: ''
                        }
                        if (routinelist[k].athleteInfo.length > 0) {

                            user.firstName = routinelist[k].athleteInfo[0].FirstName ? routinelist[k].athleteInfo[0].FirstName : ''
                            user.lastName = routinelist[k].athleteInfo[0].LastName ? routinelist[k].athleteInfo[0].LastName : ''
                            user.name = routinelist[k].athleteInfo[0].Name ? routinelist[k].athleteInfo[0].Name : ''
                        } else if (routinelist[k].coachInfo.length > 0) {
                            console.log(routinelist[k].coachInfo[0])
                            user.firstName = routinelist[k].coachInfo[0].FirstName ? routinelist[k].coachInfo[0].FirstName : ''
                            user.lastName = routinelist[k].coachInfo[0].LastName ? routinelist[k].coachInfo[0].LastName : ''
                            user.name = routinelist[k].coachInfo[0].Name ? routinelist[k].coachInfo[0].Name : ''
                        } else {
                            user.firstName = routinelist[k].userInfo.firstName ? routinelist[k].userInfo.firstName : ''
                            user.lastName = routinelist[k].userInfo.lastName ? routinelist[k].userInfo.lastName : ''
                            user.name = routinelist[k].userInfo.firstName + ' ' + routinelist[k].userInfo.lastName
                        }
                        users.push(user);
                        if (k == routinelist['length'] - 1) {
                            users = await ranking(users);
                            await users.sort((a, b) => {
                                return a.rank - b.rank
                            });
                            let rank = {
                                eventName: routinelist[0].event,
                                levelName: routinelist[0].level,
                                users: users
                            }
                            Ranking.push(rank);
                        }
                    }
                }

            }

            if (i == levels.length - 1) {
                res.json(Ranking)
            }
        }


    }

    function getClubInfoForUSAGMember(sanctionID, USAGID) {
        return new Promise(async(resolve, reject) => {
            var coach = await getClubInfoForCoach(sanctionID, USAGID);
            var athlete = await getClubInfoForAthlete(sanctionID, USAGID);
            //console.log(coach.length, athlete.length, "coach")
            if (coach.length > 0) {
                resolve(coach[0])
            } else if (athlete.length > 0) {
                resolve(athlete[0])
            } else {
                resolve({})
            }
        })
    }

    function getClubInfoForCoach(sanctionID, USAGID) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [

                            { SanctionID: sanctionID },
                            { USAGID: USAGID },


                        ],
                    }

                },


                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "MeetReservationID",
                        foreignField: "_id",
                        as: "clubInfo"
                    }
                },
                { "$unwind": { path: "$clubInfo", preserveNullAndEmptyArrays: true } },
            ]
            CoachReservation.aggregate(query, function(err, response) {
                //console.log(response, err, 'dffdfdf')
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
                }

            })
        })

    }

    function getClubInfoForAthlete(sanctionID, USAGID) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [

                            { SanctionID: sanctionID },
                            { USAGID: USAGID },


                        ],
                    }

                },


                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "MeetReservationID",
                        foreignField: "_id",
                        as: "clubInfo"
                    }
                },
                { "$unwind": { path: "$clubInfo", preserveNullAndEmptyArrays: true } },
            ]
            AthleteReservation.aggregate(query, function(err, response) {
                //console.log(response, err, 'dffdfdf')
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
                }

            })
        })


    }
    _p.getRankingbyEventLevel = async function(req, res, next) {
        var routinelist = [];
        let users = []
        var Ranking = [];
        routinelist = await getRoutineByEventLevel(req.query.lid, req.query.eid, req.query.eventMeetId);
        if (routinelist['length']) {
            for (var k = 0; k < routinelist['length']; k++) {
                let user = {
                    athlete: routinelist[k].athlete,
                    score: routinelist[k].score,
                    USAGID: routinelist[k].MemberInfo ? routinelist[k].MemberInfo.MemberID : '',
                    userid: routinelist[k].userid,
                    eventlevelRank: routinelist[k].eventlevelRank,
                    rank: ''
                }

                if (routinelist[k].athleteInfo.length > 0) {

                    user.firstName = routinelist[k].athleteInfo[0].FirstName ? routinelist[k].athleteInfo[0].FirstName : ''
                    user.lastName = routinelist[k].athleteInfo[0].LastName ? routinelist[k].athleteInfo[0].LastName : ''
                    user.name = routinelist[k].athleteInfo[0].Name ? routinelist[k].athleteInfo[0].Name : ''
                } else if (routinelist[k].coachInfo.length > 0) {

                    user.firstName = routinelist[k].coachInfo[0].FirstName ? routinelist[k].coachInfo[0].FirstName : ''
                    user.lastName = routinelist[k].coachInfo[0].LastName ? routinelist[k].coachInfo[0].LastName : ''
                    user.name = routinelist[k].coachInfo[0].Name ? routinelist[k].coachInfo[0].Name : ''
                } else {
                    user.firstName = routinelist[k].userInfo.firstName ? routinelist[k].userInfo.firstName : ''
                    user.lastName = routinelist[k].userInfo.lastName ? routinelist[k].userInfo.lastName : ''
                    user.name = routinelist[k].userInfo.firstName + ' ' + routinelist[k].userInfo.lastName
                }
                users.push(user);
                if (k == routinelist['length'] - 1) {
                    users = await ranking(users);
                    users.sort((a, b) => {
                        return a.rank - b.rank
                    });
                    let rank = {
                        eventName: routinelist[0].event,
                        levelName: routinelist[0].level,
                        users: users
                    }
                    Ranking.push(rank);
                    res.json(Ranking)

                }
            }
        }

    }

    function getRoutineByEventLevel(lid, eid, eventmeetId) {

        return new Promise((resolve, reject) => {
            //console.log(eventmeetId, "eventmeetId")
            // var query = {}
            // query.lid = mongoose.Types.ObjectId(lid)
            // query.eid = mongoose.Types.ObjectId(eid)
            // query.eventMeetId = eventmeetId;
            // query.routinestatus = '1'
            var query = [{
                        $match: {
                            $and: [

                                { lid: mongoose.Types.ObjectId(lid) },
                                { eid: mongoose.Types.ObjectId(eid) },
                                { eventMeetId: eventmeetId.toString() },
                                { deleted: false },
                                { routinestatus: '1' }
                            ],
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

                    { "$unwind": { path: "$userInfo", preserveNullAndEmptyArrays: true } },
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
                            localField: "MemberInfo.MemberID",
                            foreignField: "USAGID",
                            as: "athleteInfo"

                        }
                    },
                    {
                        $lookup: {
                            from: "EventMeet-Coach-Reservation",
                            localField: "MemberInfo.MemberID",
                            foreignField: "USAGID",
                            as: "coachInfo"

                        }
                    },
                ]
                //console.log(query, "query")
            Routine.aggregate(query, function(err, response) {
                //console.log(response, err, 'dffdfdf')
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
                }

            })
        })

    }

    _p.mappedEventMeetCoachInfo = function(req, res, next) {
        var query = [{
                    $match: {
                        $and: [{ deleted: false }, { eventId: mongoose.Types.ObjectId(req.params.eventmeetId) }]
                    }

                },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "userId",
                        foreignField: "Flyp10UserID",
                        as: "Mapped_MemberInfo"
                    }
                },

                { "$unwind": { path: "$Mapped_MemberInfo", preserveNullAndEmptyArrays: true } },

                {
                    $lookup: {
                        from: "EventMeet-Coach-Reservation",
                        let: { usagID: "$Mapped_MemberInfo.MemberID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", req.params.sanctionId] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$USAGID", '$$usagID'] }
                                        ]
                                    }
                                }
                            },

                        ],

                        as: "Mapped_coachInfo"
                    }
                },




                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "Mapped_coachInfo.MeetReservationID",
                        foreignField: "_id",
                        as: "Mapped_coachclubInfo"
                    }
                },


                {
                    $lookup: {
                        from: "EventMeet-Athlete-Reservation",
                        let: { usagID: "$Mapped_MemberInfo.MemberID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", req.params.sanctionId] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$USAGID", '$$usagID'] }
                                        ]
                                    }
                                }
                            },

                        ],

                        as: "Mapped_athleteInfo"
                    }
                },




                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "Mapped_athleteInfo.MeetReservationID",
                        foreignField: "_id",
                        as: "Mapped_athleteclubInfo"
                    }
                },









            ]
            //console.log(query, 'query')
            //query.eventMeetId = req.params.eventmeetId;
        EventMeetCoachMapping.aggregate(query, async function(err, response) {
            if (!err) {

                res.json({
                    success: true,
                    data: response
                })





            } else {
                res.json({
                    success: false,
                    msg: "Unable to load event meet routines.",
                    err: err
                })
            }

        })
    }

    function getRoutineBylevelClubInfo(eventmeetId, lid) {
        return new Promise((resolve, reject) => {
            console.log(eventmeetId, lid)
            var query = [{
                    $match: {
                        $and: [
                            { deleted: false },
                            { eventMeetId: eventmeetId },

                            { lid: mongoose.Types.ObjectId(lid) },

                            //{ eid: mongoose.Types.ObjectId(eid) },


                        ],
                    }

                },
                {
                    $lookup: {
                        from: "EventMeetForJudging",
                        let: { routineId: '$_id' },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$routineId", "$$routineId"] },

                                        ]
                                    }
                                }
                            },
                            {

                                $group: {
                                    _id: { "judgePanel": "$judgePanel", "judgePanelid": "$judgePanelid" },

                                    "PanelJudges": { $push: "$$ROOT" }
                                }
                            }

                        ],

                        as: "Judges"
                    }
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
                        let: { sanctionID: "$SanctionID", usagID: "$MemberInfo.MemberID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", "$$sanctionID"] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$USAGID", '$$usagID'] }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: "athleteInfo"

                    }
                },
                { "$unwind": { path: "$athleteInfo", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "athleteInfo.MeetReservationID",
                        foreignField: "_id",
                        as: "athleteclubInfo"
                    }
                },

                {
                    $lookup: {
                        from: "EventMeet-Coach-Reservation",
                        let: { sanctionID: "$SanctionID", usagID: "$MemberInfo.MemberID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", "$$sanctionID"] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$USAGID", '$$usagID'] }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: "coachInfo"

                    }
                },
                { "$unwind": { path: "$coachInfo", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "coachInfo.MeetReservationID",
                        foreignField: "_id",
                        as: "coachclubInfo"
                    }
                },
            ]
            Routine.aggregate(query, function(err, response) {
                console.log(response.length)
                if (response.length > 0) {
                    //console.log(response[1]._id, 'A')
                    var result = response
                    for (var i = 0; i < result.length; i++) {
                        result[i]._id = result[i]._id.toString()
                        if (i == result.length - 1) {
                            result = _.uniqBy(result, '_id');
                            //console.log(result[1]._id, 'A')
                            resolve(result)
                        }

                    }

                } else {
                    resolve([])
                }

            })
        })

    }

    function getRoutineBylevel(eventmeetId, lid) {
        return new Promise((resolve, reject) => {

            var query = [{
                    $match: {
                        $and: [

                            { lid: mongoose.Types.ObjectId(lid) },
                            { eventMeetId: eventmeetId },
                            { deleted: false },
                            { routinestatus: '1' }
                        ],
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

                { "$unwind": { path: "$userInfo", preserveNullAndEmptyArrays: true } },
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
                        localField: "MemberInfo.MemberID",
                        foreignField: "USAGID",
                        as: "athleteInfo"

                    }
                },
                {
                    $lookup: {
                        from: "EventMeet-Coach-Reservation",
                        localField: "MemberInfo.MemberID",
                        foreignField: "USAGID",
                        as: "coachInfo"

                    }
                },
            ]
            Routine.aggregate(query, function(err, response) {
                //console.log(response)
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
                }

            })
        })

    }
    _p.updateEvent = function(req, res, next) {
        if (req.body.title) {
            //console.log('req.body ', req.body);
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.title = req.params.event;
            query._id = { $ne: modelInfo._id }
            query.deleted = false;
            //console.log('########## query ', query)
            //console.log('modelInfo ', modelInfo)
            // return _p.updateEventFunc(req, res, modelInfo);
            dataProviderHelper.checkForDuplicateEntry(EventMeet, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.faq.alreadyExistsFaq + '"}');
                    } else {
                        //console.log("inside update")
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
    _p.getEventMeetByCreatedby = function(req, res, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var sortOpts = { addedOn: -1 };
        var query = {}
        query.deleted = false;
        query.Createdby = mongoose.Types.ObjectId(req.params.userid)
        dataProviderHelper.getAllWithDocumentFieldsPagination(EventMeetModel, query, pagerOpts, null, sortOpts).then(resp => {
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


    _p.getEventMeetbyCreatedBySanctionID = function(req, res, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var sortOpts = { addedOn: -1 };
        var query = {}
        query.deleted = false;
        // query.Createdby = mongoose.Types.ObjectId(req.params.userid);
        query.SanctionID = req.params.sanctionid
        dataProviderHelper.getAllWithDocumentFieldsPagination(EventMeetModel, query, pagerOpts, null, sortOpts).then(resp => {
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
    _p.getSanctionEventMeetByMemberID = async function(req, res, next) {
        var SanctionByMeetDirector = await getMeetDirectorSanction(req.params.memberid)
        var sanctionbyadmin = await getAdminSanction(req.params.memberid)
        var Sanction = [];
        var EventMeet = [];
        //console.log(SanctionByMeetDirector, "sanctionbtmeetdirector", SanctionByMeetDirector.length)
        Sanction = SanctionByMeetDirector.concat(sanctionbyadmin);

        for (var i = 0; i < Sanction.length; i++) {
            var eventMeet = await getSanctionEventMeetbySanctionID(Sanction[i].SanctionID);
            EventMeet = EventMeet.concat(eventMeet)
            if (i == Sanction.length - 1) {
                //console.log(EventMeet.length, "Sanctionlene", i)
                res.json({
                    success: true,
                    result: EventMeet
                })
            }


        }

    }
    _p.getSanctionEventMeetForMeetDirectorAdmin = async function(req, res, next) {
        var SanctionByMeetDirector = await getMeetDirectorSanction(req.params.memberid)
        var sanctionbyadmin = await getAdminSanction(req.params.memberid)
        var Sanction = [];
        var EventMeet = [];
        //console.log(SanctionByMeetDirector, "sanctionbtmeetdirector", SanctionByMeetDirector.length)
        Sanction = SanctionByMeetDirector.concat(sanctionbyadmin);

        for (var i = 0; i < Sanction.length; i++) {
            var eventMeet = await getSanctionEventMeet(Sanction[i].SanctionID);
            EventMeet = EventMeet.concat(eventMeet)
            if (i == Sanction.length - 1) {
                //console.log(EventMeet.length, "Sanctionlene", i)
                res.json({
                    success: true,
                    result: EventMeet
                })
            }


        }

    }

    function getSanctionEventMeetbySanctionID(sanctionid) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [{ active: true },

                            { SanctionID: sanctionid }
                        ],
                    }

                }, ]
                //console.log(query, "query", sanctionid)
            EventMeetModel.aggregate(query, function(err, response) {
                //console.log(response)
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
                }

            })
        })

    }

    function getSanctionEventMeet(sanctionid) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [{ active: true },
                            { EndDate: { $gt: new Date() } },

                            { SanctionID: sanctionid }
                        ],
                    }

                }, ]
                //console.log(query, "query", sanctionid)
            EventMeetModel.aggregate(query, function(err, response) {
                //console.log(response)
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
                }

            })
        })

    }

    function getMeetDirectorSanction(memberid) {
        return new Promise((resolve, reject) => {
            var query = {}
            query.MeetDirectorID = memberid
            query.deleted = false;
            //  var pagerOpts = utilityHelper.getPaginationOpts(req, next);
            dataProviderHelper.find(Sanction, query).then(sanction => {
                //console.log(sanction, "sanction")
                if (sanction.length > 0) {
                    resolve(sanction);
                } else {
                    resolve([])
                }

            })
        })
    }

    function getAdminSanction(memberid) {
        return new Promise((resolve, reject) => {
            var Sanction = []
            var query = {}
            query.AdminID = memberid
            dataProviderHelper.find(SanctionAdministrator, query).then(async(admin) => {
                if (admin.length > 0) {
                    for (var i = 0; i < admin.length; i++) {
                        //console.log("admin.SanctionID", admin.SanctionID)
                        var sanction = await getSanctionByAdminSanctionID(admin[i].SanctionID)
                        Sanction.push(sanction)
                            //console.log(Sanction, "Sanctionadmin")
                        if (i == admin.length - 1) {
                            resolve(Sanction)
                        }
                    }
                } else {
                    resolve(Sanction)
                }
            })
        })


    }

    function getSanctionByAdminSanctionID(sanctionID) {
        return new Promise((resolve, reject) => {
            //  var pagerOpts = utilityHelper.getPaginationOpts(req, next);
            var query = {};
            query.SanctionID = sanctionID;
            dataProviderHelper.findOne(Sanction, query).then(sanction => {
                resolve(sanction)

            })
        })

    }

    _p.getEventMeetbyid = function(req, res, next) {
        var query = {};
        query.deleted = false;
        query.Createdby = mongoose.Types.ObjectId(req.params.userid)
            //console.log(query, "dsd")
        dataProviderHelper.find(EventMeetModel, query).then((response) => {
            res.json(response)
        });
    };



    _p.patchEvent = function(req, res, next) {


        var _query = {
            'title': req.params.event,
            'deleted': false
        };
        //console.log("sdsdsd", req.body)
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
        //console.log(req.body.judgePanelid, "req.body.judgePanelid")
        if (req.body.judgePanelid) {
            //console.log(req.body.judgePanelid, "req.body.judgePanelid")
            query.judgePanelid = req.body.judgePanelid
            query.judged = false;
        }
        return dataProviderHelper.find(EventMeetForJudges, query);
    };

    _p.getEventJudgeDetails = function(req) {
        var query = [{
                $match: {
                    $and: [{ 'deleted': false }, { 'judged': false }, { 'routineId': mongoose.Types.ObjectId(req.params.routineID) }, { 'judgeId': mongoose.Types.ObjectId(req.body.jid) }]
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


            dataProviderHelper.find(EventMeetForJudges, _query).then(async function(res) {
                    //console.log(res)
                    let routineArr = res ? res : []
                    let judgedarr = [];
                    let pendingarr = [];
                    let technician = [];
                    let score = 0;
                    let nd = 0;
                    let length = routineArr.length;
                    if (routineArr.length > 0) {
                        judgedarr = routineArr.filter(item => item.judged == true)
                        pendingarr = routineArr.filter(item => item.judged == false)
                            //console.log('judgedarr,pendingarr', judgedarr, pendingarr)
                            //console.log('judgedarr,pendingarr', judgedarr.length, pendingarr.length, length);

                        technician = routineArr.filter(item => item.isTechnician == '1');
                        if (technician.length > 0) {
                            length = length - 1;
                        }
                        //console.log('judgedarr,pendingarr', judgedarr.length, pendingarr.length, length);

                        if (pendingarr.length == 0) {
                            //console.log("test")
                            var routineInfo = await getRoutineInfo(req.body._id);
                            await sharedRoutinewithteammates(routineInfo)
                                //console.log(routineInfo.SanctionRoutine, 'sdsd')
                            if (routineInfo.SanctionRoutine) {
                                var scorecalculation = await scoreCalculationBasedForUSAGRoutine(routineInfo, routineArr)
                                score = scorecalculation.score;
                                nd = scorecalculation.nd;
                                let update = { $set: { "routinestatus": "1", "score": score, "nd": nd } }
                                let Query = { _id: mongoose.Types.ObjectId(req.body._id) }
                                    //completed=false;
                                    //console.log('update', update)
                                    //console.log('Query', Query)
                                try {
                                    dataProviderHelper.updateMany(Routine, Query, update);
                                    // await rankingOnEventLevelRoutine(routineInfo.eventMeetId,routineInfo.lid,routineInfo.eid)
                                    //await rankingOnEventmeetLevelRoutine(routineInfo.eventMeetId,routineInfo.lid)
                                    //await rankingOnEventmeetRoutine(routineInfo.eventMeetId);
                                    //await rankingOnSanctionRoutine(routineInfo.SanctionID);

                                    try {
                                        //console.log('notification')

                                        _p.sendNotification(req)
                                    } catch (e) {

                                    }

                                } catch (e) {
                                    //console.log('Querycatch', e)
                                }
                            } else {
                                for (let i = 0; i < routineArr.length; i++) {

                                    let temp = routineArr[i];
                                    //console.log(temp, 'technicianjudge')
                                    if (temp.hasOwnProperty('isTechnician') && temp.isTechnician == '1') {
                                        routineArr.splice(i, 1)
                                            // length = length -1;
                                    } else {
                                        let num1 = Number(temp.score)
                                        num1 = isNaN(num1) ? 0 : num1;
                                        score = score + num1;
                                        //console.log('score in event meet', length)
                                        if (i == routineArr.length - 1) {
                                            score = Number(score / length)
                                            score = Number(score.toFixed(3))
                                                //console.log('score', score)
                                            let update = { $set: { "routinestatus": "1", "score": score } }
                                            let Query = { _id: mongoose.Types.ObjectId(req.body._id) }
                                                //completed=false;
                                                //console.log('update', update)
                                                //console.log('Query', Query)
                                            try {
                                                dataProviderHelper.updateMany(Routine, Query, update);
                                                try {
                                                    //console.log('notification')

                                                    _p.sendNotification(req)
                                                } catch (e) {

                                                }

                                            } catch (e) {
                                                //console.log('Querycatch', e)
                                            }
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

    function scoreCalculationBasedForUSAGRoutine(routineInfo, routineArr) {

        return new Promise((resolve, reject) => {
            var query = {};
            var score;
            var nd = 0;
            //console.log(routineInfo.sid, routineInfo.lid, routineInfo.eid, 'id')
            query.sportid = mongoose.Types.ObjectId(routineInfo.sid);
            query.levelid = mongoose.Types.ObjectId(routineInfo.lid);
            query.eventid = mongoose.Types.ObjectId(routineInfo.eid);
            dataProviderHelper.findOne(ScoreCalculation, query).then(async(scoreCalculation) => {

                if (scoreCalculation.calculation) {
                    if (routineInfo.sid == applicationConfig.USAGSports.Men || routineInfo.sid == applicationConfig.USAGSports.Women) {
                        if (scoreCalculation.calculation == 'Avg(J)') {
                            var routineJudgedwithScore = routineArr.filter((judge) => judge.routinestatus == '1')
                            score = await CalculateAverageScore(routineJudgedwithScore);
                            nd = await CalculateMaxND(routineJudgedwithScore)
                            score = Number(score.toFixed(3))
                            score = score - Number(nd);

                            resolve({ score: score, nd: Number(nd) })
                        } else if (scoreCalculation.calculation == 'Max(J)') {
                            score = await CalculateMaxScore(routineArr);
                            nd = await CalculateMaxND(routineArr)
                            score = Number(score.toFixed(3))
                            score = score - Number(nd);
                            resolve({ score: score, nd: Number(nd) })
                        }

                    } else if (routineInfo.sid == applicationConfig.USAGSports.Acro) {

                        if (scoreCalculation.calculation == "DJ+(Avg(EJ)*2)+AJ-CJP") {

                            let DJArr = routineArr.filter(item => item.judgePanel == 'DJ');
                            let AJArr = routineArr.filter(item => item.judgePanel == 'AJ');
                            let CJPArr = routineArr.filter(item => item.judgePanel == 'CJP');
                            let EJArr = routineArr.filter(item => item.judgePanel == 'EJ');
                            let AvgEJ = await CalculateAverageScore(EJArr);
                            let DJ = DJArr.length > 0 ? Number(DJArr[0].score) : 0;
                            let AJ = AJArr.length > 0 ? Number(AJArr[0].score) : 0;
                            let CJP = CJPArr.length > 0 ? Number(CJPArr[0].score) : 0;
                            score = DJ + (AvgEJ * 2) + AJ - CJP;
                            nd = await CalculateMaxND(routineArr)
                            score = Number(score.toFixed(3))
                            score = score - Number(nd);
                            resolve({ score: score, nd: Number(nd) })


                        }

                    } else if (routineInfo.sid == applicationConfig.USAGSports.TANDT) {
                        let EArr = routineArr.filter(item => item.judgePanel == 'E');
                        let CJPArr = routineArr.filter(item => item.judgePanel == 'CJP');
                        let DDArr = routineArr.filter(item => item.judgePanel == 'DD');
                        let SumE = await CalculateSumScore(EArr);
                        let CJP = CJPArr.length > 0 ? Number(CJPArr[0].score) : 0;
                        let DD = DDArr.length > 0 ? Number(DDArr[0].score) : 0;

                        if (scoreCalculation.calculation == "Sum(E)+DD-CJP") {
                            score = SumE + DD - CJP;
                            nd = await CalculateMaxND(routineArr)
                            score = Number(score.toFixed(3))
                            score = score - Number(nd);
                            resolve({ score: score, nd: Number(nd) })
                        }
                        // if (scoreCalculation.calculation == "Sum(E)-(CJP/DD)") {
                        //     score = SumE - (CJP / DD);
                        //     score = Number(score.toFixed(3))
                        //     resolve(score)
                        // } else if (scoreCalculation.calculation == "SUM(E)+DD-(CJP/DD)") {
                        //     score = SumE + DD - (CJP / DD);
                        //     score = Number(score.toFixed(3))
                        //     resolve(score)
                        // } else if (scoreCalculation.calculation === "Sum(E)-CJP") {
                        //     score = SumE - CJP;
                        //     score = Number(score.toFixed(3))
                        //     resolve(score)
                        // }

                    } else if (routineInfo.sid == applicationConfig.USAGSports.Rhythmic) {
                        let D1Arr = routineArr.filter(item => item.judgePanel == 'D1')
                        let AEArr = routineArr.filter(item => item.judgePanel == 'AE')
                        let TEArr = routineArr.filter(item => item.judgePanel == 'TE')
                        let D3Arr = routineArr.filter(item => item.judgePanel == 'D3')
                        let TLArr = routineArr.filter(item => item.judgePanel == 'ND')
                            //console.log(D1Arr[0], Number(D1Arr[0].score), "D1")
                        let D1 = D1Arr.length > 0 ? Number(D1Arr[0].score) : 0;
                        let AE = AEArr.length > 0 ? Number(AEArr[0].score) : 0;
                        let TE = TEArr.length > 0 ? Number(TEArr[0].score) : 0;
                        if (scoreCalculation.calculation == "D1 + AE + TE") {
                            score = D1 + AE + TE
                            nd = await CalculateMaxND(routineArr)
                            score = Number(score.toFixed(3))
                            score = score - Number(nd);
                            resolve({ score: score, nd: Number(nd) })
                        } else if (scoreCalculation.calculation == "Avg(D1) + Avg(D3) + (10-(Avg (AE) + Avg(TE))-ND") {
                            let TL = TLArr.length > 0 ? Number(TLArr[0].score) : 0;
                            let AvgD1 = await CalculateAverageScore(D1Arr);
                            let AvgD3 = await CalculateAverageScore(D3Arr);
                            let AvgAE = await CalculateAverageScore(AEArr);
                            let AvgTE = await CalculateAverageScore(TEArr);
                            //  //console.log(TL,AvgD1,AvgD3,AvgAE,AvgTE)
                            score = AvgD1 + AvgD3 + (10 - (AvgAE + AvgTE)) - TL;
                            nd = await CalculateMaxND(routineArr)
                            score = Number(score.toFixed(3))
                            score = score - Number(nd);
                            resolve({ score: score, nd: Number(nd) })

                        }
                    } else {
                        //console.log("else")
                    }
                } else {

                    resolve({ score: score, nd: Number(nd) })
                }

            })
        })

    }

    function CalculateAverageScore(Arr) {
        return new Promise((resolve, reject) => {
            var length = Arr.length;
            var score = 0;
            if (Arr.length > 0) {
                for (let i = 0; i < Arr.length; i++) {

                    let temp = Arr[i];
                    console
                    let num1 = Number(temp.score);
                    //console.log(num1)
                    num1 = isNaN(num1) ? 0 : num1;
                    //console.log(score, num1, "number");
                    score = score + num1;
                    //console.log('score in event meet', length)
                    if (i == Arr.length - 1) {
                        //console.log(score)
                        score = Number(score / length)
                        score = Number(score.toFixed(3))
                            //console.log(score, "Average")
                        resolve(score);

                    }

                }
            } else {
                resolve(score)
            }
        })
    }

    function CalculateMaxScore(Arr) {
        return new Promise((resolve, reject) => {
            var length = Arr.length;
            var score = 0;
            Arr.sort((a, b) => {
                return b.score - a.score
            });
            score = Number(Arr[0].score)
            resolve(score);
        })
    }

    function CalculateMaxND(Arr) {
        return new Promise((resolve, reject) => {

            var length = Arr.length;
            var nd = 0;
            if (Arr.length > 0) {
                Arr.sort((a, b) => {
                    return b.ND - a.ND
                });
                nd = Number(Arr[0].ND)
            }
            resolve(nd);
        })
    }

    function CalculateSumScore(Arr) {
        return new Promise((resolve, reject) => {
            var score = 0;
            for (let i = 0; i < Arr.length; i++) {
                //console.log(Arr)
                let temp = Arr[i];
                let num1 = Number(temp.score);
                num1 = isNaN(num1) ? 0 : num1;
                score = score + num1;

                if (i == Arr.length - 1) {
                    score = Number(score.toFixed(3))
                    resolve(score);

                }

            }
            if (Arr.length == 0) {
                resolve(score);
            }
        })

    }

    async function sharedRoutinewithteammates(routineInfo) {
        //console.log('sharedroutine', routineInfo.userid)
        var userInfo = await getUserByID(routineInfo.userid);
        //console.log("userInfo", userInfo.alwaysSharedRoutine)
        if (userInfo.alwaysSharedRoutine && userInfo.alwaysSharedRoutine == 'Y') {
            //console.log("alwaysSharedRoutine")
            var teammate1 = await getTeammatesById(routineInfo.userid);
            var teammate2 = await getRequestsByFID(routineInfo.userid);
            var teammate = teammate1.concat(teammate2);
            //console.log(teammate, "teammate")
            let data = {
                RoutineID: routineInfo._id,
                SubmittedBy: routineInfo.uid,
                sharedwith: teammate
            }
            var sharedObj = EventModule.CreateShareRoutine(data, routineInfo.athlete);
            dataProviderHelper.save(sharedObj);
            for (let i = 0; i < teammate.length; i++) {
                let msg = routineInfo.athlete + " shared routine with you."
                    //console.log(msg)
                const notificationitem = {
                    UID: teammate[i],
                    type: 5,
                    read: false,
                    message: msg,
                    notificationProperties: {
                        FID: '',
                        RID: ''
                    }
                }
                saveNotification(notificationitem);
            }
        }

    }

    function getTeammatesById(userId) {
        return new Promise((resolve, reject) => {
            //console.log(userId, "teammateUID")
            let UID = mongoose.Types.ObjectId(userId);

            var query = {};

            if (userId) {
                query.UID = { $regex: new RegExp('.*' + UID, "i") };
                // query.UID = req.params.UID
            }
            //console.log(query, "query")
            dataProviderHelper.findAll(TeamMate, query).then((res) => {
                //console.log(res, 'UID')
                if (res.length > 0) {
                    let teammate = []
                    for (let i = 0; i < res.length; i++) {
                        let temp = res[i];
                        if (temp.status == '2') {
                            teammate.push(temp.FID);
                            //this.teammatelist.push(temp)
                        }
                        if (i == res.length - 1) {
                            //console.log("teammateUID", teammate)
                            resolve(teammate)
                        }
                    }
                } else {
                    resolve([])
                }
            })
        })

    };

    function getRequestsByFID(userId) {
        return new Promise((resolve, reject) => {
            //console.log(userId, "teammateFID")
            let FID = mongoose.Types.ObjectId(userId);


            var query = {};
            if (userId) {
                query.FID = { $regex: new RegExp('.*' + FID, "i") };
            }
            dataProviderHelper.findAll(TeamMate, query).then((res) => {
                if (res.length > 0) {
                    let teammate = []
                    for (let i = 0; i < res.length; i++) {
                        let temp = res[i];
                        if (temp.status == '2') {
                            teammate.push(temp.UID);
                            //this.teammatelist.push(temp)
                        }
                        if (i == res.length - 1) {
                            resolve(teammate)
                        }
                    }
                } else {
                    resolve([])
                }
            });
        })
    };

    function getUserByID(userId) {
        return new Promise((resolve, reject) => {
            userdocumentFields = userdocumentFields + ' twoFactorAuthSharedSecret';
            dataProviderHelper.findById(User, userId, userdocumentFields).then((res) => {
                resolve(res)
            });
        })
    }

    function saveNotification(notification) {
        //console.log('notification')
        var notificationInfo = EventModule.CreateNotification(notification, '');
        dataProviderHelper.save(notificationInfo).then(function() {

                let query;
                if (notification.type == '3' || notification.type == '4' || notification.type == '5') {
                    //console.log('notification.UID', notification.UID)
                    query = {
                        _id: notification.UID,
                        deleted: false
                    }
                }
                let Tokenquery = {
                        UID: notification.UID

                    }
                    //console.log('tokenquery', Tokenquery)
                dataProviderHelper.find(User, query).then(function(user) {
                    //console.log("userdata azar", query, user);
                    if (user) {
                        dataProviderHelper.find(NotificationTokenObj, Tokenquery).then(function(tokenList) {
                            //console.log("tokenlist", tokenList)
                            for (let i = 0; i < tokenList.length; i++) {
                                var message;
                                var title;
                                if (notification.type == '5') {
                                    title = "New notification from Judge"
                                    message = notification.message

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
                                    //console.log('notification body', body)

                                const callback = (err, resp, body) => {
                                    if (!err && resp.statusCode == 200) {
                                        //console.log(body, "firebasenotification")
                                        //console.log("success")
                                    } else {
                                        //console.log(body, "firebasenotification")
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
    _p.sendNotification = function(req) {

        //console.log(req.body._id, 'sendNotification')
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
            //console.log("userdata", routine);

            if (routine.length > 0) {
                //console.log("userdata", routine);
                // //console.log(routine[0].token);
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

    function getRoutineInfo(routineId) {
        //console.log("dfdfd", routineId)
        return new Promise((resolve, reject) => {
            dataProviderHelper.findOne(Routine, { "_id": mongoose.Types.ObjectId(routineId) }).then((routine) => {

                resolve(routine)
            })
        })
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
    _p.patchEventMeetRoutine = function(req, res, next) {


        var _query = {
            'judged': false,
            'routineId': mongoose.Types.ObjectId(req.params.routineID)
        };
        //console.log("sdsdsd", req.body)
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
                        req.MeetRoutine.dod = req.body.dod;
                        req.MeetRoutine.ND = req.body.nd ? req.body.nd : '0';
                    } else {
                        req.MeetRoutine.score = '0';
                        req.MeetRoutine.ND = "0"
                    }
                    req.MeetRoutine.judged = true;
                    req.MeetRoutine.JudgedOn = req.body.judgedOn;
                    //console.log(req.MeetRoutine, 'test')

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
                    //console.log(req.MeetRoutine)
                    if (req.body.assigned) {
                        req.MeetRoutine.assigned = true;
                    }

                    //console.log(req.MeetRoutine)
                    //console.log(req.MeetRoutine.assigned)

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
        //console.log(query);
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
        //console.log("gfgfgfg")
        //console.log(req.query.eventId)
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
            //console.log("modelInfo", modelInfo)
            query.title = modelInfo.title;
            query.userid = modelInfo.userid;
            query.deleted = false;
            //console.log(query)
            return dataProviderHelper.checkForDuplicateEntry(EventList, query).then(function(count) {
                    //console.log(count)
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

        //console.log('eventmett', eventMeet)
        var query = {}


        query.EventName = req.body.EventName


        EventMeetModel.find(query, function(err, response) {
            if (response.length) {
                var message = "Duplicate Event Name"
                    // if(req.body.SanctionMeet) {
                    //     message = "Event Meet already exists for this Sanction"
                    // }
                res.json({
                    success: false,
                    message: message
                })
            } else {
                eventMeet.save(async function(err, response) {



                    if (!err) {
                        if (req.body.SanctionMeet) {
                            var coaches = await getSanctionCoaches(req.body.SanctionID);
                            var athletes = await getSanctionAthletes(req.body.SanctionID)
                                //console.log(coaches, "coaches")
                                //console.log(athletes, "athletes")
                            if (coaches.length > 0) {
                                for (var i = 0; i < coaches.length; i++) {
                                    await createEventMeetMapping(coaches[i].Flyp10UserID, response._id)
                                }
                            }

                            if (athletes.length > 0) {
                                for (var i = 0; i < athletes.length; i++) {
                                    await createEventMeetMapping(athletes[i].Flyp10UserID, response._id)
                                }
                            }
                        }

                        res.json({
                            success: true,
                            message: "Event Meet Added Successfully",
                            response: response
                        })
                    } else {
                        res.json({
                            success: false,
                            message: "Cannot add Event Meet",
                            err
                        })
                    }

                })
            }
        })


    }

    function createEventMeetMapping(userid, eventmeetId) {
        return new Promise((resolve, reject) => {
            var modelInfo = {};
            modelInfo.userId = userid;
            modelInfo.eventId = eventmeetId;
            modelInfo.active = true;
            var query = {}
            query.userId = userid;
            query.eventId = eventmeetId;
            dataProviderHelper.find(EventMeetCoachMapping, query).then((response) => {
                if (response.length == 0) {
                    var newEvent = EventModule.CreateEventMeeetCoachMapping(modelInfo);
                    dataProviderHelper.save(newEvent).then((res) => {
                        resolve();
                    })
                } else {
                    resolve()
                }
            })
        })

    }

    function getSanctionCoaches(sanctionId) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [{ deleted: false }, { SanctionID: sanctionId }]
                    }

                },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "USAGID",
                        foreignField: "MemberID",
                        as: "MemberInfo"
                    }
                },

                { "$unwind": "$MemberInfo" },
                {
                    "$project": {
                        "MemeberID": "$MemberInfo.MemberID",
                        "Flyp10UserID": "$MemberInfo.Flyp10UserID",
                        "FirstName": "$FirstName",
                        "LastName": "$LastName",
                        "Name": "$Name",
                        "Type": 'C'

                    }
                }



            ]
            CoachReservation.aggregate(query, function(err, response) {
                if (!err) {
                    resolve(response)
                }
            })

        })

    }

    function getSanctionAthletes(sanctionId) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [{ deleted: false }, { SanctionID: sanctionId }]
                    }

                },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "USAGID",
                        foreignField: "MemberID",
                        as: "MemberInfo"
                    }
                },

                { "$unwind": "$MemberInfo" },
                {
                    "$project": {
                        "MemeberID": "$MemberInfo.MemberID",
                        "Flyp10UserID": "$MemberInfo.Flyp10UserID",
                        "FirstName": "$FirstName",
                        "LastName": "$LastName",
                        "Name": "$Name",
                        "Type": "A"
                    }
                }



            ]
            AthleteReservation.aggregate(query, function(err, response) {
                if (!err) {
                    resolve(response)
                }
            })

        })

    }

    function getSanctionAthleteInfo(sanctionId, eventmeetId) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [{ deleted: false }, { SanctionID: sanctionId }]
                    }

                },
                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "MeetReservationID",
                        foreignField: "_id",
                        as: "ClubReservationInfo"
                    }
                },
                { "$unwind": "$ClubReservationInfo" },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "USAGID",
                        foreignField: "MemberID",
                        as: "MemberInfo"
                    }
                },

                { "$unwind": { path: "$MemberInfo", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "Routine",
                        let: { uid: "$MemberInfo.Flyp10UserID", },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$uid", "$$uid"] },
                                            { $eq: ["$eventMeetId", eventmeetId] },
                                            { $eq: ["$deleted", false] },

                                        ]
                                    }
                                }
                            },

                        ],
                        as: "Routine"
                    }
                },

                {
                    "$project": {
                        "Name": "$Name",
                        "USAGID": "$USAGID",
                        "Club": "$ClubReservationInfo.ClubName",
                        "Level": "$Level",
                        "routine": "$Routine",

                    }
                }



            ]
            AthleteReservation.aggregate(query, function(err, response) {
                if (!err) {
                    resolve(response)
                }
            })

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

        // var date1 = new Date();
        // var formatDate1 = date1.getFullYear()+'-'+addZ(date1.getMonth()+1)+'-'+addZ(date1.getDate());
        // var formatDate2 = date1.getFullYear()+'-'+addZ(date1.getMonth()+1)+'-'+addZ(date1.getDate()-1);
        // var startDate = new Date(formatDate1)
        // var endDate = new Date(formatDate2);
        // //console.log(startDate,endDate,"startendentroll")
        var usaTime = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
        var date1 = new Date(usaTime);
        var formatDate1 = date1.getFullYear() + '-' + addZ(date1.getMonth() + 1) + '-' + addZ(date1.getDate())
            //   //console.log(moment('10-30-2020').toDate(),"djkfhdkjfhd")
            // var startDate = new Date(formatDate1)
            // var endDate = new Date(formatDate1);
            // //console.log('USA time: '+ (new Date(usaTime)));
            // //console.log(startDate,endDate,"startendentroll")
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
                    "$expr": {
                        $and: [{
                                $lte: [

                                    {
                                        "$dateToString": {
                                            "date": "$MeetInfo.StartDate",
                                            "timezone": 'America/New_York',
                                            "format": "%Y-%m-%d"
                                        }
                                    },
                                    formatDate1
                                ]
                            },
                            {
                                $gte: [

                                    {
                                        "$dateToString": {
                                            "date": "$MeetInfo.EndDate",
                                            "timezone": 'America/New_York',
                                            "format": "%Y-%m-%d"
                                        }
                                    },
                                    formatDate1
                                ]
                            },
                        ]

                    }
                    //  $and: [{ 'MeetInfo.deleted': false },{ 'MeetInfo.StartDate': { $lte: startDate  }}, { 'MeetInfo.EndDate': { $gte: endDate  } } ]
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

        // //console.log('req.decoded.user.username',req.decoded.user._id)
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

    _p.getAllStartedEventMeet = function(req, res, next) {

        // //console.log('req.decoded.user.username',req.decoded.user._id)
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var sortOpts = { StartDate: -1 };
        var query = { deleted: false, StartDate: { $lte: new Date() } }
        dataProviderHelper.getAllWithDocumentFieldsPagination(EventMeetModel, query, pagerOpts, null, sortOpts).then(resp => {
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

    _p.getSanctionEventMeet = function(req, res, next) {

        // //console.log('req.decoded.user.username',req.decoded.user._id)
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var sortOpts = { addedOn: -1 };
        dataProviderHelper.getAllWithDocumentFieldsPagination(EventMeetModel, { deleted: false, SanctionID: req.params.sanctionid }, pagerOpts, null, sortOpts).then(resp => {
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

    _p.getEventMeetForMapByCreatedBy = function(req, res, next) {

        var date = new Date().toISOString();


        var query = [{
                $match: {
                    $and: [{ active: true },
                        { EndDate: { $gt: new Date() } },

                        { Createdby: mongoose.Types.ObjectId(req.params.userid) }
                    ],
                }

            }, ]
            //console.log(query);
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
    _p.getEventMeetForMap = function(req, res, next) {

        var date = new Date().toISOString();


        var query = [{
                $match: {
                    $and: [{ active: true },
                        { EndDate: { $gt: new Date() } },
                    ]
                }

            }, ]
            //console.log(query);
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
            //console.log(query);
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

        //console.log(req.body)
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


            //console.log('response', response)

            res.json({
                success: true,
                result: response
            })

        })

    }
    _p.enrollEventMeet = function(req, res, next) {

        var enrollEvent = EventModule.CreateenrollEventMeet(req.body)
            //console.log('it came', enrollEvent)
        enrollEvent.save(function(err, response) {
            //console.log('err', err)
            //console.log('response', response)
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
        //console.log("query", query)
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
        //console.log("querygfghgfj", query)
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
            //console.log("modelInfo", modelInfo)
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
            //console.log("modelInfo", modelInfo)
            query.eventId = modelInfo.eventId;
            query.userId = modelInfo.userId;
            query.deleted = false;
            return dataProviderHelper.checkForDuplicateEntry(EventMeetCoachMapping, query).then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.eventManager.alreadyExists + '"}');
                    } else {
                        ////console.log(req.decoded.user.username)
                        var newEvent = EventModule.CreateEventMeeetCoachMapping(modelInfo);
                        //console.log(newEvent)
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
                    ////console.log(req.decoded.user.username)
                    var newEvent = EventModule.CreateEventMeetGroup(req.body);
                    //console.log(newEvent)
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
            //console.log("modelInfo", modelInfo)
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


    _p.getEventForJudges1 = function(req, res, next) {
        var query = [{
                    $match: {
                        $and: [{ deleted: false }, { $or: [{ routinestatus: '0' }, { routinestatus: '5' }] }, { isConverted: '2' }]
                    }

                },
                {
                    $lookup: {
                        from: "SportLevelSort",
                        let: { levelId: "$lid", sportId: "$sid" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$levelId", "$$levelId"] },
                                            { $eq: ["$sportId", "$$sportId"] },

                                        ]
                                    }
                                }
                            },

                        ],
                        as: "SportLevelSort"
                    }
                },
                { "$unwind": { path: "$SportLevelSort", preserveNullAndEmptyArrays: true } },
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
                {
                    $lookup: {
                        from: "EventMeet-Sanction",
                        let: { sanctionID: '$eventmeetInfo.SanctionID' },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$SanctionID", "$$sanctionID"] },
                                        { $eq: ["$deleted", false] },
                                    ]
                                }
                            }
                        }, ],
                        as: "Sanction"
                    }
                },
                { "$unwind": { path: "$Sanction", preserveNullAndEmptyArrays: true } },
                { $sort: { addedOn: 1 } },
                {
                    $group: {
                        _id: { "SanctionID": "$eventmeetInfo.SanctionID", "SortOrder": "$Sanction.Settings.SortForJudges" },

                        "Routines": { $push: "$$ROOT" },
                    }
                }

            ]
            //console.log(query, 'judgeInfo.judgeId', mongoose.Types.ObjectId(req.params.judgeId))
        Routine.aggregate(query, function(err, response) {
            if (err) {
                res.json({
                    success: false,
                    message: "Cannot get judges",
                    err: 'err'
                })
            } else {
                if (response.length > 0) {
                    var routines = [];
                    for (var i = 0; i < response.length; i++) {
                        var data = response[i];
                        if (data._id.SanctionID) {
                            if (data._id.SortOrder == 'DateTimeAsc') {
                                data.Routines.sort(function(a, b) { return new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime() });
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'DateTimeDesc') {
                                data.Routines.sort(function(a, b) { return new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime() });
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'LevelAsc') {
                                data.Routines.sort((a, b) => a.level.localeCompare(b.level))
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'LevelDesc') {
                                data.Routines.sort((a, b) => b.level.localeCompare(a.level))
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'CustomLevelAsc') {
                                data.Routines.sort((a, b) => {
                                    return a.SportLevelSort.sortValue - b.SportLevelSort.sortValue
                                })
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'CustomLevelDesc') {
                                data.Routines.sort((a, b) => {
                                    return b.SportLevelSort.sortValue - a.SportLevelSort.sortValue
                                })
                                routines = routines.concat(data.Routines)
                            } else {
                                data.Routines.sort(function(a, b) { return new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime() });
                                routines = routines.concat(data.Routines)
                            }

                        } else {
                            data.Routines.sort(function(a, b) { return new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime() });
                            routines = routines.concat(data.Routines)
                        }
                        if (i === response.length - 1) {
                            res.json({
                                success: true,
                                result: routines
                            })
                        }

                    }
                }
                // res.json({
                //     success: true,
                //     result: response
                // })

            }
        })
    }
    _p.getEventForJudges = function(req, res, next) {
        var query = [{
                    $match: {
                        $and: [{ 'judged': false }, { 'deleted': false }, { 'judgeId': mongoose.Types.ObjectId(req.params.judgeId) }]

                    }

                },
                //it is lookup for mobile
                {
                    $lookup: {
                        from: "EventMeetForJudging",
                        let: { routineId: "$routineId", judgeId: "$judgeId" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$routineId", "$$routineId"] },
                                            { $eq: ["$judgeId", "$$judgeId"] },

                                        ]
                                    }
                                }
                            },



                        ],
                        as: "judgeInfo"
                    }
                },
                { "$unwind": "$judgeInfo" },

                {
                    $lookup: {
                        from: "EventMeet",
                        localField: "eventId",
                        foreignField: "_id",
                        as: "eventmeetInfo"
                    }
                },
                { "$unwind": "$eventmeetInfo" },
                {
                    $lookup: {
                        from: "Routine",
                        let: { routineId: "$routineId", eventmeetInfo: "$eventmeetInfo", judgeInfo: "$judgeInfo" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$routineId"] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$isConverted", '2'] },
                                            {
                                                $or: [
                                                    { $eq: ["$routinestatus", '0'] },
                                                    { $eq: ["$routinestatus", '5'] },

                                                ]
                                            },


                                        ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: "SportLevelSort",
                                    let: { levelId: "$lid", sportId: "$sid" },
                                    pipeline: [{
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ["$levelId", "$$levelId"] },
                                                        { $eq: ["$sportId", "$$sportId"] },

                                                    ]
                                                }
                                            }
                                        },

                                    ],
                                    as: "SportLevelSort"
                                }
                            },
                            { "$unwind": { path: "$SportLevelSort", preserveNullAndEmptyArrays: true } },

                            {
                                $addFields: {
                                    "eventmeetInfo": "$$eventmeetInfo",
                                    "judgeInfo": "$$judgeInfo"

                                }
                            }

                        ],
                        as: "Routine"
                    }
                },
                // {
                //     $match: {
                //         $and: [{ "Routine.deleted": false }, { $or: [{ "Routine.routinestatus": '0' }, { "Routine.routinestatus": '5' }] }, { "Routine.isConverted": '2' }]
                //     }

                // },
                { "$unwind": "$Routine" },


                {
                    $lookup: {
                        from: "EventMeet-Sanction",
                        let: { sanctionID: '$eventmeetInfo.SanctionID' },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$SanctionID", "$$sanctionID"] },
                                        { $eq: ["$deleted", false] },
                                    ]
                                }
                            }
                        }, ],
                        as: "Sanction"
                    }
                },
                { "$unwind": { path: "$Sanction", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: { "SanctionID": "$eventmeetInfo.SanctionID", "SortOrder": "$Sanction.Settings.SortForJudges" },

                        "Routines": { $push: "$Routine" }
                    }
                }

            ]
            //console.log(query, 'judgeInfo.judgeId', mongoose.Types.ObjectId(req.params.judgeId))
        EventMeetForJudges.aggregate(query, function(err, response) {
            if (err) {
                res.json({
                    success: false,
                    message: "Cannot get judges",
                    err: 'err'
                })
            } else {
                if (response.length > 0) {
                    var routines = [];
                    for (var i = 0; i < response.length; i++) {
                        var data = response[i];
                        if (data._id.SanctionID) {
                            if (data._id.SortOrder == 'DateTimeAsc') {
                                data.Routines.sort(function(a, b) { return new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime() });
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'DateTimeDesc') {
                                data.Routines.sort(function(a, b) { return new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime() });
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'LevelAsc') {
                                data.Routines.sort((a, b) => {
                                    return a.level.localeCompare(b.level) || new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime()
                                })
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'LevelDesc') {
                                data.Routines.sort((a, b) => {
                                    return b.level.localeCompare(a.level) || new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime()
                                })
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'CustomLevelAsc') {
                                data.Routines.sort((a, b) => {
                                    //return a.SportLevelSort.sortValue - b.SportLevelSort.sortValue
                                    return a.SportLevelSort.sortValue - b.SportLevelSort.sortValue || new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime()
                                })
                                routines = routines.concat(data.Routines)
                            } else if (data._id.SortOrder == 'CustomLevelDesc') {
                                data.Routines.sort((a, b) => {
                                    // return b.SportLevelSort.sortValue - a.SportLevelSort.sortValue
                                    return b.SportLevelSort.sortValue - a.SportLevelSort.sortValue || new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime()
                                })
                                routines = routines.concat(data.Routines)
                            } else {
                                data.Routines.sort(function(a, b) { return new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime() });
                                routines = routines.concat(data.Routines)
                            }

                        } else {
                            data.Routines.sort(function(a, b) { return new Date(a.addedOn).getTime() - new Date(b.addedOn).getTime() });
                            routines = routines.concat(data.Routines)
                        }
                        if (i === response.length - 1) {
                            res.json({
                                success: true,
                                result: routines
                            })
                        }

                    }
                }
                // res.json({
                //     success: true,
                //     result: response
                // })

            }
        })
    }
    _p.getEventMeetCoachMappingForUser = function(req, res, next) {
        //console.log("eventmeet")
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
            ////console.log(query,'judgeInfo.judgeId',mongoose.Types.ObjectId(req.params.judgeId))
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
            //console.log(query, 'judgeInfo.judgeId', mongoose.Types.ObjectId(req.params.judgeId))
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
            ////console.log(query,'judgeInfo.judgeId',mongoose.Types.ObjectId(req.params.judgeId))
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

    function addUSAGEventmeetJudges(req, loggedInUser) {
        return new Promise(async(resolve, reject) => {
            var JudgesbyPanel = req.body.JudgesbyPanel;
            if (JudgesbyPanel.length > 0) {
                for (var i = 0; i < JudgesbyPanel.length; i++) {
                    var judgePanelId = JudgesbyPanel[i].Panel;
                    var judgePanel = JudgesbyPanel[i].PanelName;
                    //console.log(judgePanelId, judgePanel, JudgesbyPanel[i].Judges, "judgePanelId")
                    for (var j = 0; j < JudgesbyPanel[i].Judges.length; j++) {
                        var judgeId = JudgesbyPanel[i].Judges[j]
                        var body = {
                                eventmeetId: req.body.eventmeetId,
                                sportId: req.body.sportId,
                                eventId: req.body.eventId,
                                levelId: req.body.levelId,
                                judgePanelId: judgePanelId,
                                judgePanel: judgePanel,
                                judgeId: judgeId,
                                levelName: req.body.levelName,
                                eventName: req.body.eventName,
                                loggedInUser: loggedInUser
                            }
                            //console.log(judgePanelId, judgePanel, judgeId, j, "judgeInfo")
                        await addUSAGEventmeetJudge(body);

                    }
                    if (i === JudgesbyPanel.length - 1) {
                        resolve()
                    }
                }

            } else {
                resolve();
            }
        })
    }

    function addUSAGEventmeetJudge(obj) {
        return new Promise((resolve, reject) => {
            var query = {}
            query.eventmeetId = obj.eventmeetId
            query.sportId = obj.sportId
            query.eventId = obj.eventId
            query.levelId = obj.levelId
            query.judgePanel = obj.judgePanel;
            query.judgePanelId = obj.judgePanelId;
            query.judgeId = obj.judgeId;
            query.deleted = false;
            dataProviderHelper.find(USAGEventMeetJudges, query).then((judge) => {
                if (judge.length == 0) {
                    //console.log(obj.judgePanelId, obj.judgePanel, obj.judgeId, "panelInfo")
                    var body = {
                            eventmeetId: obj.eventmeetId,
                            sportId: obj.sportId,
                            eventId: obj.eventId,
                            levelId: obj.levelId,
                            judgePanelId: obj.judgePanelId,
                            judgePanel: obj.judgePanel,
                            judgeId: obj.judgeId,
                            levelName: obj.levelName,
                            eventName: obj.eventName,
                            addedBy: obj.loggedInUser
                        }
                        //console.log(body, "dfdfd")
                    var USAGJudge = EventModule.CreateUSAGEventMeetJudges(body, obj.loggedInUser)
                    USAGJudge.save();
                    resolve()
                } else {
                    resolve()
                }
            })
        })
    }

    function deleteUSAGEventmeetJudges(JudgesbyPanel, obj, loggedInUser) {
        return new Promise(async(resolve, reject) => {
            var updatedJudgeByPanel = obj.JudgesbyPanel;
            if (JudgesbyPanel.length > 0) {
                for (var i = 0; i < JudgesbyPanel.length; i++) {
                    var judgePanelId = JudgesbyPanel[i].Panel;
                    var judgePanel = JudgesbyPanel[i].PanelName;
                    var panelJudge = JudgesbyPanel[i].Judges;
                    var updatedpanelJudge = [];
                    var updatedpanel = updatedJudgeByPanel.filter(item => JudgesbyPanel[i].Panel.indexOf(item.Panel) != -1);
                    if (updatedpanel.length > 0) {
                        updatedpanelJudge = updatedpanel[0].Judges
                            // //console.log('updatedpanelJudge',updatedpanelJudge)
                    }
                    var deletedJudgebyPanel = panelJudge.filter(item => updatedpanelJudge.indexOf(item) == -1);
                    //console.log(deletedJudgebyPanel, "deletedJudgebyPanel", judgePanel)

                    for (var j = 0; j < deletedJudgebyPanel.length; j++) {
                        var body = {
                            eventmeetId: obj.eventmeetId,
                            sportId: obj.sportId,
                            eventId: obj.eventId,
                            levelId: obj.levelId,
                            judgePanelId: judgePanelId,
                            judgePanel: judgePanel,
                            judgeId: deletedJudgebyPanel[j],
                            levelName: obj.levelName,
                            eventName: obj.eventName,
                            loggedInUser: loggedInUser
                        }
                        await deleteUSAGEventmeetJudge(body);

                    }

                    if (i === JudgesbyPanel.length - 1) {
                        resolve()
                    }



                }
            } else {
                resolve()
            }
        })


    }

    function deleteUSAGEventmeetJudge(obj) {
        return new Promise((resolve, reject) => {
            var query = {}
            query.eventmeetId = obj.eventmeetId
            query.sportId = obj.sportId
            query.eventId = obj.eventId
            query.levelId = obj.levelId
            query.judgePanel = obj.judgePanel;
            query.judgePanelId = obj.judgePanelId;
            query.judgeId = obj.judgeId;
            query.deleted = false
            dataProviderHelper.find(USAGEventMeetJudges, query).then((judge) => {
                if (judge.length > 0) {
                    judge[0].deleted = true;
                    judge[0].deletedOn = new Date();
                    judge[0].deletedBy = obj.loggedInUser
                    dataProviderHelper.save(judge[0])
                    resolve()
                } else {
                    resolve()
                }
            })
        })
    }
    _p.postEventmeetJudgesBypanel = async function(req, res, next) {
        var query = {}
            //console.log(req.body, 'body')
        query.eventmeetId = req.body.eventmeetId
            //query.sportId = req.params.sportId
        query.eventId = req.body.eventId
        query.levelId = req.body.levelId
        await addUSAGEventmeetJudges(req, req.decoded.user.username);
        dataProviderHelper.find(EventMeetJudgeMap, query).then(async(judge) => {
            //console.log(judge, 'judge')
            if (judge.length) {
                await deleteUSAGEventmeetJudges(judge[0].JudgesbyPanel, req.body, req.decoded.user.username)
                judge[0].JudgesbyPanel = req.body.JudgesbyPanel;
                judge[0].levelName = req.body.levelName;
                judge[0].eventName = req.body.eventName;
                dataProviderHelper.save(judge[0]).then((response) => {
                    res.json({
                        success: true,
                        message: "EventMeet Judges Mapped Successfully"
                    })
                })
            } else {
                var newEventMeetJudgeMap = EventModule.CreateEventMeetJudgeMap(req.body, req.decoded.user.username)
                    //console.log(newEventMeetJudgeMap, "newEventMeetJudgeMap")
                dataProviderHelper.save(newEventMeetJudgeMap).then((response) => {
                    res.json({
                        success: true,
                        message: "EventMeet Judges Mapped Successfully"
                    })
                })
            }

        })



    }
    _p.getSanctionCoachesAthletes = async function(req, res, next) {
        var coaches = await getSanctionCoaches(req.query.sanctionid);
        var athletes = await getSanctionAthletes(req.query.sanctionid);
        var competitors = coaches.concat(athletes);
        res.json({
            success: true,
            data: competitors
        })


    }
    _p.getEventmeetJudgesBypanel = function(req, res, next) {
        var query = {}
        query.eventmeetId = mongoose.Types.ObjectId(req.query.eventmeetId)
        query.sportId = mongoose.Types.ObjectId(req.query.sportId)
        query.eventId = mongoose.Types.ObjectId(req.query.eventId)
        query.levelId = mongoose.Types.ObjectId(req.query.levelId)
            //console.log(query)
        dataProviderHelper.find(EventMeetJudgeMap, query).then((response) => {
            res.json({
                success: true,
                data: response
            })
        })
    }
    _p.getEventmeetJudgespanelByeventmeetId = function(req, res, next) {
        var query = {}
        query.eventmeetId = mongoose.Types.ObjectId(req.params.eventmeetId)

        //console.log(query)
        dataProviderHelper.find(EventMeetJudgeMap, query).then((response) => {
            res.json({
                success: true,
                data: response
            })
        })
    }
    _p.generatepdf = function(req, res, next) {
        var contentbody = req.body.HTML;
        var content = `<html>
        <head>
            <title>Convert HTML To PDF</title>
            <!-- Latest compiled and minified CSS -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            
            <!-- Optional theme -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
            
            <!-- Latest compiled and minified JavaScript -->
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
            <script src="https://code.jquery.com/jquery-1.12.4.min.js" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.min.js"></script>
        </head>
        <body>` + contentbody + `</body></html>`
            // //console.log(content,"contenthtml") 
            // const doc = new jsPDF();
            // let _elementHandlers =  
            // {  
            //     '#elementH': function (element, renderer) {
            //         return true;
            //     }
            // };  
            // doc.fromHTML(content,15,15,{  

        //   'width':190,  
        //   'elementHandlers':_elementHandlers  
        // });  

        // doc.save('test.pdf'); 
        const HTMLToPDF = require('html-to-pdf');

        const htmlToPDF = new HTMLToPDF(content);

        htmlToPDF.convert()
            .then((buffer) => {
                // do something with the PDF file buffer
                res.json({
                    pdf: buffer,
                    fileName: ''
                })
            })
            .catch((err) => {
                // do something on error
            });
    }
    _p.sendStartCodeToUSAGMappedCompetitors = function(req, res, next) {
        var eventmeetStartCode = EventModule.CreateEventMeetStartCode(req.body, req.decoded.user.username)
        dataProviderHelper.save(eventmeetStartCode);
        var query = [{
                $match: {
                    $and: [{ 'deleted': false }, { 'eventId': mongoose.Types.ObjectId(req.body.eventmeetId) }]
                }

            },
            {
                $lookup: {
                    from: "USAG-Membership-Verification",
                    localField: "userId",
                    foreignField: "Flyp10UserID",
                    as: "USAGMemberInfo"
                }
            },
            {
                $unwind: "$USAGMemberInfo"
            },
            {
                "$project": {
                    "MemeberID": "$USAGMemberInfo.MemberID",
                    "Flyp10UserID": "$USAGMemberInfo.Flyp10UserID",
                    "USAGMail": "$USAGMemberInfo.Email"
                }
            }
        ]
        EventMeetCoachMapping.aggregate(query).then((response) => {
            //console.log(response)
            var emailTemplate = `<html><head></head><body><p>Please display the following start code in the view of your recordings of submitted routines.
        Your Meet Organizer may send additional start codes throughout this competition.
        </p><b>Start code:` + req.body.startcode + `</b></body></html>`
            for (var i = 0; i < response.length; i++) {
                //console.log(response[i].USAGMail)
                var mailOptions = {
                    fromEmail: '', // sender address
                    toEmail: response[i].USAGMail, // list of receivers
                    subject: "Flyp10 Start Code: " + req.body.startcode, // Subject line
                    textMessage: emailTemplate, // plaintext body
                    htmlTemplateMessage: emailTemplate
                };
                //console.log(mailOptions)
                mailHelper.sendEmailWithNoAttachment(req, mailOptions, next);
                if (i == response.length - 1) {
                    res.json({
                        success: true,
                        //message: "start "
                    })
                }
            }
        })
    }

    _p.getEventmeetRoutineJudgesbyPanel = function(req, res, next) {
        var query = [{
                $match: {
                    $and: [{ deleted: false }, { routineId: mongoose.Types.ObjectId(req.params.routineId) }, ]
                }

            },
            {
                $group: {
                    _id: { "judgePanel": "$judgePanel", "judgePanelid": "$judgePanelid" },

                    "PanelJudges": { $push: "$$ROOT" }
                }
            }
        ]
        EventMeetForJudges.aggregate(query, function(err, response) {
            if (!err) {
                res.json({
                    success: true,
                    data: response
                })
            } else {
                res.json({
                    success: false,
                    msg: "Unable to load event meet routines."
                })
            }
        })
    }
    _p.mappedEventmeetCompetitorsWithScore = function(req, res, next) {
        //var query ={};

        var query = [{
                    $match: {
                        $and: [{ deleted: false }, { eventId: mongoose.Types.ObjectId(req.params.eventmeetId) }]
                    }

                },
                {
                    $lookup: {
                        from: 'EventMeet',
                        localField: 'eventId',
                        foreignField: '_id',
                        as: 'EventMeetInfo'
                    }
                },
                { "$unwind": { path: "$EventMeetInfo", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {

                        from: "Routine",
                        let: { userId: "$userId" },

                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$submittedByID", "$$userId"] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$eventMeetId", req.params.eventmeetId] }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: "Routines"
                    }
                },

                // { "$unwind": "$Routines" },

                { "$unwind": { path: "$Routines", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {

                        from: "Routine",
                        let: { userId: "$userId" },

                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$uid", "$$userId"] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$eventMeetId", req.params.eventmeetId] }
                                        ]
                                    }
                                }
                            },

                        ],
                        as: "ownRoutines"
                    }
                },

                // { "$unwind": "$Routines" },

                //  { "$unwind": { path: "$Routines", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "EventMeetForJudging",
                        let: { routineId: '$Routines._id' },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$routineId", "$$routineId"] },

                                        ]
                                    }
                                }
                            },
                            {

                                $group: {
                                    _id: { "judgePanel": "$judgePanel", "judgePanelid": "$judgePanelid" },

                                    "PanelJudges": { $push: "$$ROOT" }
                                }
                            }

                        ],

                        as: "Judges"
                    }
                },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "Routines.uid",
                        foreignField: "Flyp10UserID",
                        as: "Routine_MemberInfo"
                    }
                },

                { "$unwind": { path: "$Routine_MemberInfo", preserveNullAndEmptyArrays: true } },

                {
                    $lookup: {
                        from: "EventMeet-Coach-Reservation",
                        let: { sanctionID: "$EventMeetInfo.SanctionID", usagID: "$Routine_MemberInfo.MemberID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", "$$sanctionID"] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$USAGID", '$$usagID'] }
                                        ]
                                    }
                                }
                            },

                        ],

                        as: "Routine_coachInfo"
                    }
                },




                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "Routine_coachInfo.MeetReservationID",
                        foreignField: "_id",
                        as: "Routine_coachclubInfo"
                    }
                },


                {
                    $lookup: {
                        from: "EventMeet-Athlete-Reservation",
                        let: { sanctionID: "$EventMeetInfo.SanctionID", usagID: "$Routine_MemberInfo.MemberID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", "$$sanctionID"] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$USAGID", '$$usagID'] }
                                        ]
                                    }
                                }
                            },

                        ],

                        as: "Routine_athleteInfo"
                    }
                },




                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "Routine_athleteInfo.MeetReservationID",
                        foreignField: "_id",
                        as: "Routine_athleteclubInfo"
                    }
                },

                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "userId",
                        foreignField: "Flyp10UserID",
                        as: "Mapped_MemberInfo"
                    }
                },

                { "$unwind": { path: "$Mapped_MemberInfo", preserveNullAndEmptyArrays: true } },

                {
                    $lookup: {
                        from: "EventMeet-Coach-Reservation",
                        let: { sanctionID: "$EventMeetInfo.SanctionID", usagID: "$Mapped_MemberInfo.MemberID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", "$$sanctionID"] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$USAGID", '$$usagID'] }
                                        ]
                                    }
                                }
                            },

                        ],

                        as: "Mapped_coachInfo"
                    }
                },




                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "Mapped_coachInfo.MeetReservationID",
                        foreignField: "_id",
                        as: "Mapped_coachclubInfo"
                    }
                },


                {
                    $lookup: {
                        from: "EventMeet-Athlete-Reservation",
                        let: { sanctionID: "$EventMeetInfo.SanctionID", usagID: "$Mapped_MemberInfo.MemberID" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$SanctionID", "$$sanctionID"] },
                                            { $eq: ["$deleted", false] },
                                            { $eq: ["$USAGID", '$$usagID'] }
                                        ]
                                    }
                                }
                            },

                        ],

                        as: "Mapped_athleteInfo"
                    }
                },




                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "Mapped_athleteInfo.MeetReservationID",
                        foreignField: "_id",
                        as: "Mapped_athleteclubInfo"
                    }
                },









            ]
            //console.log(query, 'query')
            //query.eventMeetId = req.params.eventmeetId;
        EventMeetCoachMapping.aggregate(query, async function(err, response) {
            if (!err) {

                res.json({
                    success: true,
                    data: response
                })





            } else {
                res.json({
                    success: false,
                    msg: "Unable to load event meet routines.",
                    err: err
                })
            }

        })
    }
    _p.downloadEventmeetScoreBylevel = async function(req, res, next) {
        var EventMeetLevelRoutines = [];
        var routinelist = await getRoutineBylevelClubInfo(req.params.eventmeetId, req.query.levelId);
        EventMeetLevelRoutines = EventMeetLevelRoutines.concat(routinelist);
        res.json({
            success: true,
            response: EventMeetLevelRoutines
        })
    }


    _p.getEventMeetRoutines = function(req, res, next) {
        //var query ={};

        var query = [{
                    $match: {
                        $and: [{ deleted: false }, { eventMeetId: req.params.eventmeetId }, { "routinestatus": "1" }]
                    }

                },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "uid",
                        foreignField: "Flyp10UserID",
                        as: "MemberInfo"
                    }
                },

                { "$unwind": "$MemberInfo" },

                {
                    $lookup: {
                        from: "Flyp10_User",
                        localField: "uid",
                        foreignField: "_id",
                        as: "userInfo"
                    }
                },

                { "$unwind": "$userInfo" },


            ]
            //console.log(query, 'query')
            //query.eventMeetId = req.params.eventmeetId;
        Routine.aggregate(query, async function(err, response) {
            if (!err) {
                if (response.length > 0) {
                    //console.log(response[0])
                    var length = response.length
                    console.log(length)
                    for (var i = 0; i < length; i++) {
                        //console.log(i)
                        var USAGclubInfo = await getClubInfoForUSAGMember(response[i].SanctionID, response[i].MemberInfo.MemberID);
                        //  console.log(clubInfo, "clubInfo", i, response.length)
                        response[i].USAGclubInfo = USAGclubInfo;
                        if (i == response.length - 1) {
                            res.json({
                                success: true,
                                data: response
                            })
                        }

                    }
                } else {
                    res.json({
                        success: true,
                        data: response
                    })
                }

            } else {
                res.json({
                    success: false,
                    msg: "Unable to load event meet routines.",
                    err: err
                })
            }

        })
    }

    _p.getEventlevelRoutines = function(req, res, next) {
        //var query ={};

        var query = [{
                    $match: {
                        $and: [{ deleted: false }, { eventMeetId: req.params.eventmeetId }, { "routinestatus": "1" }, { lid: mongoose.Types.ObjectId(req.query.lid) }, { eid: mongoose.Types.ObjectId(req.query.eid) }]
                    }

                },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "uid",
                        foreignField: "Flyp10UserID",
                        as: "MemberInfo"
                    }
                },

                { "$unwind": "$MemberInfo" },

                {
                    $lookup: {
                        from: "Flyp10_User",
                        localField: "uid",
                        foreignField: "_id",
                        as: "userInfo"
                    }
                },

                { "$unwind": "$userInfo" },
            ]
            //console.log(query, 'query')
            //query.eventMeetId = req.params.eventmeetId;
        Routine.aggregate(query, async function(err, response) {
            if (!err) {
                if (response.length > 0) {
                    console.log(response[0])
                    var length = response.length
                    console.log(length)
                    for (var i = 0; i < length; i++) {
                        console.log(i)
                        var USAGclubInfo = await getClubInfoForUSAGMember(response[i].SanctionID, response[i].MemberInfo.MemberID);
                        //  console.log(clubInfo, "clubInfo", i, response.length)
                        response[i].USAGclubInfo = USAGclubInfo;
                        if (i == response.length - 1) {
                            res.json({
                                success: true,
                                data: response
                            })
                        }

                    }
                } else {
                    res.json({
                        success: true,
                        data: response
                    })
                }

            } else {
                res.json({
                    success: false,
                    msg: "Unable to load event meet routines.",
                    err: err
                })
            }

        })
    }

    function getAssignedRoutineForSwapFromJudge(obj) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [{ judged: false }, { judgePanel: obj.panel }, { judgeId: mongoose.Types.ObjectId(obj.judgeIdChangeFrom), eventId: mongoose.Types.ObjectId(obj.eventmeetId) }]
                    }

                },
                {
                    $lookup: {
                        from: "Routine",
                        let: { routineId: "$routineId" },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$routineId"] },
                                            { $eq: ["$lid", mongoose.Types.ObjectId(obj.levelId)] },
                                            { $eq: ["$eid", mongoose.Types.ObjectId(obj.eventId)] },
                                            { $eq: ["$sid", mongoose.Types.ObjectId(obj.sportId)] },

                                        ]
                                    }
                                }
                            },

                        ],
                        as: "routineInfo"
                    }
                },
                { "$unwind": "$routineInfo" },
            ]

            dataProviderHelper.aggregate(EventMeetForJudges, query).then((response) => {
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
                }

            })
        })

    }

    _p.swapJudgesForEventmeetByEventLevel = async function(req, res, next) {

        var swapjudge = EventModule.CreateEventMeetSwapJudge(req.body, req.decoded.user.username)
        dataProviderHelper.save(swapjudge);
        var SwapRoutineFromAssignedJudges = await getAssignedRoutineForSwapFromJudge(req.body);
        if (SwapRoutineFromAssignedJudges.length > 0) {
            for (var i = 0; i < SwapRoutineFromAssignedJudges.length; i++) {
                let update = {
                    $set: {
                        "judgeId": mongoose.Types.ObjectId(req.body.judgeIdChangeTo),
                        SwapjudgeIdFrom: mongoose.Types.ObjectId(req.body.judgeIdChangeFrom),
                        isSwappedJudge: true
                    }
                }
                let Query = { _id: mongoose.Types.ObjectId(SwapRoutineFromAssignedJudges[i]._id) }
                dataProviderHelper.updateMany(EventMeetForJudges, Query, update);
                console.log(i, SwapRoutineFromAssignedJudges.length)
                if (i == SwapRoutineFromAssignedJudges.length - 1) {
                    res.json({
                        success: true,
                        message: "Judge swapped successfully"
                    })
                }
            }
        } else {
            res.json({
                success: true,
                message: "Judge swapped successfully"
            })
        }

    }

    function getRoutineByEventAthlete(uid) {
        return new Promise((resolve, reject) => {
            var query = {
                // eid: mongoose.Types.ObjectId(eid),
                uid: mongoose.Types.ObjectId(uid),
                deleted: false
            }
            dataProviderHelper.find(Routine, query).then((routine) => {
                if (routine.length > 0) {
                    resolve(routine)
                } else {
                    resolve()
                }
            })
        })


    }

    function getSportEventInfo(eventId) {
        return new Promise((resolve, reject) => {
            var query = {
                _id: mongoose.Types.ObjectId(eventId)
            }
            dataProviderHelper.findOne(SportEvent, query).then((res) => {

                resolve(res)

            })
        })
    }

    function getEventMeetSportEventInfo(events) {
        return new Promise(async(resolve, reject) => {
            var eventInfo = []
            for (var i = 0; i < events.length; i++) {
                var event = await getSportEventInfo(events[i])
                eventInfo.push(event)
                if (i == events.length - 1) {
                    resolve(eventInfo)
                }
            }
        })
    }
    _p.getAthleteCoachRoutinesByEvent = async function(req, res, next) {
        var eventmeetId = req.query.eventmeetId;
        var sanctionId = req.query.sanctionId
        var eventmeet = await getEventmeetbyID(eventmeetId);
        var athlete = await getSanctionAthleteInfo(sanctionId, eventmeetId);
        athlete = _.uniqBy(athlete, 'USAGID')
        var events = await getEventMeetSportEventInfo(eventmeet.Events)
        var athleteInfo = []
        for (var i = 0; i < athlete.length; i++) {
            var data = athlete[i]
                //console.log(athlete[i].Name)
            for (var j = 0; j < events.length; j++) {
                if (athlete[i].routine.length > 0) {
                    var routine = athlete[i].routine
                    var eventroutine = routine.filter((routine) => routine.eid.toString() == events[j]._id.toString())

                    if (eventroutine.length > 0) {
                        data[events[j]._id] = eventroutine[0].routinestatus
                    } else {
                        data[events[j]._id] = '-1'
                    }
                } else {
                    data[events[j]._id] = '-1'
                }
                if (j == events.length - 1) {
                    athleteInfo.push(data)
                }

            }
            if (i == athlete.length - 1) {
                res.json({
                    success: true,
                    result: athleteInfo
                })
            }
        }



    }
    _p.getEventMeetSportEventInfobyId = async function(req, res, next) {
        var eventmeetId = req.params.eventmeetId;

        var eventmeet = await getEventmeetbyID(eventmeetId);
        var events = await getEventMeetSportEventInfo(eventmeet.Events)
        res.json({
            success: true,
            result: events
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
        //  generatepdf:_p.generatepdf,
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
        sendNotification: _p.sendNotification,
        getSanctionEventMeet: _p.getSanctionEventMeet,
        getEventMeetByCreatedby: _p.getEventMeetByCreatedby,
        getEventMeetbyCreatedBySanctionID: _p.getEventMeetbyCreatedBySanctionID,
        getEventMeetbyid: _p.getEventMeetbyid,
        postEventmeetJudgesBypanel: _p.postEventmeetJudgesBypanel,
        getEventmeetJudgesBypanel: _p.getEventmeetJudgesBypanel,
        getEventMeetRoutines: _p.getEventMeetRoutines,
        getEventlevelRoutines: _p.getEventlevelRoutines,
        getEventmeetRoutineJudgesbyPanel: _p.getEventmeetRoutineJudgesbyPanel,
        getEventmeetJudgespanelByeventmeetId: _p.getEventmeetJudgespanelByeventmeetId,
        sendStartCodeToUSAGMappedCompetitors: _p.sendStartCodeToUSAGMappedCompetitors,
        getEventMeetForMapByCreatedBy: _p.getEventMeetForMapByCreatedBy,
        getSanctionCoachesAthletes: _p.getSanctionCoachesAthletes,
        getRankingForEventMeet: _p.getRankingForEventMeet,
        mappedEventmeetCompetitorsWithScore: _p.mappedEventmeetCompetitorsWithScore,
        getRankingbyEventLevel: _p.getRankingbyEventLevel,
        getRankingForEventMeetlevel: _p.getRankingForEventMeetlevel,
        getRankingForEventMeetAlllevel: _p.getRankingForEventMeetAlllevel,
        getSanctionEventMeetByMemberID: _p.getSanctionEventMeetByMemberID,
        swapJudgesForEventmeetByEventLevel: _p.swapJudgesForEventmeetByEventLevel,
        getSanctionEventMeetForMeetDirectorAdmin: _p.getSanctionEventMeetForMeetDirectorAdmin,
        getAthleteCoachRoutinesByEvent: _p.getAthleteCoachRoutinesByEvent,
        getEventMeetSportEventInfobyId: _p.getEventMeetSportEventInfobyId,
        updateroutinejudgedStatus: _p.updateroutinejudgedStatus,
        mappedEventMeetCoachInfo: _p.mappedEventMeetCoachInfo,
        downloadEventmeetScoreBylevel: _p.downloadEventmeetScoreBylevel,
        getAllStartedEventMeet: _p.getAllStartedEventMeet


    };

})();

module.exports = eventController;