 (function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var PricingSchema = new Schema({
        premiumPlus: {
            type: String,
            required: true,
            trim: true
        },
        premium: {
            type:String,
            required:true,
            trim: true
        },
        addCredits: {
            type:String,
            required:true,
            trim: true
        },
        active: {
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

    module.exports = mongoose.model('PricingSetting',PricingSchema , 'PricingSetting');

})();