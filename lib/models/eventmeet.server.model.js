(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var EventSportsMeetSchema = new Schema({
        title:{
            type: String,
            required: true,
            trim: true
        },
        address:{
            type:String,
            trim: true
        },
		 state:{
            type:String,
			required: true,
            trim: true
        },city: {
            type:String,
			required: true,
            trim: true
        },
        sportName: {
            type:String,
            trim: true
        },
		sportid: {
            type:Schema.Types.ObjectId,
            required:true,
            trim: true
        },
        start: {
            type:String,
            required:true,
            trim: true
        },
        end: {
            type:String,
            required:true,
            trim: true
        },
		Nod: {
            type:String,
            required:true,
            trim: true
        },
		 userid: {
            type:String,
            required:true,
            trim: true
        },
        active: {
            type:Boolean,
            default:true
        },
        status: {
            type:Boolean,
            default:true
        },
        addedBy: {
            type:String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type:String,
            trim: true
        },
        updatedOn: {
            type: Date
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type:String,
            trim: true
        },
        deletedOn: {
            type: Date
        }
    });

    var UserEventSportMeetSchema = new Schema({
        // title:{
        //     type: String,
        //     required: true,
        //     trim: true
        // },
        // address:{
        //     type:String,
        //     trim: true
        // },
		//  state:{
        //     type:String,
		// 	required: true,
        //     trim: true
        // },city: {
        //     type:String,
		// 	required: true,
        //     trim: true
        // },
        // sportName: {
        //     type:String,
        //     trim: true
        // },
        // start: {
        //     type:String,
        //     required:true,
        //     trim: true
        // },
        // end: {
        //     type:String,
        //     required:true,
        //     trim: true
        // },
		// Nod: {
        //     type:String,
        //     required:true,
        //     trim: true
        // },
		sportid: {
            type:Schema.Types.ObjectId,
            required:true,
            trim: true
        },    
		 userid: {
            type:Schema.Types.ObjectId,
            required:true,
            trim: true
        },
		eventid: {
            type:Schema.Types.ObjectId,
            required:true,
            trim: true
        },
        active: {
            type:Boolean,
            default:true
        },
        status: {
            type:Boolean,
            default:true
        },
        addedBy: {
            type:String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type:String,
            trim: true
        },
        updatedOn: {
            type: Date
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type:String,
            trim: true
        },
        deletedOn: {
            type: Date
        }
    });

    module.exports = { 
        EventSportMeet: mongoose.model('EventSportsMeet', EventSportsMeetSchema, 'EventSportsMeet'), 
        UserEvent: mongoose.model('UserSportEvents', UserEventSportMeetSchema, 'UserSportEvents')
    }


})();