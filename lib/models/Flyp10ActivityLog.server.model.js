 (function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var Flyp10ActivitySchema = new Schema({
        userid: {
            type:Schema.Types.ObjectId,
            trim: true
        },
		 Routineid: {
            type:Schema.Types.ObjectId,
            trim: true
        },
        LogNotes: {
            type:String,
            required:true,
            trim: true
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

    module.exports = mongoose.model('Flyp10_Activity_Log', Flyp10ActivitySchema, 'Flyp10_Activity_Log');

})();