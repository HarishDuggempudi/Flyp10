 (function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var Flyp10WorldMeetSchema = new Schema({
        Routineid: {
            type:Schema.Types.ObjectId,
            trim: true
        },	
        Awards: {
            type:String,
            required:true,
            trim: true
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

    module.exports = mongoose.model('Flyp10_WorldMeet', Flyp10WorldMeetSchema, 'Flyp10_WorldMeet');

})();