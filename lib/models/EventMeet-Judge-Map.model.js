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
        levelName:{
            type: String,
        },
        eventName:{
            type: String,
        },
        JudgesbyPanel: {
            type:Array,
            required:true,
            trim: true
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
      
       

    });

    module.exports = mongoose.model('EventMeet-Judge-Map', EventSportListSchema, 'EventMeet-Judge-Map');

})();