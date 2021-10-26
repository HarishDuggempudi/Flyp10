(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var ConvergeSchema = new Schema({
        ssl_txn_id: {
            type: String,         
            trim: true
        },
        ssl_transaction_type: {
            type:String,
            trim: true
        },
        ssl_txn_time: {
            type:String,
            trim: true
        },
        ssl_token_response: {
            type:String,
            trim: true
        },
		ssl_token: {
            type:String,  
            trim: true
        },
		ssl_tender_amount:{
			 type:String,
            trim: true
		},
		ssl_result_message:{
			type:String,
            trim: true
		},
		ssl_result:{
			type:String,
            trim: true
		},
		ssl_ps2000_data:{
			type:String,
            trim: true
		},
		ssl_promo_code:{
			type:String,
            trim: true
		},
		ssl_merchant_initiated_unscheduled:{
			type:String,
            trim: true
		},
		ssl_loyalty_program:{
			type:String,
            trim: true
		},
		ssl_loyalty_account_balance:{
			type:String,
            trim: true
		},
		ssl_last_name:{
			type:String,
            trim: true
		},
		ssl_issue_points:{
			type:String,
            trim: true
		},
		ssl_first_name:{
			type:String,
            trim: true
		},
		ssl_exp_date:{
			type:String,
            trim: true
		},
		ssl_enrollment:{
			type:String,
            trim: true
		},
		ssl_departure_date:{
			type:String,
            trim: true
		},
		ssl_cvv2_response:{
			type:String,
            trim: true
		},
		ssl_completion_date:{
			type:String,
            trim: true
		},
		ssl_card_type:{
			type:String,
            trim: true
		},
		ssl_card_short_description:{
			type:String,
            trim: true
		},
		ssl_card_number:{
			type:String,
            trim: true
		},
		ssl_avs_response:{
			type:String,
            trim: true
		},
		ssl_approval_code:{
			type:String,
            trim: true
		},
		ssl_amount:{
			type:String,
            trim: true
		},
		ssl_account_status:{
			type:String,
            trim: true
		},
		ssl_account_balance:{
			type:String,
            trim: true
		},
		ssl_access_code:{
			type:String,
            trim: true
		},
		userid:{
			type:String,
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

    module.exports = mongoose.model('Converge_Transaction', ConvergeSchema, 'Converge_Transaction');

})();