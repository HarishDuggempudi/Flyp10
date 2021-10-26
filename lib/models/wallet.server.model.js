 (function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var WalletSchema = new Schema({
        userid: {
            type: String,
            required: true,
            trim: true
        },
		 uid: {
            type:Schema.Types.ObjectId,          
            trim: true
        },
        balance: {
            type:String,
            required:true,
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

    module.exports = mongoose.model('user_wallet', WalletSchema, 'user_wallet');

})();