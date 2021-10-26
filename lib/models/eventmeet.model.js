(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var EventSportListSchema = new Schema({
            EventName:{type: String,
            required: true,
            trim: true
        },
        StartDate:{
            type:Date,
            trim: true
        },
		 EndDate:{
            type:Date,
			required: true,
            
        },
        Sport: {
            type:String,
			required: true,
            trim: true
        },
        SportName: {
            type:String,
			required: true,
            trim: true
        },
        Events: {
            type:Array,
            required:true,
            trim: true
        },
       
        Levels: {
            type:Array,
            required:true,
            trim: true
        },
        
        Country: {
            type:String,
            required:true,
            trim: true
        },
		State: {
            type:String,
            trim: true
        },
		
        active: {
            type:Boolean,
            default:true
        },

        addedOn: {
            type: Date,
            default: Date.now
        },
        Judges:{
            type:Array
        },
        NjudgePrice: {
            type:String,
            required:true,
            trim: true
        },
        NcompetitorPrice: {
            type:String,
            required:true,
            trim: true
        },
        NtechnicianPrice:{
            type:String,
            trime:true,
            default:true
        },
        SjudgePrice: {
            type:String,
            required:true,
            trim: true
        },
        ScompetitorPrice: {
            type:String,
            required:true,
            trim: true
        },
        StechnicianPrice:{
            type:String,
            trime:true,
            default:true
        },
        EventLevel :{
            type:String,
            trim:true,
            default:'0'
        },

        deleted: {
            type: Boolean,
            default: false
        },
        SanctionMeet: {
            type: Boolean,
            default: false
        },
        SanctionID :{
            type:String,
            trim:true
        },
        Createdby:{
            type:mongoose.Schema.Types.ObjectId,
            trim:true
        },
        scoretype:{
            type:String,
            trim:true 
        }

    });

    module.exports = mongoose.model('EventMeet', EventSportListSchema, 'EventMeet');

})();