var routineRoutes = (function() {

    'use strict';

    var HTTPStatus = require('http-status'),
        express = require('express'),
        tokenAuthMiddleware = require('../middlewares/token.authentication.middleware'),
        roleAuthMiddleware = require('../middlewares/role.authorization.middleware'),
        messageConfig = require('../configs/api.message.config'),
        routineController = require('../controllers/routine.server.controller'),
        applicationConfig = require('../configs/application.config'),
        routineFilePath = '/mnt/volume_sfo2_01/public/uploads/user/routine/source/',
        Routine = require('../models/routine.server.model'),
        mongoose = require('mongoose'),
        uploaddocPrefix = 'routine',
        docfileUploadHelper = require('../helpers/file.upload.helper')('', routineFilePath, uploaddocPrefix),
        documentUploader = docfileUploadHelper.documentUploader,
        Promise = require("bluebird"),
        fs = Promise.promisifyAll(require('fs')),
        bannerFilePath = '/mnt/volume_sfo2_01/public/uploads/video/',
        uploadbannerPrefix = 'banner',
        mailController = require('../controllers//mail.server.controller'),
        bannerfileUploadHelper = require('../helpers/file.upload.helper')('', bannerFilePath, uploadbannerPrefix),
        documentbannerUploader = bannerfileUploadHelper.documentUploader,
        //  fileUploadHelper = require('../helpers/file.upload.helper')(routineFilePath, '', uploadPrefix),
        //  uploader = fileUploadHelper.uploader,
        routineRouter = express.Router();
    routineRouter.route('/technician_routine')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.saveTechnicianRoutine);

    routineRouter.route('/getSanctionEventMeetRoutines/:eventMeetId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getSanctionEventMeetRoutines);

    routineRouter.route('/getJudgedEventMeetRoutines/:eventMeetId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getJudgedEventMeetRoutines);

    routineRouter.route('/getRoutineJudges/:routineid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getRoutineJudges);

    routineRouter.route('/checkExistingRoutine')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.checkExistingRoutine);

    routineRouter.route('/updateFinalScorewithNeutralDeduction/:routineId')
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.updateFinalScorewithNeutralDeduction);

    function getSanctionEventMeetRoutines(req, res, next) {
        routineController.getSanctionEventMeetRoutines(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getJudgedEventMeetRoutines(req, res, next) {
        routineController.getJudgedEventMeetRoutines(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getRoutineJudges(req, res, next) {
        routineController.getRoutineJudges(req, next)
            .then(function(routinejudges) {
                //if exists, return data in json format
                if (routinejudges) {
                    res.status(HTTPStatus.OK);
                    res.json(routinejudges);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    routineRouter.route('/routine/')

    /**
     * @api {get} /api/user/ Get user list
     * @apiPermission admin
     * @apiName getUsers
     * @apiGroup User
     *
     * @apiParam {Int} perpage Number of data to return on each request
     * @apiParam {Int} page Current page number of pagination system.
     * @apiParam {String} username  username of the user registered in the system
     *
     *   @apiParamExample {json} Request-Example:
     *     {
     *       "perpage": 10,
     *       "page": 1
     *     }
     *   @apiParamExample {json} Request-Example:
     *     {
     *       "perpage": 10,
     *       "page": 1,
     *       "username": "shrawanlakhey@gmail.com"
     *     }
     *
     * @apiDescription Retrieves the user list, if exists, else return empty array
     * @apiVersion 0.0.1
     *
     * @apiHeader (AuthorizationHeader) {String} authorization x-access-token value.
     * @apiHeaderExample {json} Header-Example:
     *{
     *  "x-access-token": "yJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c"
     * }
     *
     *
     * @apiExample {curl} Example usage:
     * curl \
     * -G \
     * -v \
     * "http://localhost:3000/api/user/" \
     * -H "x-access-token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c2JlYXQuY29tIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiX2lkIjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwidXNlckNvbmZpcm1lZCI6ZmFsc2UsImJsb2NrZWQiOmZhbHNlLCJkZWxldGVkIjpmYWxzZSwiYWRkZWRPbiI6IjIwMTYtMDctMDhUMDc6NTQ6MDMuNzY2WiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjpmYWxzZSwidXNlclJvbGUiOiJhZG1pbiIsImFjdGl2ZSI6dHJ1ZX0sImNsYWltcyI6eyJzdWJqZWN0IjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwiaXNzdWVyIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwicGVybWlzc2lvbnMiOlsic2F2ZSIsInVwZGF0ZSIsInJlYWQiLCJkZWxldGUiXX0sImlhdCI6MTQ2OTE4MzQ0MCwiZXhwIjoxNDY5MjAzNDQwLCJpc3MiOiI1NzdmNWMxYjU4Njk5MDJkNjdlYjIyYTgifQ.KSp3_S2LEhixyzTnNJE9AtD5u7-8ljImr-Np0kzxkoNWWjqB66a_T67NTCTMoMZys7PIYPFNBR9VwLOhkrX7BQ" \
     *--data-urlencode "perpage=10" \
     * --data-urlencode "page=1"
     *
     * @apiExample {curl} Example usage:
     * curl \
     * -G \
     * -v \
     * "http://localhost:3000/api/user/" \
     * -H "x-access-token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c2JlYXQuY29tIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiX2lkIjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwidXNlckNvbmZpcm1lZCI6ZmFsc2UsImJsb2NrZWQiOmZhbHNlLCJkZWxldGVkIjpmYWxzZSwiYWRkZWRPbiI6IjIwMTYtMDctMDhUMDc6NTQ6MDMuNzY2WiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjpmYWxzZSwidXNlclJvbGUiOiJhZG1pbiIsImFjdGl2ZSI6dHJ1ZX0sImNsYWltcyI6eyJzdWJqZWN0IjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwiaXNzdWVyIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwicGVybWlzc2lvbnMiOlsic2F2ZSIsInVwZGF0ZSIsInJlYWQiLCJkZWxldGUiXX0sImlhdCI6MTQ2OTE4MzQ0MCwiZXhwIjoxNDY5MjAzNDQwLCJpc3MiOiI1NzdmNWMxYjU4Njk5MDJkNjdlYjIyYTgifQ.KSp3_S2LEhixyzTnNJE9AtD5u7-8ljImr-Np0kzxkoNWWjqB66a_T67NTCTMoMZys7PIYPFNBR9VwLOhkrX7BQ" \
     *--data-urlencode "perpage=10" \
     * --data-urlencode "page=1" \
     * --data-urlencode "username=shrawanlakhey@gmail.com"
     *
     *
     * @apiSuccess {Array} dataList list of users in the system
     * @apiSuccess {String} dataList._id  object id of user data.
     * @apiSuccess {String} dataList.firstName  first name of the user.
     * @apiSuccess {String} dataList.middleName middle name of the user.
     * @apiSuccess {String} dataList.lastName   last name of the user.
     * @apiSuccess {String} dataList.email  email address of the user.
     * @apiSuccess {String} dataList.username  username used when registering in the system, by default, same as email address.
     * @apiSuccess {String} dataList.phoneNumber phone number of the  user.
     * @apiSuccess {String} dataList.mobileNumber  mobile number of the user.
     * @apiSuccess {String} dataList.securityQuestion  question selected by the user as a backup or extra security mechanism.
     * @apiSuccess {Boolean} dataList.active  active bit status of the user.
     * @apiSuccess {String} dataList.userRole  role of the user in the system.
     * @apiSuccess {String} dataList.imageName  name of the image file of the user avatar.
     * @apiSuccess {String} dataList.twoFactorAuthEnabled  multi-factor or two factor authentication is enabled in the system or not.
     * @apiSuccess {String} dataList.addedOn date of user registered in the system .
     * @apiSuccess {String} dataList.blocked user blocked or not.
     * @apiSuccess {String} dataList.userConfirmed user registration confirmed or not.
     * @apiSuccess {String} dataList.imageProperties  meta-data info of image file.
     * @apiSuccess {String} dataList.imageProperties.imageExtension  extension of image file .
     * @apiSuccess {String} dataList.imageProperties.imagePath  path of image file.
     * @apiSuccess {Int} totalItems  total no of users in the related collection in database.
     * @apiSuccess {Int} currentPage  current page number of client pagination system.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *           "dataList": [
     *               {
     *                   "_id": "57833052319c2cae0defc7b5",
     *                   "imageName": "user-1468215378497.webp",
     *                    "securityQuestion": "Favourite Movie?",
     *                   "mobileNumber": "9818278372",
     *                   "phoneNumber": "01-5560147",
     *                   "username": "shrawanlakhey@gmail.com",
     *                   "email": "shrawanlakhey@gmail.com",
     *                   "lastName": "Lakhe",
     *                   "firstName": "Shrawan",
     *                   "userConfirmed": true,
     *                   "imageProperties": {
     *                       "imagePath": "public/uploads/images/users/user-1468215378497.jpg",
     *                       "imageExtension": "jpg"
     *                   },
     *                   "blocked": false,
     *                   "addedOn": "2016-07-11T05:36:18.906Z",
     *                   "twoFactorAuthEnabled": true,
     *                   "userRole": "admin",
     *                   "active": true
     *               },
     *               {
     *                   "_id": "577f5c1b5869902d67eb22a8",
     *                   "mobileNumber": "",
     *                   "phoneNumber": "",
     *                   "username": "superadmin",
     *                   "email": "hello@bitsbeat.com",
     *                   "lastName": "superadmin",
     *                   "middleName": "",
     *                   "firstName": "superadmin",
     *                   "userConfirmed": true,
     *                   "blocked": false,
     *                   "addedOn": "2016-07-08T07:54:03.766Z",
     *                   "twoFactorAuthEnabled": false,
     *                   "userRole": "admin",
     *                   "active": true
     *               }
     *           ],
     *           "totalItems": 2,
     *           "currentPage": 1
     *       }
     *
     *
     * @apiError (UnAuthorizedError) {String} message authentication token was not supplied
     * @apiError (UnAuthorizedError) {Boolean} isToken to check if token is supplied or not , if token is supplied , returns true else returns false
     * @apiError (UnAuthorizedError) {Boolean} success true if jwt token verifies
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "isToken": true,
     *        "success": false,
     *        "message": "Authentication failed"
     *     }
     *
     *
     * @apiError  (UnAuthorizedError_1) {String} message  You are not authorized to access this api route.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to access this api route."
     *     }
     *
     * @apiError  (UnAuthorizedError_2) {String} message  You are not authorized to perform this action.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to perform this action"
     *     }
     *
     *
     *
     * @apiError  (NotFound) {String} message  User not found
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "message": "User not found"
     *     }
     *
     * @apiError  (InternalServerError) {String} message  Internal Server Error
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "message": "Internal Server Error"
     *     }
     *
     */

    .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getRoutine)

    /**
     * @api {post} /api/routine/ Post user information data
     * @apiPermission admin
     * @apiName saveUsers
     * @apiGroup User
     *
     * @apiParam {String} firstName   Mandatory  first name of the user.
     * @apiParam {String} lastName    Mandatory    last name of the user.
     * @apiParam {String} email    Mandatory   email address of the user.
     * @apiParam {String} securityQuestion    Mandatory   question selected by the user as a backup or extra security mechanism.
     * @apiParam {String} securityAnswer   Mandatory    security answer.
     * @apiParam {String} userRole    Mandatory   role of the user in the system.
     *
     *
     * @apiDescription saves user information to the database
     * @apiVersion 0.0.1
     * @apiHeader (AuthorizationHeader) {String} authorization x-access-token value.
     * @apiHeaderExample {json} Header-Example:
     *{
     *  "x-access-token": "yJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c"
     * }
     *
     * @apiExample {curl} Example usage:
     *
     *
     * curl \
     * -v \
     * -X POST  \
     * http://localhost:3000/api/user/ \
     * -H "Content-Type: multipart/form-data"  \
     * -H "x-access-token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c2JlYXQuY29tIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiX2lkIjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwidXNlckNvbmZpcm1lZCI6ZmFsc2UsImJsb2NrZWQiOmZhbHNlLCJkZWxldGVkIjpmYWxzZSwiYWRkZWRPbiI6IjIwMTYtMDctMDhUMDc6NTQ6MDMuNzY2WiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjpmYWxzZSwidXNlclJvbGUiOiJhZG1pbiIsImFjdGl2ZSI6dHJ1ZX0sImNsYWltcyI6eyJzdWJqZWN0IjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwiaXNzdWVyIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwicGVybWlzc2lvbnMiOlsic2F2ZSIsInVwZGF0ZSIsInJlYWQiLCJkZWxldGUiXX0sImlhdCI6MTQ2OTE4MzQ0MCwiZXhwIjoxNDY5MjAzNDQwLCJpc3MiOiI1NzdmNWMxYjU4Njk5MDJkNjdlYjIyYTgifQ.KSp3_S2LEhixyzTnNJE9AtD5u7-8ljImr-Np0kzxkoNWWjqB66a_T67NTCTMoMZys7PIYPFNBR9VwLOhkrX7BQ" \
     * -F avatar=@public/images/404_banner.png  \
     * -F "data={\"firstName\": \"tom\",\"lastName\": \"cruise\",\"email\": \"testnodecms@gmail.com\",\"password\": \"testnodecms@123\",\"phoneNumber\": \"55232659858\",\"securityQuestion\": \"favourite cartoon series?\",\"securityAnswer\": \"transformers series\",\"userRole\": \"admin\"};type=application/json"
     * @apiSuccess {String} message User saved successfully.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "message": "User saved successfully"
     *       }
     *
     * @apiError (UnAuthorizedError) {String} message authentication token was not supplied
     * @apiError (UnAuthorizedError) {Boolean} isToken to check if token is supplied or not , if token is supplied , returns true else returns false
     * @apiError (UnAuthorizedError) {Boolean} success true if jwt token verifies
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "isToken": true,
     *        "success": false,
     *        "message": "Authentication failed"
     *     }
     *
     *
     * @apiError  (UnAuthorizedError_1) {String} message  You are not authorized to access this api route.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to access this api route."
     *     }
     *
     * @apiError  (UnAuthorizedError_2) {String} message  You are not authorized to perform this action.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to perform this action"
     *     }
     *
     *
     *
     * @apiError  (BadRequest) {String[]} message validation errors due to not entering values for  mandatory fields first name, last name, email address, user role, password, security question and answer to that question
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *
     *     {
     *       "message":[
     *                      {"param":"securityQuestion","msg":"Security question is required"},
     *                      {"param":"securityAnswer","msg":"Security answer is required"},
     *                      {"param":"firstName","msg":"First name is required"},
     *                      {"param":"lastName","msg":"Last name is required"},
     *                      {"param":"email","msg":"Email is required"},
     *                      {"param":"userRole","msg":"User role is required"},
     *                      {"param":"password","msg":"Password is required","value":""}
     *                 ]
     *     }
     *
     *
     *
     * @apiError  (AlreadyExists)  {String} message  User with same username already exists
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 409 Conflict
     *     {
     *       "message": "User with same username already exists"
     *     }
     *
     *
     * @apiError  (BadRequest) {String} message password must not be same as username of the user
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *
     *     {
     *       "message": "Password must not contain the username"
     *     }
     *
     *
     * @apiError  (BadRequest) {String} message password must be strong and must contain commonly used passwords to enforce password security
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *
     *     {
     *       "message": "Password is very weak. Please try the combination of lowercase alphabets, uppercase alphabets, numbers, symbols and a minimum of 8 characters long password"
     *     }
     *
     *
     *
     *
     * @apiError (InternalServerError)  {String} message  Internal Server Error
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "message": "Internal Server Error"
     *     }
     *
     */

    .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, documentUploader.single('documentName'), routineController.saveRoutine);


    // routineRouter.route('/routine/:routineId')

    /**
     * @api {get} /api/user/:userId Get user  information object by user ID
     * @apiPermission admin
     * @apiName getUserByID
     * @apiGroup User
     *
     *
     * @apiParam {String} userId  object id of the user
     *
     *   @apiParamExample {json} Request-Example:
     *     {
     *       "userId": "57833052319c2cae0defc7b5"
     *     }
     *
     *
     * @apiDescription Retrieves the user object by ID, if exists, else return empty object
     * @apiVersion 0.0.1
     *
     * @apiHeader (AuthorizationHeader) {String} authorization x-access-token value.
     * @apiHeaderExample {json} Header-Example:
     *{
     *  "x-access-token": "yJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c"
     * }
     *
     *
     * @apiExample {curl} Example usage:
     * curl \
     * -G \
     * -v \
     * "http://localhost:3000/api/user/57833052319c2cae0defc7b5" \
     * -H "x-access-token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c2JlYXQuY29tIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiX2lkIjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwidXNlckNvbmZpcm1lZCI6ZmFsc2UsImJsb2NrZWQiOmZhbHNlLCJkZWxldGVkIjpmYWxzZSwiYWRkZWRPbiI6IjIwMTYtMDctMDhUMDc6NTQ6MDMuNzY2WiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjpmYWxzZSwidXNlclJvbGUiOiJhZG1pbiIsImFjdGl2ZSI6dHJ1ZX0sImNsYWltcyI6eyJzdWJqZWN0IjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwiaXNzdWVyIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwicGVybWlzc2lvbnMiOlsic2F2ZSIsInVwZGF0ZSIsInJlYWQiLCJkZWxldGUiXX0sImlhdCI6MTQ2OTE4MzQ0MCwiZXhwIjoxNDY5MjAzNDQwLCJpc3MiOiI1NzdmNWMxYjU4Njk5MDJkNjdlYjIyYTgifQ.KSp3_S2LEhixyzTnNJE9AtD5u7-8ljImr-Np0kzxkoNWWjqB66a_T67NTCTMoMZys7PIYPFNBR9VwLOhkrX7BQ"
     *
     *
     *
     * @apiSuccess {String} _id  object id of user data.
     * @apiSuccess {String} firstName  first name of the user.
     * @apiSuccess {String} middleName middle name of the user.
     * @apiSuccess {String} lastName   last name of the user.
     * @apiSuccess {String} email  email address of the user.
     * @apiSuccess {String} username  username used when registering in the system, by default, same as email address.
     * @apiSuccess {String} phoneNumber phone number of the  user.
     * @apiSuccess {String} mobileNumber  mobile number of the user.
     * @apiSuccess {String} securityQuestion  question selected by the user as a backup or extra security mechanism.
     * @apiSuccess {Boolean} active  active bit status of the user.
     * @apiSuccess {String} userRole  role of the user in the system.
     * @apiSuccess {String} imageName  name of the image file of the user avatar.
     * @apiSuccess {String} twoFactorAuthEnabled  multi-factor or two factor authentication is enabled in the system or not.
     * @apiSuccess {String} addedOn date of user registered in the system .
     * @apiSuccess {String} blocked user blocked or not.
     * @apiSuccess {String} userConfirmed user registration confirmed or not.
     * @apiSuccess {String} imageProperties  meta-data info of image file.
     * @apiSuccess {String} imageProperties.imageExtension  extension of image file .
     * @apiSuccess {String} imageProperties.imagePath  path of image file.
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *           "_id": "57833052319c2cae0defc7b5",
     *           "imageName": "user-1468215378497.webp",
     *           "securityQuestion": "Favourite Movie?",
     *           "mobileNumber": "9818278372",
     *           "phoneNumber": "01-5560147",
     *           "username": "shrawanlakhey@gmail.com",
     *           "email": "shrawanlakhey@gmail.com",
     *           "lastName": "Lakhe",
     *           "firstName": "Shrawan",
     *           "userConfirmed": true,
     *           "imageProperties": {
     *               "imagePath": "public/uploads/images/users/user-1468215378497.jpg",
     *               "imageExtension": "jpg"
     *           },
     *           "blocked": false,
     *           "addedOn": "2016-07-11T05:36:18.906Z",
     *           "twoFactorAuthEnabled": true,
     *           "userRole": "admin",
     *           "active": true
     *       }
     *
     *
     * @apiError (UnAuthorizedError) {String} message authentication token was not supplied
     * @apiError (UnAuthorizedError) {Boolean} isToken to check if token is supplied or not , if token is supplied , returns true else returns false
     * @apiError (UnAuthorizedError) {Boolean} success true if jwt token verifies
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "isToken": true,
     *        "success": false,
     *        "message": "Authentication failed"
     *     }
     *
     *
     * @apiError  (UnAuthorizedError_1) {String} message  You are not authorized to access this api route.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to access this api route."
     *     }
     *
     * @apiError  (UnAuthorizedError_2) {String} message  You are not authorized to perform this action.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to perform this action"
     *     }
     *
     *
     * @apiError  (NotFound) {String} message  User not found
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "message": "User not found"
     *     }
     *
     * @apiError  (InternalServerError) {String} message  Internal Server Error
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "message": "Internal Server Error"
     *     }
     *
     */

    // .get(function (req, res) {
    //     res.status(HTTPStatus.OK);
    //     res.json(req.user);
    // })

    /**
     * @api {patch} /api/user/:userId  Deletes existing user information  data from the database
     * @apiPermission admin
     * @apiName patchUserInformation
     * @apiGroup User
     *
     *
     * @apiParam {String} userId  object id of the user
     *
     *   @apiParamExample {json} Request-Example:
     *     {
     *       "userId": "57833052319c2cae0defc7b5"
     *     }
     *
     *
     *
     * @apiDescription Deletes existing user information data from the database
     * @apiVersion 0.0.1
     * @apiHeader (AuthorizationHeader) {String} authorization x-access-token value.
     * @apiHeaderExample {json} Header-Example:
     *{
     *  "x-access-token": "yJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c"
     * }
     *
     * @apiExample {curl} Example usage:
     *
     *
     * curl \
     * -v \
     * -X PATCH  \
     * http://localhost:3000/api/user/5791fc7cf7b57f69796ef444 \
     * -H 'Content-Type: application/json' \
     * -H "x-access-token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c2JlYXQuY29tIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiX2lkIjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwidXNlckNvbmZpcm1lZCI6ZmFsc2UsImJsb2NrZWQiOmZhbHNlLCJkZWxldGVkIjpmYWxzZSwiYWRkZWRPbiI6IjIwMTYtMDctMDhUMDc6NTQ6MDMuNzY2WiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjpmYWxzZSwidXNlclJvbGUiOiJhZG1pbiIsImFjdGl2ZSI6dHJ1ZX0sImNsYWltcyI6eyJzdWJqZWN0IjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwiaXNzdWVyIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwicGVybWlzc2lvbnMiOlsic2F2ZSIsInVwZGF0ZSIsInJlYWQiLCJkZWxldGUiXX0sImlhdCI6MTQ2OTE4MzQ0MCwiZXhwIjoxNDY5MjAzNDQwLCJpc3MiOiI1NzdmNWMxYjU4Njk5MDJkNjdlYjIyYTgifQ.KSp3_S2LEhixyzTnNJE9AtD5u7-8ljImr-Np0kzxkoNWWjqB66a_T67NTCTMoMZys7PIYPFNBR9VwLOhkrX7BQ" \
     * -d '{"deleted":"true"}'
     *
     * @apiSuccess {String} message User deleted successfully.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "message": "User deleted successfully"
     *       }
     *
     * @apiError (UnAuthorizedError) {String} message authentication token was not supplied
     * @apiError (UnAuthorizedError) {Boolean} isToken to check if token is supplied or not , if token is supplied , returns true else returns false
     * @apiError (UnAuthorizedError) {Boolean} success true if jwt token verifies
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "isToken": true,
     *        "success": false,
     *        "message": "Authentication failed"
     *     }
     *
     *
     * @apiError  (UnAuthorizedError_1) {String} message  You are not authorized to access this api route.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to access this api route."
     *     }
     *
     * @apiError  (UnAuthorizedError_2) {String} message  You are not authorized to perform this action.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to perform this action"
     *     }
     *
     *
     *
     * @apiError  (MethodNotAllowed)  {String} message  superadmin cannot be deleted
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 405 Method Not Allowed
     *     {
     *        "message": "superadmin cannot be deleted"
     *     }
     *
     *
     *
     * @apiError (InternalServerError)  {String} message  Internal Server Error
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "message": "Internal Server Error"
     *     }
     *
     */


    /**
     * @api {patch} /api/user/:userId  Updates  user's password information to the  database
     * @apiPermission admin
     * @apiName patchUserInformation
     * @apiGroup User
     *
     *
     * @apiParam {String} userId  object id of the user
     *
     *   @apiParamExample {json} Request-Example:
     *     {
     *       "userId": "57833052319c2cae0defc7b5"
     *     }
     *
     *
     *
     * @apiDescription Updates user's password information data to the database
     * @apiVersion 0.0.1
     * @apiHeader (AuthorizationHeader) {String} authorization x-access-token value.
     * @apiHeaderExample {json} Header-Example:
     *{
     *  "x-access-token": "yJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c"
     * }
     *
     * @apiExample {curl} Example usage:
     *
     *
     *
     * curl \
     * -v \
     * -X PATCH  \
     * http://localhost:3000/api/user/5791fc7cf7b57f69796ef444 \
     * -H 'Content-Type: application/json' \
     * -H "x-access-token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c2JlYXQuY29tIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiX2lkIjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwidXNlckNvbmZpcm1lZCI6ZmFsc2UsImJsb2NrZWQiOmZhbHNlLCJkZWxldGVkIjpmYWxzZSwiYWRkZWRPbiI6IjIwMTYtMDctMDhUMDc6NTQ6MDMuNzY2WiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjpmYWxzZSwidXNlclJvbGUiOiJhZG1pbiIsImFjdGl2ZSI6dHJ1ZX0sImNsYWltcyI6eyJzdWJqZWN0IjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwiaXNzdWVyIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwicGVybWlzc2lvbnMiOlsic2F2ZSIsInVwZGF0ZSIsInJlYWQiLCJkZWxldGUiXX0sImlhdCI6MTQ2OTE4MzQ0MCwiZXhwIjoxNDY5MjAzNDQwLCJpc3MiOiI1NzdmNWMxYjU4Njk5MDJkNjdlYjIyYTgifQ.KSp3_S2LEhixyzTnNJE9AtD5u7-8ljImr-Np0kzxkoNWWjqB66a_T67NTCTMoMZys7PIYPFNBR9VwLOhkrX7BQ" \
     * -d '{"password":"nodecms@123"}'
     *
     * @apiSuccess {String} message Password changed successfully.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "message": "Password changed successfully"
     *       }
     *
     * @apiError (UnAuthorizedError) {String} message authentication token was not supplied
     * @apiError (UnAuthorizedError) {Boolean} isToken to check if token is supplied or not , if token is supplied , returns true else returns false
     * @apiError (UnAuthorizedError) {Boolean} success true if jwt token verifies
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "isToken": true,
     *        "success": false,
     *        "message": "Authentication failed"
     *     }
     *
     *
     * @apiError  (UnAuthorizedError_1) {String} message  You are not authorized to access this api route.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to access this api route."
     *     }
     *
     * @apiError  (UnAuthorizedError_2) {String} message  You are not authorized to perform this action.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to perform this action"
     *     }
     *
     *
     * @apiError  (BadRequest) {String} message password must not be same as username of the user
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *
     *     {
     *       "message": "Password must not contain the username"
     *     }
     *
     *
     * @apiError  (BadRequest) {String} message password must be strong and must contain commonly used passwords to enforce password security
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *
     *     {
     *       "message": "Password is very weak. Please try the combination of lowercase alphabets, uppercase alphabets, numbers, symbols and a minimum of 8 characters long password"
     *     }
     *
     *
     * @apiError  (Forbidden) {String} message You are not allowed to change the password of superadmin user
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 403 Forbidden
     *
     *     {
     *       "message": "You are not allowed to change the password of superadmin user"
     *     }
     *
     *
     *
     *
     * @apiError (InternalServerError)  {String} message  Internal Server Error
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "message": "Internal Server Error"
     *     }
     *
     */


    /**
     * @api {patch} /api/user/:userId  Updates  user's security answer information to the  database
     * @apiPermission admin
     * @apiName patchUserInformation
     * @apiGroup User
     *
     *
     * @apiParam {String} userId  object id of the user
     *
     *   @apiParamExample {json} Request-Example:
     *     {
     *       "userId": "57833052319c2cae0defc7b5"
     *     }
     *
     *
     *
     * @apiDescription Updates user's security answer information data to the database
     * @apiVersion 0.0.1
     * @apiHeader (AuthorizationHeader) {String} authorization x-access-token value.
     * @apiHeaderExample {json} Header-Example:
     *{
     *  "x-access-token": "yJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c"
     * }
     *
     * @apiExample {curl} Example usage:
     *
     *
     *
     * curl \
     * -v \
     * -X PATCH  \
     * http://localhost:3000/api/user/5791fc7cf7b57f69796ef444 \
     * -H 'Content-Type: application/json' \
     * -H "x-access-token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c2JlYXQuY29tIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiX2lkIjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwidXNlckNvbmZpcm1lZCI6ZmFsc2UsImJsb2NrZWQiOmZhbHNlLCJkZWxldGVkIjpmYWxzZSwiYWRkZWRPbiI6IjIwMTYtMDctMDhUMDc6NTQ6MDMuNzY2WiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjpmYWxzZSwidXNlclJvbGUiOiJhZG1pbiIsImFjdGl2ZSI6dHJ1ZX0sImNsYWltcyI6eyJzdWJqZWN0IjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwiaXNzdWVyIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwicGVybWlzc2lvbnMiOlsic2F2ZSIsInVwZGF0ZSIsInJlYWQiLCJkZWxldGUiXX0sImlhdCI6MTQ2OTE4MzQ0MCwiZXhwIjoxNDY5MjAzNDQwLCJpc3MiOiI1NzdmNWMxYjU4Njk5MDJkNjdlYjIyYTgifQ.KSp3_S2LEhixyzTnNJE9AtD5u7-8ljImr-Np0kzxkoNWWjqB66a_T67NTCTMoMZys7PIYPFNBR9VwLOhkrX7BQ" \
     * -d '{"securityQuestion":"favorite movie","securityAnswer":"Harry Potter"}'
     *
     * @apiSuccess {String} message Security answer changed successfully.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "message": "Security answer changed successfully"
     *       }
     *
     * @apiError (UnAuthorizedError) {String} message authentication token was not supplied
     * @apiError (UnAuthorizedError) {Boolean} isToken to check if token is supplied or not , if token is supplied , returns true else returns false
     * @apiError (UnAuthorizedError) {Boolean} success true if jwt token verifies
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "isToken": true,
     *        "success": false,
     *        "message": "Authentication failed"
     *     }
     *
     * @apiError  (UnAuthorizedError_1) {String} message  You are not authorized to access this api route.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to access this api route."
     *     }
     *
     * @apiError  (UnAuthorizedError_2) {String} message  You are not authorized to perform this action.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to perform this action"
     *     }
     *
     *
     * @apiError (InternalServerError)  {String} message  Internal Server Error
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "message": "Internal Server Error"
     *     }
     *
     */

    //    .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.patchUserInformation)

    /**
     * @api {put} /api/user/:userId  Updates existing user information  data to the database
     * @apiPermission admin
     * @apiName updateUser
     * @apiGroup User
     *
     *
     * @apiParam {String} userId  object id of the user
     *
     *   @apiParamExample {json} Request-Example:
     *     {
     *       "userId": "57833052319c2cae0defc7b5"
     *     }
     *
     *
     *
     * @apiDescription Update existing user information data object to the database
     * @apiVersion 0.0.1
     * @apiHeader (AuthorizationHeader) {String} authorization x-access-token value.
     * @apiHeaderExample {json} Header-Example:
     *{
     *  "x-access-token": "yJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c"
     * }
     *
     * @apiExample {curl} Example usage:
     *
     *
     * curl \
     * -v \
     * -X PUT  \
     * http://localhost:3000/api/user/5791fc7cf7b57f69796ef444 \
     * -H "Content-Type: multipart/form-data"  \
     * -H "x-access-token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaGVsbG9AYml0c2JlYXQuY29tIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiX2lkIjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwidXNlckNvbmZpcm1lZCI6ZmFsc2UsImJsb2NrZWQiOmZhbHNlLCJkZWxldGVkIjpmYWxzZSwiYWRkZWRPbiI6IjIwMTYtMDctMDhUMDc6NTQ6MDMuNzY2WiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjpmYWxzZSwidXNlclJvbGUiOiJhZG1pbiIsImFjdGl2ZSI6dHJ1ZX0sImNsYWltcyI6eyJzdWJqZWN0IjoiNTc3ZjVjMWI1ODY5OTAyZDY3ZWIyMmE4IiwiaXNzdWVyIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwicGVybWlzc2lvbnMiOlsic2F2ZSIsInVwZGF0ZSIsInJlYWQiLCJkZWxldGUiXX0sImlhdCI6MTQ2OTE4MzQ0MCwiZXhwIjoxNDY5MjAzNDQwLCJpc3MiOiI1NzdmNWMxYjU4Njk5MDJkNjdlYjIyYTgifQ.KSp3_S2LEhixyzTnNJE9AtD5u7-8ljImr-Np0kzxkoNWWjqB66a_T67NTCTMoMZys7PIYPFNBR9VwLOhkrX7BQ" \
     * -F avatar=@public/images/404_banner.png  \
     * -F "data={\"firstName\": \"david\",\"lastName\": \"beckham\",\"email\": \"testnodecms@gmail.com\",\"phoneNumber\": \"556000023\",\"mobileNumber\": \"977-9999999999\",\"userRole\": \"admin\"};type=application/json"
     *
     * @apiSuccess {String} message User updated successfully.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "message": "User updated successfully"
     *       }
     *
     * @apiError (UnAuthorizedError) {String} message authentication token was not supplied
     * @apiError (UnAuthorizedError) {Boolean} isToken to check if token is supplied or not , if token is supplied , returns true else returns false
     * @apiError (UnAuthorizedError) {Boolean} success true if jwt token verifies
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "isToken": true,
     *        "success": false,
     *        "message": "Authentication failed"
     *     }
     *
     *
     * @apiError  (UnAuthorizedError_1) {String} message  You are not authorized to access this api route.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to access this api route."
     *     }
     *
     * @apiError  (UnAuthorizedError_2) {String} message  You are not authorized to perform this action.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "message": "You are not authorized to perform this action"
     *     }
     *
     *
     *
     * @apiError  (BadRequest) {String[]} message validation errors due to not entering values for  mandatory fields first name, last name, email address, user role
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *
     *     {
     *       "message":[
     *                      {"param":"firstName","msg":"First name is required"},
     *                      {"param":"lastName","msg":"Last name is required"},
     *                      {"param":"email","msg":"Email is required"},
     *                      {"param":"userRole","msg":"User role is required"}
     *                 ]
     *     }
     *
     *
     *
     * @apiError  (AlreadyExists)  {String} message  User with same username already exists
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 409 Conflict
     *     {
     *       "message": "User with same username already exists"
     *     }
     *
     *
     *
     * @apiError (InternalServerError)  {String} message  Internal Server Error
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "message": "Internal Server Error"
     *     }
     *
     */

    //  .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, uploader.single('avatar'), fileUploadHelper.imageUpload, routineController.updateUser);

    routineRouter.use('/routines/:routineid', function(req, res, next) {
        routineController.getsingleRoutineByID(req)
            .then(function(singleroutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (singleroutine) {
                    req.singleroutine = singleroutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/routines/:routineid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.singleroutine);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.patchRoutineInformation);

    routineRouter.use('/librarycomment/:rid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getLibraryCommentsByRID(req)
            .then(function(routine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log('routine ', routine);
                if (routine) {
                    req.librarycomment = routine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    routineRouter.route('/librarycomment/:rid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.librarycomment);
        });

    routineRouter.route('/getpremiumuserroutine')
        .get(getPremiumUsersRoutine)


    routineRouter.use('/videoView/:vid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getLibraryVideoByVID(req)
            .then(function(routine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log('routine ', routine);
                if (routine) {
                    req.libraryVideoView = routine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    routineRouter.route('/sendReportMail')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, mailController.sendReportMail)
    routineRouter.route('/videoView/:vid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.libraryVideoView);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.updateLibraryView);

    routineRouter.use('/mobvideoView/:vid', function(req, res, next) {
        routineController.getLibraryVideoByVID(req)
            .then(function(Mobroutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log('routine ', Mobroutine);
                if (Mobroutine) {
                    req.Mobroutine = Mobroutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    routineRouter.route('/mobvideoView/:vid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.Mobroutine);
        })
        .patch(routineController.updateLibraryViewformob);

    routineRouter.use('/routine/user/:userid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getRoutineByID(req)
            .then(function(routine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (routine) {
                    req.routine = routine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/routine/user/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.routine);
        });

    // For charting -----------
    routineRouter.use('/judgedRoutineByUid/:uid', function(req, res, next) {
        routineController.judgedRoutineByUid(req, function(err, data) {
                if (err) {
                    //console.log()
                }
                //console.log('aggregated data ', data);
                if (data) {
                    req.judgedRoutineByUid = data;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
                // var routineDataLen = data.length;
                // var dataToReturn = [];

                // var mainPromise = new Promise((mResolve, mReject) => {
                //    data.forEach((item, itemIndex) => {
                //        //console.log('item index ', itemIndex);

                //        var groupedItemPromise = new Promise((resolve, reject) => {
                //            item.groupedItem.forEach( (groupedItem, gItemIndex) => {
                //                var tempArr = [];
                //                var counter = gItemIndex+1;
                //                var findRoutine = new Promise((resol, rejec) => {
                //                    Routine.find({"_id": mongoose.Types.ObjectId(groupedItem.routineid)}, function(err, routine){
                //                        if(err){
                //                            //console.log('error retrieving routine with rid ', routine);
                //                            rejec(err);
                //                        }
                //                        if(routine[0]){
                //                         tempArr.push(routine[0]);
                //                        }else{
                //                            tempArr.push({});
                //                        }
                //                     //    //console.log('tempArr ', tempArr);
                //                        resol(tempArr);
                //                    });
                //                })
                //                findRoutine.then(tempData => {
                //                    if(counter == item.groupedItem.length){
                //                        resolve(tempArr)
                //                    }
                //                })                 
                //            })                    
                //        })
                //        groupedItemPromise.then(gdata => {
                //         //    //console.log('ret group item ', gdata);
                //         //    gdata.forEach(element => {

                //         //    });
                //            item['routineDetails']= gdata;

                //            dataToReturn.push(item);
                //            const itemCounter = itemIndex + 1;
                //            //console.log('itemCounter len -> '+itemCounter+'data.length len -> ', data.length)
                //            if(itemCounter ==routineDataLen){
                //                //console.log('=================MATCHES=================')
                //             //    //console.log('i ========> ', dataToReturn);
                //                return mResolve(dataToReturn);
                //            }
                //        })                
                //    });
                // })
                // mainPromise.then(mainData => {
                //     // //console.log('main data =========> ', mainData);
                //     if (mainData) {
                //         req.judgedRoutineByUid = mainData;
                //         next();
                //         return null;// return a non-undefined value to signal that we didn't forget to return promise
                //     } else {
                //         res.status(HTTPStatus.NOT_FOUND);
                //         res.json({
                //             message: messageConfig.routine.notFoundroutine
                //         });
                //     }
                // })
                //  return mainPromise;
            })
            // .then(function(routine){
            //     //saving in request object so that it can be used for other operations like updating data using put and patch method
            //     //console.log('routine ', routine);
            //     if (routine) {
            //         req.judgedRoutineByUid = routine;
            //         next();
            //         return null;// return a non-undefined value to signal that we didn't forget to return promise
            //     } else {
            //         res.status(HTTPStatus.NOT_FOUND);
            //         res.json({
            //             message: messageConfig.routine.notFoundroutine
            //         });
            //     }
            // })
            // .catch(function(err){
            //     return next(err);
            // });
    });
    routineRouter.route('/judgedRoutineByUid/:uid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.judgedRoutineByUid);
        })

    routineRouter.route('/routineScoresByUID/:UID')
        .get(routineController.routineScoresByUID)

    routineRouter.use('/judgeroutines/:userid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getJudgedRoutineByJudgename(req)
            .then(function(judgedroutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (judgedroutine) {
                    req.judgedroutine = judgedroutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/judgeroutines/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.judgedroutine);
        });
    routineRouter.use('/userroutinescomment/:userid/:judgeID', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getRoutineCommentByrid(req)
            .then(function(routineComment) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (routineComment) {
                    req.routineComment = routineComment;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/userroutinescomment/:userid/:judgeID')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.routineComment);
        });

    routineRouter.use('/userroutinescomment/:userid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getRoutineCommentByrid(req)
            .then(function(routineComment) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (routineComment) {
                    req.routineComment = routineComment;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/userroutinescomment/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.routineComment);
        });
    routineRouter.use('/getRoutineCommentbyflyp10routineid/:routineId', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getFlyp10RoutineCommentByrid(req)
            .then(function(routineComment) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (routineComment) {
                    req.flyp10routineComment = routineComment;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });


    routineRouter.route('/getRoutineCommentbyflyp10routineid/:routineId')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.flyp10routineComment);
        });

    // routineRouter.use('/getRoutineCommentbyEventroutineid/:routineId', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function (req, res, next) {
    //     routineController.getRoutineCommentbyEventroutineid(req) 
    //        .then(function(routineComment){
    //            //saving in request object so that it can be used for other operations like updating data using put and patch method
    //            if (routineComment) {
    //                req.eventroutineComment = routineComment;
    //                next();
    //                return null;// return a non-undefined value to signal that we didn't forget to return promise
    //            } else {
    //                res.status(HTTPStatus.NOT_FOUND);
    //                res.json({
    //                    message: messageConfig.routine.notFoundroutine
    //                });
    //            }
    //        })
    //        .catch(function(err){
    //            return next(err);
    //        });
    // });


    routineRouter.route('/updateeteventmeetjudgingfromxlsx')
        .post(routineController.updateeteventmeetjudgingfromxlsx);

    routineRouter.route('/getRoutineCommentbyEventroutineid/:routineId')
        .get(routineController.getRoutineCommentbyEventroutineid);

    routineRouter.use('/getVerifiedsports/:judgeid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getVerifiedsportsByjudgeID(req)
            .then(function(verifiedjudge) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (verifiedjudge) {
                    req.verifiedjudgesports = verifiedjudge;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/getVerifiedsports/:judgeid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.verifiedjudgesports);
        });
    routineRouter.use('/getAssignedroutine/:judgeid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getAssignedroutine(req)
            .then(function(assignedRoutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (assignedRoutine) {
                    req.assignedRoutine = assignedRoutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/getAssignedroutine/:judgeid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.assignedRoutine);
        })
    routineRouter.use('/getroutinebysportsandlevel/:sport/:level', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getroutinebysportsandlevel(req)
            .then(function(verifiedjudge) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (verifiedjudge) {
                    req.routinelistbyspl = verifiedjudge;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/getroutinebysportsandlevel/:sport/:level')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.routinelistbyspl);
        })
    routineRouter.route('/judgeRoutineComment')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.judgeRoutineComment);
    routineRouter.route('/RoutineCommentsForJudge')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.patchRoutineComment);
    routineRouter.use('/routinestatus/:routineid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getsingleRoutinedetailByID(req)
            .then(function(singleroutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (singleroutine) {
                    if (singleroutine.sportid != applicationConfig.sports.WFigureSkating && singleroutine.sportid != applicationConfig.sports.MFigureSkating) {
                        singleroutine.technician_status = '2'
                    }
                    req.routinelist = singleroutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    routineRouter.use('/routinetechnicianstatus/:routineid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getsingleRoutineTechniciandetailByID(req)
            .then(function(singleroutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (singleroutine) {
                    req.routinelist = singleroutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    routineRouter.route('/getJudgesSportDetails/:sid/:lid/:assignedTo')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.getJudgesSportDetails);
    routineRouter.route('/getSingleRoutine/:routineid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getSingleRoutine)

    routineRouter.route('/getRoutineCommentForEventMeet/:routineid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getRoutineCommentForEventMeet)

    routineRouter.route('/getEventMeetRoutineCommentByPanel/:routineid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.getEventMeetRoutineCommentByPanel)

    routineRouter.route('/getEventMeetOverallCommentByPanel/:routineid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getEventMeetOverallCommentByPanel)

    function getEventMeetOverallCommentByPanel(req, res, next) {
        routineController.getEventMeetOverallCommentByPanel(req)
            .then(function(comment) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log(comment, "sjhdsjd")
                if (comment) {
                    res.status(HTTPStatus.OK);
                    res.json({
                        success: true,
                        result: comment
                    });
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }



    function getRoutineCommentForEventMeet(req, res, next) {
        routineController.getRoutineCommentForEventMeet(req)
            .then(function(comment) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                //console.log(comment, "sjhdsjd")
                if (comment) {
                    res.status(HTTPStatus.OK);
                    res.json({
                        success: true,
                        result: comment
                    });
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }
    routineRouter.route('/routinestatus/:routineid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.routinelist);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.patchRoutineStatusInformation);

    routineRouter.route('/updateroutinestatus/:routineid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.updateroutinestatus);
    routineRouter.route('/updateJudgeQueue')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.updateJudgeQueue)
    routineRouter.route('/addJudgesQueue')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.addJudgeQueue)
    routineRouter.route('/routinetechnicianstatus/:routineid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.routinelist);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.patchRoutineTechnicianStatusInformation);
    routineRouter.use('/technicianroutine/:routineid', function(req, res, next) {
        routineController.getsingleTechnicianRoutineByID(req)
            .then(function(singleroutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (singleroutine) {
                    //console.log(singleroutine, 'singleroutine')
                    req.singleroutine = singleroutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });
    routineRouter.route('/technicianRoutine/:routineid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getTechnicianRoutine)
    routineRouter.route('/technicianroutinecomment/:routineid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getTechnicianRoutineComment)

    routineRouter.route('/technicianroutine/:routineid')
        .get(function(req, res) {
            //console.log('get')
            res.status(HTTPStatus.OK);
            res.json(req.singleroutine);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.patchTechnicianRoutineInformation);
    routineRouter.route('/sortByState')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.sortByState);

    routineRouter.route('/updateObjectId')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.replaceAllIds);
    routineRouter.route('/getRoutineByEventLevel')
        .get(routineController.getRoutineByEventLevel);
    routineRouter.route('/convertRoutine/:routineID')
        .get(routineController.convertRoutineByName);
    routineRouter.route('/uploadjudgedRoutine')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.uploadjudgedRoutine);
    // Updated charting route for getting elements value summary -------------------------------
    routineRouter.route('/getElementsValueSummary')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.getElementsValueSummary);

    routineRouter.route('/getUserMappedSportsLevelsEvents')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.getUserMappedSportsLevelsEvents);

    routineRouter.route('/getEventsBySportLevel')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.getEventsBySportLevel);

    routineRouter.use('/updateroutineStatus/:routineid', function(req, res, next) {
        routineController.getsingleRoutinedetailByID(req)
            .then(function(singleroutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                console.log(singleroutine, "siglerotuine")
                if (singleroutine) {
                    req.routinelists = singleroutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/updateroutineStatus/:routineid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.routinelists);
        })
        .patch(routineController.patchRoutineAssignedStatusInformation);
    routineRouter.route('/routinecomment/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllRoutinecomment)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.postComment);

    routineRouter.route('/routineTechniciancomment/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllTechnicianRoutinecomment)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.postTechnicianComment);

    routineRouter.route('/filterByDateJudgedRoutineByUid/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.filterByDateJudgedRoutineByUid);

    routineRouter.route('/filterTrackingChartByDaysAndUid/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.filterTrackingChartByDaysAndUid);

    routineRouter.route('/getEventsForAnalyticsFilterByDays/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.getEventsForAnalyticsFilterByDays);

    routineRouter.route('/sportDetailsByUsername/:username')
        .post(routineController.sportDetailsByUsername);
    routineRouter.route('/getUnconvertedRoutine')
        .get(routineController.getUnconvertedRoutine);
    routineRouter.route('/eventsScoreById/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.eventsScoreById);

    routineRouter.route('/librarycomments/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllLibraryComments)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.postLibraryComment);

    routineRouter.route('/banner/')
        .get(getbannerdetails)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, documentbannerUploader.single('documentName'), routineController.saveBanner);

    routineRouter.use('/banner/:bannerid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getBannerdetailByID(req)
            .then(function(bannerObj) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (bannerObj) {
                    req.bannerObj = bannerObj;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.banner.notFoundBanner
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/banner/:bannerid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.bannerObj);
        })
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, documentUploader.single('documentName'), routineController.updatebanner)
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.patchBanner);

    routineRouter.use('/getbanner/:bannerid', function(req, res, next) {
        routineController.getBannerInfobyType(req)
            .then(function(bannerinfo) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (bannerinfo) {
                    req.bannerinfo = bannerinfo;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.banner.notFoundBanner
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/getbanner/:bannerid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.bannerinfo);
        })
    routineRouter.use('/routinebystatus/:routinestatus', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getRoutinedetailBystatus(req)
            .then(function(singleroutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (singleroutine) {
                    req.routinelistbyStatus = singleroutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/routinebystatus/:routinestatus')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.routinelistbyStatus);
        })
        //share Routine routes

    routineRouter.route('/shareRoutine')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.insertSharedRoutine);


    routineRouter.use('/getsharedRoutinebyUID/:UID', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function(req, res, next) {
        routineController.getsharedRoutinebyUID(req)
            .then(function(sharedRoutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (sharedRoutine) {
                    req.sharedRoutine = sharedRoutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/getsharedRoutinebyUID/:UID')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.sharedRoutine);
        })
        // routineRouter.route('/getsharedRoutinebyUID/:UID') 
        // .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, routineController.getsharedRoutinebyUID);
        //Super admin routine management menu
    routineRouter.route('/getTeammateRoutines')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getTeammateRoutines);

    routineRouter.route('/newRoutine')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllNewRoutine);

    routineRouter.route('/newRoutine/:eventMeetId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getEventMeetNewRoutine);
    routineRouter.route('/judgedRoutine')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllJudgedRoutine);
    routineRouter.route('/eventmeetQueueRoutine')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getEventmeetQueueRoutine);
    routineRouter.route('/eventmeetQueueRoutine/:eventMeetId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getEventmeetQueueRoutineByID);

    routineRouter.route('/assignedRoutine')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllassignedRoutine);
    routineRouter.route('/inCompleteRoutine')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllinCompleteRoutine);
    routineRouter.route('/inAppeopriateRoutine')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAllinAppeopriateRoutine);


    routineRouter.use('/deleteRoutinefile/:username', function(req, res, next) {
        routineController.deleteRoutinefile(req)
            .then(function(singleroutine) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method 
                if (singleroutine) {
                    req.deleteRoutinefile = singleroutine;
                    next();
                    return null; // return a non-undefined value to signal that we didn't forget to return promise 
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFoundroutine
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    });

    routineRouter.route('/deleteRoutinefile/:username')
        .get(function(req, res) {

            //console.log(req.deleteRoutinefile.length)
            let list = req.deleteRoutinefile;
            let rcount = 0
            let tcount = 0
            if (list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    let tempObj = list[i]
                        //console.log('videofileName', tempObj.videofilename);
                    try {
                        if (fs.existsSync(tempObj.videofilename)) {
                            fs.unlink(tempObj.videofilename, function(err) {
                                if (!err) {
                                    //console.log('routine File deleted!');
                                    rcount = rcount + 1
                                }
                                //console.log('unlink success video')
                                // if no error, file has been deleted successfully 


                            });
                        } else {
                            //console.log('unlink unsuccessful video')
                        }
                        if (fs.existsSync(tempObj.thumbnailPath)) {
                            fs.unlink(tempObj.thumbnailPath, function(err) {
                                if (!err) {
                                    //console.log('thump File deleted!');
                                    tcount = tcount + 1
                                }
                                //console.log('unlink success for thumbnail')
                                // if no error, file has been deleted successfully 

                            });
                        } else {
                            //console.log('unlink unsuccessful video')
                        }
                    } catch (e) {
                        //console.log('error by catch ', e)
                    }
                    if (i == list.length - 1) {
                        res.status(HTTPStatus.OK);
                        res.json({ rcount: rcount, tcount: tcount });
                    }
                }

            } else {
                res.status(HTTPStatus.OK);
                res.json(req.deleteRoutinefile);
            }

        })

    function getAllJudgedRoutine(req, res, next) {
        routineController.getAllJudgedRoutine(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getEventmeetQueueRoutine(req, res, next) {
        routineController.getEventmeetQueueRoutine(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getEventmeetQueueRoutineByID(req, res, next) {
        routineController.getEventmeetQueueRoutineByID(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }



    function getSingleRoutine(req, res, next) {
        routineController.getsingleRoutineByID(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })


        .catch(function(err) {
            return next(err);
        });
    }

    function getTeammateRoutines(req, res, next) {
        routineController.getTeammateRoutines(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllNewRoutine(req, res, next) {
        routineController.getAllNewRoutine(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getEventMeetNewRoutine(req, res, next) {
        routineController.getEventMeetNewRoutine(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllassignedRoutine(req, res, next) {
        routineController.getAllassignedRoutine(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllinCompleteRoutine(req, res, next) {
        routineController.getAllinCompleteRoutine(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllinAppeopriateRoutine(req, res, next) {
        routineController.getAllinAppeopriateRoutine(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.routine.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }
    //function declaration to return user list to the client, if exists, else return not found message
    function getRoutine(req, res, next) {
        routineController.getRoutine(req, next)
            .then(function(userList) {
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllTechnicianRoutinecomment(req, res, next) {
        routineController.getAllTechnicianRoutinecomment(req, next)
            .then(function(userList) {
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllRoutinecomment(req, res, next) {
        routineController.getAllRoutinecomment(req, next)
            .then(function(userList) {
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getTechnicianRoutine(req, res, next) {
        routineController.getsingleTechnicianRoutineByID(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                //console.log('rerer', routinelist)
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getTechnicianRoutineComment(req, res, next) {
        routineController.getTechnicianRoutineComment(req, next)
            .then(function(routinelist) {
                //if exists, return data in json format
                //console.log('rerer', routinelist)
                if (routinelist) {
                    res.status(HTTPStatus.OK);
                    res.json(routinelist);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getLibraryVideoByVID(req, res, next) {
        routineController.getLibraryVideoByVID(req, next)
            .then(function(userList) {
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getAllLibraryComments(req, res, next) {
        routineController.getLibraryComments(req, next)
            .then(function(lComments) {
                //if exists, return data in json format
                if (lComments) {
                    res.status(HTTPStatus.OK);
                    res.json(lComments);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }


    function getbannerdetails(req, res, next) {
        routineController.getbannerdetails(req, next)
            .then(function(userList) {
                //if exists, return data in json format
                if (userList) {
                    res.status(HTTPStatus.OK);
                    res.json(userList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    function getPremiumUsersRoutine(req, res, next) {
        routineController.getPremiumUsersRoutine(req, next)
            .then(function(userRoutineList) {
                //if exists, return data in json format
                if (userRoutineList) {
                    res.status(HTTPStatus.OK);
                    res.json(userRoutineList);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            });
    }

    return routineRouter;

})();

module.exports = routineRoutes;