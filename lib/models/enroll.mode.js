(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var EventEnrollSchema = new Schema({

        eventMeetId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
        },

        judgeId:{
            type:Array,
            required: true,
        },
		sportId:{
            type:mongoose.Schema.Types.ObjectId,
			required: true,
            
        },
        eventId: {
            type:String,
			required: true,
            trim: true
        },
        levelId: {
            type:String,
			required: true,
            trim: true
        },
        userId: {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            trim: true
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

    module.exports = mongoose.model('EnrollMeet', EventEnrollSchema, 'EnrollMeet');

})();