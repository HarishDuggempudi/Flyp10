 (function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var TransactionSchema = new Schema({
        userid: {
            type: String,
            required: true,
            trim: true
        },
        txn_amount:{
            type:String,
            required:true,
            trim: true,
			default:'0'
        },
        txn_type:{
            type:String,
            required:true,
            trim: true,
			default:'0'
        },
		txn_id:{
            type:String,
            required:true,
            trim: true,
			default:'0'
        },
       txn_token:{
            type:String,
            trim: true,
			default:'0'
        },txn_desc:{
            type:String,
            trim: true,
			default:'0'
        },
		txn_date:{
            type:String,
            trim: true,
			default:'0'
        },
        promocode:{
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

    module.exports = mongoose.model('Transaction', TransactionSchema, 'Transaction');

})();