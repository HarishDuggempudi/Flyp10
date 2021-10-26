(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var CountryCurrencySchema = new Schema({
        Country: {
            type: String,
            required: true,
            trim: true
        },
        Currency: {
            type:String,
            required:true,
            trim: true
        },
        Exponents: {
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

    module.exports = mongoose.model('CountryCurrency', CountryCurrencySchema, 'CountryCurrency');

})();