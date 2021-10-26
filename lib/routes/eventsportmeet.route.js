var routineRoutes = (function() {

    'use strict';
    var HTTPStatus = require('http-status'),
        express = require('express'),
        tokenAuthMiddleware = require('../middlewares/token.authentication.middleware'),
        roleAuthMiddleware = require('../middlewares/role.authorization.middleware'),
        messageConfig = require('../configs/api.message.config'),
        faqController = require('../controllers/faq.server.controller'),
        eventController = require('../controllers/event.meet.server'),
        routineFilePath = './public/uploads/user/routine/',
        uploaddocPrefix = 'routine',
        docfileUploadHelper = require('../helpers/file.upload.helper')('', routineFilePath, uploaddocPrefix),
        documentUploader = docfileUploadHelper.documentUploader,
        //  fileUploadHelper = require('../helpers/file.upload.helper')(routineFilePath, '', uploadPrefix),
        //  uploader = fileUploadHelper.uploader,
        eventsportMeetRouter = express.Router();
    eventsportMeetRouter.route('/getEventMeetCoachMappingForUser/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeetCoachMappingForUser);
    eventsportMeetRouter.route('/removeeventmeetcoachmapping/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.removeEventMeetCoachMappingList);
    eventsportMeetRouter.route('/eventmeetcoachmapping/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.saveEventMeetCoachMapping);
    eventsportMeetRouter.route('/eventmeetcoachmapping/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeetCoachMapping);


    eventsportMeetRouter.route('/eventmeetgroup/')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.saveEventMeetGroup);

    eventsportMeetRouter.route('/geteventmeetgroupByeventId/')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventmeetGroupByeventId);

    eventsportMeetRouter.route("/swapJudgesForEventmeetByEventLevel")
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.swapJudgesForEventmeetByEventLevel);
    eventsportMeetRouter.route('/eventsportmeet/')

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

    .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getEvent)

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

    .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.saveEventMeet)


    // faqRouter.route('/routine/:routineId')

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

    /*      faqRouter.use('/faq/:faqid', tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, function (req, res, next) {
           faqController.getFaqByID(req) 
              .then(function(faq){
                  //saving in request object so that it can be used for other operations like updating data using put and patch method
                  if (faq) {
                      req.faq = faq;
                      next();
                      return null;// return a non-undefined value to signal that we didn't forget to return promise
                  } else {
                      res.status(HTTPStatus.NOT_FOUND);
                      res.json({
                          message: messageConfig.routine.notFoundroutine
                      });
                  }
              })
              .catch(function(err){
                  return next(err);
              });
      });

      faqRouter.route('/faq/:faqid')
      .get(function (req, res) {
          res.status(HTTPStatus.OK);
          res.json(req.faq);
      })
      .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, faqController.updateFaq)
      .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, faqController.patchFaqInformation);
         
      faqRouter.use('/faqlist/user/:userid', function (req, res, next) {
           faqController.getFaqByuserID(req)
              .then(function(faqlist){
                  //saving in request object so that it can be used for other operations like updating data using put and patch method
                  if (faqlist) {
                      req.faqlist = faqlist;
                      next();
                      return null;// return a non-undefined value to signal that we didn't forget to return promise
                  } else {
                      res.status(HTTPStatus.NOT_FOUND);
                      res.json({
                          message: messageConfig.routine.notFoundroutine
                      });
                  }
              })
              .catch(function(err){
                  return next(err);
              });
      });

      faqRouter.route('/faqlist/user/:userid')
      .get(function (req, res) {
          res.status(HTTPStatus.OK);
          res.json(req.faqlist);
      }) */


    eventsportMeetRouter.route('/eventmeet')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.addEventMeet)
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getAllEventMeet)


    eventsportMeetRouter.route('/startedeventmeet')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getAllStartedEventMeet)

    eventsportMeetRouter.route('/sanctioneventmeet/:sanctionid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getSanctionEventMeet)


    eventsportMeetRouter.route('/getEventMeetbyCreatedBy/:userid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeetByCreatedby)

    eventsportMeetRouter.route('/getCompetitorsByEventmeetSanction')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getSanctionCoachesAthletes)

    eventsportMeetRouter.route('/getAthleteCoachRoutinesByEvent')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getAthleteCoachRoutinesByEvent)
    eventsportMeetRouter.route('/getEventMeetSportEventInfobyId/:eventmeetId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeetSportEventInfobyId)

    eventsportMeetRouter.route('/getEventMeetbyCreatedBySanctionID/:userid/:sanctionid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeetbyCreatedBySanctionID)

    eventsportMeetRouter.route('/getEventMeetbyuserid/:userid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeetbyid)

    eventsportMeetRouter.route('/getRankingForEventMeet/:eventmeetId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getRankingForEventMeet)

    eventsportMeetRouter.route('/getRankingForEventMeetAlllevel/:eventmeetId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getRankingForEventMeetAlllevel)

    eventsportMeetRouter.route('/getRankingForEventMeetlevel')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getRankingForEventMeetlevel)

    eventsportMeetRouter.route('/getRankingbyEventLevel')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getRankingbyEventLevel)

    eventsportMeetRouter.route('/eventmeetlower')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getLowerEventMeet);
    eventsportMeetRouter.route('/eventmeetsformap')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeetForMap)

    eventsportMeetRouter.route('/eventmeetsformapbyuserid/:userid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeetForMapByCreatedBy)

    eventsportMeetRouter.route('/eventmeetsbymemberid/:memberid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getSanctionEventMeetByMemberID)
    eventsportMeetRouter.route('/eventmeetsformapbymemberid/:memberid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getSanctionEventMeetForMeetDirectorAdmin)
    eventsportMeetRouter.route('/getMappedCompetitorsForeventmeet')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getMappedCompetitorsForeventmeet)


    eventsportMeetRouter.route('/getenroll')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEnrolledEventMeet)
        //    eventsportMeetRouter.route('/generatepdf')
        //    .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize,eventController.generatepdf)

    eventsportMeetRouter.route('/getenroll/:id')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEnrolledEventMeetById)
    eventsportMeetRouter.route('/getenrollStartEndDate/:id')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEnrolledEventMeetByIdStartEndDate)

    eventsportMeetRouter.route('/enroll')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.enrollEventMeet)

    eventsportMeetRouter.route('/eventmeet/:eventId')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.updateEventMeet)
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeet)

    eventsportMeetRouter.route('/sendStartCodeToUSAGMappedCompetitors')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.sendStartCodeToUSAGMappedCompetitors)

    eventsportMeetRouter.route('/eventmeetJudgespanelByeventmeetId/:eventmeetId')

    .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventmeetJudgespanelByeventmeetId)

    eventsportMeetRouter.route('/eventmeetJudgesBypanel')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.postEventmeetJudgesBypanel)
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventmeetJudgesBypanel)

    eventsportMeetRouter.route('/downloadEventmeetScore/:eventmeetId')
        .get(eventController.mappedEventmeetCompetitorsWithScore);
    eventsportMeetRouter.route('/downloadEventmeetScoreBylevel/:eventmeetId')
        .get(eventController.downloadEventmeetScoreBylevel);
    eventsportMeetRouter.route('/mappedEventMeetCoachInfo/:eventmeetId/:sanctionId')
        .get(eventController.mappedEventMeetCoachInfo);

    eventsportMeetRouter.route('/getEventlevelRoutines/:eventmeetId')
        .get(eventController.getEventlevelRoutines)
    eventsportMeetRouter.route('/getEventmeetRoutineJudgesbyPanel/:routineId')
        .get(eventController.getEventmeetRoutineJudgesbyPanel)
    eventsportMeetRouter.route('/eventmeet/:eventId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventMeet)

    eventsportMeetRouter.route('/removeeventlist/:eventid')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.removeEventList)

    eventsportMeetRouter.route('/removeeventmeetgroup')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.removeEventMeetGroup)

    eventsportMeetRouter.route('/getEventForJudges/:judgeId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventForJudges)

    eventsportMeetRouter.route('/getReviewRoutine')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getReviewRoutine)

    eventsportMeetRouter.route('/updateMeetdeventRoutineStatus')
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.updateMeetdeventRoutineStatus)

    eventsportMeetRouter.route('/getEventJudgesCount/:routineId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventJudgesCount)

    eventsportMeetRouter.route('/getEventRoutineDetails/:judgeId/:routineID')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getEventRoutineDetails)


    eventsportMeetRouter.route('/getJudgedEventMeetRoutine/:judgeId')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.getJudgedEventMeetRoutine)

    eventsportMeetRouter.route('/checkisEnrolledEvent/:eventID/:userID')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.checkisEnrolledEvent)

    eventsportMeetRouter.route('/eventlist/')
        .get(getAllEventList)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.saveNewEventList)
        // .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.updateEvent);


    eventsportMeetRouter.route('/eventlist/:eventname')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            //console.log('middleware ', req.neweventInfo)
            res.json(req.neweventInfo);
        })
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.updateEvent);

    eventsportMeetRouter.route('/usereventlist/')
        .get(getAllUserEventList)
        .post(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.saveUserEventMeet)

    eventsportMeetRouter.use('/eventsportmeetuser/:userid', function(req, res, next) {
        eventController.getEventMeetByuserID(req)
            .then(function(eventMeetlist) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (eventMeetlist) {
                    req.eventMeetlist = eventMeetlist;
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

    eventsportMeetRouter.route('/eventsportmeetuser/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.eventMeetlist);
        });
    eventsportMeetRouter.use('/eventsportlistbyevent/:event', function(req, res, next) {
        eventController.getEventlistByevent(req)
            .then(function(eventlistByEvent) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (eventlistByEvent) {
                    req.eventlistByEvent = eventlistByEvent[0];
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

    eventsportMeetRouter.route('/eventsportlistbyevent/:event')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            //console.log('middleware ', req.eventlistByEvent)
            res.json(req.eventlistByEvent);
        })
        .put(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.updateEvent)
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.patchEvent);


    eventsportMeetRouter.use('/updateEventMeetRoutineID/:routineID', function(req, res, next) {
        eventController.getEventMeetRoutineID(req)
            .then(function(MeetRoutineID) {
                //console.log(MeetRoutineID)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (MeetRoutineID) {
                    req.MeetRoutine = MeetRoutineID[0];
                    //console.log(MeetRoutineID[0])
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
    eventsportMeetRouter.route('/getEventJudgeDetails/:judgeId/:routineID')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getEventJudgeDetails);
    eventsportMeetRouter.route('/updateEventMeetRoutineID/:routineID')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            //console.log('middleware ', req.getEvent)
            res.json(req.MeetRoutine);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.patchEventMeetRoutine);
    eventsportMeetRouter.use('/updateAssignedStatusInEventMeetForJudges/:routineID', function(req, res, next) {
        eventController.getEventMeetRoutineID(req)
            .then(function(MeetRoutineID) {
                //console.log(MeetRoutineID)
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (MeetRoutineID) {
                    req.MeetRoutine = MeetRoutineID[0];
                    //console.log(MeetRoutineID[0])
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


    eventsportMeetRouter.route('/updateAssignedStatusInEventMeetForJudges/:routineID')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            //console.log('middleware ', req.getEvent)
            res.json(req.MeetRoutine);
        })
        .patch(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, eventController.patchAssignedStatusInEventMeetForJudges);


    eventsportMeetRouter.route('/getAssignedEventMeetForJudges/:judgeid')
        .get(tokenAuthMiddleware.authenticate, roleAuthMiddleware.authorize, getAssignedEventMeetForJudges)
    eventsportMeetRouter.route('/eventsportlistbyevent/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.eventlistByEvent);
        })

    eventsportMeetRouter.use('/getfutureevntbyuserid/:userid', function(req, res, next) {
        eventController.getfutureevntbyuserid(req)
            .then(function(futureevent) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (futureevent) {
                    req.futureevent = futureevent;
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

    eventsportMeetRouter.route('/getfutureevntbyuserid/:userid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.futureevent);
        });

    eventsportMeetRouter.use('/getevntbyuseridandeventid/:userid/:eventid', function(req, res, next) {
        eventController.getevntbyuseridandeventid(req)
            .then(function(futureevent) {
                //saving in request object so that it can be used for other operations like updating data using put and patch method
                if (futureevent) {
                    req.eventbyuserandeventid = futureevent;
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

    eventsportMeetRouter.route('/getevntbyuseridandeventid/:userid/:eventid')
        .get(function(req, res) {
            res.status(HTTPStatus.OK);
            res.json(req.eventbyuserandeventid);
        })

    function getAssignedEventMeetForJudges(req, res, next) {
        eventController.getAssignedEventMeetForJudges(req, next)
            .then(function(judgedata) {
                //if exists, return data in json format
                if (judgedata) {
                    res.status(HTTPStatus.OK);
                    res.json(judgedata);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            })
    }

    function getEventJudgeDetails(req, res, next) {
        req.body.jid = req.params.judgeId;
        eventController.getEventJudgeDetails(req, next)
            .then(function(judgedata) {
                //if exists, return data in json format
                if (judgedata) {
                    res.status(HTTPStatus.OK);
                    res.json(judgedata);
                } else {
                    res.status(HTTPStatus.NOT_FOUND);
                    res.json({
                        message: messageConfig.user.notFound
                    });
                }
            })
            .catch(function(err) {
                return next(err);
            })
    }
    //function declaration to return user list to the client, if exists, else return not found message
    function getEvent(req, res, next) {
        eventController.getAllEvent(req, next)
            .then(function(eventList) {
                //if exists, return data in json format
                if (eventList) {
                    res.status(HTTPStatus.OK);
                    res.json(eventList);
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


    function getAllEventList(req, res, next) {
        eventController.getallEventList(req, next)
            .then(function(eventListdata) {
                //if exists, return data in json format
                if (eventListdata) {
                    res.status(HTTPStatus.OK);
                    res.json(eventListdata);
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

    function getAllUserEventList(req, res, next) {
        eventController.getAllUserEventList(req, next)
            .then(function(eventListdata) {
                //if exists, return data in json format
                if (eventListdata) {
                    res.status(HTTPStatus.OK);
                    res.json(eventListdata);
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

    return eventsportMeetRouter;

})();

module.exports = routineRoutes;