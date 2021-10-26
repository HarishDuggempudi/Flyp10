var sportController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        HTTPStatus = require('http-status'),
        messageConfig = require('../configs/api.message.config'),
        sportModel = require('../models/sport.server.model'),

        Sport = sportModel.SportsModel,
        Category = sportModel.CategoryModel,
        Level = sportModel.LevelModel,
        EventModel = sportModel.EventModal,
        ElementGroup = sportModel.ElementGroup,
        Mapping = sportModel.MappingModel,
        Element = sportModel.Element,
        Pricing = sportModel.PricingModel,
        JudgeSport = require('../models/Judge-Sportdetail.server.model'),
        ScoreCard = require('../models/scorecardmodel'),
        SportJudgePanel = require('../models/sportjudges-panel.model'),
        ScoreCalculation = require('../models/USAG-Score-Calculation.model'),
        SportLevelSortOrder = require('../models/SportLevelSortOrder.model'),
        errorHelper = require('../helpers/error.helper'),
        utilityHelper = require('../helpers/utilities.helper'),
        CountryCurrency = require('../models/countrycurrency.server.model'),
        Promise = require("bluebird");
    var State = require('../models/state.model'),
        City = require('../models/city.model'),
        ZipCode = require('../models/zipcode.model');
    var documenteventfield = '_id Event eventFullname difficultyFactor active addedOn';
    var documentFields = '_id sportName selectLevel addnotes imageName imageProperties fieldsConfig active';
    var documentFieldsCategory = '_id categoryName active';
    var documentFieldsLevel = '_id level maxscore active';
    var documentelementfield = '_id elementName event skillValue factor active addedOn';
    var documentelementgroupfield = '_id elementGroup active addedOn';
    var documentMappingField = '_id sport level mappingFieldsVal';
    var documentFieldspricing = '_id sport sportid scoretype competitor judge technician deleted active addedOn';
    var mongoose = require('mongoose');
    const cron = require("node-cron");

    cron.schedule('59 23 * * *', () => {
        console.log("judesport expires jon run On-" + new Date().toString());

        var usaTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        //console.log('USA time: '+ (new Date(usaTime)))

        var monthNum = new Date(usaTime).getMonth() + 1,
            month = monthNum.toString().length == 1 ? "0" + monthNum.toString() : monthNum.toString()


        JudgeSport.update({ expdate: `${month}-${new Date(usaTime).getDate()}-${new Date(usaTime).getFullYear()}` }, { $set: { "status": '3' } }, function(err, updRes) {

            //console.log('updated expiry judge sport')
        })
    }, {
        scheduled: true,
        timezone: "America/New_York"
    });





    function SportModule() {}

    SportModule.CreateSport = function(sportObj, loggedInUser, imageInfo) {
        var sportInfo = new Sport();

        sportInfo.sportName = sportObj.sportName ? replaceSpecialCharaters(sportObj.sportName) : '';
        sportInfo.active = sportObj.active;
        sportInfo.addnotes = sportObj.addnotes;
        sportInfo.imageName = imageInfo._imageName;
        sportInfo.imageProperties = {
            imageExtension: imageInfo._imageExtension,
            imagePath: imageInfo._imagePath
        };
        sportInfo.fieldsConfig = {
            eventMapping: {
                added: sportObj.eventMapping
            },
            levelMapping: {
                added: sportObj.levelMapping
            },
            categoryMapping: {
                added: sportObj.categoryMapping
            },
            elementMapping: {
                added: sportObj.elementMapping
            },
            elementGroupMapping: {
                added: sportObj.elementGroupMapping
            },
            baseMapping: {
                added: sportObj.baseMapping
            }
        }

        return sportInfo;
    };
    SportModule.CreateSportJudgesPanel = function(sportObj) {
        var sportInfo = new SportJudgePanel();
        sportInfo.sportid = mongoose.Types.ObjectId(sportObj.sportid);
        sportInfo.sportName = sportObj.sportName;
        sportInfo.judgePanel = sportObj.JudgePanel;
        return sportInfo
    }
    SportModule.CreateScoreCalculation = function(scoreObj) {
        var scoreInfo = new ScoreCalculation();
        scoreInfo.sportid = mongoose.Types.ObjectId(scoreObj.sportid);
        scoreInfo.levelid = mongoose.Types.ObjectId(scoreObj.levelid);
        scoreInfo.eventid = mongoose.Types.ObjectId(scoreObj.eventid);
        scoreInfo.calculation = scoreObj.calculation
        return scoreInfo
    }
    SportModule.CreateSportlevelSortOrder = function(sportlevelObj) {
        var sportlevelInfo = new SportLevelSortOrder();
        sportlevelInfo.sportId = mongoose.Types.ObjectId(sportlevelObj.sportid);
        sportlevelInfo.levelId = mongoose.Types.ObjectId(sportlevelObj.levelid);
        sportlevelInfo.level = sportlevelObj.level
        sportlevelInfo.sortValue = sportlevelObj.sortValue
        return sportlevelInfo
    }
    SportModule.CreateMapping = function(mappingObj, loggedInUser) {
        var mappingInfo = new Mapping();

        //console.log('mapping info', mappingObj);
        mappingInfo._id = mappingObj._id;
        mappingInfo.sport = mappingObj.sport;
        mappingInfo.level = mappingObj.level;
        mappingInfo.mappingFieldsVal = mappingObj.mappingFieldsVal;

        //console.log('Mapping info from CreateMapping ', mappingInfo);

        return mappingInfo;
    };


    SportModule.createElement = function(elementobj, loginUser) {
        var element = new Element();
        element.elementName = elementobj.elementName ? replaceSpecialCharaters(elementobj.elementName) : '';
        element.event = mongoose.Types.ObjectId(elementobj.event);
        element.skillValue = elementobj.skillValue;
        element.factor = elementobj.factor;
        element.active = elementobj.active;
        element.addedBy = loginUser;
        element.addedOn = new Date();
        //console.log("sportelement",element)
        return element;
    }

    SportModule.CreateScoreCard = function(cardObj, loginUser) {
        var settings = new ScoreCard();
        settings.sportid = mongoose.Types.ObjectId(cardObj.sportsName);
        settings.skillvalue = cardObj.skillvalue;
        settings.execution = cardObj.execution;
        settings.factor = cardObj.factor;
        settings.time = cardObj.time;
        settings.bonus = cardObj.bonus;
        settings.addedBy = loginUser;
        settings.addedOn = new Date();
        return settings;
    }
    SportModule.CreatePricing = function(pricingobj, loginUser) {
        var pricing = new Pricing();
        pricing.sportid = mongoose.Types.ObjectId(pricingobj.sportid);
        pricing.sport = pricingobj.sport;
        pricing.scoretype = pricingobj.scoretype;
        pricing.competitor = pricingobj.competitor;
        pricing.judge = pricingobj.judge;
        pricing.active = true;
        pricing.addedBy = loginUser;
        pricing.addedOn = new Date();
        pricing.technician = pricingobj.technician
        return pricing;
    }
    SportModule.createElementGroup = function(elementgroupobj, loginUser) {
        var elementGroup = new ElementGroup();
        elementGroup.elementGroup = elementgroupobj.elementGroup;
        elementGroup.active = elementgroupobj.active;
        elementGroup.addedBy = loginUser;
        elementGroup.addedOn = new Date();
        return elementGroup;
    }

    SportModule.createEvent = function(eventobj, loginUser) {
        var event = new EventModel();
        event.sportsName = eventobj.sportsName;
        event.Event = eventobj.Event;
        event.eventFullname = eventobj.eventFullname;
        event.difficultyFactor = eventobj.difficultyFactor;
        event.active = eventobj.active;
        event.addedBy = loginUser;
        event.addedOn = new Date();
        return event;
    };

    SportModule.CreateCategory = function(categoryObj, loggedInUser) {
        var categoryInfo = new Category();

        categoryInfo.categoryName = categoryObj.categoryName;
        categoryInfo.active = categoryObj.active;

        return categoryInfo;
    };

    SportModule.CreateLevel = function(levelObj, loggedInUser) {
        var levelInfo = new Level();

        levelInfo.level = levelObj.level;
        levelInfo.active = levelObj.active;
        levelInfo.maxscore = levelObj.maxscore;
        return levelInfo;
    };
    SportModule.CreatecountryCurrency = function(countryObj, loggedInUser) {
        var countryInfo = new CountryCurrency();

        countryInfo.Country = countryObj.Country;
        countryInfo.Currency = countryObj.Currency;
        countryInfo.Exponents = countryObj.Exponents;
        countryInfo.addedBy = loggedInUser;
        countryInfo.active = countryObj.active;
        countryInfo.deleted = false
        return countryInfo;
    };
    var _p = SportModule.prototype;

    _p.getAllSportsElementGroup = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};

        if (req.query.active) {
            query.active = true;
        }
        query.deleted = false;
        var sortOpts = { addedOn: -1 };

        return dataProviderHelper.getAllWithDocumentFieldsPagination(ElementGroup, query, pagerOpts, documentelementgroupfield, sortOpts);
    };
    _p.getSportsElementgroupByID = function(req) {
        //console.log(req.params.elementgroupid) 
        return dataProviderHelper.findById(ElementGroup, req.params.elementgroupid, documentelementgroupfield);
    };
    _p.postElementGroup = function(req, res, next) {
        if (req.body.elementGroup) {
            ////console.log(req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.elementGroup = req.body.elementGroup;
            query.deleted = false
            dataProviderHelper.checkForDuplicateEntry(ElementGroup, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.elementgroup.alreadyExistsElementgroup + '"}');
                    } else {
                        var elementGroupObj = SportModule.createElementGroup(modelInfo, req.decoded.user.username);
                        return dataProviderHelper.save(elementGroupObj);
                    }
                })
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
    _p.updateSportElementGroup = function(req, res, next) {
        if (req.body.elementGroup) {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);

            var query = {};
            query.elementGroup = req.body.elementGroup;
            query._id = { $ne: req.params.elementgroupid }
            query.deleted = false;
            //console.log(query)
            dataProviderHelper.checkForDuplicateEntry(ElementGroup, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.elementgroup.alreadyExistsElementgroup + '"}');
                    } else {
                        //console.log("inside update")
                        return _p.updateElementgroupFunc(req, res, modelInfo);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.elementgroup.updateMessageElementgroup
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
                message: messageConfig.elementgroup.notFoundElementgroup
            });
        }
    };
    _p.updateElementgroupFunc = function(req, res, modelInfo) {
        //   //console.log("req.eventObj",req)
        req.elementgroupinfo.elementGroup = modelInfo.elementGroup;
        req.elementgroupinfo.active = modelInfo.active;
        req.elementgroupinfo.updatedBy = req.decoded.user.username;
        req.elementgroupinfo.updatedOn = new Date();
        return dataProviderHelper.save(req.elementgroupinfo);
    };
    _p.patchSportElementGroup = function(req, res, next) {
        req.elementgroupinfo.deleted = true;
        req.elementgroupinfo.deletedOn = new Date();
        req.elementgroupinfo.deletedBy = req.decoded.user.username;

        var _query = {
            '_Id': req.params.elementgroupid,
            'deleted': false
        };

        dataProviderHelper.checkForDuplicateEntry(ElementGroup, _query)
            .then(function(count) {
                if (count > 0) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.elementgroup.elementDeleteDenygroup + '"}');
                } else {
                    dataProviderHelper.save(req.elementgroupinfo)
                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.elementgroup.deleteMessageElementgroup
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });
    };
    _p.getSportsElement = function(req, next) {
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = [

                { $match: { "deleted": false } },
                {


                    $lookup: {
                        from: "SportsEvent",
                        localField: 'event',
                        foreignField: '_id',
                        as: 'eventInfo'
                    }

                },
                { $unwind: "$eventInfo" }
            ]
            //matches anything that exactly matches the inputted category name, case  insensitive
            // if(req.query.categoryname){
            //     query.categoryName = { $regex: new RegExp('^'+ req.query.categoryname + '$', "i") };
            // }
            /*         if(req.query.active){
                        query.active = true;
                    }
                    query.deleted = false; */
        var sortOpts = { addedOn: -1 };

        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Element, query, pagerOpts, documentelementfield, sortOpts);
    };
    _p.getAllSportsElement = function(req, next) {

        var query = {};
        query.active = true;
        query.deleted = false;
        return dataProviderHelper.find(Element, query);
    };
    _p.getElementByevent = function(req) {
        var query = {};
        query.event = req.params.eventid;
        query.active = true;
        query.deleted = false;
        return dataProviderHelper.find(Element, query);
    };

    _p.getStates = function(req) {
        var query = {};
        return dataProviderHelper.find(State, query);
    };
    _p.getCitybyStateID = function(req) {

        var query = { '$or': [{ StateID: req.params.stateID.toString() }, { StateID: Number(req.params.stateID) }] };
        // //console.log(query)		
        return dataProviderHelper.findandsort(City, query, { StateID: 1 });
    };
    _p.getZipCodebyStateID = function(req) {
        var query = { '$or': [{ StateID: req.params.stateID.toString() }, { StateID: Number(req.params.stateID) }] };
        // query.CityID=req.params.cityID
        // //console.log(query)					
        return dataProviderHelper.find(ZipCode, query);
    };
    _p.getSportsElementByID = function(req) {

        return dataProviderHelper.findById(Element, req.params.elementid, documentelementfield);
    };
    _p.postElement = function(req, res, next) {
        if (req.body.elementName) {
            //console.log(req.body.elementName,"req")
            // var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            //  //console.log(modelInfo.elementName,"modelInfo")
            var query = {};
            query.elementName = req.body.elementName ? req.body.elementName.toLowerCase() : req.body.elementName;
            query.event = mongoose.Types.ObjectId(req.body.event)
            query.deleted = false
            dataProviderHelper.checkForDuplicateEntry(Element, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.element.alreadyExistsElement + '"}');
                    } else {
                        var elementObj = SportModule.createElement(req.body, req.decoded.user.username);
                        return dataProviderHelper.save(elementObj);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.element.saveMessageElement
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
                message: messageConfig.element.fieldRequiredElement
            });
        }
    };
    _p.updateSportElement = function(req, res, next) {
        if (req.body.elementName) {
            //     var modelInfo = utilityHelper.sanitizeUserInput(req, next);

            var query = {};
            query.elementName = req.body.elementName;
            query.event = mongoose.Types.ObjectId(req.body.event)
            query._id = { $ne: req.params.elementid }
            query.deleted = false;

            dataProviderHelper.checkForDuplicateEntry(Element, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.element.alreadyExistsElement + '"}');
                    } else {
                        //console.log("inside update")
                        return _p.updateElementFunc(req, res, req.body);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.element.updateMessageElement
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
                message: messageConfig.element.fieldRequiredElement
            });
        }
    };
    _p.createSportJudgesPanel = function(req, res, next) {

        var sportJudgePanel = SportModule.CreateSportJudgesPanel(req.body)
        return dataProviderHelper.save(sportJudgePanel);

    }
    _p.updateElementFunc = function(req, res, modelInfo) {
        //   //console.log("req.eventObj",req)
        req.elementinfo.elementName = modelInfo.elementName ? replaceSpecialCharaters(modelInfo.elementName) : "";
        req.elementinfo.event = mongoose.Types.ObjectId(modelInfo.event);
        req.elementinfo.skillValue = modelInfo.skillValue;
        req.elementinfo.factor = modelInfo.factor;
        req.elementinfo.active = modelInfo.active;
        req.elementinfo.updatedBy = req.decoded.user.username;
        req.elementinfo.updatedOn = new Date();
        return dataProviderHelper.save(req.elementinfo);
    };
    _p.patchSportElement = function(req, res, next) {
        req.elementinfo.deleted = true;
        req.elementinfo.deletedOn = new Date();
        req.elementinfo.deletedBy = req.decoded.user.username;

        var _query = {
            '_Id': req.params.elementid,
            'deleted': false
        };

        dataProviderHelper.checkForDuplicateEntry(Element, _query)
            .then(function(count) {
                if (count > 0) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.element.elementDeleteDeny + '"}');
                } else {
                    dataProviderHelper.save(req.elementinfo)
                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.element.deleteMessageElement
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });
    };
    _p.getSportsEvent = function(req, next) {
        //console.log('get sports event ------------')
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};
        //matches anything that exactly matches the inputted category name, case  insensitive
        // if(req.query.categoryname){
        //     query.categoryName = { $regex: new RegExp('^'+ req.query.categoryname + '$', "i") };
        // }
        if (req.query.active) {
            query.active = true;
        }
        query.deleted = false;
        var sortOpts = { addedOn: -1 };

        return dataProviderHelper.getAllWithDocumentFieldsPagination(EventModel, query, pagerOpts, documenteventfield, sortOpts);
        // //console.log(response)
        //response.totaldataItem = _p.getalllist(EventModel,query,req,next);
        ////console.log('response',response.totaldataItem)
        //return response
    };
    _p.getalllist = function(model, query, req, next) {

        return dataProviderHelper.find(model, query);
    };
    _p.getAllSportsEventlist = function(req, next) {
        var query = {};
        query.active = true;
        query.deleted = false;
        return dataProviderHelper.find(EventModel, query);
    };
    _p.getSportsEventByID = function(req) {

        return dataProviderHelper.findById(EventModel, req.params.eventid, documenteventfield);
    };
    _p.getSportsEventByEvent = function(req) {
        let query = {};
        if (req.params.event) {
            query.Event = req.params.event;
        }
        if (req.params.event1) {
            query.Event = req.params.event1 + '/' + req.params.event2;
        }
        console.log(query.Event, "sdsd  ")
        query.deleted = false;
        return dataProviderHelper.find(EventModel, query);
    };
    _p.getSportsInfobysport = function(req) {
        let query = {};
        query.sport = mongoose.Types.ObjectId(req.params.sports);
        //console.log(query)
        return dataProviderHelper.find(Mapping, query);
    };
    _p.postEvent = function(req, res, next) {
        //console.log('inside post event');
        if (req.body.Event) {
            //console.log("post request obj", req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.Event = req.body.Event;
            dataProviderHelper.checkForDuplicateEntry(EventModel, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.eventManager.alreadyExists + '"}');
                    } else {
                        var eventObj = SportModule.createEvent(modelInfo, req.decoded.user.username);
                        return dataProviderHelper.save(eventObj);
                    }
                })
                .then(function() {
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
        } else {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: messageConfig.eventManager.fieldRequired
            });
        }
    };
    _p.patchSportEvent = function(req, res, next) {
        req.eventinfo.deleted = true;
        req.eventinfo.deletedOn = new Date();
        req.eventinfo.deletedBy = req.decoded.user.username;

        var query = {};
        query._id = req.params.eventid;
        query.deleted = true;

        dataProviderHelper.checkForDuplicateEntry(EventModel, query)
            .then(function(count) {
                if (count > 0) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.eventManager.alreadyExists + '"}');
                } else {
                    dataProviderHelper.save(req.eventinfo)
                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.eventManager.deleteMessage
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });
    };
    _p.updateSportEvent = function(req, res, next) {
        if (req.body.Event) {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);

            var query = {};
            query._id = { $ne: req.params.eventid }
            query.Event = req.body.Event;
            query.deleted = false;

            dataProviderHelper.checkForDuplicateEntry(EventModel, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.eventManager.alreadyExists + '"}');
                    } else {
                        //console.log("inside update")
                        return _p.updateSportFunc(req, res, modelInfo);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.eventManager.updateMessage
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
                message: messageConfig.eventManager.fieldRequired
            });
        }
    };


    _p.updateSportFunc = function(req, res, modelInfo) {
        //console.log("req.eventObj",req)

        req.eventinfo.Event = modelInfo.Event
        req.eventinfo.eventFullname = modelInfo.eventFullname;
        req.eventinfo.difficultyFactor = modelInfo.difficultyFactor;
        req.eventinfo.active = modelInfo.active;
        req.eventinfo.updatedBy = req.decoded.user.username;
        req.eventinfo.updatedOn = new Date();
        return dataProviderHelper.save(req.eventinfo);
    };

    _p.checkValidationErrors = function(req) {

        req.checkBody('sportName', messageConfig.sport.validationErrMessage.sportName).notEmpty();

        return req.validationErrors();
    };

    _p.checkMappingValidationErrors = function(req) {

        req.checkBody('sport', messageConfig.sport.validationErrMessage.sport).notEmpty();

        return req.validationErrors();
    };

    // Category controller functions

    _p.checkCategoryValidationErrors = function(req) {

        req.checkBody('categoryName', messageConfig.sport.validationErrMessage.sportName).notEmpty();

        return req.validationErrors();
    };

    _p.getAllCategories = function(req, next) {
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};
        //console.log('category name', req.query.categoryName);

        // matches anything that  starts with the inputted sport name, case insensitive
        if (req.query.categoryName) {
            query.categoryName = { $regex: new RegExp('.*' + req.query.categoryName, "i") };
        }
        if (req.query.active) {
            query.active = req.query.active;
        }
        query.deleted = false;

        return dataProviderHelper.getAllWithDocumentFieldsPagination(Category, query, pagerOpts, documentFieldsCategory, { addedOn: -1 });
    };

    _p.getCategoryByID = function(req) {
        return dataProviderHelper.findById(Category, req.params.categoryId, documentFieldsCategory);
    };

    _p.patchCategory = function(req, res, next) {
        req.categoryInfo.deleted = true;
        req.categoryInfo.deletedOn = new Date();
        req.categoryInfo.deletedBy = req.decoded.user.username;

        var _query = {
            '_Id': req.params.categoryId,
            'deleted': false
        };

        dataProviderHelper.checkForDuplicateEntry(Category, _query)
            .then(function(count) {
                //console.log(count,_query)
                if (count > 1) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.category.categoryDeleteDeny + '"}');
                } else {
                    dataProviderHelper.save(req.categoryInfo)
                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.category.deleteMessagecategory
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });
    };

    _p.postCategory = function(req, res, next) {

        if (req.body.categoryName) {
            //console.log(req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.categoryName = req.body.categoryName;
            query.deleted = false
            dataProviderHelper.checkForDuplicateEntry(Category, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.category.alreadyExistscategory + '"}');
                    } else {
                        var categoryObj = SportModule.CreateCategory(modelInfo, req.decoded.user.username);
                        return dataProviderHelper.save(categoryObj);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.category.saveMessagecategory
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
                message: messageConfig.category.fieldRequiredcategory
            });
        }
    };

    _p.updateCategory = function(req, res, next) {
        if (req.body.categoryName) {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.categoryName = req.body.categoryName;
            query._id = { $ne: req.params.categoryid }
            query.deleted = false;
            //console.log(query)
            dataProviderHelper.checkForDuplicateEntry(Category, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.category.alreadyExistscategory + '"}');
                    } else {
                        //console.log("inside update")
                        return _p.updateCategoryFunc(req, res, modelInfo);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({

                        message: messageConfig.category.updateMessagecategory
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
                message: messageConfig.category.notFoundcategory
            });
        }

    };

    _p.updateCategoryFunc = function(req, res, modelInfo) {
        //   //console.log("req.eventObj",req)
        req.categoryInfo.categoryName = modelInfo.categoryName;
        req.categoryInfo.active = modelInfo.active;
        req.categoryInfo.updatedBy = req.decoded.user.username;
        req.categoryInfo.updatedOn = new Date();
        return dataProviderHelper.save(req.categoryInfo);
    };

    // Level controller functions

    _p.checkLevelValidationErrors = function(req) {

        req.checkBody('level', messageConfig.sport.validationErrMessage.sportName).notEmpty();

        return req.validationErrors();
    };

    _p.getSportPricing = function(req, next) {
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);
        var query = [{
                $match: { 'deleted': false, 'active': true }
            },
            {
                $lookup: {
                    from: "Sport",
                    localField: "sportid",
                    foreignField: "_id",
                    as: "sportinfo"
                }
            }, {
                $unwind: "$sportinfo"
            },
        ];
        // query.deleted = false;
        // query.active=true;
        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(Pricing, query, pagerOpts, documentFieldspricing, { addedOn: -1 });
    };
    _p.getSportpricingByID = function(req) {
        return dataProviderHelper.findById(Pricing, req.params.priceid, documentFieldspricing);
    };
    _p.getSportpricingBysportID = function(req) {
        var query = {};
        query.sportid = req.params.priceid;
        query.scoretype = req.params.scoretype;
        query.deleted = false;
        return dataProviderHelper.find(Pricing, query);
    };
    _p.postSportPricing = function(req, res, next) {
        if (req.body.sport && req.body.scoretype) {

            //console.log(req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.sportid = req.body.sportid;
            query.scoretype = req.body.scoretype;
            query.deleted = false
            dataProviderHelper.checkForDuplicateEntry(Pricing, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.pricing.alreadyExistsPricing + '"}');
                    } else {
                        var pricingObj = SportModule.CreatePricing(modelInfo, req.decoded.user.username);
                        return dataProviderHelper.save(pricingObj);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.pricing.saveMessagePricing
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
                message: messageConfig.pricing.fieldRequiredpricing
            });
        }
    }

    _p.updateSportPricing = function(req, res, next) {
        if (req.body.sportid) {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.sportid = mongoose.Types.ObjectId(req.body.sportid);
            query.scoretype = req.body.scoretype;
            query._id = { $ne: req.params.priceid }
            query.deleted = false;
            //console.log(query)
            dataProviderHelper.checkForDuplicateEntry(Pricing, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.pricing.alreadyExistsPricing + '"}');
                    } else {
                        //console.log("inside update")
                        //console.log(modelInfo,'pricingInfo')
                        return _p.updatpricingFunc(req, res, modelInfo);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.pricing.updateMessagePricing
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
                message: messageConfig.pricing.notFoundPricing
            });
        }


    };

    _p.updatpricingFunc = function(req, res, modelInfo) {

        req.pricinginfo.sport = modelInfo.sport;
        req.pricinginfo.sportid = mongoose.Types.ObjectId(modelInfo.sportid);
        req.pricinginfo.scoretype = modelInfo.scoretype;
        req.pricinginfo.competitor = modelInfo.competitor;
        req.pricinginfo.judge = modelInfo.judge;
        req.pricinginfo.technician = modelInfo.technician;
        req.pricinginfo.active = modelInfo.active;
        req.pricinginfo.updatedBy = req.decoded.user.username;
        req.pricinginfo.updatedOn = new Date();
        //console.log('dffdfdf',req.pricinginfo)
        return dataProviderHelper.save(req.pricinginfo);
    };

    _p.patchSportPricing = function(req, res, next) {
        req.pricinginfo.deleted = true;
        req.pricinginfo.deletedOn = new Date();
        req.pricinginfo.deletedBy = req.decoded.user.username;

        var _query = {
            '_Id': req.params.priceid,
            'deleted': false
        };

        dataProviderHelper.checkForDuplicateEntry(Pricing, _query)
            .then(function(count) {
                //console.log(count,_query)
                if (count > 1) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.pricing.PricingDeleteDeny + '"}');
                } else {

                    dataProviderHelper.save(req.pricinginfo)
                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.pricing.deleteMessagePricing
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });
    };

    _p.getAllLevels = function(req, next) {
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};
        //console.log('Level name', req.query.level);

        // matches anything that  starts with the inputted sport name, case insensitive
        if (req.query.level) {
            query.level = { $regex: new RegExp('.*' + req.query.level, "i") };
        }
        if (req.query.active) {
            query.active = req.query.active;
        }
        query.deleted = false;

        return dataProviderHelper.getAllWithDocumentFieldsPagination(Level, query, pagerOpts, documentFieldsLevel, { addedOn: -1 });
    };

    _p.getLevelByID = function(req) {
        return dataProviderHelper.findById(Level, req.params.levelId, documentFieldsLevel);
    };
    _p.getusersportpricing = function(req, res, next) {

        var query = [{
                $match: { 'deleted': false }
            },
            {
                $group: {
                    _id: "$sportid",
                    scoreonlywithnotes: { $push: { $cond: { if: { $eq: ["$scoretype", '2'] }, then: "$competitor", else: null } } },
                    scoreonly: { $push: { $cond: { if: { $eq: ["$scoretype", '1'] }, then: "$competitor", else: null } } }

                }

            }, {

                $lookup: {
                    from: "Sport",
                    localField: "_id",
                    foreignField: "_id",
                    as: "sportinfo"
                }
            }, {
                $unwind: "$sportinfo"
            },
            {
                $project: {
                    scoreonlywithnotes: {
                        $filter: {
                            input: "$scoreonlywithnotes",
                            as: "item",
                            cond: { $ne: ["$$item", null] }
                        }
                    },
                    scoreonly: {
                        $filter: {
                            input: "$scoreonly",
                            as: "item1",
                            cond: { $ne: ["$$item1", null] }
                        }
                    },
                    sport: '$sportinfo.sportName'
                }
            }
        ]

        return dataProviderHelper.aggregate(Pricing, query);

    }
    _p.patchLevel = function(req, res, next) {
        req.levelInfo.deleted = true;
        req.levelInfo.deletedOn = new Date();
        req.levelInfo.deletedBy = req.decoded.user.username;

        var _query = {
            '_Id': req.params.levelId,
            'deleted': false
        };

        dataProviderHelper.checkForDuplicateEntry(Level, _query)
            .then(function(count) {
                //console.log(count,_query)
                if (count > 1) {
                    throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.level.levelDeleteDeny + '"}');
                } else {
                    dataProviderHelper.save(req.levelInfo)
                }
            })
            .then(function() {
                res.status(HTTPStatus.OK);
                res.json({
                    message: messageConfig.level.deleteMessagelevel
                });
            })
            .catch(Promise.CancellationError, function(cancellationErr) {
                errorHelper.customErrorResponse(res, cancellationErr, next);
            })
            .catch(function(err) {
                return next(err);
            });
    };

    _p.postLevel = function(req, res, next) {
        if (req.body.level) {
            //console.log(req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.level = req.body.level;
            query.deleted = false
            dataProviderHelper.checkForDuplicateEntry(Level, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.level.alreadyExistslevel + '"}');
                    } else {
                        var levelObj = SportModule.CreateLevel(modelInfo, req.decoded.user.username);
                        return dataProviderHelper.save(levelObj);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.level.saveMessagelevel
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
                message: messageConfig.level.fieldRequiredlevel
            });
        }
    };

    _p.updateLevel = function(req, res, next) {
        //console.log('req.body ==============> ', req.body);
        if (req.body.level) {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.level = req.body.level;
            query._id = { $ne: req.params.levelId }
            query.deleted = false;
            //console.log(query)
            dataProviderHelper.checkForDuplicateEntry(Level, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.level.alreadyExistslevel + '"}');
                    } else {
                        //console.log("inside update")
                        return _p.updatelevelFunc(req, res, modelInfo);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: messageConfig.level.updateMessagelevel
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
                message: messageConfig.level.notFoundlevel
            });
        }


    };

    _p.updatelevelFunc = function(req, res, modelInfo) {
        //console.log("req.levelInfo",req.levelInfo);
        req.levelInfo.level = modelInfo.level;
        req.levelInfo.maxscore = modelInfo.maxscore;
        req.levelInfo.active = modelInfo.active;
        req.levelInfo.updatedBy = req.decoded.user.username;
        req.levelInfo.updatedOn = new Date();
        return dataProviderHelper.save(req.levelInfo);
    };



    // Sports ==========================================================

    _p.getAllSports = function(req, next) {
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};
        // //console.log('sport name req', req.query.sportName);

        // matches anything that  starts with the inputted sport name, case insensitive
        if (req.query.sportName) {
            query.sportName = { $regex: new RegExp('.*' + req.query.sportName, "i") };
        }
        if (req.query.active) {
            query.active = req.query.active;
        }
        query.deleted = false;
        //  //console.log('after query mapped', query.sportName);
        return dataProviderHelper.getAllWithDocumentFieldsPagination(Sport, query, pagerOpts, documentFields, { addedOn: -1 });
    };

    // Mapping ==========================================================

    _p.getAllMappingData = function(req, next) {
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};
        //console.log('mapped sport name', req.query.sport);

        // matches anything that  starts with the inputted sport name, case insensitive
        if (req.query.sport) {
            query.sport = { $regex: new RegExp('.*' + req.query.sport, "i") };
        }
        if (req.query.active) {
            query.active = req.query.active;
        }
        query.deleted = false;
        //console.log('after query mapped', query.sport);
        //console.log('dataProviderHelper ----------> ', dataProviderHelper.getAllWithDocumentFieldsPagination(Mapping, query, pagerOpts, documentMappingField, { addedOn: -1 }))

        return dataProviderHelper.getAllWithDocumentFieldsPagination(Mapping, query, pagerOpts, documentMappingField, { addedOn: -1 });
    };

    _p.getSportByID = function(req) {
        return dataProviderHelper.findById(Sport, req.params.sportId, documentFields);
    };

    _p.patchSport = function(req, res, next) {
        req.sportInfo.deleted = true;
        req.sportInfo.deletedOn = new Date();
        req.sportInfo.deletedBy = req.decoded.user.username;
        _p.saveFunc(req, res, req.sportInfo, next, messageConfig.sport.deleteMessage);
    };



    _p.postSport = function(req, res, next) {
        //console.log('_p.postSport -------------> ', req.body);
        req.body = JSON.parse(req.body.data);
        //console.log("inside post sport fn",req.body);
        var errors = _p.checkValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {
            var imageInfo = utilityHelper.getFileInfo(req, null, next);
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var sportInfo = SportModule.CreateSport(modelInfo, req.decoded.user.username, imageInfo);
            var query = {};
            query.sportName = req.body.sportName;
            query.deleted = false;

            dataProviderHelper.checkForDuplicateEntry(Sport, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.sport.alreadyExistsSport + '"}');
                    } else {
                        //console.log("inside save")
                        return _p.saveFunc(req, res, sportInfo, next, messageConfig.sport.saveMessage);
                    }
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });

        }
    };

    function replaceSpecialCharaters(data) {
        ////console.log(data)
        data = data.replace(/&amp;/g, "&");
        data = data.replace(/&gt;/g, ">");
        data = data.replace(/&lt;/g, "<");
        data = data.replace(/&quot;/g, '"');
        return (data)


    }
    // Mapping services ------------------

    _p.postMapping = function(req, res, next) {
        //console.log("inside post mapping",req.body);
        // req.body.mappingFieldsVal = JSON.parse(req.body.mappingFieldsVal);
        // req.body = JSON.parse(req.body);
        var errors = _p.checkMappingValidationErrors(req);
        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            //console.log('post mapping ----> ', modelInfo);
            var mappingInfo = SportModule.CreateMapping(req.body, req.decoded.user.username);
            _p.saveFunc(req, res, mappingInfo, next, messageConfig.sport.saveMessage);
        }
    };

    var ObjectId = require('mongodb').ObjectID;

    _p.getMappedDataById = function(req, callback) {
        let sportId = ObjectId(req.params.mappingid);
        //console.log('sport from url ', sportId);

        // dataProviderHelper.findMappingById(Mapping, sportId, (err, doc) => {
        //     if(err) //console.log('mongo error ', err);
        //     //console.log('doc val', doc);
        //     return doc;
        // });
        dataProviderHelper.findMappingById(Mapping, sportId, callback);
    };

    // _p.updateMappedSport = function (req, res ,next){
    //     //console.log('req.body mapping ', req.body);
    //     dataProviderHelper.findMappingByIdAndUpdate( Mapping, mappingId, req.body)
    //             .then(function(data){
    //                 // res.status(HTTPStatus.OK);
    //                 //console.log('successfully updated!!')
    //                 return res.end(data);
    //             })
    //             .catch(function(err){
    //                 return next(err);
    //             });
    // }

    _p.updateMappedSport = function(req, res, next) {
        let mappingId = ObjectId(req.params.mappingid);
        dataProviderHelper.findMappingByIdAndUpdate(Mapping, mappingId, req.body)
            .then(function(data) {
                // res.status(HTTPStatus.OK);
                //console.log('successfully updated!!', data)
                return res.end(HTTPStatus.OK);
            })
            .catch(function(err) {
                return next(err);
            });
        if (req.body) {
            //console.log('req.body', req.body);              

        } else {
            return res.status(HTTPStatus.BAD_REQUEST).json({
                message: messageConfig.level.notFoundlevel
            });
        }

    };

    _p.updateMappedDataFunc = function(req, res, modelInfo) {
        return res.send({ data: modelInfo });
    };

    _p.saveFunc = function(req, res, newSportInfo, next, msg) {
        // //console.log('_p.saveFunc-------> ', newSportInfo)
        dataProviderHelper.save(newSportInfo)
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

    _p.updateSport = function(req, res, next) {
        req.body = JSON.parse(req.body.data);
        var errors = _p.checkValidationErrors(req);

        if (errors) {
            res.status(HTTPStatus.BAD_REQUEST);
            res.json({
                message: errors
            });
        } else {
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var imageInfo = utilityHelper.getFileInfo(req, req.sportInfo, next);
            var query = {};
            query.sportName = req.body.sportName;
            query._id = { $ne: req.params.sportId }
            query.deleted = false;

            dataProviderHelper.checkForDuplicateEntry(Sport, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "' + messageConfig.sport.alreadyExistsSport + '"}');
                    } else {
                        req.sportInfo.sportName = modelInfo.sportName ? replaceSpecialCharaters(modelInfo.sportName) : '';
                        req.sportInfo.selectLevel = modelInfo.selectLevel;
                        req.sportInfo.active = modelInfo.active;
                        req.sportInfo.addnotes = modelInfo.addnotes;
                        req.sportInfo.imageName = imageInfo._imageName;
                        req.sportInfo.imageProperties.imageExtension = imageInfo._imageExtension;
                        req.sportInfo.imageProperties.imagePath = imageInfo._imagePath;
                        req.sportInfo.fieldsConfig.eventMapping.added = modelInfo.eventMapping;
                        req.sportInfo.fieldsConfig.levelMapping.added = modelInfo.levelMapping;
                        req.sportInfo.fieldsConfig.categoryMapping.added = modelInfo.categoryMapping;
                        req.sportInfo.fieldsConfig.elementMapping.added = modelInfo.elementMapping;
                        req.sportInfo.fieldsConfig.elementGroupMapping.added = modelInfo.elementGroupMapping;
                        req.sportInfo.fieldsConfig.baseMapping.added = modelInfo.baseMapping;
                        return _p.saveFunc(req, res, req.sportInfo, next, messageConfig.sport.updateMessage);
                    }
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });



            // sportInfo.fieldsConfig = {
            //     eventMapping: {
            //         added: sportObj.eventMapping
            //     },
            //     levelMapping: {
            //         added: sportObj.levelMapping
            //     },
            //     categoryMapping: {
            //         added: sportObj.categoryMapping
            //     },
            //     elementMapping: {
            //         added: sportObj.elementMapping
            //     },
            //     elementGroupMapping: {
            //         added: sportObj.elementGroupMapping
            //     },
            //     baseMapping: {
            //         added: sportObj.baseMapping
            //     }
            // }


            // req.testimonialInfo.updatedBy = req.decoded.user.username;
            // req.testimonialInfo.updatedOn = new Date();

        }
    };
    _p.postScoreCard = function(req, res, next) {
        if (req.body.sportsName) {
            //console.log(req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.sportid = req.body.sportsName;
            query.deleted = false
            dataProviderHelper.checkForDuplicateEntry(ScoreCard, query)
                .then(function(count) {
                    if (count > 0) {
                        //console.log(req.scoreCardsetting);
                        let scoreCardsetting = new ScoreCard();
                        scoreCardsetting.sportid = modelInfo.sportsName;
                        scoreCardsetting.skillvalue = modelInfo.skillvalue;
                        scoreCardsetting.execution = modelInfo.execution;
                        scoreCardsetting.factor = modelInfo.factor;
                        scoreCardsetting.time = modelInfo.time;
                        scoreCardsetting.bonus = modelInfo.bonus;
                        scoreCardsetting._id = modelInfo._id
                        return dataProviderHelper.save(scoreCardsetting);
                    } else {
                        var scoreCardObj = SportModule.CreateScoreCard(modelInfo, req.decoded.user.username);
                        return dataProviderHelper.save(scoreCardObj);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: "Scorecard settings updated successfully."
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
                message: "Sport is required."
            });
        }
    };
    _p.getScoreCardConfigBySportid = function(req, res, next) {
        var query = {}
        query.sportid = req.params.sportid,
            query.deleted = false
        return dataProviderHelper.find(ScoreCard, query)

    }
    _p.patchscoreCard = function(req, res, next) {
        //console.log(req.scoreCardsetting[0])
        if (req.scoreCardsetting[0]) {
            req.scoreCardsetting[0].skillvalue = req.body.skillvalue;
            req.scoreCardsetting[0].execution = req.body.execution;
            req.scoreCardsetting[0].factor = req.body.factor;
            req.scoreCardsetting[0].time = req.body.time;
            req.scoreCardsetting[0].bonus = req.body.bonus;

            _p.saveFunc(req, res, req.scoreCardsetting[0], next, 'Scorecard updated successfully.');
        } else {
            res.status(HTTPStatus.OK);
            res.json({
                message: "Sport not found."
            });
        }


    };
    _p.getscoreCard = function(req, next) {
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = [

                {
                    $match: {
                        'deleted': false
                    }

                },
                {

                    $lookup: {
                        from: "Sport",
                        localField: "sportid",
                        foreignField: "_id",
                        as: "sportinfo"
                    }
                }, {
                    $unwind: "$sportinfo"
                },
            ]
            ////console.log('Level name', req.query.sportname);

        // matches anything that  starts with the inputted sport name, case insensitive
        // if(req.query.sportname){
        //   query.sportid = { $regex: new RegExp('.*' + req.query.sportname, "i") };
        // }
        //if(req.query.active){
        //    query.active = req.query.active;
        // }
        query.deleted = false;

        return dataProviderHelper.getAllWithaggregateDocumentFieldsPagination(ScoreCard, query, pagerOpts, '_id', { addedOn: -1 });
    };
    //=====Country Currency Config 


    _p.getcountryCurrency = function(req, next) {
        //Get pagination query options
        var pagerOpts = utilityHelper.getPaginationOpts(req, next);

        var query = {};
        // //console.log('sport name req', req.query.sportName);

        // matches anything that  starts with the inputted sport name, case insensitive
        if (req.query.Country) {
            query.Country = { $regex: new RegExp('.*' + req.query.Country, "i") };
        }
        if (req.query.active) {
            query.active = req.query.active;
        }
        query.deleted = false;
        //  //console.log('after query mapped', query.sportName);
        let documentCountryCurrencyFields = "_id Country Currency Exponents active deleted addedOn addedBy"
        return dataProviderHelper.getAllWithDocumentFieldsPagination(CountryCurrency, query, pagerOpts, documentCountryCurrencyFields, { addedOn: -1 });
    };
    _p.postcountryCurrency = function(req, res, next) {
        if (req.body.Country && req.body.Currency && req.body.Exponents) {
            //console.log(req.body)
            var modelInfo = utilityHelper.sanitizeUserInput(req, next);
            var query = {};
            query.Country = req.body.Country;
            query.deleted = false
            dataProviderHelper.checkForDuplicateEntry(CountryCurrency, query)
                .then(function(count) {
                    if (count > 0) {
                        throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "Country already exists."}');
                    } else {
                        var levelObj = SportModule.CreatecountryCurrency(modelInfo, req.decoded.user.username);
                        return dataProviderHelper.save(levelObj);
                    }
                })
                .then(function() {
                    res.status(HTTPStatus.OK);
                    res.json({
                        message: "Country & Currency saved successfully;"
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
                message: "All fields are required"
            });
        }
    };
    _p.getcountryCurrencyByID = function(req, res, next) {
        var query = {}
        query._id = req.params.countryid;
        query.deleted = false;
        return dataProviderHelper.find(CountryCurrency, query)

    }
    _p.getActivecountryCurrency = function(req, res, next) {
        var query = {}
        query.active = true;
        query.deleted = false;
        query.Country = { $ne: 'United States' }
        var sortOpts = { Country: 1 }
        return dataProviderHelper.findandsort(CountryCurrency, query, sortOpts)

    }
    _p.getJudgesbySportAndLevel = function(req, res, next) {

        var query = {}
        query.sportid = req.params.sportId
        query.status = "1"

        JudgeSport.find(query, function(err, judges) {

            if (err) {
                res.json({
                    success: false,
                    message: "Cannot get judges"
                })
            } else {
                res.json({
                    success: true,
                    result: judges
                })
            }




        })

    }
    _p.scoreCalculation = async function(req, res, next) {
        // let update = { $set: { "calculation": "SUM(E)+DD-CJP" } }
        // let Query = { _id: mongoose.Types.ObjectId('5f75f3a6e208ce7ac70f3958') }
        // dataProviderHelper.updateMany(ScoreCalculation, Query, update);
        // const excelToJson = require('convert-excel-to-json');
        // const fs = require('fs');
        // var path = req.app.get('rootDir') + '/lib/configs/ScoreMethodologyBySportLevel012021.xlsx';
        // const result = excelToJson({
        //     source: fs.readFileSync(path) // fs.readFileSync return a Buffer
        // });

        // var Score = result.Sheet1;
        // var eventmeetjudging = []
        // res.json({
        //     data: Score
        // })


        //var i = 1;
        //while (i < Score.length) {
        // var query = {
        //     sportid: Score[i].D,
        //     levelid: Score[i].E,
        //     eventid: Score[i].F,
        //     calculation: Score[i].G
        // }
        // await scoreCalculation(query, i);
        // i++;

        // var scoreObj = SportModule.CreateScoreCalculation({
        //     sportid: Score[i].D,
        //     levelid: Score[i].E,
        //     eventid: Score[i].F,
        //     calculation: Score[i].G
        // });
        // //console.log(scoreObj)
        // dataProviderHelper.save(scoreObj);

        // var levelsort = SportModule.CreateSportlevelSortOrder({
        //         sportid: '5d1aaabd2a91081752afd7e2',
        //         levelid: Score[i].C,
        //         level: Score[i].A,
        //         sortValue: Score[i].B
        //     })
        //     // console.log(i)
        // dataProviderHelper.save(levelsort);





        //        }

    }

    function scoreCalculation(obj, i) {
        return new Promise((resolve, reject) => {
            var query = {
                sportid: mongoose.Types.ObjectId(obj.sportid),
                levelid: mongoose.Types.ObjectId(obj.levelid),
                eventid: mongoose.Types.ObjectId(obj.eventid),
            }
            dataProviderHelper.find(ScoreCalculation, obj).then((calculation) => {
                if (calculation.length == 0) {
                    console.log(i)
                    var scoreObj = SportModule.CreateScoreCalculation(obj);
                    //console.log(scoreObj)
                    dataProviderHelper.save(scoreObj);
                    resolve()
                } else {
                    //console.log(i, "u")
                    calculation[0].calculation = obj.calculation
                    dataProviderHelper.save(calculation[0])
                    resolve()
                }
            })
        })

    }
    _p.patchcountryCurrency = function(req, res, next) {
        //console.log(req.countryCurrencyinfo[0])
        var query = {};
        query.Country = req.body.Country ? req.body.Country : '';
        query._id = { $ne: req.params.countryid }
        query.deleted = false;

        if (req.countryCurrencyinfo[0]) {


            dataProviderHelper.checkForDuplicateEntry(CountryCurrency, query)
                .then(function(count) {
                    //console.log(count)
                    if (count > 0) {
                        if (req.body.deleted) {
                            req.countryCurrencyinfo[0].deleted = true;
                            return _p.saveFunc(req, res, req.countryCurrencyinfo[0], next, req.body.deleted ? 'Country & Currency deleted successfully.' : 'Country & Currency updated successfully.');
                        } else {
                            throw new Promise.CancellationError('{ "statusCode":"' + HTTPStatus.CONFLICT + '", "message": "Country already exist"}');
                        }

                    } else {
                        if (req.body.deleted) {
                            req.countryCurrencyinfo[0].deleted = true;
                        } else {
                            req.countryCurrencyinfo[0].Country = req.body.Country;
                            req.countryCurrencyinfo[0].Currency = req.body.Currency;
                            req.countryCurrencyinfo[0].Exponents = req.body.Exponents;
                            req.countryCurrencyinfo[0].active = req.body.active;
                        }

                        return _p.saveFunc(req, res, req.countryCurrencyinfo[0], next, req.body.deleted ? 'Country & Currency deleted successfully.' : 'Country & Currency updated successfully.');
                    }
                })
                .catch(Promise.CancellationError, function(cancellationErr) {
                    errorHelper.customErrorResponse(res, cancellationErr, next);
                })
                .catch(function(err) {
                    return next(err);
                });


        } else {
            res.status(HTTPStatus.OK);
            res.json({
                message: "Country not found."
            });
        }


    };
    _p.getUSAGSportJudgePanelBySportId = function(req, res, next) {
        var query = {}
        query.sportid = mongoose.Types.ObjectId(req.params.sportid)

        dataProviderHelper.find(SportJudgePanel, query).then((JudgePanel) => {
            res.json({
                success: true,
                data: JudgePanel
            })
        })
    }

    _p.getUSAGScoreCalculationBySportLevelEvent = function(req, res, next) {
        var query = {}
        query.sportid = mongoose.Types.ObjectId(req.query.sportId)
        query.levelid = mongoose.Types.ObjectId(req.query.levelId)
        query.eventid = mongoose.Types.ObjectId(req.query.eventId)

        dataProviderHelper.find(ScoreCalculation, query).then((calculation) => {
            res.json({
                success: true,
                data: calculation
            })
        })

    }
    _p.getSportLevelSortOrder = function(req, res, next) {

        var query = {
            sportId: mongoose.Types.ObjectId(req.params.sportId)
        }
        dataProviderHelper.find(SportLevelSortOrder, query).then((response) => {
            res.json(response)
        })

    }

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

    return {

        getStates: _p.getStates,
        getCitybyStateID: _p.getCitybyStateID,
        getZipCodebyStateID: _p.getZipCodebyStateID,

        getAllSports: _p.getAllSports,
        getSportByID: _p.getSportByID,
        patchSport: _p.patchSport,
        postSport: _p.postSport,
        updateSport: _p.updateSport,

        getSportsEvent: _p.getSportsEvent,
        getAllSportsEventlist: _p.getAllSportsEventlist,
        getSportsEventByID: _p.getSportsEventByID,
        postEvent: _p.postEvent,
        patchSportEvent: _p.patchSportEvent,
        updateSportEvent: _p.updateSportEvent,
        getSportsEventByEvent: _p.getSportsEventByEvent,

        getAllCategories: _p.getAllCategories,
        getCategoryByID: _p.getCategoryByID,
        patchCategory: _p.patchCategory,
        postCategory: _p.postCategory,
        updateCategory: _p.updateCategory,

        getAllLevels: _p.getAllLevels,
        getLevelByID: _p.getLevelByID,
        patchLevel: _p.patchLevel,
        postLevel: _p.postLevel,
        updateLevel: _p.updateLevel,

        postElement: _p.postElement,
        getSportsElement: _p.getSportsElement,
        getElementByevent: _p.getElementByevent,
        getSportsElementByID: _p.getSportsElementByID,
        updateSportElement: _p.updateSportElement,
        patchSportElement: _p.patchSportElement,
        getAllSportsElement: _p.getAllSportsElement,
        getAllSportsElementGroup: _p.getAllSportsElementGroup,
        getSportsElementgroupByID: _p.getSportsElementgroupByID,
        postElementGroup: _p.postElementGroup,
        updateSportElementGroup: _p.updateSportElementGroup,
        patchSportElementGroup: _p.patchSportElementGroup,

        postMapping: _p.postMapping,
        getAllMappingData: _p.getAllMappingData,
        getMappedDataById: _p.getMappedDataById,
        updateMappedSport: _p.updateMappedSport,
        getSportsInfobysport: _p.getSportsInfobysport,

        getSportPricing: _p.getSportPricing,
        postSportPricing: _p.postSportPricing,
        getSportpricingByID: _p.getSportpricingByID,
        updateSportPricing: _p.updateSportPricing,
        patchSportPricing: _p.patchSportPricing,
        getSportpricingBysportID: _p.getSportpricingBysportID,
        getusersportpricing: _p.getusersportpricing,

        postScoreCard: _p.postScoreCard,
        getScoreCardConfigBySportid: _p.getScoreCardConfigBySportid,
        patchscoreCard: _p.patchscoreCard,
        getscoreCard: _p.getscoreCard,
        getcountryCurrency: _p.getcountryCurrency,
        postcountryCurrency: _p.postcountryCurrency,
        getcountryCurrencyByID: _p.getcountryCurrencyByID,
        patchcountryCurrency: _p.patchcountryCurrency,
        getActivecountryCurrency: _p.getActivecountryCurrency,
        getJudgesbySportAndLevel: _p.getJudgesbySportAndLevel,
        createSportJudgesPanel: _p.createSportJudgesPanel,
        scoreCalculation: _p.scoreCalculation,
        getSportLevelSortOrder: _p.getSportLevelSortOrder,
        getUSAGSportJudgePanelBySportId: _p.getUSAGSportJudgePanelBySportId,
        getUSAGScoreCalculationBySportLevelEvent: _p.getUSAGScoreCalculationBySportLevelEvent
    };
})();

module.exports = sportController;