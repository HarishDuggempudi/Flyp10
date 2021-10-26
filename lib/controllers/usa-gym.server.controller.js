const { data } = require('jquery');

var usagGymController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        collectionConfig = require('../configs/collection.config'),
        json2csv = require('json2csv').parse,
        xml2js = require('xml2js'),
        moment = require('moment'),
        HTTPStatus = require('http-status'),
        User = require('../models/user.server.model'),
        Promise = require("bluebird"),
        fs = Promise.promisifyAll(require('fs')),
        Sanction = require('../models/eventmeet-sanction.model'),
        Reservation = require('../models/eventmeet-reservations.model'),
        Judges = require("../models/USAG-Judges-Reservation.model"),
        Flyp10APIUser = require("../models/flyp10.api.user.model"),
        applicationConfig = require('../configs/application.config'),
        AthleteReservation = require('../models/eventmeet-athlete-reservation.model'),
        AthleteGroupReservation = require('../models/eventmeet-athletegroup-reservation.model'),
        CoachReservation = require('../models/eventmeet-coach-reservation.model'),
        messageConfig = require('../configs/api.message.config'),
        SanctionApparatus = require('../models/sanction-apparatus.model'),
        SanctionApparatusLimit = require('../models/sanction.apparatuslimit.model'),
        SanctionLevelLimit = require('../models/sanction.levellimit.model'),
        USAGMemberVerification = require('../models/USAG-membership-verification.model'),
        USAGAPIRequest = require('../models/USAG-Sanction-Reservation-API-Request.model'),
        USAGScoringAPIRequest = require('../models/USAG-Scoring-API-Request.model'),
        utilityHelper = require('../helpers/utilities.helper'),
        _ = require('lodash'),
        SanctionAdministrator = require('../models/sanction-administrators.model'),
        EnrollEventMeetModel = require('../models/enroll.mode'),
        EventMeetCoachMapping = require("../models/eventmeetcoachmapping.server.model.js"),
        EventMeetModel = require('../models/eventmeet.model'),
        hasher = require('../auth/hasher'),
        Promise = require("bluebird"),
        Routine = require('../models/routine.server.model')
        // fs= Promise.promisifyAll(require('fs'))

    var request = require('request');
    var mongoose = require('mongoose');

    function APIModule() {}
    var _p = APIModule.prototype;
    APIModule.CreateSanction = function(sanctionObj, arrayObj) {
        var newSanctionInfo = new Sanction();
        newSanctionInfo.SanctionID = sanctionObj.SanctionID;
        newSanctionInfo.Name = sanctionObj.Name ? sanctionObj.Name : '';
        newSanctionInfo.MeetDirectorID = sanctionObj.MeetDirectorID ? sanctionObj.MeetDirectorID : '';
        newSanctionInfo.MeetDirectorName = sanctionObj.MeetDirectorName ? sanctionObj.MeetDirectorName : "";
        newSanctionInfo.MeetDirectorEmail = sanctionObj.MeetDirectorEmail ? sanctionObj.MeetDirectorEmail : '';
        newSanctionInfo.OrganizationID = sanctionObj.OrganizationID ? sanctionObj.OrganizationID : '';
        newSanctionInfo.Organization = sanctionObj.Organization ? sanctionObj.Organization : '';
        newSanctionInfo.DisciplineType = sanctionObj.DisciplineType ? sanctionObj.DisciplineType : '';
        newSanctionInfo.TypeOfMeet = sanctionObj.TypeOfMeet ? sanctionObj.TypeOfMeet : '';
        newSanctionInfo.AllowsInternational = sanctionObj.AllowsInternational ? sanctionObj.AllowsInternational : '0';
        newSanctionInfo.Levels = arrayObj.Levels ? arrayObj.Levels : [];
        newSanctionInfo.CompetitionStartDate = sanctionObj.CompetitionStartDate ? sanctionObj.CompetitionStartDate : '';
        newSanctionInfo.CompetitionEndDate = sanctionObj.CompetitionEndDate ? sanctionObj.CompetitionEndDate : '';
        newSanctionInfo.SiteName = sanctionObj.SiteName ? sanctionObj.SiteName : '';
        newSanctionInfo.SiteAddress1 = sanctionObj.SiteAddress1 ? sanctionObj.SiteAddress1 : '';
        newSanctionInfo.SiteAddress2 = sanctionObj.SiteAddress2 ? sanctionObj.SiteAddress2 : '';
        newSanctionInfo.SiteState = sanctionObj.SiteState ? sanctionObj.SiteState : '';
        newSanctionInfo.SiteCity = sanctionObj.SiteCity ? sanctionObj.SiteCity : '';
        newSanctionInfo.SiteZip = sanctionObj.SiteZip ? sanctionObj.SiteZip : '';
        newSanctionInfo.ReservationPeriodOpens = sanctionObj.ReservationPeriodOpens ? sanctionObj.ReservationPeriodOpens : '';
        newSanctionInfo.ReservationPeriodCloses = sanctionObj.ReservationPeriodCloses ? sanctionObj.ReservationPeriodCloses : '';
        newSanctionInfo.LevelChangeCloseDate = sanctionObj.LevelChangeCloseDate ? sanctionObj.LevelChangeCloseDate : '';
        newSanctionInfo.CancellationCloseDate = sanctionObj.CancellationCloseDate ? sanctionObj.CancellationCloseDate : '';
        newSanctionInfo.Website = sanctionObj.Website;
        newSanctionInfo.TimeStamp = sanctionObj.TimeStamp;

        return newSanctionInfo;
    };
    APIModule.CreateEventMeeetCoachMapping = function(eventObj) {
        var neweventInfo = new EventMeetCoachMapping();
        neweventInfo.eventId = eventObj.eventId;
        neweventInfo.userId = eventObj.userId;
        neweventInfo.active = eventObj.active;
        neweventInfo.addedBy = eventObj.addedBy;
        neweventInfo.addedOn = new Date();
        return neweventInfo;
    };
    APIModule.CreateApparatus = function(apparatusObj, sanctionID, SID) {
        var newapparatus = new SanctionApparatus()
        newapparatus.SanctionID = sanctionID;
        newapparatus.SID = SID;
        newapparatus.Name = apparatusObj.Name;
        newapparatus.Levels = apparatusObj.Levels;
        return newapparatus;

    }
    APIModule.CreateLevelLimit = function(levellimitObj, sanctionID, SID) {
        var newlevellimit = new SanctionLevelLimit()
        newlevellimit.SanctionID = sanctionID;
        newlevellimit.SID = SID;
        newlevellimit.Name = levellimitObj.Name;
        newlevellimit.LevelName = levellimitObj.LevelName;
        newlevellimit.MaxParticipants = levellimitObj.MaxParticipants ? levellimitObj.MaxParticipants : null;
        return newlevellimit;
    }
    APIModule.CreateenrollEventMeet = function(eventObj) {

        var neweventInfo = new EnrollEventMeetModel();
        neweventInfo.eventMeetId = eventObj._id
        neweventInfo.judgeId = eventObj.Judges
        neweventInfo.sportId = eventObj.Sport
        neweventInfo.eventId = eventObj.Events
        neweventInfo.levelId = eventObj.Levels
        neweventInfo.userId = eventObj.userId
        return neweventInfo;
    };
    APIModule.CreateApparatusLimit = function(apparatuslimitObj, sanctionID, SID) {
        var newapparatuslimit = new SanctionApparatusLimit()
        newapparatuslimit.SanctionID = sanctionID;
        newapparatuslimit.SID = SID;
        newapparatuslimit.Name = apparatuslimitObj.Name;
        newapparatuslimit.MaxParticipants = apparatuslimitObj.MaxParticipants ? apparatuslimitObj.MaxParticipants : null;
        return newapparatuslimit;
    }
    APIModule.CreateSanctionAdministrators = function(administratorsbj, sanctionID, SID) {
        var newadministrators = new SanctionAdministrator()
        newadministrators.SanctionID = sanctionID;
        newadministrators.AdminID = administratorsbj.AdminID;
        newadministrators.AdminFirstName = administratorsbj.AdminFirstName ? administratorsbj.AdminFirstName : '';
        newadministrators.AdminLastName = administratorsbj.AdminLastName ? administratorsbj.AdminLastName : '';
        newadministrators.AdminEmail = administratorsbj.AdminEmail ? administratorsbj.AdminEmail : '';

        return newadministrators;
    }
    APIModule.CreateReservation = function(reservationObj) {
        var newReservationInfo = new Reservation();
        newReservationInfo.SanctionID = reservationObj.SanctionID ? reservationObj.SanctionID : '';
        newReservationInfo.ClubUSAGID = reservationObj.ClubUSAGID ? reservationObj.ClubUSAGID : '';
        newReservationInfo.ClubName = reservationObj.ClubName ? reservationObj.ClubName : '';
        newReservationInfo.ClubAbbreviation = reservationObj.ClubAbbreviation ? reservationObj.ClubAbbreviation : '';
        newReservationInfo.ClubInternational = reservationObj.ClubInternational ? reservationObj.ClubInternational : '0';
        newReservationInfo.ClubContactUSAGID = reservationObj.ClubContactUSAGID ? reservationObj.ClubContactUSAGID : '';
        newReservationInfo.ClubContactEmail = reservationObj.ClubContactEmail ? reservationObj.ClubContactEmail : '';
        newReservationInfo.ClubContactPhone = reservationObj.ClubContactPhone ? reservationObj.ClubContactPhone : '';
        newReservationInfo.ClubMeetContactUSAGID = reservationObj.ClubMeetContactUSAGID ? reservationObj.ClubMeetContactUSAGID : '';
        newReservationInfo.ClubMeetContact = reservationObj.ClubMeetContact ? reservationObj.ClubMeetContact : '';
        newReservationInfo.ClubMeetContactEmail = reservationObj.ClubMeetContactEmail ? reservationObj.ClubMeetContactEmail : '';
        newReservationInfo.ClubMeetContactPhone = reservationObj.ClubMeetContactPhone ? reservationObj.ClubMeetContactPhone : '';
        newReservationInfo.ClubStreetAddress1 = reservationObj.ClubStreetAddress1 ? reservationObj.ClubStreetAddress1 : '';
        newReservationInfo.ClubStreetAddress2 = reservationObj.ClubStreetAddress2 ? reservationObj.ClubStreetAddress2 : '';
        newReservationInfo.ClubStreetCity = reservationObj.ClubStreetCity ? reservationObj.ClubStreetCity : '';
        newReservationInfo.ClubStreetState = reservationObj.ClubStreetState ? reservationObj.ClubStreetState : '';
        newReservationInfo.ClubStreetZip = reservationObj.ClubStreetZip ? reservationObj.ClubStreetZip : '';
        newReservationInfo.ClubStreetCountry = reservationObj.ClubStreetCountry ? reservationObj.ClubStreetCountry : '';
        newReservationInfo.TimeStamp = reservationObj.TimeStamp;
        return newReservationInfo;

    }
    APIModule.CreateJudgesReservation = function(judgesObj, SanctionID) {
        var newJudgesInfo = new Judges();
        newJudgesInfo.SanctionID = SanctionID ? SanctionID : '';
        newJudgesInfo.ReservationID = judgesObj.ReservationID ? judgesObj.ReservationID : '';
        newJudgesInfo.FirstName = judgesObj.FirstName ? judgesObj.FirstName : '';
        newJudgesInfo.LastName = judgesObj.LastName ? judgesObj.LastName : '';
        newJudgesInfo.USAGID = judgesObj.USAGID ? judgesObj.USAGID : '';
        newJudgesInfo.InternationalMember = judgesObj.InternationalMember ? judgesObj.InternationalMember : '0';
        newJudgesInfo.MemberType = judgesObj.MemberType ? judgesObj.MemberType : '';
        newJudgesInfo.ScratchDate = judgesObj.ScratchDate ? judgesObj.ScratchDate : '';
        newJudgesInfo.Discipline = judgesObj.Discipline ? judgesObj.Discipline : [];
        newJudgesInfo.TimeStamp = judgesObj.TimeStamp;
        return newJudgesInfo;
    }
    APIModule.CreateAthleteReservation = function(reservationObj, SanctionID, EventMeetReservationID) {
        var newAthleteReservationInfo = new AthleteReservation();
        newAthleteReservationInfo.MeetReservationID = EventMeetReservationID ? EventMeetReservationID : '';
        newAthleteReservationInfo.SanctionID = SanctionID ? SanctionID : '';
        newAthleteReservationInfo.ReservationID = reservationObj.ReservationID ? reservationObj.ReservationID : '';
        newAthleteReservationInfo.Name = reservationObj.Name ? reservationObj.Name : '';
        newAthleteReservationInfo.FirstName = reservationObj.FirstName ? reservationObj.FirstName : '';
        newAthleteReservationInfo.LastName = reservationObj.LastName ? reservationObj.LastName : '';
        newAthleteReservationInfo.USAGID = reservationObj.USAGID ? reservationObj.USAGID : '';
        newAthleteReservationInfo.Gender = reservationObj.Gender ? reservationObj.Gender : '';
        newAthleteReservationInfo.DOB = reservationObj.DOB ? reservationObj.DOB : '';
        newAthleteReservationInfo.InternationalMember = reservationObj.InternationalMember ? reservationObj.InternationalMember : '0';
        newAthleteReservationInfo.USCitizen = reservationObj.USCitizen ? reservationObj.USCitizen : '0';
        newAthleteReservationInfo.MemberType = reservationObj.MemberType ? reservationObj.MemberType : '';
        newAthleteReservationInfo.Apparatus = reservationObj.Apparatus ? reservationObj.Apparatus : '';
        newAthleteReservationInfo.Level = reservationObj.Level ? reservationObj.Level : '';
        newAthleteReservationInfo.AgeGroup = reservationObj.AgeGroup ? reservationObj.AgeGroup : '';
        newAthleteReservationInfo.ScratchDate = reservationObj.ScratchDate ? reservationObj.ScratchDate : '';


        return newAthleteReservationInfo;
    }
    APIModule.CreateUSAGMemberVerification = function(obj) {
        var newUSAGMemberVerificationInfo = new USAGMemberVerification();
        newUSAGMemberVerificationInfo.MemberID = obj.MemberID ? obj.MemberID : '';
        newUSAGMemberVerificationInfo.FirstName = obj.FirstName ? obj.FirstName : '';
        newUSAGMemberVerificationInfo.LastName = obj.LastName ? obj.LastName : '';
        newUSAGMemberVerificationInfo.USCitizen = obj.USCitizen ? obj.USCitizen : '';
        newUSAGMemberVerificationInfo.DOB = obj.DOB ? obj.DOB : '';
        newUSAGMemberVerificationInfo.ClubID = obj.ClubID ? obj.ClubID : [];
        newUSAGMemberVerificationInfo.ClubAbbrev = obj.ClubAbbrev ? obj.ClubAbbrev : [];
        newUSAGMemberVerificationInfo.ClubName = obj.ClubName ? obj.ClubName : [];
        newUSAGMemberVerificationInfo.ClubStatus = obj.ClubStatus ? obj.ClubStatus : [];
        newUSAGMemberVerificationInfo.InternationalClub = obj.InternationalClub ? obj.InternationalClub : [];
        newUSAGMemberVerificationInfo.MemberType = obj.MemberType ? obj.MemberType : '';
        newUSAGMemberVerificationInfo.Discipline = obj.Discipline ? obj.Discipline : [];
        newUSAGMemberVerificationInfo.Level = obj.Level ? obj.Level : '';
        newUSAGMemberVerificationInfo.InternationalMember = obj.InternationalMember ? obj.InternationalMember : '';
        newUSAGMemberVerificationInfo.Eligible = obj.Eligible ? obj.Eligible : '';
        newUSAGMemberVerificationInfo.IneligibleReason = obj.IneligibleReason ? obj.IneligibleReason : '';
        newUSAGMemberVerificationInfo.Flyp10UserID = obj.Flyp10UserID ? obj.Flyp10UserID : '';
        newUSAGMemberVerificationInfo.Email = obj.Email ? obj.Email : ""
            //console.log(newUSAGMemberVerificationInfo, "new")
        return newUSAGMemberVerificationInfo;
    }
    APIModule.CreateUSAGAPIRequestDetails = function(obj, URL) {
        var newUSAGAPIRequestInfo = new USAGAPIRequest();
        newUSAGAPIRequestInfo.Requestbody = obj ? JSON.stringify(obj) : '';
        newUSAGAPIRequestInfo.RequestURL = URL ? URL : '';
        return newUSAGAPIRequestInfo;
    }
    APIModule.CreateUSAGScoreAPIRequestDetails = function(sanctionId, apirequest, data) {
        var newUSAGScoreAPIRequestInfo = new USAGScoringAPIRequest();
        newUSAGScoreAPIRequestInfo.Requestbody = data ? JSON.stringify(data) : '';
        newUSAGScoreAPIRequestInfo.RequestURL = apirequest ? apirequest : '';
        newUSAGScoreAPIRequestInfo.SanctionID = sanctionId ? sanctionId : '';
        return newUSAGScoreAPIRequestInfo;
    }
    APIModule.CreateAthleteGroupReservation = function(reservationObj, SanctionID, EventMeetReservationID) {
        var newAthleteGroupReservationInfo = new AthleteGroupReservation();
        newAthleteGroupReservationInfo.MeetReservationID = EventMeetReservationID ? EventMeetReservationID : '';
        newAthleteGroupReservationInfo.SanctionID = SanctionID ? SanctionID : '';
        newAthleteGroupReservationInfo.ReservationID = reservationObj.ReservationID ? reservationObj.ReservationID : '';
        newAthleteGroupReservationInfo.Name = reservationObj.Name ? reservationObj.Name : '';
        newAthleteGroupReservationInfo.USAGID = reservationObj.USAGID ? reservationObj.USAGID : '';
        newAthleteGroupReservationInfo.InternationalMember = reservationObj.InternationalMember ? reservationObj.InternationalMember : '0';
        newAthleteGroupReservationInfo.Type = reservationObj.Type ? reservationObj.Type : '';
        newAthleteGroupReservationInfo.Apparatus = reservationObj.Apparatus ? reservationObj.Apparatus : '';
        newAthleteGroupReservationInfo.Level = reservationObj.Level ? reservationObj.Level : '';
        newAthleteGroupReservationInfo.AgeGroup = reservationObj.AgeGroup ? reservationObj.AgeGroup : '';
        newAthleteGroupReservationInfo.ScratchDate = reservationObj.ScratchDate ? reservationObj.ScratchDate : '';
        return newAthleteGroupReservationInfo;
    }
    APIModule.CreateCoachReservation = function(reservationObj, SanctionID, EventMeetReservationID) {
        var newCoachReservationInfo = new CoachReservation();
        newCoachReservationInfo.MeetReservationID = EventMeetReservationID ? EventMeetReservationID : '';
        newCoachReservationInfo.SanctionID = SanctionID ? SanctionID : '';
        newCoachReservationInfo.ReservationID = reservationObj.ReservationID ? reservationObj.ReservationID : '';
        newCoachReservationInfo.Name = reservationObj.Name ? reservationObj.Name : '';
        newCoachReservationInfo.FirstName = reservationObj.FirstName ? reservationObj.FirstName : '';
        newCoachReservationInfo.LastName = reservationObj.LastName ? reservationObj.LastName : '';
        newCoachReservationInfo.USAGID = reservationObj.USAGID ? reservationObj.USAGID : '';
        newCoachReservationInfo.InternationalMember = reservationObj.InternationalMember ? reservationObj.InternationalMember : '0';
        newCoachReservationInfo.MemberType = reservationObj.MemberType ? reservationObj.MemberType : '';
        newCoachReservationInfo.Discipline = reservationObj.Discipline ? reservationObj.Discipline : [];
        newCoachReservationInfo.ScratchDate = reservationObj.ScratchDate ? reservationObj.ScratchDate : '';

        return newCoachReservationInfo;
    }

    _p.removeSanctionData = function(req, res, next) {
        req.sanctionData.deleted = true;
        req.sanctionData.deletedOn = new Date();
        req.sanctionData.TimeStamp = req.body.TimeStamp
        return dataProviderHelper.save(req.sanctionData)
            // var sanction = req.body.Sanction;
            // var query = {
            //     SanctionID: sanction.SanctionID,
            // };
            // //console.log(query)
            // return dataProviderHelper.removeModelData(Sanction, query)
    }

    _p.getSanctionData = function(req, res, next) {
        var sanction = req.body.Sanction;
        var query = {
            SanctionID: sanction.SanctionID,
        };
        return dataProviderHelper.findOne(Sanction, query)
    }
    _p.postSanctionData = function(req, res, next) {

        var sanctionObj = req.body.Sanction;
        var ExistingFlyp10User = []
        var NonExistingFlyp10User = [];
        let query = {}
        query.SanctionID = sanctionObj.SanctionID
        query.deleted = false
        return dataProviderHelper.checkForDuplicateEntry(Sanction, query).then(async function(count) {
                var responsedata;
                if (count > 0) {
                    responsedata = {
                        success: false,
                        message: messageConfig.USAGYMAPI.alreadySanctionExists,
                        errorcode: HTTPStatus.CONFLICT
                    }
                    return responsedata
                        //  throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.USAGYMAPI.alreadySanctionExists + '"}');
                } else {
                    var Apparatuses = sanctionObj.Apparatuses;
                    var ApparatusesArr = []
                    var Levels;
                    var isFlyp10 = await checkUSAGMemberInFlyp10(sanctionObj.MeetDirectorID)
                    if (isFlyp10) {
                        ExistingFlyp10User.push(sanctionObj.MeetDirectorID)
                    } else {
                        NonExistingFlyp10User.push(sanctionObj.MeetDirectorID)
                    }
                    if (sanctionObj.Levels && sanctionObj.Levels.Add) {
                        Levels = sanctionObj.Levels.Add;
                    }

                    let arrayObj = {
                        Levels: Levels
                    }
                    sanctionObj.TimeStamp = req.body.TimeStamp;
                    if (sanctionObj.Administrators && sanctionObj.Administrators.Add) {
                        var Administrators = sanctionObj.Administrators.Add
                        for (var i = 0; i < Administrators.length; i++) {
                            var isFlyp10 = await checkUSAGMemberInFlyp10(Administrators[i].AdminID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(Administrators[i].AdminID)
                                    //console.log(ExistingFlyp10User)
                            } else {
                                NonExistingFlyp10User.push(Administrators[i].AdminID)
                                    //console.log(ExistingFlyp10User)
                            }
                            _p.postAdministrators(Administrators[i], sanctionObj.SanctionID)
                        }
                    }
                    var newSanction = APIModule.CreateSanction(sanctionObj, arrayObj);
                    //  //console.log('PASSWORD CHECK ', newSanction);
                    dataProviderHelper.save(newSanction).then(async(sanction) => {
                        if (Apparatuses && Apparatuses.Add) {

                            if (Array.isArray(Apparatuses.Add)) {
                                for (var i = 0; i < Apparatuses.Add.length; i++) {
                                    await addapparatuses(Apparatuses.Add[i], sanction)
                                }
                            } else {
                                await addapparatuses(Apparatuses.Add, sanction)
                            }
                        }

                        if (sanctionObj.LevelLimits && sanctionObj.LevelLimits.Add) {
                            var LevelLimits = sanctionObj.LevelLimits.Add
                            for (var name in LevelLimits) {

                                for (var levelname in LevelLimits[name]) {
                                    let data = {
                                        Name: name,
                                        LevelName: levelname,
                                        MaxParticipants: LevelLimits[name][levelname]
                                    }
                                    _p.postLevelLimits(data, sanction.SanctionID, sanction._id)
                                }
                            }

                        }

                        if (sanctionObj.ApparatusLimits && sanctionObj.ApparatusLimits.Add) {
                            var ApparatusLimits = sanctionObj.ApparatusLimits.Add;
                            for (var name in ApparatusLimits) {
                                let data = {
                                    Name: name,
                                    MaxParticipants: ApparatusLimits[name]
                                }
                                _p.postApparatusLimits(data, sanction.SanctionID, sanction._id)
                            }

                        }



                    })

                    responsedata = {
                        success: true,
                        ExistingFlyp10User: ExistingFlyp10User,
                        NonExistingFlyp10User: NonExistingFlyp10User
                    }
                    return responsedata
                }
            })
            .catch(function(err) {
                return next(err);
            });
    };

    function addapparatuses(appratus, sanction) {
        return new Promise((resolve, reject) => {
            for (var app in appratus) {
                let ApparatusesName = appratus[app];
                if (ApparatusesName.Levels.Add) {
                    let data = {
                        Name: app,
                        Levels: ApparatusesName.Levels.Add
                    }
                    _p.postApparatuses(data, sanction.SanctionID, sanction._id);
                    resolve()
                }
            }
        })

    }

    function removeappratus(apparatus, sanctionObj) {
        return new Promise((resolve, reject) => {
            for (var app in apparatus) {
                let ApparatusesName = apparatus[app];
                //if levels is not present,whole apparatus will be removed
                if (!ApparatusesName.Levels) {
                    _p.removeSanctionApparatus(app, sanctionObj)
                }
                var query = {}
                query.Name = app;
                query.SID = mongoose.Types.ObjectId(sanctionObj._id);
                dataProviderHelper.findOne(SanctionApparatus, query).then((apparatusObj) => {
                    //levels remove in apparartus
                    if (ApparatusesName.Levels && ApparatusesName.Levels.Remove) {
                        for (var i = 0; i < ApparatusesName.Levels.Remove.length; i++) {
                            var index = apparatusObj.Levels.findIndex(e => e === ApparatusesName.Levels.Remove[i]);
                            if (index != -1) {
                                apparatusObj.Levels.splice(index, 1);
                                if (i == ApparatusesName.Levels.Remove.length - 1) {
                                    dataProviderHelper.save(apparatusObj);
                                }
                            }
                        }
                    }
                    //levels add in apparatus
                    if (ApparatusesName.Levels && ApparatusesName.Levels.Add) {
                        for (var i = 0; i < ApparatusesName.Levels.Add.length; i++) {
                            apparatusObj.Levels.push(ApparatusesName.Levels.Add[i]);
                            dataProviderHelper.save(apparatusObj);
                        }
                    }
                    resolve();
                })



            }
        })
    }

    function updateappratus(apparatus, sanctionObj) {
        return new Promise((resolve, reject) => {
            for (var app in apparatus) {

                let ApparatusesName = apparatus[app];
                var query = {}
                query.Name = app;
                query.SID = mongoose.Types.ObjectId(sanctionObj._id);
                dataProviderHelper.findOne(SanctionApparatus, query).then((apparatusObj) => {
                    // remove the levels in apparatus
                    if (ApparatusesName.Levels && ApparatusesName.Levels.Remove) {
                        for (var i = 0; i < ApparatusesName.Levels.Remove.length; i++) {
                            var index = apparatusObj.Levels.findIndex(e => e === ApparatusesName.Levels.Remove[i]);
                            if (index != -1) {
                                apparatusObj.Levels.splice(index, 1);
                                if (i == ApparatusesName.Levels.Remove.length - 1) {
                                    dataProviderHelper.save(apparatusObj);
                                }
                            }
                        }
                    }
                    // add the levels in apparatus
                    if (ApparatusesName.Levels && ApparatusesName.Levels.Add) {

                        for (var i = 0; i < ApparatusesName.Levels.Add.length; i++) {
                            apparatusObj.Levels.push(ApparatusesName.Levels.Add[i]);
                            if (i == ApparatusesName.Levels.Add.length - 1) {
                                dataProviderHelper.save(apparatusObj);
                            }

                        }

                    }
                    resolve()
                })

            }
        })
    }
    _p.postLevelLimits = function(data, SanctionID, SID) {

        var newlevellimit = APIModule.CreateLevelLimit(data, SanctionID, SID);
        return dataProviderHelper.save(newlevellimit);


    }
    _p.postApparatusLimits = function(data, SanctionID, SID) {
        var newapparatuslimit = APIModule.CreateApparatusLimit(data, SanctionID, SID);
        return dataProviderHelper.save(newapparatuslimit);
    }
    _p.postAdministrators = function(data, SanctionID) {
        var newAdministrators = APIModule.CreateSanctionAdministrators(data, SanctionID);
        return dataProviderHelper.save(newAdministrators);
    }
    _p.updateAdministrators = function(data, SanctionID) {
        var query = {};
        query.SanctionID = SanctionID;
        query.AdminID = data.AdminID;
        //console.log(query, "query")
        dataProviderHelper.findOne(SanctionAdministrator, query).then((sanctionadmin) => {
            //console.log(sanctionadmin, "sanctionadmin")
            if (sanctionadmin) {
                sanctionadmin.AdminFirstName = data.AdminFirstName;
                sanctionadmin.AdminLastName = data.AdminLastName;
                sanctionadmin.AdminEmail = data.AdminEmail;
                dataProviderHelper.save(sanctionadmin)
            }
        })

    }
    _p.postApparatuses = function(apparatus, sanctionID, SID) {
        var newapparatus = APIModule.CreateApparatus(apparatus, sanctionID, SID);
        //console.log(newapparatus, "athleteReservationObj")
        return dataProviderHelper.save(newapparatus);
    }

    _p.postReservationData = function(req, res, next) {
        var reservation = req.body.Reservation;
        var ReservationID = [];
        var ExistingFlyp10User = [];
        var NonExistingFlyp10User = []
        let query = {}
        let sanctionID = reservation.SanctionID;
        query.SanctionID = reservation.SanctionID;
        query.ClubUSAGID = reservation.ClubUSAGID;
        return dataProviderHelper.checkForDuplicateEntry(Reservation, query).then(async function(count) {
            var responsedata;
            if (count > 0) {
                var reservation1 = await getReservationData(req, res, next)
                req.reservationData = reservation1;
                var ReservationData = await _p.updateReservationData(req, res, next)
                console.log(ReservationData, "ReservationData")
                return ReservationData;

                // responsedata = {
                //     success: false,
                //     message: messageConfig.USAGYMAPI.alreadyReservationExists,
                //     errorcode: HTTPStatus.CONFLICT
                // }
                // return responsedata
                //  throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.USAGYMAPI.alreadyReservationExists + '"}');
            } else {
                console.log(req.body.TimeStamp)
                reservation.TimeStamp = req.body.TimeStamp;

                console.log(reservation.TimeStamp)
                var newreRervation = APIModule.CreateReservation(reservation);
                var ReservationData = dataProviderHelper.save(newreRervation).then(async(reservationresponse) => {
                    //console.log(reservationresponse._id, 'reservationId')
                    var details = reservation.Details;
                    if (details) {
                        for (var type in details) {
                            let obj = details[type].Add;
                            if (type == "Coaches" && obj) {
                                for (var i = 0; i < obj.length; i++) {
                                    ReservationID.push(obj[i].ReservationID)
                                    var isFlyp10 = await checkUSAGMemberInFlyp10(obj[i].USAGID)
                                    if (isFlyp10) {
                                        ExistingFlyp10User.push(obj[i].USAGID)
                                    } else {
                                        NonExistingFlyp10User.push(obj[i].USAGID)
                                    }
                                    _p.postCoachReservation(obj[i], sanctionID, reservationresponse._id);
                                }
                            } else if (type == "Groups" && obj) {
                                for (var i = 0; i < obj.length; i++) {
                                    ReservationID.push(obj[i].ReservationID);
                                    var isFlyp10 = await checkUSAGMemberInFlyp10(obj[i].USAGID)
                                    if (isFlyp10) {
                                        ExistingFlyp10User.push(obj[i].USAGID)
                                    } else {
                                        NonExistingFlyp10User.push(obj[i].USAGID)
                                    }
                                    _p.postAthleteGroupReservation(obj[i], sanctionID, reservationresponse._id);
                                }
                            } else if (type == 'Gymnasts' && obj) {
                                for (var i = 0; i < obj.length; i++) {
                                    ReservationID.push(obj[i].ReservationID);
                                    var isFlyp10 = await checkUSAGMemberInFlyp10(obj[i].USAGID)
                                    if (isFlyp10) {
                                        ExistingFlyp10User.push(obj[i].USAGID)
                                    } else {
                                        NonExistingFlyp10User.push(obj[i].USAGID)
                                    }
                                    _p.postAthleteReservation(obj[i], sanctionID, reservationresponse._id);
                                }
                            }

                        }
                    }

                    return {
                        ReservationID: ReservationID,
                        ExistingFlyp10User: ExistingFlyp10User,
                        NonExistingFlyp10User: NonExistingFlyp10User
                    }

                });

                return ReservationData;
            }
        })

    }

    function checkUSAGMemberInFlyp10(MemberID) {
        return new Promise((resolve, reject) => {
            var query = {}
            query.MemberID = MemberID
            dataProviderHelper.findOne(USAGMemberVerification, query).then((USAGMember) => {
                if (USAGMember && USAGMember.MemberID) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }

    _p.updateReservationData = async function(req, res, next) {
        return new Promise(async function(resolve, reject) {
            var reservationObj = req.body.Reservation;
            var sanctionID = req.body.Reservation.SanctionID;
            var ReservationID = [];
            var ExistingFlyp10User = [];
            var NonExistingFlyp10User = []
                //console.log(req.reservationData, "reservation")
            var details = reservationObj.Details;
            if (details) {
                for (var type in details) {
                    let Addobj = details[type].Add;
                    let updateobj = details[type].Update;
                    let scratchObj = details[type].Scratch;
                    //console.log(updateobj, 'update')
                    if (type == "Coaches" && Addobj) {
                        for (var i = 0; i < Addobj.length; i++) {
                            ReservationID.push(Addobj[i].ReservationID);
                            var isFlyp10 = await checkUSAGMemberInFlyp10(Addobj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(Addobj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(Addobj[i].USAGID)
                            }

                            _p.postCoachReservation(Addobj[i], sanctionID, req.reservationData._id);
                        }
                    } else if (type == "Groups" && Addobj) {
                        for (var i = 0; i < Addobj.length; i++) {
                            ReservationID.push(Addobj[i].ReservationID)
                            var isFlyp10 = await checkUSAGMemberInFlyp10(Addobj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(Addobj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(Addobj[i].USAGID)
                            }
                            _p.postAthleteGroupReservation(Addobj[i], sanctionID, req.reservationData._id);
                        }
                    } else if (Addobj) {
                        for (var i = 0; i < Addobj.length; i++) {
                            ReservationID.push(Addobj[i].ReservationID)
                            var isFlyp10 = await checkUSAGMemberInFlyp10(Addobj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(Addobj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(Addobj[i].USAGID)
                            }
                            _p.postAthleteReservation(Addobj[i], sanctionID, req.reservationData._id);
                        }
                    }
                    if (type == "Coaches" && updateobj) {
                        for (var i = 0; i < updateobj.length; i++) {
                            ReservationID.push(updateobj[i].ReservationID)
                            var isFlyp10 = await checkUSAGMemberInFlyp10(updateobj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(updateobj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(updateobj[i].USAGID)
                            }
                            _p.updateCoachReservation(updateobj[i], sanctionID, req.reservationData._id);
                        }
                    } else if (type == "Groups" && updateobj) {
                        for (var i = 0; i < updateobj.length; i++) {
                            ReservationID.push(updateobj[i].ReservationID)
                            var isFlyp10 = await checkUSAGMemberInFlyp10(updateobj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(updateobj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(updateobj[i].USAGID)
                            }
                            _p.updateAthleteGroupReservation(updateobj[i], sanctionID, req.reservationData._id);
                        }
                    } else if (type == 'Gymnasts' && updateobj) {
                        //console.log(updateobj.length)
                        for (var i = 0; i < updateobj.length; i++) {
                            ReservationID.push(updateobj[i].ReservationID)
                            var isFlyp10 = await checkUSAGMemberInFlyp10(updateobj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(updateobj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(updateobj[i].USAGID)
                            }
                            _p.updateAthleteReservation(updateobj[i], sanctionID, req.reservationData._id);
                        }
                    }
                    if (type == 'Coaches' && scratchObj) {
                        for (var i = 0; i < scratchObj.length; i++) {
                            ReservationID.push(scratchObj[i].ReservationID)
                            var isFlyp10 = await checkUSAGMemberInFlyp10(scratchObj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(scratchObj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(scratchObj[i].USAGID)
                            }
                            _p.scratchCoachReservation(scratchObj[i], sanctionID, req.reservationData._id);
                        }
                    } else if (type == 'Groups' && scratchObj) {
                        for (var i = 0; i < scratchObj.length; i++) {
                            ReservationID.push(scratchObj[i].ReservationID)
                            var isFlyp10 = await checkUSAGMemberInFlyp10(scratchObj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(scratchObj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(scratchObj[i].USAGID)
                            }
                            _p.scratchAthleteGroupReservation(scratchObj[i], sanctionID, req.reservationData._id);
                        }
                    } else if (type == 'Gymnasts' && scratchObj) {
                        for (var i = 0; i < scratchObj.length; i++) {
                            ReservationID.push(scratchObj[i].ReservationID);
                            var isFlyp10 = await checkUSAGMemberInFlyp10(scratchObj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(scratchObj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(scratchObj[i].USAGID)
                            }
                            _p.scratchAthleteReservation(scratchObj[i], sanctionID, req.reservationData._id);
                        }
                    }


                }
            }
            req.reservationData.SanctionID = reservationObj.SanctionID ? reservationObj.SanctionID : req.reservationData.SanctionID;
            req.reservationData.ClubUSAGID = reservationObj.ClubUSAGID ? reservationObj.ClubUSAGID : req.reservationData.ClubUSAGID;
            req.reservationData.ClubName = reservationObj.ClubName ? reservationObj.ClubName : req.reservationData.ClubName;
            req.reservationData.ClubAbbreviation = reservationObj.ClubAbbreviation ? reservationObj.ClubAbbreviation : req.reservationData.ClubAbbreviation;
            req.reservationData.ClubInternational = reservationObj.ClubInternational ? reservationObj.ClubInternational : req.reservationData.ClubInternational;
            req.reservationData.ClubContactUSAGID = reservationObj.ClubContactUSAGID ? reservationObj.ClubContactUSAGID : req.reservationData.ClubContactUSAGID;
            req.reservationData.ClubContactEmail = reservationObj.ClubContactEmail ? reservationObj.ClubContactEmail : req.reservationData.ClubContactEmail;
            req.reservationData.ClubContactPhone = reservationObj.ClubContactPhone ? reservationObj.ClubContactPhone : req.reservationData.ClubContactPhone;
            req.reservationData.ClubMeetContactUSAGID = reservationObj.ClubMeetContactUSAGID ? reservationObj.ClubMeetContactUSAGID : req.reservationData.ClubMeetContactUSAGID;
            req.reservationData.ClubMeetContact = reservationObj.ClubMeetContact ? reservationObj.ClubMeetContact : req.reservationData.ClubMeetContact;
            req.reservationData.ClubMeetContactEmail = reservationObj.ClubMeetContactEmail ? reservationObj.ClubMeetContactEmail : req.reservationData.ClubMeetContactEmail;
            req.reservationData.ClubMeetContactPhone = reservationObj.ClubMeetContactPhone ? reservationObj.ClubMeetContactPhone : req.reservationData.ClubMeetContactPhone;
            req.reservationData.ClubStreetAddress1 = reservationObj.ClubStreetAddress1 ? reservationObj.ClubStreetAddress1 : req.reservationData.ClubStreetAddress1;
            req.reservationData.ClubStreetAddress2 = reservationObj.ClubStreetAddress2 ? reservationObj.ClubStreetAddress2 : req.reservationData.ClubStreetAddress2;
            req.reservationData.ClubStreetCity = reservationObj.ClubStreetCity ? reservationObj.ClubStreetCity : req.reservationData.ClubStreetCity
            req.reservationData.ClubStreetState = reservationObj.ClubStreetState ? reservationObj.ClubStreetState : req.reservationData.ClubStreetState;
            req.reservationData.ClubStreetZip = reservationObj.ClubStreetZip ? reservationObj.ClubStreetZip : req.reservationData.ClubStreetZip;
            req.reservationData.ClubStreetCountry = reservationObj.ClubStreetCountry ? reservationObj.ClubStreetCountry : req.reservationData.ClubStreetCountry;
            req.reservationData.TimeStamp = req.body.TimeStamp
            dataProviderHelper.save(req.reservationData);
            let reservation = {
                success: true,
                ReservationID: ReservationID,
                ExistingFlyp10User: ExistingFlyp10User,
                NonExistingFlyp10User: NonExistingFlyp10User
            }
            resolve(reservation)
        })
    }

    async function getReservationData(req, res, next) {
        return new Promise((resolve, reject) => {
            var reservation = req.body.Reservation;
            //sanction have multiple clubs ,so we add a CLubUSAGID
            var query = {
                SanctionID: reservation.SanctionID,
                ClubUSAGID: reservation.ClubUSAGID
            };
            resolve(dataProviderHelper.findOne(Reservation, query))
        })

    }
    _p.getReservationData = function(req, res, next) {
        var reservation = req.body.Reservation;
        //sanction have multiple clubs ,so we add a CLubUSAGID
        var query = {
            SanctionID: reservation.SanctionID,
            ClubUSAGID: reservation.ClubUSAGID
        };
        return dataProviderHelper.findOne(Reservation, query)
    }
    _p.updateSanctionData = async function(req, res, next) {
        var sanctionObj = req.body.Sanction;
        var Apparatuses = sanctionObj.Apparatuses;
        let levellimit = [];
        let apparatuslimit = [];
        var ExistingFlyp10User = []
        var NonExistingFlyp10User = []

        if (sanctionObj.MeetDirectorID) {
            var meetDirectorID = sanctionObj.MeetDirectorID
            var isFlyp10 = await checkUSAGMemberInFlyp10(meetDirectorID)
            if (isFlyp10) {
                ExistingFlyp10User.push(meetDirectorID)
            } else {
                NonExistingFlyp10User.push(meetDirectorID)
            }
        }
        // add administrators
        if (sanctionObj.Administrators && sanctionObj.Administrators.Add) {
            var Administrators = sanctionObj.Administrators.Add
            for (var i = 0; i < Administrators.length; i++) {
                var isFlyp10 = await checkUSAGMemberInFlyp10(Administrators[i].AdminID)
                if (isFlyp10) {
                    ExistingFlyp10User.push(Administrators[i].AdminID)
                } else {
                    NonExistingFlyp10User.push(Administrators[i].AdminID)
                }
                _p.postAdministrators(Administrators[i], req.sanctionData.SanctionID);
                await EnrollEventMeetForSanctionAdminstrators(req.sanctionData.SanctionID, Administrators[i].AdminID)
            }
        }
        // update administrators
        if (sanctionObj.Administrators && sanctionObj.Administrators.Update) {
            var Administrators = sanctionObj.Administrators.Update
                //console.log(Administrators, "Administrators")
            for (var i = 0; i < Administrators.length; i++) {
                var isFlyp10 = await checkUSAGMemberInFlyp10(Administrators[i].AdminID)
                if (isFlyp10) {
                    ExistingFlyp10User.push(Administrators[i].AdminID)
                } else {
                    NonExistingFlyp10User.push(Administrators[i].AdminID)
                }
                //    //console.log("sanctionid",req.sanctionData.SanctionID)
                _p.updateAdministrators(Administrators[i], req.sanctionData.SanctionID)
            }
        }

        //sanction levels add
        if (sanctionObj.Levels && sanctionObj.Levels.Add) {

            for (var i = 0; i < sanctionObj.Levels.Add.length; i++) {
                //  //console.log("level",sanctionObj.Levels.Add[i])
                req.sanctionData.Levels.push(sanctionObj.Levels.Add[i])
            }
        }
        //sanction levels remove
        if (sanctionObj.Levels && sanctionObj.Levels.Remove) {
            //console.log("levelassds")
            for (var i = 0; i < sanctionObj.Levels.Remove.length; i++) {
                var index = req.sanctionData.Levels.findIndex(e => e === sanctionObj.Levels.Remove[i]);
                //console.log(index, "index")
                if (index != -1) {
                    req.sanctionData.Levels.splice(index, 1)
                }
            }
        }

        if (sanctionObj.LevelLimits && sanctionObj.LevelLimits.Update) {
            var LevelLimits = sanctionObj.LevelLimits.Update;
            for (let name in LevelLimits) {

                for (var levelname in LevelLimits[name]) {
                    let data = {
                        Name: name,
                        LevelName: levelname,
                        MaxParticipants: LevelLimits[name][levelname]
                    }
                    levellimit.push(data);
                }

            }
        }
        //   //console.log(LevelLimits)

        if (sanctionObj.ApparatusLimits && sanctionObj.ApparatusLimits.Update) {
            var ApparatusLimits = sanctionObj.ApparatusLimits.Update;

            for (let name in ApparatusLimits) {
                let data = {
                    Name: name,
                    MaxParticipants: ApparatusLimits[name]
                }
                apparatuslimit.push(data)

            }
        }
        //console.log(req.sanctionData)
        updateApparatuses(Apparatuses, req.sanctionData);
        updataLevellimits(levellimit, req.sanctionData.SanctionID, req.sanctionData._id);
        updateApparatuseslimits(apparatuslimit, req.sanctionData.SanctionID, req.sanctionData._id)
        req.sanctionData.Name = sanctionObj.Name ? sanctionObj.Name : req.sanctionData.Name;
        req.sanctionData.MeetDirectorID = sanctionObj.MeetDirectorID ? sanctionObj.MeetDirectorID : req.sanctionData.MeetDirectorID;
        req.sanctionData.MeetDirectorName = sanctionObj.MeetDirectorName ? sanctionObj.MeetDirectorName : req.sanctionData.MeetDirectorName;
        req.sanctionData.MeetDirectorEmail = sanctionObj.MeetDirectorEmail ? sanctionObj.MeetDirectorEmail : req.sanctionData.MeetDirectorEmail;
        req.sanctionData.OrganizationID = sanctionObj.OrganizationID ? sanctionObj.OrganizationID : req.sanctionData.OrganizationID;
        req.sanctionData.Organization = sanctionObj.Organization ? sanctionObj.Organization : req.sanctionData.Organization;
        req.sanctionData.DisciplineType = sanctionObj.DisciplineType ? sanctionObj.DisciplineType : req.sanctionData.DisciplineType;
        req.sanctionData.TypeOfMeet = sanctionObj.TypeOfMeet ? sanctionObj.TypeOfMeet : req.sanctionData.TypeOfMeet;
        req.sanctionData.AllowsInternational = sanctionObj.AllowsInternational ? sanctionObj.AllowsInternational : req.sanctionData.AllowsInternational;

        req.sanctionData.CompetitionStartDate = sanctionObj.CompetitionStartDate ? sanctionObj.CompetitionStartDate : req.sanctionData.CompetitionStartDate;
        req.sanctionData.CompetitionEndDate = sanctionObj.CompetitionEndDate ? sanctionObj.CompetitionEndDate : req.sanctionData.CompetitionEndDate;
        req.sanctionData.SiteName = sanctionObj.SiteName ? sanctionObj.SiteName : req.sanctionData.SiteName;
        req.sanctionData.SiteAddress1 = sanctionObj.SiteAddress1 ? sanctionObj.SiteAddress1 : req.sanctionData.SiteAddress1;
        req.sanctionData.SiteAddress2 = sanctionObj.SiteAddress2 ? sanctionObj.SiteAddress2 : req.sanctionData.SiteAddress2;
        req.sanctionData.SiteState = sanctionObj.SiteState ? sanctionObj.SiteState : req.sanctionData.SiteState;
        req.sanctionData.SiteCity = sanctionObj.SiteCity ? sanctionObj.SiteCity : req.sanctionData.SiteCity;
        req.sanctionData.SiteZip = sanctionObj.SiteZip ? sanctionObj.SiteZip : req.sanctionData.SiteZip;
        req.sanctionData.ReservationPeriodOpens = sanctionObj.ReservationPeriodOpens ? sanctionObj.ReservationPeriodOpens : req.sanctionData.ReservationPeriodOpens;
        req.sanctionData.ReservationPeriodCloses = sanctionObj.ReservationPeriodCloses ? sanctionObj.ReservationPeriodCloses : req.sanctionData.ReservationPeriodCloses;
        req.sanctionData.LevelChangeCloseDate = sanctionObj.LevelChangeCloseDate ? sanctionObj.LevelChangeCloseDate : req.sanctionData.LevelChangeCloseDate;
        req.sanctionData.CancellationCloseDate = sanctionObj.CancellationCloseDate ? sanctionObj.CancellationCloseDate : req.sanctionData.CancellationCloseDate;
        req.sanctionData.Website = sanctionObj.Website ? sanctionObj.Website : req.sanctionData.Website;
        req.sanctionData.TimeStamp = req.body.TimeStamp


        //  //console.log(req.sanctionData);
        dataProviderHelper.save(req.sanctionData)
        var result = {
                ExistingFlyp10User: ExistingFlyp10User,
                NonExistingFlyp10User: NonExistingFlyp10User
            }
            //console.log(result, "sds")
        return result;

    }
    async function updateApparatuseslimits(apparatuslimit, sanctionID, SID) {
        //   //console.log(levellimit.length)
        var i = 0;
        while (i < apparatuslimit.length) {
            var apparatus = await _p.getApparatusLimit(apparatuslimit[i], SID);
            if (apparatus) {
                apparatus.MaxParticipants = apparatuslimit[i].MaxParticipants;
                dataProviderHelper.save(apparatus);
                i++
            } else {
                //console.log(apparatuslimit[i], "dfdf")
                _p.postApparatusLimits(apparatuslimit[i], sanctionID, SID)
                i++
            }
        }

    }
    async function updataLevellimits(levellimit, sanctionID, SID) {
        //console.log(levellimit.length)
        var i = 0;
        while (i < levellimit.length) {


            var level = await _p.getLevelLimit(levellimit[i], SID);
            if (level && level.LevelName) {
                level.MaxParticipants = levellimit[i].MaxParticipants;
                dataProviderHelper.save(level);
                i++;
            } else {
                //console.log(levellimit[i], i, "g")
                _p.postLevelLimits(levellimit[i], sanctionID, SID)
                i++;

            }


        }
    }

    _p.getLevelLimit = function(levellimit, SID) {
        return new Promise((resolve, reject) => {
            var query2 = {}
                //console.log(SID)
            query2.LevelName = levellimit.LevelName;
            query2.Name = levellimit.Name;
            query2.SID = mongoose.Types.ObjectId(SID);
            dataProviderHelper.findOne(SanctionLevelLimit, query2).then((level) => {
                resolve(level)
            })
        });

    }
    _p.getApparatusLimit = function(apparatuslimit, SID) {
        return new Promise((resolve, reject) => {
            var query = {}

            query.Name = apparatuslimit.Name;
            query.SID = mongoose.Types.ObjectId(SID);
            dataProviderHelper.findOne(SanctionApparatusLimit, query).then((level) => {
                resolve(level)
            })
        });

    }
    _p.postCoachReservation = function(coachReservationObj, sanctionID, eventmeetreservationID) {
        //  coachReservationObj.SanctionID = sanctionID
        var newCoachReservation = APIModule.CreateCoachReservation(coachReservationObj, sanctionID, eventmeetreservationID);
        //console.log(coachReservationObj, "coach")
        return dataProviderHelper.save(newCoachReservation);
    }
    _p.postAthleteReservation = function(athleteReservationObj, sanctionID, eventmeetreservationID) {

        //  athleteReservationObj.SanctionID = sanctionID
        var newathleteReservation = APIModule.CreateAthleteReservation(athleteReservationObj, sanctionID, eventmeetreservationID);
        //console.log(athleteReservationObj, "athleteReservationObj")
        return dataProviderHelper.save(newathleteReservation);
    }
    _p.postAthleteGroupReservation = function(groupReservationObj, sanctionID, eventmeetreservationID) {

        //   groupReservationObj.SanctionID = sanctionID
        var newgroupReservation = APIModule.CreateAthleteGroupReservation(groupReservationObj, sanctionID, eventmeetreservationID);
        //console.log(groupReservationObj, "groupReservationObj")
        return dataProviderHelper.save(newgroupReservation);
    }
    _p.updateCoachReservation = function(coachReservationObj, sanctionID, eventmeetreservationID) {

        var query = {}
        query.SanctionID = sanctionID;
        query.ReservationID = coachReservationObj.ReservationID;
        query.MeetReservationID = eventmeetreservationID;
        dataProviderHelper.findOne(CoachReservation, query).then((coach) => {
            coach.Name = coachReservationObj.Name ? coachReservationObj.Name : coach.Name;
            coach.FirstName = coachReservationObj.FirstName ? coachReservationObj.FirstName : coach.FirstName;
            coach.LastName = coachReservationObj.LastName ? coachReservationObj.LastName : coach.LastName;
            coach.USAGID = coachReservationObj.USAGID ? coachReservationObj.USAGID : coach.USAGID;
            coach.InternationalMember = coachReservationObj.InternationalMember ? coachReservationObj.InternationalMember : coach.InternationalMember;
            coach.MemberType = coachReservationObj.MemberType ? coachReservationObj.MemberType : coach.MemberType;
            coach.Discipline = coachReservationObj.Discipline ? coachReservationObj.Discipline : coach.Discipline;
            coach.ScratchDate = coachReservationObj.ScratchDate ? coachReservationObj.ScratchDate : coach.ScratchDate;
            return dataProviderHelper.save(coach)
        })
    }
    _p.updateAthleteReservation = function(athleteReservationObj, sanctionID, eventmeetreservationID) {

        var query = {}
        query.SanctionID = sanctionID;
        query.ReservationID = athleteReservationObj.ReservationID;
        query.MeetReservationID = mongoose.Types.ObjectId(eventmeetreservationID);

        dataProviderHelper.findOne(AthleteReservation, query).then((athlete) => {
            athlete.Name = athleteReservationObj.Name ? athleteReservationObj.Name : athlete.Name;
            athlete.FirstName = athleteReservationObj.FirstName ? athleteReservationObj.FirstName : athlete.FirstName;
            athlete.LastName = athleteReservationObj.LastName ? athleteReservationObj.LastName : athlete.LastName;
            athlete.USAGID = athleteReservationObj.USAGID ? athleteReservationObj.USAGID : athlete.USAGID;
            athlete.Gender = athleteReservationObj.Gender ? athleteReservationObj.Gender : athlete.Gender;
            athlete.DOB = athleteReservationObj.DOB ? athleteReservationObj.DOB : athlete.DOB;
            athlete.InternationalMember = athleteReservationObj.InternationalMember ? athleteReservationObj.InternationalMember : athlete.InternationalMember;
            athlete.USCitizen = athleteReservationObj.USCitizen ? athleteReservationObj.USCitizen : athlete.USCitizen;
            athlete.MemberType = athleteReservationObj.MemberType ? athleteReservationObj.MemberType : athlete.MemberType;
            athlete.Apparatus = athleteReservationObj.Apparatus ? athleteReservationObj.Apparatus : athlete.Apparatus;
            athlete.Level = athleteReservationObj.Level ? athleteReservationObj.Level : athlete.Level;
            athlete.AgeGroup = athleteReservationObj.AgeGroup ? athleteReservationObj.AgeGroup : athlete.AgeGroup;
            athlete.ScratchDate = athleteReservationObj.ScratchDate ? athleteReservationObj.ScratchDate : athlete.ScratchDate;

            return dataProviderHelper.save(athlete);
        })
    }
    _p.updateAthleteGroupReservation = function(groupReservationObj, sanctionID, eventmeetreservationID) {
        var query = {}
        query.SanctionID = sanctionID;
        query.ReservationID = groupReservationObj.ReservationID;
        query.MeetReservationID = eventmeetreservationID
        dataProviderHelper.findOne(AthleteGroupReservation, query).then((group) => {
            group.Name = groupReservationObj.Name ? groupReservationObj.Name : group.Name;
            group.USAGID = groupReservationObj.USAGID ? groupReservationObj.USAGID : group.USAGID;
            group.InternationalMember = groupReservationObj.InternationalMember ? groupReservationObj.InternationalMember : group.InternationalMember;
            group.Type = groupReservationObj.Type ? groupReservationObj.Type : group.Type;
            group.Apparatus = groupReservationObj.Apparatus ? groupReservationObj.Apparatus : group.Apparatus;
            group.Level = groupReservationObj.Level ? groupReservationObj.Level : group.Level;
            group.AgeGroup = groupReservationObj.AgeGroup ? groupReservationObj.AgeGroup : group.AgeGroup;
            group.ScratchDate = groupReservationObj.ScratchDate ? groupReservationObj.ScratchDate : group.ScratchDate;
            return dataProviderHelper.save(group);
        })
    }
    _p.changevendorSanctionData = function(req, res, next) {
        req.sanctionData.deleted = true;
        req.sanctionData.deletedOn = new Date();
        req.sanctionData.TimeStamp = req.body.TimeStamp;
        req.sanctionData.changeVendor = '1'
        return dataProviderHelper.save(req.sanctionData)
    }
    _p.scratchCoachReservation = function(coachReservationObj, sanctionID, eventmeetreservationID) {

        var query = {}
        query.SanctionID = sanctionID;
        query.ReservationID = coachReservationObj.ReservationID;
        query.MeetReservationID = mongoose.Types.ObjectId(eventmeetreservationID);

        dataProviderHelper.findOne(CoachReservation, query).then((athlete) => {

            athlete.deleted = true;
            athlete.deletedOn = new Date();

            return dataProviderHelper.save(athlete);
        })
    }
    _p.scratchAthleteGroupReservation = function(groupReservationObj, sanctionID, eventmeetreservationID) {

        var query = {}
        query.SanctionID = sanctionID;
        query.ReservationID = groupReservationObj.ReservationID;
        query.MeetReservationID = mongoose.Types.ObjectId(eventmeetreservationID);

        dataProviderHelper.findOne(AthleteGroupReservation, query).then((athlete) => {

            athlete.deleted = true;
            athlete.deletedOn = new Date();

            return dataProviderHelper.save(athlete);
        })
    }
    _p.scratchAthleteReservation = function(athleteReservationObj, sanctionID, eventmeetreservationID) {

        var query = {}
        query.SanctionID = sanctionID;
        query.ReservationID = athleteReservationObj.ReservationID;
        query.MeetReservationID = mongoose.Types.ObjectId(eventmeetreservationID);

        dataProviderHelper.findOne(AthleteReservation, query).then((athlete) => {

            athlete.deleted = true;
            athlete.deletedOn = new Date();
            //console.log(athlete, "dfdf")
            return dataProviderHelper.save(athlete);
        })
    }
    async function updateApparatuses(Apparatuses, sanctionObj) {
        //for add a sanction apparatus
        if (Apparatuses && Apparatuses.Add) {
            if (Array.isArray(Apparatuses.Add)) {
                for (var i = 0; i < Apparatuses.Add.length; i++) {
                    await addapparatuses(Apparatuses.Add[i], sanctionObj)
                }
            } else {
                await addapparatuses(Apparatuses.Add, sanctionObj)
            }
        }
        //for remove the sanction apparatus levels or apparatus
        if (Apparatuses && Apparatuses.Remove) {
            if (Array.isArray(Apparatuses.Remove)) {
                for (var i = 0; i < Apparatuses.Remove.length; i++) {
                    await removeappratus(Apparatuses.Remove[i], sanctionObj)
                }
            } else {
                await removeappratus(Apparatuses.Remove, sanctionObj)
            }

        }
        //for update the apparatus
        if (Apparatuses && Apparatuses.Update) {
            if (Array.isArray(Apparatuses.Update)) {
                for (var i = 0; i < Apparatuses.Update.length; i++) {
                    await updateappratus(Apparatuses.Update[i], sanctionObj)
                }
            } else {
                await updateappratus(Apparatuses.Update, sanctionObj)
            }


        }
    }
    _p.getSanctionApparatus = function(Apparatusesname, sanctionObj) {
        var query = {}
        query.Name = Apparatusesname;
        query.SID = mongoose.Types.ObjectId(sanctionObj._id);
        dataProviderHelper.findOne(SanctionApparatus, query).then((apparatus) => {
            //console.log(apparatus, 'sdsd')
            return apparatus;
        });
    }

    _p.removeSanctionApparatus = function(Apparatusesname, sanctionObj) {
        var query = {}
        query.Name = Apparatusesname;
        query.SID = mongoose.Types.ObjectId(sanctionObj._id);
        return dataProviderHelper.removeModelData(SanctionApparatus, query)
    }

    function verifyUSAGMEmber(req) {
        return new Promise((resolve, reject) => {
            let data = 'flyp10:e2417781-00dc-4d8e-8a85-6cf01667f667';
            let buff = new Buffer(data);
            let base64data = buff.toString('base64');
            const options = {
                //url: `https://test.usagym.org/app/api/v3/sanctions/`+58025+`/verification/`+a+`/`+w+`/`+1036
                url: applicationConfig.USAGVerificationAPI.person + req.body.MemberID + '/verification/legalContact/email/' + req.body.Email,
                method: 'GET',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Basic " + base64data
                }
            };

            const callback = (err, resp, body) => {
                if (!err && resp.statusCode == 200) {
                    resolve({
                        success: true,
                        data: body
                    })
                } else {
                    resolve({
                        success: false,
                        message: err,
                        resp
                    })
                }

            }

            request(options, callback)
        })
    }
    _p.verifyMembership = async function(req, res, next) {
        //console.log(req.body, "verrify")
        var response = await verifyUSAGMEmber(req)
            //console.log(response)
        if (response.success) {
            response = JSON.parse(response.data)
                //console.log(response)
            if (response.status == 'success' && response.data.valid == '1') {

                var query = {
                    Flyp10UserID: req.body.Flyp10UserID,
                    MemberID: req.body.MemberID
                }
                dataProviderHelper.find(USAGMemberVerification, query).then((response1) => {

                    if (response1.length == 0) {
                        var newUSAGMemberVerification = APIModule.CreateUSAGMemberVerification(req.body);
                        //console.log(newUSAGMemberVerification, "new")
                        dataProviderHelper.save(newUSAGMemberVerification).then((response) => {
                            res.json({
                                success: true
                            })
                        })
                    } else {
                        res.json({
                            success: true
                        })
                    }

                })


            } else {
                return res.json({
                    success: false
                })
            }

        } else {
            return res.json({
                success: false
            })
        }

    }
    _p.getUSAGverificationMemberID = function(req, res, next) {

        var query = {}
        query.Flyp10UserID = mongoose.Types.ObjectId(req.params.userid)

        //console.log('tesr', query, req.params.userid)
        dataProviderHelper.findOne(USAGMemberVerification, query).then((USAGMember) => {

            res.json({
                success: true,
                data: USAGMember
            })
        });
    }

    _p.getUSAGVerificationMemberIDByFlyp10UserID = function(req, res, next) {
        //console.log(req.params.userid, "userid")

        var query = [{
                $match: {

                    $and: [{ 'Flyp10UserID': mongoose.Types.ObjectId(req.params.userid) }]
                }
            },
            {
                $lookup: {
                    from: "EventMeet-Sanction",
                    let: { memberID: '$MemberID' },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$MeetDirectorID", "$$memberID"] },
                                    { $eq: ["$deleted", false] },
                                ]
                            }
                        }
                    }, ],
                    as: "USAGSanctioninfo"
                },

            },
            {
                $unwind: "$USAGSanctioninfo"
            },
            {
                $project: {
                    MemberID: '$MemberID',
                    USAGSanctioninfo: '$USAGSanctioninfo',
                    TenDatesAfterSanctionEndDate: { $add: ["$USAGSanctioninfo.CompetitionEndDate", 10 * 24 * 60 * 60000] }
                },
            },


            {
                $match: {
                    $and: [{ 'TenDatesAfterSanctionEndDate': { $gte: new Date() } }]
                }
            }
        ];
        // query.username=req.params.username;
        //query.deleted=false
        USAGMemberVerification.aggregate(query, function(err, result) {
            //console.log('result ', result);
            res.send(result)
        })
    }

    _p.getSanctionMemberIDByFlyp10UserID = async function(req, res, next) {
        var Sanction = [];
        //console.log(req.params.memberID, "meemberid")
        var sanctionbtmeetdirector = await getSanctionByMeetDirector(req.params.memberID);
        //console.log(sanctionbtmeetdirector, "sanctionbtmeetdirector")
        var sanctionbyadmin = await getSanctionByAdmin(req.params.memberID);
        //console.log(sanctionbyadmin, "sanctionbyadmin", sanctionbyadmin.length)
        var Sanction = [];
        //console.log(sanctionbyadmin, "sanctionbyadmin", sanctionbyadmin.length)
        //console.log(sanctionbtmeetdirector, "sanctionbtmeetdirector", sanctionbtmeetdirector.length)

        Sanction = sanctionbtmeetdirector.concat(sanctionbyadmin);

        res.json(Sanction)

    }

    function getSanctionByAdmin(memberid) {
        return new Promise((resolve, reject) => {
            var Sanction = []
            var query = {}
            query.AdminID = memberid
            dataProviderHelper.find(SanctionAdministrator, query).then(async(admin) => {
                //console.log('admin', admin)
                if (admin.length > 0) {
                    for (var i = 0; i < admin.length; i++) {
                        //console.log(admin.SanctionID, "admin.SanctionID")
                        var sanction = await getSanctionByAdminSanctionIDDate(admin[i].SanctionID)
                            //console.log(sanction, "sasas")
                        if (sanction) {
                            Sanction.push(sanction)
                        }

                        if (i == admin.length - 1) {
                            resolve(Sanction)
                        }
                    }
                } else {
                    resolve([])
                }
            })
        })

    }

    function getSanctionByMeetDirector(memberid) {
        return new Promise((resolve, reject) => {
            //console.log("sanction", memberid)
            var query = [{
                        $match: {
                            $and: [{ "MeetDirectorID": memberid }, { deleted: false }]
                        }
                    }, {
                        $project: {
                            SanctionID: '$SanctionID',
                            TenDatesAfterSanctionEndDate: { $add: ['$CompetitionEndDate', 10 * 24 * 60 * 60000] }
                        },
                    },
                    {
                        $match: {
                            $and: [{ 'TenDatesAfterSanctionEndDate': { $gte: new Date() } }]
                        }
                    }


                ]
                //  var pagerOpts = utilityHelper.getPaginationOpts(req, next);
            Sanction.aggregate(query, function(err, result) {
                if (result.length > 0) {
                    resolve(result)
                } else {
                    resolve([])
                }

            })
        })

    }
    _p.updateUSAGMember = function(req, res, next) {

        var query = {}
        query.Flyp10UserID = req.params.userid
        dataProviderHelper.findOne(USAGMemberVerification, query).then(async(USAG) => {
            USAG.MemberID = req.body.MemberID,
                USAG.Email = req.body.Email
            var response = await verifyUSAGMEmber(req)
                //console.log(response)
            if (response.success) {
                response = JSON.parse(response.data)
                    //console.log(response)
                if (response.status == 'success' && response.data.valid == '1') {

                    dataProviderHelper.save(USAG).then((response) => {
                        res.json({
                            success: true
                        })
                    })

                } else {
                    return res.json({
                        success: false
                    })
                }

            } else {
                return res.json({
                    success: false
                })
            }


        })

    }

    _p.saveUSAGrequest = function(req, res, next) {
        //console.log("res")
        var newUSAGAPIRequestInfo = APIModule.CreateUSAGAPIRequestDetails(req.body, req.originalUrl)
        return dataProviderHelper.save(newUSAGAPIRequestInfo)
    }

    function saveUSAGScorerequest(sanctionId, apirequest, data) {
        return new Promise(async(resolve, reject) => {
            var newUSAGAPIRequestInfo = APIModule.CreateUSAGScoreAPIRequestDetails(sanctionId, apirequest, data)
            dataProviderHelper.save(newUSAGAPIRequestInfo)
            resolve()
        })

    }
    _p.postJudgesData = function(req, res, next) {
        return new Promise(async(resolve, reject) => {
            var judges = req.body.Judges;
            var SanctionID = req.body.Judges.SanctionID
            var ReservationID = [];
            var details = judges.Details;
            var ExistingFlyp10User = [];
            var NonExistingFlyp10User = [];
            if (details) {
                for (var type in details) {
                    let obj = details[type].Add;
                    if (type == "Judges" && obj) {
                        for (var i = 0; i < obj.length; i++) {
                            ReservationID.push(obj[i].ReservationID);
                            var isFlyp10 = await checkUSAGMemberInFlyp10(obj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(obj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(obj[i].USAGID)
                            }
                            obj[i]['TimeStamp'] = req.body.TimeStamp;

                            var newJudgesReservation = APIModule.CreateJudgesReservation(obj[i], SanctionID);
                            dataProviderHelper.save(newJudgesReservation);
                            if (i == obj.length - 1) {
                                //console.log(Reservation)
                                let reservation = {
                                    ReservationID: ReservationID,
                                    ExistingFlyp10User: ExistingFlyp10User,
                                    NonExistingFlyp10User: NonExistingFlyp10User
                                }
                                resolve(reservation);
                            }


                        }
                    }


                }
            }
        }).catch((err) => {
            reject()
        })



    }
    _p.getSanctionByMemberID = async function(req, res, next) {
        var SanctionByMeetDirector = await getMeetDirectorSanction(req.params.memberid)
        var sanctionbyadmin = await getAdminSanction(req.params.memberid)
        var Sanction = [];
        //console.log(sanctionbyadmin, "sanctionbyadmin", sanctionbyadmin.length)
        //console.log(SanctionByMeetDirector, "sanctionbtmeetdirector", SanctionByMeetDirector.length)
        Sanction = SanctionByMeetDirector.concat(sanctionbyadmin);
        res.json(Sanction)

    }

    function getMeetDirectorSanction(memberid) {
        return new Promise((resolve, reject) => {
            var query = {}
            query.MeetDirectorID = memberid;
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
                        if (sanction) {
                            Sanction.push(sanction)
                        }
                        //console.log(sanction, "sanctionadas")
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
            query.deleted = false;
            dataProviderHelper.findOne(Sanction, query).then(sanction => {
                if (sanction) {
                    resolve(sanction)
                } else {
                    resolve()
                }

            })
        })

    }


    function getSanctionByAdminSanctionIDDate(sanctionID) {
        return new Promise((resolve, reject) => {
            //console.log("adminsanction", sanctionID)
            //  var pagerOpts = utilityHelper.getPaginationOpts(req, next);
            var query = [{
                    $match: {
                        $and: [{ "SanctionID": sanctionID }, { deleted: false }]
                    }
                }, {
                    $project: {
                        SanctionID: '$SanctionID',
                        TenDatesAfterSanctionEndDate: { $add: ['$CompetitionEndDate', 10 * 24 * 60 * 60000] }
                    },
                },
                {
                    $match: {
                        $and: [{ 'TenDatesAfterSanctionEndDate': { $gte: new Date() } }]
                    }
                }


            ]
            Sanction.aggregate(query, function(err, result) {
                //console.log(result, "adminresult")
                if (result.length > 0) {
                    resolve(result[0])
                } else {
                    resolve()
                }

            })
        })

    }
    _p.getSanctionByID = function(req, res, next) {
        var query = {}
        query._id = req.params.sid;
        dataProviderHelper.findOne(Sanction, query).then((sanction) => {
            res.json(sanction)
        })
    }
    _p.patchSanction = function(req, res, next) {
        var _query = {
            '_id': req.params.sid,
            'deleted': false
        };
        //console.log("sdsdsd", req.body)
        // if(req.routinelist.routinestatus!='1'){
        dataProviderHelper.checkForDuplicateEntry(Sanction, _query)
            .then(function(count) {

                if (count > 1) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.routine.routineDeleteDeny + '"}');
                } else {
                    dataProviderHelper.findOne(Sanction, _query).then((sanction) => {
                        sanction.Settings = req.body.Settings
                        dataProviderHelper.save(sanction)
                    })

                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    success: true,
                    message: "Setting Update Successfully"
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });
    }
    _p.getSanctionInfoBySanctionID = function(req, res, next) {
        var query = {}
        query.SanctionID = req.params.sid;

        dataProviderHelper.findOne(Sanction, query).then(sanction => {
            //console.log(sanction, "sanction")
            res.json(sanction);
        })
    }
    _p.getSanctionJudges = function(req, res, next) {

        var query = [{
                $match: {
                    $and: [{ deleted: false }, { SanctionID: req.params.sanctionid }]
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
                }
            }



        ]
        Judges.aggregate(query, function(err, response) {
            if (!err) {
                res.json({
                    success: true,
                    data: response
                })
            } else {
                res.json({
                    success: false,
                    message: 'Can not get Judges'
                })
            }
        })

    }


    _p.updateJudgesData = function(req, res, next) {
        return new Promise(async(resolve, reject) => {
            var ReservationID = [];
            var ExistingFlyp10User = [];
            var NonExistingFlyp10User = [];
            var query = {}
            var SanctionID = req.body.Judges.SanctionID
            var judges = req.body.Judges;
            var details = judges.Details;
            if (details) {
                for (var type in details) {
                    let obj = details[type].Scratch;
                    let addObj = details[type].Add;
                    //console.log(addObj, "addObj")
                    if (type == "Judges" && obj) {
                        for (var i = 0; i < obj.length; i++) {
                            ReservationID.push(obj[i].ReservationID);
                            var isFlyp10 = await checkUSAGMemberInFlyp10(obj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(obj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(obj[i].USAGID)
                            }
                            query.SanctionID = req.body.Judges.SanctionID
                            query.ReservationID = obj[i].ReservationID;
                            dataProviderHelper.findOne(Judges, query).then((judge) => {
                                judge.deletedOn = new Date();
                                judge.deleted = true;
                                dataProviderHelper.save(judge)
                            })
                        }
                    }
                    if (type == "Judges" && addObj) {

                        for (var i = 0; i < addObj.length; i++) {
                            ReservationID.push(addObj[i].ReservationID)
                            var isFlyp10 = await checkUSAGMemberInFlyp10(addObj[i].USAGID)
                            if (isFlyp10) {
                                ExistingFlyp10User.push(addObj[i].USAGID)
                            } else {
                                NonExistingFlyp10User.push(addObj[i].USAGID)
                            }
                            addObj[i]['TimeStamp'] = req.body.TimeStamp;
                            var newJudgesReservation = APIModule.CreateJudgesReservation(addObj[i], SanctionID);
                            dataProviderHelper.save(newJudgesReservation);

                        }
                    }
                }
            }

            resolve({
                ReservationID: ReservationID,
                ExistingFlyp10User: ExistingFlyp10User,
                NonExistingFlyp10User: NonExistingFlyp10User
            });
        })

    }

    function getSanctionCoachesFlyp10User(sanctionid) {
        return new Promise((resolve, reject) => {
            //    var query = {};
            var Coahes = [];
            //  query.deleted = false;
            // query.SanctionID = sanctionid
            var query = [{
                    $match: {
                        $and: [{ deleted: false }, { SanctionID: sanctionid }]
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
            ]
            dataProviderHelper.aggregate(CoachReservation, query).then(async(coaches) => {
                if (coaches.length) {
                    for (var i = 0; i < coaches.length; i++) {
                        var isFlyp10User = await checkUSAGMemberInFlyp10(coaches[i].USAGID);
                        if (isFlyp10User) {
                            let data = {
                                "MemberID": coaches[i].USAGID,
                                Flyp10User: '1',
                                Type: 'Coach',
                                ClubName: coaches[i].ClubReservationInfo.ClubName,
                                FirstName: coaches[i].FirstName,
                                LastName: coaches[i].LastName
                            }
                            Coahes.push(data)
                        } else {
                            let data = {
                                "MemberID": coaches[i].USAGID,
                                Flyp10User: '0',
                                Type: 'Coach',
                                FirstName: coaches[i].FirstName,
                                LastName: coaches[i].LastName,
                                ClubName: coaches[i].ClubReservationInfo.ClubName
                            }
                            Coahes.push(data)
                        }
                        if (i == coaches.length - 1) {
                            resolve(Coahes);

                        }
                    }
                } else {
                    resolve([]);
                }

            })
        })



    }

    function getSanctionAthleteFlyp10User(sanctionid) {
        return new Promise((resolve, reject) => {
            //  var query = {};
            var Athlete = [];
            // query.deleted = false;
            // query.SanctionID = sanctionid
            var query = [{
                    $match: {
                        $and: [{ deleted: false }, { SanctionID: sanctionid }]
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




            ]
            dataProviderHelper.aggregate(AthleteReservation, query).then(async(athlete) => {
                if (athlete.length) {
                    for (var i = 0; i < athlete.length; i++) {
                        var isFlyp10User = await checkUSAGMemberInFlyp10(athlete[i].USAGID);
                        if (isFlyp10User) {
                            let data = {
                                "MemberID": athlete[i].USAGID,
                                Flyp10User: '1',
                                Type: 'Athlete',
                                ClubName: athlete[i].ClubReservationInfo.ClubName,
                                ClubUSAGID: athlete[i].ClubReservationInfo.ClubUSAGID,
                                FirstName: athlete[i].FirstName,
                                LastName: athlete[i].LastName
                            }

                            Athlete.push(data)

                        } else {
                            let data = {

                                "MemberID": athlete[i].USAGID,
                                Flyp10User: '0',
                                Type: 'Athlete',
                                ClubName: athlete[i].ClubReservationInfo.ClubName,
                                ClubUSAGID: athlete[i].ClubReservationInfo.ClubUSAGID,
                                FirstName: athlete[i].FirstName,
                                LastName: athlete[i].LastName
                            }
                            Athlete.push(data)
                        }
                        if (i == athlete.length - 1) {
                            resolve(Athlete);

                        }
                    }
                } else {
                    resolve([])
                }

            })
        })


    }

    function getSanctionJudgeFlyp10User(sanctionid) {
        return new Promise((resolve, reject) => {
            var query = {};
            var Judge = [];
            query.deleted = false;
            query.SanctionID = sanctionid
            dataProviderHelper.find(Judges, query).then(async(judge) => {
                if (judge.length) {
                    for (var i = 0; i < judge.length; i++) {
                        var isFlyp10User = await checkUSAGMemberInFlyp10(judge[i].USAGID);
                        if (isFlyp10User) {
                            let data = {
                                "MemberID": judge[i].USAGID,
                                Flyp10User: '1',
                                Type: 'Judge',
                                FirstName: judge[i].FirstName,
                                LastName: judge[i].LastName
                            }

                            Judge.push(data)
                        } else {
                            var data = {
                                "MemberID": judge[i].USAGID,
                                Flyp10User: '0',
                                Type: 'Judge',
                                FirstName: judge[i].FirstName,
                                LastName: judge[i].LastName
                            }
                            Judge.push(data)
                        }
                        if (i == judge.length - 1) {
                            resolve(Judge);

                        }
                    }
                } else {
                    resolve([])
                }

            })
        })


    }
    _p.getSanctionFlyp10UserStatus = async function(req, res, next) {
        var coaches = await getSanctionCoachesFlyp10User(req.params.sanctionid);
        var athlete = await getSanctionAthleteFlyp10User(req.params.sanctionid);
        var judges = await getSanctionJudgeFlyp10User(req.params.sanctionid);
        var SanctionUsers = [];
        //console.log(coaches, "coaches", coaches.length)
        //console.log(athlete, "athlete", athlete.length)
        //console.log(judges, "judges", judges.length)
        SanctionUsers = judges.concat(coaches);
        SanctionUsers = SanctionUsers.concat(athlete);
        SanctionUsers = _.uniqBy(SanctionUsers, 'MemberID')
        res.json({
            success: true,
            data: SanctionUsers
        })
    }

    function getSanctionByMeetDirectorIDSanctionID(sanctionid, meetdirectorid) {
        return new Promise((resolve, reject) => {
            var query = {
                "MeetDirectorID": meetdirectorid,
                "SanctionID": sanctionid,
                deleted: false,

            }
            dataProviderHelper.find(Sanction, query).then((response) => {
                resolve(response)
            })
        })
    }

    function getSanctionByAdminIDSAnctionID(sanctionid, adminid) {
        return new Promise((resolve, reject) => {

            var query = [{
                    $match: {

                        $and: [{ 'AdminID': adminid }, { SanctionID: sanctionid }]
                    }
                },
                {
                    $lookup: {
                        from: "EventMeet-Sanction",
                        let: { sanctionID: '$SanctionID' },
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
                        as: "USAGSanctioninfo"
                    },

                },
                {
                    $unwind: "$USAGSanctioninfo"
                },
            ]

            dataProviderHelper.aggregate(SanctionAdministrator, query).then((response) => {
                var sanction = []
                console.log(response.length, "sdsdsdsd")
                if (response.length > 0) {
                    console.log(response[0].USAGSanctioninfo)
                    sanction.push(response[0].USAGSanctioninfo)
                    resolve(sanction)
                } else {
                    resolve(sanction)
                }
            })
        })

    }
    _p.checkMeetDirectorOrAdmin = async function(req, res, next) {
        var meetdirector = await getSanctionByMeetDirectorIDSanctionID(req.query.SanctionID, req.query.USAGID);
        var admin = await getSanctionByAdminIDSAnctionID(req.query.SanctionID, req.query.USAGID);
        // console.log(meetdirector.length, admin.length)
        var Sanction = [];

        Sanction = meetdirector.concat(admin);

        res.json({
            success: true,
            data: Sanction
        })
    }
    _p.sanctionEventMeetmapping = async function(req, res, next) {
        var sanctionID = req.body.Reservation.SanctionID;
        var sanctionEventmeet = await getSanctionEventMeet(sanctionID);
        //console.log(sanctionEventmeet.length)
        var responsedata;
        if (sanctionEventmeet.length > 0) {
            for (var j = 0; j < sanctionEventmeet.length; j++) {
                var coaches = await getSanctionCoaches(sanctionID);
                var athletes = await getSanctionAthletes(sanctionID)
                    //console.log(coaches, athletes)
                if (coaches.length > 0) {
                    await createEventMappingForCoachesAthlete(coaches, sanctionEventmeet[j]._id)

                }
                if (athletes.length > 0) {
                    await createEventMappingForCoachesAthlete(athletes, sanctionEventmeet[j]._id)
                }
                if (j == sanctionEventmeet.length - 1) {
                    responsedata = {
                        success: true,
                    }
                    return responsedata
                }
            }
        } else {
            responsedata = {
                success: true,
            }
            return responsedata
        }

    }

    function createEventMappingForCoachesAthlete(competitors, eventmeetid) {
        return new Promise(async(resolve, reject) => {
            for (var i = 0; i < competitors.length; i++) {
                await createEventMeetMapping(competitors[i].Flyp10UserID, eventmeetid)
                if (i == competitors.length - 1) {
                    resolve()
                }
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
                    var newEvent = APIModule.CreateEventMeeetCoachMapping(modelInfo);
                    dataProviderHelper.save(newEvent).then((res) => {
                        resolve();
                    })
                } else {
                    resolve()
                }
            })


        })

    }

    function getSanctionEventMeet(sanctionId) {
        return new Promise((resolve, reject) => {
            var query = {};
            query.SanctionID = sanctionId;
            dataProviderHelper.find(EventMeetModel, query).then((response) => {
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
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
                } else {
                    resolve([])
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
                } else {
                    resolve([])
                }
            })

        })

    }

    function getSanctionAdministrators(SanctionID) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [{ SanctionID: SanctionID }]
                    }

                },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "AdminID",
                        foreignField: "MemberID",
                        as: "MemberInfo"
                    }
                },

                { "$unwind": "$MemberInfo" },
                {
                    "$project": {

                        "Flyp10UserID": "$MemberInfo.Flyp10UserID",

                    }
                }

            ]

            dataProviderHelper.aggregate(SanctionAdministrator, query).then((response) => {
                if (response.length > 0) {
                    resolve(response)

                } else {
                    resolve([])
                }
            })
        })
    }

    function getSanctionOrganizer(SanctionID) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [{ deleted: false }, { SanctionID: SanctionID }]
                    }

                },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "MeetDirectorID",
                        foreignField: "MemberID",
                        as: "MemberInfo"
                    },

                },

                { "$unwind": "$MemberInfo" },
                {
                    "$project": {

                        "Flyp10UserID": "$MemberInfo.Flyp10UserID",

                    }
                }

            ]

            dataProviderHelper.aggregate(Sanction, query).then((response) => {
                if (response.length > 0) {
                    resolve(response)

                } else {
                    resolve([])
                }
            })
        })
    }

    function getSanctionAdminByAdminID(SanctionID, memberID) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {
                        $and: [{ SanctionID: SanctionID }, { AdminID: memberID }]
                    }

                },


                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "AdminID",
                        foreignField: "MemberID",
                        as: "MemberInfo"
                    },

                },

                { "$unwind": "$MemberInfo" },
                {
                    "$project": {

                        "Flyp10UserID": "$MemberInfo.Flyp10UserID",

                    }
                }

            ]
            dataProviderHelper.aggregate(SanctionAdministrator, query).then((response) => {

                if (response.length > 0) {
                    resolve(response[0])
                } else {
                    resolve({})
                }
            })
        })


    }

    async function EnrollEventMeetForSanctionAdminstrators(sanctionID, AdminID) {
        var sanctionEventmeet = await getSanctionEventMeet(sanctionID);
        var sanctionadminbyAdminID = await getSanctionAdminByAdminID(sanctionID, AdminID)
        var sanctionOrganizer = await getSanctionOrganizer(sanctionID);
        var competitors = sanctionOrganizer.concat(sanctionadminbyAdminID)
        console.log(sanctionEventmeet.length)
        if (sanctionEventmeet.length > 0) {
            for (var j = 0; j < sanctionEventmeet.length; j++) {
                for (var i = 0; i < competitors.length; i++) {
                    sanctionEventmeet[j]['userId'] = competitors[i].Flyp10UserID;
                    console.log(sanctionEventmeet[j])
                    await CreateenrollEventMeet(sanctionEventmeet[j])
                }
            }
        }
    }

    function CreateenrollEventMeet(data) {
        return new Promise((resolve, reject) => {
            var query = {};
            console.log('dfdffd')
            query.userId = data.userId;
            query.eventMeetId = data._id;
            dataProviderHelper.checkForDuplicateEntry(EnrollEventMeetModel, query)
                .then(function(count) {
                    console.log(count)
                    if (count > 0) {
                        // throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.faq.alreadyExistsFaq + '"}');
                        resolve()
                    } else {
                        console.log(data, "asd")
                        var enrollEvent = APIModule.CreateenrollEventMeet(data)
                        dataProviderHelper.save(enrollEvent);
                        resolve()
                    }

                })
        })
    }
    _p.EnrollEventMeetForSanctionOrganizerAdminstrators = async function(req, res, next) {

        var organizer = await getSanctionOrganizer(req.body.SanctionID);
        var administrators = await getSanctionAdministrators(req.body.SanctionID);
        var competitors = organizer.concat(administrators);
        for (var i = 0; i < competitors.length; i++) {
            req.body.userId = competitors[i].Flyp10UserID;
            await CreateenrollEventMeet(req.body)
            if (i == competitors.length - 1) {
                res.json({
                    success: true
                })
            }

        }
    }

    function checkValidationForSanction(req, res) {
        return new Promise((resolve, reject) => {
            if (req.query.sanction) {
                var query = {
                    SanctionID: req.query.sanction,
                    deleted: false
                }
                dataProviderHelper.find(Sanction, query).then((response) => {
                    if (response.length > 0) {
                        resolve()
                    } else {
                        res.status(HTTPStatus.NOT_FOUND);
                        res.json({
                            status: "Invalid SanctionID",
                        })
                    }


                })
            } else {
                res.status(HTTPStatus.NOT_FOUND);
                res.json({
                    status: "Invalid SanctionID",
                })
            }

        })
    }

    function comparePassword(password, user) {
        return new Promise(async(resolve, reject) => {
            var isMatch = hasher.comparePassword(password, user.password)
            resolve(isMatch)
        })
    }

    function checkUserAuthorization(req, res, next) {
        return new Promise(async(resolve, reject) => {
            if (req.headers.authorization) {
                var authorization = req.headers.authorization.split(' ');
                var credential = authorization.length > 1 ? authorization[1].split(':') : '';
                var username = credential.length > 1 ? credential[0] : '';
                var password = credential.length > 1 ? credential[1] : '';
                var query = {
                    username: username,
                    password: password,
                    deleted: false
                }
                dataProviderHelper.findOne(Flyp10APIUser, query).then(async(user) => {
                    if (user) {

                        resolve()
                    } else {
                        res.json({
                            status: "Invalid credential"
                        })
                    }
                })
            } else {
                res.json({
                    status: "Invalid credential"
                })
            }


        })
    }
    _p.getSanctionScores = async function(req, res, next) {
        try {
            _p.logActivity(req.query.sanction + " => Start Time =>" + new Date())
        } catch (e) {

        }
        var SanctionID = req.query.sanction;

        await checkValidationForSanction(req, res);
        await checkUserAuthorization(req, res)


        var query = [{
                $match: {
                    $and: [{ 'deleted': false }, { routinestatus: '1' }, { SanctionID: SanctionID }, ]
                }

            },
            {
                $lookup: {
                    from: "USAG-Membership-Verification",
                    localField: "uid",
                    foreignField: "Flyp10UserID",
                    as: "memberInfo"
                }
            },
            { "$unwind": "$memberInfo" },
            {
                $lookup: {
                    from: "EventMeetForJudging",
                    localField: "_id",
                    foreignField: "routineId",
                    as: "judges"
                }
            },
            {
                $group: {
                    _id: { "USAGID": "$memberInfo.MemberID", },

                    routines: { $push: "$$ROOT" }
                }
            },
        ]
        dataProviderHelper.aggregate(Routine, query).then((response) => {
            if (response.length > 0) {
                try {
                    _p.logActivity(req.query.sanction + " => reponse return Time =>" + new Date())
                } catch (e) {}
                var athletes = []
                for (var i = 0; i < response.length; i++) {
                    var athlete = {}
                    athlete.entrant = response[i]._id.USAGID;
                    athlete.scores = [];
                    var routines = response[i].routines;
                    var scores = []
                    for (var j = 0; j < routines.length; j++) {
                        var judges = [];
                        for (var k = 0; k < routines[j].judges.length; k++) {
                            judges.push(routines[j].judges[k].score)
                        }
                        var routinescore = {
                            event: routines[j].event,
                            finalScore: parseFloat(routines[j].score.toFixed(2)),
                            judges: judges,
                            nd: routines[j].nd ? '-' + routines[j].nd : 0
                        }
                        scores.push(routinescore)

                        if (j === routines.length - 1) {
                            athlete.scores = scores;
                            athletes.push(athlete)
                        }
                    }
                    if (i === response.length - 1) {
                        // var count = 0;
                        // for (var l = 0; l < athletes.length; l++) {
                        //     count = count + athletes[l].scores.length;
                        // }
                        try {
                            _p.logActivity(req.query.sanction + " => End Time =>" + new Date())
                        } catch (e) {}

                        res.json({
                            status: "success",
                            response: {
                                //  count: count,
                                // athletelength: athletes.length,
                                athletes: athletes
                            }
                        })
                    }

                }

            } else if (response.length == 0) {
                try {
                    _p.logActivity(req.query.sanction + " => End Time =>" + new Date())
                } catch (e) {

                }
                res.json({
                    status: "success",
                    response: {

                        athletes: athletes
                    }
                })
            } else {
                try {
                    _p.logActivity(req.query.sanction + " => Internal server error")
                } catch (e) {}

                res.status(HTTPStatus.INTERNAL_SERVER_ERROR);
                res.json({
                    message: "Internal server error"
                })



            }

        })
    }
    _p.logActivity = async function(logmsg) {
        // var root = __dirname.split('\\');
        // root.pop();
        // var rootPath = root.join('/')
        var date = formatDate()
        let fileName = '/mnt/volume_sfo2_01/errorlog/proscore_log_' + date + '.txt'
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

    function getSanctionClubs(sanctionId) {
        return new Promise((resolve, reject) => {
            var query = {};
            query.SanctionID = sanctionId;
            query.deleted = false;
            dataProviderHelper.find(Reservation, query).then((response) => {
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
                }
            })
        })
    }

    function getSanctionAthletewithClubInfo(sanctionid) {
        return new Promise((resolve, reject) => {
            //  var query = {};
            var Athlete = [];
            // query.deleted = false;
            // query.SanctionID = sanctionid
            var query = [{
                    $match: {
                        $and: [{ deleted: false }, { SanctionID: sanctionid }]
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




            ]
            dataProviderHelper.aggregate(AthleteReservation, query).then(async(athlete) => {
                if (athlete.length) {

                    resolve(athlete)
                } else {
                    resolve([])
                }

            })
        })


    }

    _p.usagmeetInfo = async function(req, res, next) {
        var eventmeet = await getSanctionEventMeet(req.params.sanctionID);
        var sanctionathletes = await getSanctionAthletewithClubInfo(req.params.sanctionID);
        var sanctionclubs = await getSanctionClubs(req.params.sanctionID)
        var sessions = [];
        var gymnasts = [];
        var gyms = [];
        for (var i = 0; i < eventmeet.length; i++) {
            var eventtype = eventmeet[i].SportName == 'Womens Gymnastics' ? 'ARTW' : 'ARTM';
            var id = eventmeet[i]._id.toString()
            var sessionId = id.slice(id.length - 4)
                //    console.log(i, "i")
            var session = {
                id: sessionId,
                rotationId: "1",
                eventType: eventtype,
                description: eventmeet[i].EventName,
                date: moment(eventmeet[i].StartDate).format('MM/DD/YYYY'),
            }
            sessions.push(session);
            for (var j = 0; j < sanctionathletes.length; j++) {

                var gymnast = {
                        memberId: sanctionathletes[j].USAGID,
                        gymId: sanctionathletes[j].ClubReservationInfo.ClubUSAGID,
                        sessionId: sessionId,
                        eventType: eventtype,
                        ageDiv: "All",


                    }
                    // console.log(j, "j")
                gymnasts.push(gymnast)
            }
            for (var k = 0; k < sanctionclubs.length; k++) {
                var gym = {
                    id: sanctionclubs[k].ClubUSAGID,
                    clubNum: sanctionclubs[k].ClubUSAGID,
                    shortName: sanctionclubs[k].ClubName
                }
                gyms.push(gym)
                    //  console.log(k, "k")

            }
            if (i === eventmeet.length - 1) {
                var data = {
                        sanctionId: req.params.sanctionID,
                        timeStamp: new Date(),
                        statusText: "Preparing...",
                        sanctionathletes: sanctionathletes.length,
                        gymnastslegth: gymnasts.length,
                        sanctionclubs: sanctionclubs.length,
                        gyms: gyms,
                        gymnasts: gymnasts,

                        rotationTypes: [{
                                id: 1,
                            },

                        ],
                        timeDefs: {
                            time1: "Flyp10 Virtual",
                            time2: "Flyp10 Virtual",
                            time3: "Flyp10 Virtual",
                            time4: "Flyp10 Virtual"
                        },
                        sessions: sessions


                    }
                    // console.log(data, "data")
                res.json({
                    data: data
                })
            }
        }


    }

    function getEventmeetAthleteScore(eventmeetId, levelId, sanctionID) {
        return new Promise((resolve, reject) => {
            var query = [{
                    $match: {

                        $and: [{ 'lid': mongoose.Types.ObjectId(levelId), eventMeetId: eventmeetId.toString() }]
                    }
                },
                {
                    $lookup: {
                        from: "USAG-Membership-Verification",
                        localField: "uid",
                        foreignField: "Flyp10UserID",
                        as: "memberInfo"
                    }
                },
                { "$unwind": "$memberInfo" },
                {
                    $lookup: {
                        from: "EventMeet-Athlete-Reservation",
                        let: { usagID: '$memberInfo.MemberID', sanctionID: sanctionID },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$USAGID", "$$usagID"] },
                                        { $eq: ["$SanctionID", "$$sanctionID"] },
                                        { $eq: ["$deleted", false] },

                                    ]
                                }
                            }
                        }, ],
                        as: "athlete"
                    }
                },
                { "$unwind": "$athlete" },
                {
                    $lookup: {
                        from: "EventMeet-Reservations",
                        localField: "athlete.MeetReservationID",
                        foreignField: "_id",
                        as: "club"
                    }
                },
                { "$unwind": "$club" },
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
                                $lookup: {
                                    from: "USAG-Membership-Verification",
                                    localField: "judgeId",
                                    foreignField: "Flyp10UserID",
                                    as: "judgeMemberInfo"
                                }
                            },
                            { "$unwind": "$judgeMemberInfo" },


                            {
                                $project: {
                                    _id: 0,
                                    id: "$judgeMemberInfo.MemberID",
                                    att: "1",
                                    score: "$score"


                                }
                            }


                        ],

                        as: "Judges"
                    }
                },
                {
                    $project: {
                        id: "$athlete.USAGID",
                        routineId: '$_id',
                        clubNum: "$club.ClubUSAGID",
                        level: "$level",
                        lid: "$lid",
                        eid: "$eid",
                        event: "$event",
                        judgeScore: "$Judges",
                        score: "$score"


                    }
                },
                {
                    $group: {
                        _id: { "athleteUSAGID": "$id", },

                        routines: { $push: "$$ROOT" }
                    }
                },
            ]
            dataProviderHelper.aggregate(Routine, query).then((response) => {
                if (response.length > 0) {
                    resolve(response)
                } else {
                    resolve([])
                }
            })
        })
    }

    function getRankingForEventMeet(eventmeet) {

        return new Promise(async(resolve, reject) => {
            console.log(eventmeet._id, 'eventmeetId')
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
                                routineId: routinelist[k]._id,
                                rank: '',
                                place: ''
                            }
                            users.push(user);
                            if (k == routinelist['length'] - 1) {
                                users = await ranking(users);
                                await users.sort((a, b) => {
                                    return a.rank - b.rank
                                });
                                console.log(users.length)
                                Ranking = Ranking.concat(users);
                                for (var k1 = 0; k1 < users.length; k1++) {

                                    for (var k2 = k1 + 1; k2 < users.length; k2++) {
                                        if (users[k1].rank == users[k2].rank) {
                                            var place = users[k1].rank + 'T'
                                            users[k1].place = place
                                            users[k2].place = place
                                        }


                                    }
                                    if (k1 === user.length - 1) {
                                        Ranking = Ranking.concat(users)
                                    }


                                }




                            }
                        }
                    }

                }

                if (i == levels.length - 1) {
                    resolve(Ranking)
                }
            }
        })


    }

    function ranking(arr) {
        return new Promise((resolve, reject) => {
            var f = (a, b) => b.score - a.score
            const sorted = arr.slice().sort(f)
            var rank = arr.map(x => sorted.findIndex(s => f(x, s) === 0) + 1)
            arr.forEach((user, i) => {
                user.rank = rank[i];
                user.place = rank[i];
                if (i == Array.length - 1) {
                    resolve(arr)
                }
            })

        })
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
                                { routinestatus: '1' }
                            ],
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
    _p.usagmeetscore = async function(req, res, next) {
        var eventmeet = await getSanctionEventMeet(req.params.sanctionID);
        var meetResults = [];
        for (var i = 0; i < eventmeet.length; i++) {
            var eventtype = eventmeet[i].SportName == 'Womens Gymnastics' ? 'ARTW' : 'ARTM';
            var id = eventmeet[i]._id.toString();
            var Eventlevelranking = await getRankingForEventMeet(eventmeet[i])
            var sessionId = id.slice(id.length - 4)
            var level = eventmeet[i].Levels;
            for (var j = 0; j < level.length; j++) {
                var athletes = [];
                var athlete = await getEventmeetAthleteScore(eventmeet[i]._id, level[j], req.params.sanctionID)

                var levelName = athlete[0].routines[0].level;
                for (var k = 0; k < athlete.length; k++) {
                    //  console.log(k)
                    var routines = athlete[k].routines
                    var scores = [];
                    var places = [];
                    for (var r = 0; r < routines.length; r++) {
                        var score = {
                                id: applicationConfig.EventNumber[routines[r].eid.toString()].eventNumber,
                                finalScore: routines[r].score,
                                eScore: routines[r].score,
                                judgeScores: routines[r].judgeScore

                            }
                            //console.log(score, "score")
                        scores.push(score);
                        //console.log(Eventlevelranking[0].routineId, routines[r].routineId)
                        var rr = Eventlevelranking.filter((ranking) => ranking.routineId.toString() == routines[r].routineId.toString())
                            //  console.log(rr, "rank")
                        var place = {
                            id: applicationConfig.EventNumber[routines[r].eid.toString()].eventNumber,
                            place: rr.length > 0 ? rr[0].place : '0',
                            rank: rr.length > 0 ? rr[0].rank : '0'

                        }
                        places.push(place)
                        if (r == routines.length - 1) {
                            var athleteInfo = {
                                id: routines[r].id,
                                clubNum: routines[r].clubNum,
                                session: sessionId,
                                level: routines[r].level,
                                ageDiv: "All",
                                scores: scores,
                                places: places
                            }
                            athletes.push(athleteInfo)
                        }



                    }
                    if (k === athlete.length - 1) {
                        var meet = {
                            eventType: eventtype,
                            level: levelName,
                            ageDiv: "All",
                            session: sessionId,
                            athletes: athletes
                        }
                        meetResults.push(meet)
                    }

                }


            }
            console.log(i, eventmeet.length)
            if (i == eventmeet.length - 1) {
                let data = {
                        sanctionId: req.params.sanctionID,
                        "timeStamp": new Date(),
                        "statusText": "Complete",
                        meetResults: meetResults
                    }
                    //  console.log(meetResults, "meetResults")
                res.json({
                    data: data

                })
            }


        }
    }
    _p.getAllSanction = function(req, res, next) {

        // //console.log('req.decoded.user.username',req.decoded.user._id)
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var sortOpts = { addedOn: -1 };
        dataProviderHelper.getAllWithDocumentFieldsPagination(Sanction, { deleted: false }, pagerOpts, null, sortOpts).then(resp => {
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
    return {
        postSanctionData: _p.postSanctionData,
        removeSanctionData: _p.removeSanctionData,
        updateSanctionData: _p.updateSanctionData,
        changevendorSanctionData: _p.changevendorSanctionData,
        getSanctionData: _p.getSanctionData,
        postReservationData: _p.postReservationData,
        updateReservationData: _p.updateReservationData,
        getReservationData: _p.getReservationData,
        postCoachReservation: _p.postCoachReservation,
        postAthleteReservation: _p.postAthleteReservation,
        postAthleteGroupReservation: _p.postAthleteGroupReservation,
        updateAthleteReservation: _p.updateAthleteReservation,
        updateAthleteGroupReservation: _p.updateAthleteGroupReservation,
        updateCoachReservation: _p.updateCoachReservation,
        removeSanctionApparatus: _p.removeSanctionApparatus,
        verifyMembership: _p.verifyMembership,
        saveUSAGrequest: _p.saveUSAGrequest,
        postJudgesData: _p.postJudgesData,
        updateJudgesData: _p.updateJudgesData,
        getUSAGverificationMemberID: _p.getUSAGverificationMemberID,
        getSanctionByMemberID: _p.getSanctionByMemberID,
        getSanctionByID: _p.getSanctionByID,
        getSanctionScores: _p.getSanctionScores,
        patchSanction: _p.patchSanction,
        usagmeetInfo: _p.usagmeetInfo,
        usagmeetscore: _p.usagmeetscore,
        getAllSanction: _p.getAllSanction,
        getSanctionInfoBySanctionID: _p.getSanctionInfoBySanctionID,
        getSanctionJudges: _p.getSanctionJudges,
        updateUSAGMember: _p.updateUSAGMember,
        getSanctionFlyp10UserStatus: _p.getSanctionFlyp10UserStatus,
        EnrollEventMeetForSanctionOrganizerAdminstrators: _p.EnrollEventMeetForSanctionOrganizerAdminstrators,
        getUSAGVerificationMemberIDByFlyp10UserID: _p.getUSAGVerificationMemberIDByFlyp10UserID,
        getSanctionMemberIDByFlyp10UserID: _p.getSanctionMemberIDByFlyp10UserID,
        getSanctionByAdminMemberID: _p.getSanctionByAdminMemberID,
        sanctionEventMeetmapping: _p.sanctionEventMeetmapping,
        checkMeetDirectorOrAdmin: _p.checkMeetDirectorOrAdmin,

    };


})();

module.exports = usagGymController;