var notificationRoutes = (function() {

    'use strict';

    var HTTPStatus = require('http-status'),
        express = require('express'),
        tokenAuthMiddleware = require('../middlewares/token.authentication.middleware'),
        roleAuthMiddleware = require('../middlewares/role.authorization.middleware'),
        messageConfig = require('../configs/api.message.config'),
        notificationsController = require('../controllers/notifications.management.server.controller'),
        imageFilePath = '/mnt/volume_sfo2_01/public/uploads/images/notification/',
        uploadPrefix = 'notification',
        fileUploadHelper = require('../helpers/file.upload.helper')(imageFilePath, '', uploadPrefix),
        uploader = fileUploadHelper.uploader,
        notificationRouter = express.Router();
    notificationRouter.route('/getUserForSendNotifications')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, notificationsController.getUserForSendNotifications)
    notificationRouter.route('/sendNotificationToUsers')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, notificationsController.sendNotificationToUsers)



    notificationRouter.route('/notifications')

    .get(getAllNotifications)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, notificationsController.saveNotification)

    notificationRouter.use('/notifications/:NID', function(req, res, next) {
        notificationsController.getNotificationByNID(req)
            .then(function(data) {
                if (data) {
                    req.notificationManagementInfo = data[0];
                    //console.log('notification by NID ', data);
                    // res.json({
                    //     reqData: data
                    // });
                    next();
                    return null;
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            }).catch(function(err) {
                return next(err);
            });
    })

    notificationRouter.route('/notifications/:NID')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            //console.log('middleware ',  req.notificationManagementInfo)
            res.json(req.notificationManagementInfo);
        })
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, notificationsController.updateNotification);

    notificationRouter.use('/notification/:RID', function(req, res, next) {
        notificationsController.getNotificationByRID(req)
            .then(function(data) {
                if (data) {
                    // req.teamMateInfo = data;
                    //console.log('notification by RID ', data);
                    res.json({
                        reqData: data
                    });
                    // next();
                    // return null;
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            }).catch(function(err) {
                return next(err);
            });
    })

    notificationRouter.use('/requestnotifications/:FID', function(req, res, next) {
        notificationsController.getNotificationByFID(req)
            .then(function(data) {
                if (data) {
                    // req.teamMateInfo = data;
                    //console.log('notification by FID ', data);
                    res.json({
                        reqData: data
                    });
                    // next();
                    // return null;
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            }).catch(function(err) {
                return next(err);
            });
    })

    notificationRouter.use('/acknotifications/:UID', function(req, res, next) {
        notificationsController.getNotificationByUID(req)
            .then(function(data) {
                if (data) {
                    // req.teamMateInfo = data;
                    //console.log('notification by UID ', data);
                    res.json({
                        reqData: data
                    });
                    // next();
                    // return null;
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            }).catch(function(err) {
                return next(err);
            });
    })

    notificationRouter.use('/readnotifications/:UID', function(req, res, next) {
        notificationsController.getReadNotificationByUID(req)
            .then(function(data) {
                if (data) {
                    // req.teamMateInfo = data;
                    //console.log('notification by UID ', data);
                    res.json({
                        reqData: data
                    });
                    // next();
                    // return null;
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.eventManager.notFound
                    });
                }
            }).catch(function(err) {
                return next(err);
            });
    })


    //function declaration to return testimonial list to the client if exists else return not found message
    function getAllNotifications(req, res, next) {
        notificationsController.getAllNotifications(req, next)
            .then(function(testimonials) {
                //if exists, return data in json format
                if (testimonials) {
                    res.status(HTTPStatus.OK);
                    res.json(testimonials);
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

    return notificationRouter;

})();

module.exports = notificationRoutes;