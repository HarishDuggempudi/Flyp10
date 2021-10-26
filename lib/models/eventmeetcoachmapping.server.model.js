(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var EventMeetCoachMappingSchema = new Schema({
        eventId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            trim: true
            }  ,

            userId:{type: mongoose.Schema.Types.ObjectId,
                required: true,
                trim: true
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

    module.exports = mongoose.model('EventMeetCoachMapping', EventMeetCoachMappingSchema, 'EventMeetCoachMapping');

})();