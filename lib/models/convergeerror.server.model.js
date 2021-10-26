 (function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var ConvergeErrorSchema = new Schema({
		 uid: {
            type:Schema.Types.ObjectId,          
            trim: true
        },
        errorcode: {
            type:String,
            trim: true,
			default:'0'
        },
       errorName: {
            type:String,
            trim: true,
			default:'0'
        }, 
        errormessage:{
            type:String,
            trim: true,
			default:'0'
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

    module.exports = mongoose.model('convergeErrorlog', ConvergeErrorSchema, 'convergeErrorlog');

})();