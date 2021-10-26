(function() {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var routineSchema = new Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        sport: {
            type: String,
            required: true,
            trim: true
        },
        level: {
            type: String,
            required: true,
            trim: true
        },
        event: {
            type: String,
            trim: true
        },
        duration: {
            type: String,
            trim: true
        },
        submissionfor: {
            type: String,
            required: true,
            trim: true
        },
        scoretype: {
            type: String,
            trim: true
        },
        comment: {
            type: String,
            trim: true
        },
        dod: {
            type: String,
            trim: true
        },
        originalfilename: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        videofilename: {
            type: String,
            trim: true
        },
        submittedBy: {
            type: String,
            required: true,
            trim: true
        },
        routinestatus: {
            type: String,
            trim: true
        },
        score: {
            type: Number,
            trim: true
        },
        sportid: {
            type: String,
            trim: true
        },
        sid: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        lid: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        eid: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        uid: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        jid: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        submittedByID: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        view: {
            type: String,
            trim: true,
            default: '0'
        },
        userid: {
            type: String,
            trim: true,
        },
        judgedBy: {
            type: String,
            trim: true
        },
        judgedOn: {
            type: Date,
            default: Date.now
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        athlete: {
            type: String,
            trim: true
        },
        awards: {
            type: String,
            trim: true,
            default: '0'
        },
        thumbnailPath: {
            type: String,
            trim: true,
            default: ""
        },
        routineProperty: {
            routineExtension: {
                type: String,
                trim: true
            },
            routinePath: {
                type: String,
                trim: true
            }
        },
        filetype: {
            type: String,
            trim: true
        },
        teammate: {
            type: String,
            trim: true
        },
        filesize: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        active: {
            type: Boolean,
            default: true
        },
        addedBy: {
            type: String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        submittedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: String,
            trim: true
        },
        updatedOn: {
            type: Date
        },
        assignedOn: {
            type: Date,
            default: Date.now
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type: String,
            trim: true
        },
        deletedOn: {
            type: Date
        },
        isConverted: {
            type: String,
            trim: true,
            default: '0'
        },
        convertedfileName: {
            type: String,
            trim: true,
            default: '0'
        },
        sourceID: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        isResubmitted: {
            type: String,
            trim: true,
            default: '0'
        },
        eventMeetId: {
            type: String,
            trim: true,
        },
        uploadingType: {
            type: String,
            trim: true,
            default: '1'
        },
        technician_status: {
            type: String,
            trim: true,
            default: '0'
        },
        SanctionRoutine: {
            type: Boolean,
            default: false
        },
        SanctionID: {
            type: String,
            trim: true,
        },
        overallRank: {
            type: Number,
            trim: true
        },
        levelRank: {
            type: Number,
            trim: true
        },
        eventmeetRank: {
            type: Number,
            trim: true
        },
        eventlevelRank: {
            type: Number,
            trim: true
        },
        EventMeetName: {
            type: String,
            trim: true,
        },
        nd: {
            type: Number,
            trim: true,

        },




    });

    module.exports = mongoose.model('Routine', routineSchema, 'Routine');

})();