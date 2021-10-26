(function() {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var SanctionSchema = new Schema({

        SanctionID: {
            type: String,

            trim: true,
        },
        Name: {
            type: String,

            trim: true,

        },
        MeetDirectorID: {
            type: String,

            trim: true,

        },
        MeetDirectorName: {
            type: String,

            trim: true,

        },
        MeetDirectorEmail: {
            type: String,

            trim: true,

        },
        OrganizationID: {
            type: String,
            trim: true,

        },
        Organization: {
            type: String,

            trim: true,
        },
        DisciplineType: {
            type: String,
            trim: true,
        },
        TypeOfMeet: {
            type: String,
            trim: true,
        },
        AllowsInternational: {
            type: String,
            default: '0'
        },
        Levels: {
            type: Array

        },
        Apparatuses: {
            type: Array,
        },
        ApparatusLimits: {
            type: Array,

        },
        LevelLimits: {
            type: Array
        },
        CompetitionStartDate: {
            type: Date
        },
        CompetitionEndDate: {
            type: Date
        },
        SiteName: {
            type: String
        },
        SiteAddress1: {
            type: String
        },

        SiteAddress2: {
            type: String
        },
        SiteState: {
            type: String
        },
        SiteCity: {
            type: String
        },

        SiteZip: {
            type: String
        },
        ReservationPeriodOpens: {
            type: Date
        },
        ReservationPeriodCloses: {
            type: Date
        },
        LevelChangeCloseDate: {
            type: Date
        },
        CancellationCloseDate: {
            type: Date
        },
        Website: {
            type: String
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedOn: {
            type: Date,

        },
        changeVendor: {
            type: String,
            default: '0'
        },
        TimeStamp: {
            type: Date
        },
        Settings: {
            SortForJudges: {
                type: String,
                trim: true,
                default: 'DateTimeAsc'
            },

        }


    });
    module.exports = mongoose.model('EventMeet-Sanction', SanctionSchema, 'EventMeet-Sanction');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();