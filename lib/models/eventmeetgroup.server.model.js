(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var EventMeetGroupSchema = new Schema({
        eventId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            trim: true
            }  ,
            groupName:{
                type: String,
                required: true,
            },
            competitors:{
                type:Array,
                required: true,
            },
        addedOn: {
            type: Date,
            default: Date.now
        },
        active :{
            type: Boolean,
            default: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        addedBy:{
            type:String,
            trim: true
        }

    });

    module.exports = mongoose.model('EventMeetGroup', EventMeetGroupSchema, 'EventMeetGroup');

})();