(function() {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var EventSportListSchema = new Schema({

        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            trim: true
        },
        judgeId: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        judged: {
            type: Boolean,
            default: false,
        },
        score: {
            type: String,
            required: false,
            default: '0'
        },
        comments: {
            type: String,
            required: false,
            default: ''
        },
        routinestatus: {
            type: String,
            required: false,
            default: '0'
        },
        dod: {
            type: String,
            required: false,
            default: '0'
        },
        routineId: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        JudgedOn: {
            type: Date,
            default: Date.now
        },

        deleted: {
            type: Boolean,
            default: false
        },
        isTechnician: {
            type: String,
            default: '0'
        },
        assigned: {
            type: Boolean,
            default: false
        },
        judgePanel: {
            type: String,

        },
        judgePanelid: {
            type: String,
            trim: true
        },
        resubmit: {
            type: Boolean,
            default: false
        },
        resubmitComment: {
            type: String,

        },
        isSwappedJudge: {
            type: Boolean,
            default: false
        },
        SwapjudgeIdFrom: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        ND: {
            type: String,
            required: false,
            default: '0'
        }

    });

    module.exports = mongoose.model('EventMeetForJudging', EventSportListSchema, 'EventMeetForJudging');

})();