var sportRoutes = (function() {

    'use strict';

    var HTTPStatus = require('http-status'),
        express = require('express'),

        tokenAuthMiddleware = require('../middlewares/token.authentication.middleware'),
        roleAuthMiddleware = require('../middlewares/role.authorization.middleware'),
        messageConfig = require('../configs/api.message.config'),
        sportController = require('../controllers/sport.server.controller'),
        imageFilePath = '/mnt/volume_sfo2_01/public/uploads/images/sport/',
        uploadPrefix = 'sport',
        fileUploadHelper = require('../helpers/file.upload.helper')(imageFilePath, '', uploadPrefix),
        uploader = fileUploadHelper.uploader,
        sportRouter = express.Router();





    sportRouter.route('/getJudgesbySportAndLevel/:sportId')
        .get(sportController.getJudgesbySportAndLevel)

    sportRouter.route('/getScoreCalculationbySportLevelEvent')
        .get(sportController.getUSAGScoreCalculationBySportLevelEvent)
    sportRouter.route('/createSportJudgesPanel')
        .post(sportController.createSportJudgesPanel)
    sportRouter.route('/scoreCalculation')
        .get(sportController.scoreCalculation)

    sportRouter.route('/getUSAGSportJudgePanel/:sportid')
        .get(sportController.getUSAGSportJudgePanelBySportId)


    sportRouter.route('/SportLevelSort/:sportId')
        .get(sportController.getSportLevelSortOrder)

    /** route for country currency start here */

    sportRouter.route('/countryCurrency/')
        .get(getcountryCurrency)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.postcountryCurrency);
    //middleware function that will get the countryCurrency object for each of the routes defined downwards starting with /api/blogcategory route
    sportRouter.use('/countryCurrency/:countryid', function(req, res, next) {
        sportController.getcountryCurrencyByID(req)
            .then(function(countryCurrencyinfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (countryCurrencyinfo) {
                    req.countryCurrencyinfo = countryCurrencyinfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: "Country not found"
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/countryCurrency/:countryid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.countryCurrencyinfo);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchcountryCurrency)
        //.put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.updateSportPricing);

    sportRouter.route('/getActivecountryCurrency/')
        .get(getActivecountryCurrency)
        /** route for SportPricing start here */
    sportRouter.route('/sportpricing/')
        .get(getAllPricing)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.postSportPricing);

    //middleware function that will get the sportpricing object for each of the routes defined downwards starting with /api/blogcategory route
    sportRouter.use('/sportpricing/:priceid', function(req, res, next) {
        sportController.getSportpricingByID(req)
            .then(function(pricinginfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (pricinginfo) {
                    req.pricinginfo = pricinginfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.pricing.notFoundPricing
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/sportpricing/:priceid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.pricinginfo);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchSportPricing)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.updateSportPricing);


    sportRouter.use('/getpricing/:priceid/:scoretype', function(req, res, next) {
        sportController.getSportpricingBysportID(req)
            .then(function(singlepricinginfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (singlepricinginfo) {
                    req.singlepricinginfo = singlepricinginfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.pricing.notFoundPricing
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/getpricing/:priceid/:scoretype')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.singlepricinginfo);
        })
        /** route for SportPricing end here */
    sportRouter.route('/elementgroup/')
        .get(getAllSportsElementGroup)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.postElementGroup);


    //middleware function that will get the blog category object for each of the routes defined downwards starting with /api/blogcategory route
    sportRouter.use('/elementgroup/:elementgroupid', function(req, res, next) {
        sportController.getSportsElementgroupByID(req)
            .then(function(elementgroupinfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (elementgroupinfo) {
                    ////console.log(elementgroupinfo)
                    req.elementgroupinfo = elementgroupinfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.elementgroup.notFoundElementgroup
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/elementgroup/:elementgroupid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            //console.log(req.elementgroupinfo)
            res.json(req.elementgroupinfo);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchSportElementGroup)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.updateSportElementGroup);

    sportRouter.route('/element/')
        .get(getAllSportsElement)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.postElement);

    sportRouter.route('/getAllelement/')
        .get(getSportsElement)

    sportRouter.route('/usersportpricing/')
        .get(getusersportpricing)

    sportRouter.route('/scoreCard/')
        .get(getscoreCard)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.postScoreCard);

    sportRouter.use('/scoreCard/:sportid', function(req, res, next) {
        sportController.getScoreCardConfigBySportid(req)
            .then(function(scoreCardsetting) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (scoreCardsetting) {
                    //console.log(scoreCardsetting)
                    req.scoreCardsetting = scoreCardsetting;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: "N"
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/scoreCard/:sportid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            ////console.log(req.elementgroupinfo)
            res.json(req.scoreCardsetting);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchscoreCard)




    sportRouter.route('/mapping/')
        .get(getAllMappingData)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.postMapping);

    sportRouter.use('/mapping/:mappingid', function(req, res, next) {
        sportController.getMappedDataById(req, (err, doc) => {
            if (err) {
                //console.log('error found in routes ', err);
            }
            //console.log('data returned in route ', doc);
            if (doc) {
                res.json(doc);
                next();
                return null;
            } else {
                res.status(HTTPStatus.NOT_FOUND);
                res.json({
                    message: messageConfig.element.notFoundElement
                });
            }
        })
    });

    sportRouter.route('/mapping/:mappingid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.elementinfo);
        })
        // .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchSportElement)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.updateMappedSport);
    sportRouter.use('/sportinfobymapping/:sports', function(req, res, next) {
        sportController.getSportsInfobysport(req)
            .then(function(sportinfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (sportinfo) {
                    req.sportinfobymapping = sportinfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundElement
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/sportinfobymapping/:sports')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.sportinfobymapping);
        })

    // sportRouter.route('/mapping/')
    // .get( getAllMappingData )
    // .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res){
    //     //console.log('inside mapping route')
    //     sportController.postMapping
    // })

    //middleware function that will get the blog category object for each of the routes defined downwards starting with /api/blogcategory route
    sportRouter.use('/element/:elementid', function(req, res, next) {
        sportController.getSportsElementByID(req)
            .then(function(elementinfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (elementinfo) {
                    req.elementinfo = elementinfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.element.notFoundElement
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/element/:elementid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.elementinfo);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchSportElement)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.updateSportElement);



    function getcountryCurrency(req, res, next) {
        sportController.getcountryCurrency(req, next)
            .then(function(countryCurrencylist) {
                //if exists, return data in json format
                if (countryCurrencylist) {
                    res.status(HTTPStatus.OK);
                    res.json(countryCurrencylist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundCategory
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getActivecountryCurrency(req, res, next) {
        sportController.getActivecountryCurrency(req, next)
            .then(function(activecountryCurrencylist) {
                //if exists, return data in json format
                if (activecountryCurrencylist) {
                    res.status(HTTPStatus.OK);
                    res.json(activecountryCurrencylist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundCategory
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    //function declaration to return Sports Element list , if exists, else return not found message
    function getAllSportsElement(req, res, next) {
        sportController.getSportsElement(req, next)
            .then(function(SportsElementlist) {
                //if exists, return data in json format
                if (SportsElementlist) {
                    res.status(HTTPStatus.OK);
                    res.json(SportsElementlist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.element.notFoundElement
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getusersportpricing(req, res, next) {
        sportController.getusersportpricing(req, next)
            .then(function(sportpricing) {
                //if exists, return data in json format
                if (sportpricing) {
                    res.status(HTTPStatus.OK);
                    res.json(sportpricing);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: "Sport pricing not found."
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getSportsElement(req, res, next) {
        sportController.getAllSportsElement(req, next)
            .then(function(SportsElementlist) {
                //if exists, return data in json format
                if (SportsElementlist) {
                    res.status(HTTPStatus.OK);
                    res.json(SportsElementlist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.element.notFoundElement
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }
    //function declaration to return Sports Element Group list , if exists, else return not found message
    function getAllSportsElementGroup(req, res, next) {
        sportController.getAllSportsElementGroup(req, next)
            .then(function(SportsElementGrouplist) {
                //if exists, return data in json format
                if (SportsElementGrouplist) {
                    res.status(HTTPStatus.OK);
                    res.json(SportsElementGrouplist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.elementgroup.notFoundElementgroup
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }



    sportRouter.route('/sport/')
        .get(getAllSports)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('imageName'), fileUploadHelper.imageUpload, sportController.postSport);



    //middleware function that will get the sport object for each of the routes defined downwards
    sportRouter.use('/sport/:sportId', function(req, res, next) {
        sportController.getSportByID(req)
            .then(function(sportInfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (sportInfo) {
                    req.sportInfo = sportInfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });


    sportRouter.route('/sport/:sportId')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.sportInfo);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchSport)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('imageName'), fileUploadHelper.imageUpload, sportController.updateSport);

    //function declaration to return testimonial list to the client if exists else return not found message
    function getAllSports(req, res, next) {
        // //console.log('auth token ======> ', tokenAuthMiddleware.authenticate);
        sportController.getAllSports(req, next)
            .then(function(sports) {

                //if exists, return data in json format
                if (sports) {

                    res.status(HTTPStatus.OK);
                    res.json(sports);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }


    function getAllMappingData(req, res, next) {
        // //console.log('auth token ======> ', tokenAuthMiddleware.authenticate);
        sportController.getAllMappingData(req, next)
            .then(function(sports) {
                //console.log('inside get all sports')
                //if exists, return data in json format
                if (sports) {
                    //console.log('mapping sports data', sports);
                    res.status(HTTPStatus.OK);
                    res.json(sports);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    // Categories route ==========================================

    sportRouter.route('/category/')
        .get(getAllCategories)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.postCategory);

    //middleware function that will get the sport object for each of the routes defined downwards
    sportRouter.use('/category/:categoryId', function(req, res, next) {
        sportController.getCategoryByID(req)
            .then(function(categoryInfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (categoryInfo) {
                    req.categoryInfo = categoryInfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/category/:categoryId')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.categoryInfo);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchCategory)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.updateCategory);

    //function declaration to return testimonial list to the client if exists else return not found message
    function getAllCategories(req, res, next) {
        //console.log('auth token ======> ', req);
        sportController.getAllCategories(req, next)
            .then(function(categories) {
                //console.log('inside get all categories', categories);
                //if exists, return data in json format
                if (categories) {
                    //console.log(categories);
                    res.status(HTTPStatus.OK);
                    res.json(categories);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    // Level route ==========================================

    sportRouter.route('/level/')
        .get(getAllLevels)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.postLevel);

    //middleware function that will get the sport object for each of the routes defined downwards
    sportRouter.use('/level/:levelId', function(req, res, next) {
        sportController.getLevelByID(req)
            .then(function(levelInfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (levelInfo) {
                    req.levelInfo = levelInfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/level/:levelId')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.levelInfo);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchLevel)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.updateLevel);

    //function declaration to return testimonial list to the client if exists else return not found message
    function getAllLevels(req, res, next) {
        ////console.log('auth token ======> ', req);
        sportController.getAllLevels(req, next)
            .then(function(level) {
                ////console.log('inside get all level', level);
                //if exists, return data in json format
                if (level) {
                    // //console.log(level);
                    res.status(HTTPStatus.OK);
                    res.json(level);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    // Events route ==========================================

    sportRouter.route('/event/')
        .get(getAllSportsEvent)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.postEvent);


    sportRouter.route('/getAllevents/')
        .get(getAllSportsEventlist)

    sportRouter.route('/getStates/')
        .get(getStates)

    sportRouter.route('/getCitybyStateID/:stateID')
        .get(getCitybyStateID)


    sportRouter.route('/getZipCodebyStateID/:stateID/:cityID')
        .get(getZipCodebyStateID)

    sportRouter.use('/getElementByevent/:eventid', function(req, res, next) {
        sportController.getElementByevent(req)
            .then(function(elementList) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (elementList) {
                    req.elementListByEvent = elementList;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundElement
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/getElementByevent/:eventid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.elementListByEvent);
        })
        //middleware function that will get the sport category object for each of the routes defined downwards starting with /api/sportcategory route
    sportRouter.use('/event/:eventid', function(req, res, next) {
        sportController.getSportsEventByID(req)
            .then(function(eventinfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (eventinfo) {
                    req.eventinfo = eventinfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundCategory
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/event/:eventid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.eventinfo);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.patchSportEvent)
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, sportController.updateSportEvent);

    sportRouter.use('/eventsbyEvent/:event', function(req, res, next) {
        sportController.getSportsEventByEvent(req)
            .then(function(eventinfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (eventinfo) {
                    req.eventbyEventinfo = eventinfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundCategory
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/eventsbyEvent/:event')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.eventbyEventinfo);
        })


    sportRouter.use('/eventsbyEvent/:event1/:event2', function(req, res, next) {
        sportController.getSportsEventByEvent(req)
            .then(function(eventinfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (eventinfo) {
                    req.eventbyEventinfo = eventinfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundCategory
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    sportRouter.route('/eventsbyEvent/:event1/:event2')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.eventbyEventinfo);
        })
        //function declaration to return Sports Event list , if exists, else return not found message
    function getAllSportsEvent(req, res, next) {
        //console.log('inside get all sports event');
        sportController.getSportsEvent(req, next)
            .then(function(SportsEventlist) {
                //if exists, return data in json format
                if (SportsEventlist) {
                    res.status(HTTPStatus.OK);
                    res.json(SportsEventlist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundCategory
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllSportsEventlist(req, res, next) {
        //  //console.log('inside get all sports event');
        sportController.getAllSportsEventlist(req, next)
            .then(function(SportsEventlist) {
                //if exists, return data in json format
                if (SportsEventlist) {
                    res.status(HTTPStatus.OK);
                    res.json(SportsEventlist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundCategory
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getStates(req, res, next) {
        //  //console.log('inside get all sports event');
        sportController.getStates(req, next)
            .then(function(state) {
                //if exists, return data in json format
                if (state) {
                    res.status(HTTPStatus.OK);
                    res.json(state);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.notFound.state
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getCitybyStateID(req, res, next) {
        //  //console.log('inside get all sports event');
        sportController.getCitybyStateID(req, next)
            .then(function(city) {
                //if exists, return data in json format
                if (city) {
                    res.status(HTTPStatus.OK);
                    res.json(city);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.notFound.city
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getZipCodebyStateID(req, res, next) {
        //  //console.log('inside get all sports event');
        sportController.getZipCodebyStateID(req, next)
            .then(function(zip) {
                //if exists, return data in json format
                if (zip) {
                    res.status(HTTPStatus.OK);
                    res.json(zip);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.notFound.zip
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }
    // function declaration to return Sports Pricing list , if exists, else return not found message		
    function getAllPricing(req, res, next) {
        sportController.getSportPricing(req, next)
            .then(function(pricinglist) {
                //if exists, return data in json format
                if (pricinglist) {
                    res.status(HTTPStatus.OK);
                    res.json(pricinglist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.sport.notFoundCategory
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getscoreCard(req, res, next) {
        sportController.getscoreCard(req, next)
            .then(function(scoreCard) {
                //if exists, return data in json format
                if (scoreCard) {
                    res.status(HTTPStatus.OK);
                    res.json(scoreCard);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: "Not Found"
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }
    return sportRouter;

})();

module.exports = sportRoutes;