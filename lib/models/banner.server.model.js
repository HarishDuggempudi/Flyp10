(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var VideoSchema = new Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        subtitle: {
            type:String,
            required:true,
            trim: true
        },
        filename: {
            type:String,
            required:true,
            trim: true
        },
		type: {
            type:String,
            trim: true
        },
        filetype:{
            type:String,
            trim: true
        },
        filepath:{
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

    module.exports = mongoose.model('Banner', VideoSchema, 'Banner');

})();