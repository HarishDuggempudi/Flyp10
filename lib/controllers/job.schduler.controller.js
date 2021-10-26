 var jobController = (function() {

     'use strict';

     var dataProviderHelper = require('../data/mongo.provider.helper'),
         HTTPStatus = require('http-status'),
         messageConfig = require('../configs/api.message.config'),
         hasher = require('../auth/hasher'),
         User = require('../models/user.server.model'),
         Acitivity = require('../models/Flyp10ActivityLog.server.model'),
         WorldMeet = require('../models/worldmeetSchema.server.model'),
         applicationConfig = require('../configs/application.config'),
         Routine = require('../models/routine.server.model'),
         utilityHelper = require('../helpers/utilities.helper'),
         errorHelper = require('../helpers/error.helper'),
         eventController = require('./event.meet.server'),
         Promise = require("bluebird"),
         express = require('express'),
         path = require('path'),
         app = express(),
         fs = Promise.promisifyAll(require('fs'));
     var path = require('path');
     var mongoose = require('mongoose');
     const hbjs = require('handbrake-js');
     var documentFields = '_id question answer assignedTo active ';

     function JobModule() {}

     JobModule.Createlog = function(uid, rid, note, addedby) {
         var activityLog = new Acitivity();
         activityLog.LogNotes = note;
         activityLog.addedBy = addedby;
         activityLog.addedOn = new Date();
         return activityLog;
     };
     JobModule.CreateWorldMeet = function(rid, awards, addedby) {
         var worldMeet = new WorldMeet();
         worldMeet.Routineid = mongoose.Types.ObjectId(rid);
         worldMeet.Awards = awards;
         worldMeet.addedBy = addedby;
         worldMeet.addedOn = new Date();
         return worldMeet;
     };
     var _p = JobModule.prototype;
     _p.updateAwards = function(id, awards) {
         //console.log("ss",eleigibleRoutine);
         var query_1 = { _id: mongoose.Types.ObjectId(id) };
         var updatequery_1 = { $set: { "awards": awards } };
         dataProviderHelper.updateOnebyID(Routine, query_1, updatequery_1);
         _p.saveWorldMeet(id, awards, "System");
     }
     _p.assignAwards = function(eleigibleRoutine) {
         // console.log("ss",eleigibleRoutine);
         if (eleigibleRoutine.length < 3) {
             for (let i = 0; i < eleigibleRoutine.length; i++) {
                 if (i == 0) {
                     //console.log('less then 3',eleigibleRoutine[i].score,eleigibleRoutine[i]._id,eleigibleRoutine[i].userid,"Gold")
                     _p.updateAwards(eleigibleRoutine[i]._id, "1")
                 } else if (i == 1) {
                     //console.log('less then 3',eleigibleRoutine[i].score,"silver")
                     _p.updateAwards(eleigibleRoutine[i]._id, "2")
                 } else if (i == 2) {
                     //console.log('less then 3',eleigibleRoutine[i].score,"broonze")
                     _p.updateAwards(eleigibleRoutine[i]._id, "3")
                 } else {
                     // console.log('less then 3',eleigibleRoutine[i].score,"not")
                     _p.updateAwards(eleigibleRoutine[i]._id, "4")
                 }
             }

         } else if (eleigibleRoutine.length < 11) {
             //console.log('less then 11',eleigibleRoutine.length)
             for (let i = 0; i < eleigibleRoutine.length; i++) {
                 if (i == 0) {
                     _p.updateAwards(eleigibleRoutine[i]._id, "1");
                 } else if (i == 1) {
                     _p.updateAwards(eleigibleRoutine[i]._id, "2")
                 } else if (i == 2) {
                     _p.updateAwards(eleigibleRoutine[i]._id, "3")
                 } else {
                     _p.updateAwards(eleigibleRoutine[i]._id, "4")
                 }
             }
         } else {
             let total = eleigibleRoutine.length;
             let tenPercent = Math.round((10 / 100) * total);
             let twentyPercent = Math.round((20 / 100) * total);
             let thirtyPercent = Math.round((30 / 100) * total);
             for (let i = 0; i < total; i++) {
                 if (i <= tenPercent) {
                     _p.updateAwards(eleigibleRoutine[i]._id, "1");
                 } else if (i > tenPercent && i <= twentyPercent) {
                     _p.updateAwards(eleigibleRoutine[i]._id, "2")
                 } else if (i > twentyPercent && i <= thirtyPercent) {
                     _p.updateAwards(eleigibleRoutine[i]._id, "3")
                 } else {
                     _p.updateAwards(eleigibleRoutine[i]._id, "4")
                 }
             }

         }
     }
     _p.saveLog = function(uid, rid, note, addedby) {

         var newLog = JobModule.Createlog(uid, rid, note, addedby);
         return [newLog, dataProviderHelper.save(newLog)];
     }
     _p.saveWorldMeet = function(rid, awards, addedby) {

         var newMeet = JobModule.CreateWorldMeet(rid, awards, addedby);
         return [newMeet, dataProviderHelper.save(newMeet)];
     }

     _p.convertRoutine = function() {
         //  console.log("triggered convertRoutine");
         _p.saveLog(0, 0, "file Conversion job Triggered", "System")
         var query = { isConverted: '3', deleted: false }
         var judgedroutine = []
         dataProviderHelper.find(Routine, query).then(function(routine) {

             judgedroutine = routine;
             //  console.log(judgedroutine);
             if (judgedroutine.length > 0) {
                 _p.saveLog(0, 0, "file Conversion job start with " + judgedroutine.length + " routines", "System")

                 try {
                     let updateall = { $set: { "isConverted": "1" } }
                     let Queryall = { "isConverted": "3", deleted: false }
                     dataProviderHelper.updateMany(Routine, Queryall, updateall);
                 } catch (e) {
                     _p.saveLog(0, 0, "file Conversion job error on updatr status 1", "System")
                 }

                 _p.spwnRoutine(judgedroutine, 0)
             } else {
                 _p.saveLog(0, 0, "file Conversion job started but no routines found", "System")
             }

         });

         return judgedroutine;
     }
     _p.spwnRoutine = function(judgedroutine, i) {
         var completed = true;
         var routineScr = judgedroutine[i].videofilename;
         var convertfilename = "/mnt/volume_sfo2_01/public/uploads/user/routine/" + path.parse(judgedroutine[i].videofilename).name + '-converted.mp4';
         //  console.log("spawnRouitne --> routineScr-" + routineScr + ",convertedfilename-" + convertfilename)
         //var filename=path.parse(documentName).name;
         //console.log(routineScr)
         try {
             if (fs.existsSync(routineScr)) {
                 //  console.log('exists')
                 _p.logActivity("spawnRouitne --> exists video file")
                 hbjs.spawn({ input: routineScr, output: convertfilename })
                     .on('error', err => {
                         //  console.log(err, "convert error 3")

                         let update = { $set: { "isConverted": "3" } }
                         let Query = { _id: mongoose.Types.ObjectId(judgedroutine[i]._id) }
                         completed = false;
                         _p.logActivity("file Conversion failed for RoutineID -" + judgedroutine[i]._id + "isConverted:3,err=>", err)
                         _p.saveLog(0, 0, "file Conversion failed for RoutineID -" + judgedroutine[i]._id, "System")
                         try {
                             dataProviderHelper.updateMany(Routine, Query, update);
                         } catch (e) {

                             _p.logActivity("file Conversion exception on err callback RoutineID -" + judgedroutine[i]._id + "err=>" + e)
                             _p.saveLog(0, 0, "file Conversion exception on err callback RoutineID -" + judgedroutine[i]._id, "System")
                         }

                     })
                     .on('progress', progress => {
                         // console.log(
                         // 'Percent complete: %s, ETA: %s',
                         // progress.percentComplete,
                         // progress.eta
                         // )
                     }).on('complete', progress => {

                         if (completed == true) {
                             var videofilename = "public/uploads/user/routine/" + path.parse(judgedroutine[i].videofilename).name + '-converted.mp4';
                             let update = { $set: { "isConverted": "2", videofilename: videofilename } }
                             let Query = { _id: mongoose.Types.ObjectId(judgedroutine[i]._id) }
                             try {
                                 _p.logActivity("file Conversion completed for RoutineID -" + judgedroutine[i]._id)
                                 _p.saveLog(0, 0, "file Conversion completed for RoutineID -" + judgedroutine[i]._id, "System")
                                 dataProviderHelper.updateMany(Routine, Query, update);
                                 // delete file named 'source'
                                 if (fs.existsSync(routineScr)) {
                                     fs.unlink(routineScr, function(err) {
                                         if (err) throw err;
                                         // if no error, file has been deleted successfully
                                         //console.log('File deleted!');"
                                         _p.logActivity("file Conversion completed and source file deleted RoutineID -" + judgedroutine[i]._id)
                                         _p.saveLog(0, 0, "file Conversion completed and source file deleted RoutineID -" + judgedroutine[i]._id, "System")
                                     });
                                 }


                             } catch (e) {
                                 //  console.log('completed catch error')
                                 _p.logActivity("file Conversion exception on final RoutineID -" + judgedroutine[i]._id)
                                 _p.saveLog(0, 0, "file Conversion exception on final RoutineID -" + judgedroutine[i]._id, "System")
                             }

                         } else {
                             _p.logActivity("file Conversion not completed RoutineID -" + judgedroutine[i]._id)
                             _p.saveLog(0, 0, "file Conversion not completed RoutineID -" + judgedroutine[i]._id, "System")
                         }
                         if (i != judgedroutine.length - 1) {

                             _p.spwnRoutine(judgedroutine, i + 1)
                         }
                     })
             } else {
                 //  console.log("not exists")
                 if (i != judgedroutine.length - 1) {
                     _p.spwnRoutine(judgedroutine, i + 1)
                 }

                 let updateall1 = { $set: { "isConverted": "3" } }
                 let Queryall1 = { _id: mongoose.Types.ObjectId(judgedroutine[i]._id) }
                 dataProviderHelper.updateMany(Routine, Queryall1, updateall1);
                 _p.logActivity("file Conversion failed file not found RoutineID -" + judgedroutine[i]._id)
                 _p.saveLog(0, 0, "file Conversion failed file not found RoutineID - " + judgedroutine[i]._id, "System")
             }
         } catch (err) {
             //  console.log("catcherror", err)
             if (i != judgedroutine.length - 1) {
                 _p.spwnRoutine(judgedroutine, i + 1)
             }
             let updateall1 = { $set: { "isConverted": "3" } }
             let Queryall1 = { _id: mongoose.Types.ObjectId(judgedroutine[i]._id) }
             dataProviderHelper.updateMany(Routine, Queryall1, updateall1);
             _p.saveLog(0, 0, "file Conversion failed catch0 RoutineID -" + judgedroutine[i]._id, "System")
         }

     }


     _p.convertRoutinenew = function() {
         //   console.log("");
         _p.logActivity("file Conversion job Triggered convertRoutines every hour")
         _p.saveLog(0, 0, "file Conversion job Triggered", "System")
         var query = {
             $and: [{
                     $or: [
                         { "isConverted": "3" },
                         { "isConverted": "1" }
                     ]
                 },

                 { "deleted": false }

             ]
         }
         var judgedroutine = []
         dataProviderHelper.find(Routine, query).then(function(routine) {

             judgedroutine = routine;
             //  console.log(judgedroutine);
             if (judgedroutine.length > 0) {
                 _p.logActivity("file Conversion job start with " + judgedroutine.length + " routines")
                 _p.saveLog(0, 0, "file Conversion job start with " + judgedroutine.length + " routines", "System")

                 try {
                     let updateall = { $set: { "isConverted": "1" } }
                     let Queryall = { "isConverted": "3", deleted: false }
                     dataProviderHelper.updateMany(Routine, Queryall, updateall);
                 } catch (e) {
                     _p.logActivity("file Conversion job error on updatr isConverted 1")
                     _p.saveLog(0, 0, "file Conversion job error on updatr status 1", "System")
                 }

                 _p.spwnRoutine(judgedroutine, 0)
             } else {
                 _p.saveLog(0, 0, "file Conversion job started but no routines found", "System")
             }

         });

         return judgedroutine;
     }
     _p.awardRoutine = function() {
         // console.log("triggered awardRoutine");
         _p.saveLog(0, 0, "World Meet job Triggered", "System")
         var query = [

             {
                 $match: {
                     $and: [
                         { routinestatus: "1" },
                         { awards: { $eq: '0' } },
                         { deleted: false },
                         { addedOn: { $lt: new Date() } },
                         { addedOn: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) } }
                     ]
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

                     $and: [{ 'userinfo.deleted': false }, { 'userinfo.subtype': { $ne: '0' } }, { 'userinfo.subtype': { $ne: '1' } }]

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
                 //console.log(temp.count)

                 if (temp.count > 0) {
                     var descJudgedroutine = temp.groupedItem.sort(function(a, b) { return Number(b.score) - Number(a.score) });
                     ///  console.log(descJudgedroutine)
                     _p.assignAwards(descJudgedroutine);
                 }

             }

             //console.log(routine.length);
         });

         return judgedroutine;
     }
     _p.updateRoutine = function() {

         var query = {
             routinestatus: "2",
             uploadingType: "1"
         }
         var judgedroutine = [];
         dataProviderHelper.find(Routine, query).then(function(routine) {

             judgedroutine = routine;
             for (let i = 0; i < judgedroutine.length; i++) {
                 var temp = judgedroutine[i];
                 //console.log(temp.assignedOn)
                 if (temp.assignedOn && temp.assignedOn != null) {
                     var datenow = new Date()
                     var assignedOn = new Date(temp.assignedOn.toString().replace(/\..+$/, ''))
                     var diff = _p.diff_minutes(datenow, assignedOn);
                     //  console.log(datenow, assignedOn)
                     //  console.log(diff)
                     if (diff && diff > 45) {
                         _p.updateRoutineStatus(temp._id);
                     }

                 }

             }

             //console.log(routine.length);
         });
         return judgedroutine;
     }
     _p.updateRoutineStatus = function(id, ) {
         //console.log("ss",eleigibleRoutine);
         var query_1 = { _id: mongoose.Types.ObjectId(id) };
         var updatequery_1 = { $set: { "routinestatus": "0" } };
         dataProviderHelper.updateOnebyID(Routine, query_1, updatequery_1);
         _p.saveLog(0, 0, "routinestatus updated by" + id, "updateRoutine")
     }
     _p.diff_minutes = function(dt2, dt1) {

         var diff = (dt2.getTime() - dt1.getTime()) / 1000;
         diff /= 60;
         return Math.abs(Math.round(diff));

     }
     _p.checkEligibleRoutine = function(descJudgedroutine) {
         let scoringRoutine = [];
         for (let j = 0; j < descJudgedroutine.length; j++) {
             var temobj = descJudgedroutine[j];
             var queryopt = {
                 $and: [{ subtype: { $ne: '0' } }, { subtype: { $ne: '1' } }, { subtype: { $exists: true } },
                     { _id: mongoose.Types.ObjectId(temobj.userid) }
                 ]
             }
             dataProviderHelper.checkForDuplicateEntry(User, queryopt).then(function(count) {
                 // console.log('count ',count,temobj.userid)
                 if (count > 0) {
                     //  console.log("push Comment executed",temobj)
                     scoringRoutine.push(temobj)
                         //  console.log("push Comment executed",scoringRoutine)
                 }
                 if (j == descJudgedroutine.length - 1) {

                     if (scoringRoutine.length > 0) {
                         //console.log("j value",scoringRoutine);
                         _p.assignAwards(scoringRoutine);
                     }

                 }

             })

         }
     }
     _p.logActivity = async function(logmsg) {
         // const requestIp = require('request-ip');

         // const clientIp = requestIp.getClientIp(req); 
         // console.log('ip',clientIp)

         //  var root = __dirname.split('\\');
         //  root.pop();
         //  var rootPath = root.join('/')
         //  let fileName = rootPath + '/configs/convertroutinelogfile.txt'
         //  console.log(fileName, "filename")
         //  await createlogfile(fileName);
         //  try {
         //      let log = '\r\n' + logmsg
         //      fs.appendFile(fileName, log, function(err) {
         //          if (err) {
         //              console.log(err)
         //                  // console.log('log not saved')
         //          } else {
         //              //	  console.log('Log saved')
         //              // res.send({result:true,message:"Log saved."})
         //          }
         //      });

         //  } catch (e) {

         //  }
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
     _p.updatefinalScore = function() {
         var query = [{
                 $match: {

                     $and: [

                         { $or: [{ routinestatus: '0' }, { routinestatus: '5' }] }, { deleted: false }, { uploadingType: '2' }
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
                                         { $eq: ["$judged", false] },
                                         { $eq: ["$routineId", "$$routineId"] }
                                     ]
                                 }
                             }
                         },

                     ],
                     as: "unjudgeInfo"
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
                     as: "judgedInfo"
                 }
             },
             { $sort: { addedOn: -1 } },
             {
                 $project: {
                     routine: "$$ROOT",
                     unjudgedCount: { $size: "$unjudgeInfo" },
                     judgeCount: { $size: "$judgedInfo" }
                 }
             },

             {
                 $match: {
                     $and: [
                         { "unjudgedCount": { $eq: 0 } }, { "judgeCount": { $gt: 0 } }
                     ]
                 }
             }
         ]
         dataProviderHelper.aggregate(Routine, query).then((routine) => {
             console.log(routine.length)
             for (var i = 0; i < routine.length; i++) {
                 var req = {}
                 req.body = {}
                     // console.log(routine[i].routine._id)
                 req['body']['_id'] = routine[i].routine._id;
                 //console.log(req.body._id, i)
                 eventController.updateroutinejudgedStatus(req);
             }
         });
     }
     return {
         awardRoutine: _p.awardRoutine,
         convertRoutine: _p.convertRoutine,
         updateRoutine: _p.updateRoutine,
         convertRoutinenew: _p.convertRoutinenew,
         updatefinalScore: _p.updatefinalScore,

     };

 })();

 module.exports = jobController;