(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var EventSportListSchema = new Schema({
           
     
        sportId: {
            type:mongoose.Schema.Types.ObjectId,
            trim:true
         
        },
        levelId: {
            type:mongoose.Schema.Types.ObjectId,
            trim:true
            
        },
        eventId: {
            type:mongoose.Schema.Types.ObjectId,
            trim:true
          
        },
        eventmeetId: {
            type:mongoose.Schema.Types.ObjectId,
            trim:true
          
        },
        judgeId: {
            type:mongoose.Schema.Types.ObjectId,
            trim:true
          
        },
        judgePanelId: {
            type:String,
            trim:true
          
        },
        judgePanel: {
            type:String,
            trim:true
          
        },
        levelName:{
            type: String,
        },
        eventName:{
            type: String,
        },
        addedBy:{
            type: String,
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedOn: {
            type: Date,
        },
        addedBy:{
            type:String
        },
        deletedBy:{
            type:String
        }
       

    });

    module.exports = mongoose.model('USAG-EventMeet-Judges', EventSportListSchema, 'USAG-EventMeet-Judges');

})();