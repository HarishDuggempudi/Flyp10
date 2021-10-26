(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var notificationManagementSchema = new Schema({
        UID: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            trim: true
        },
        // status: {
        //     type: String,
        //     trim: true
        // },
        read: {
            type: Boolean,
            trim: true
        },
        message: {
            type: String,
            trim: true
        },
        // FID: {
        //     type: String,
        //     trim: true
        // },
        notificationProperties: {
            FID: {
                type: String,
                trim: true
            },
            RID: {
                type: String,
                trim: true
            }
        },
        addedBy: {
            type: String,
            trim: true
        },
        addedOn: {
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
        }
    });

    module.exports = mongoose.model('Notification', notificationManagementSchema, 'Notification') 

})();