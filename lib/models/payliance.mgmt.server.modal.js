(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var paylianceCusObjSchema = new Schema({
        CID:{
            type:Number,
            required:true,
            trim: true
        },
        UID:{
            type:String,
            required:true,
            trim: true
        },
        addedOn:{
            type: Date,
            default: Date.now
        }
    });

    var paylianceACHObjSchema = new Schema({
        AccountID:{
            type:Number,
            required:true,
            trim: true
        },
        CID:{
            type:String,
            required:true,
            trim: true
        },
        UID:{
            type:String,
            required:true,
            trim: true
        },
        defaultAccount: {
            type: Boolean,
            required: true,
            default: false
        },
        addedOn:{
            type: Date,
            default: Date.now
        }
    });

    var paylianceTransactionObjSchema = new Schema({
        RefNum:{
            type:Number,
            required:true,
            trim: true
        },
        TransKey:{
            type:String,
            required:true,
            trim: true
        },
        Amount:{
            type:Number,
            required:true,
            trim: true
        },
        PreviousBalance:{
            type:Number,
            required:true,
            trim: true
        },
        ClosingBalance:{
            type:Number,
            required:true,
            trim: true
        },
        Status: {
            type: String,
            required: true,
            trim: true
        },
        UID: {
            type: String,
            required: true,
            default: false
        },
        Username: {
            type: String,
            required: true,
            default: false
        },
        AuthCode: {
            type: String,
            required: true,
            default: false
        },
        BatchNum: {
            type: Number,
            required: true,
            default: false
        },
        BatchRefNum: {
            type: Number,
            required: true,
            default: false
        },
        BatchKey: {
            type: String,
            required: true,
            default: false
        },
        addedOn:{
            type: Date,
            default: Date.now
        }
    });

    var transactionStatusSchema = new Schema({
        UID:{
            type: String,
            required: true
        },
        Username:{
            type: String,
            required: true
        },
        Status:{
            type: String,
            required: true
        },
        RefNum: {
            type: Number,
            required: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        }
    })

    var paylianceRequestToRemitSchema = new Schema({
        AID:{
            type:Number,
            required:true,
            trim: true
        },
        CID:{
            type:String,
            required:true,
            trim: true
        },
        UID:{
            type:String,
            required:true,
            trim: true
        },
        addedOn:{
            type: Date,
            default: Date.now
        },
        type:{
            type:String,
            required:true,
            trim: true
        },
        username:{
            type:String,
            required:true,
            trim: true
        },
        amount:{
            type:Number,
            required:true,
            trim: true
        },
    });

    var notificationToken = new Schema({
        UID: {
            type: Schema.Types.ObjectId,
            required: true
        },
        token: {
            type: String,
            default: null
        }
    })

    // module.exports = mongoose.model('paylianceUsers', paylianceCusObjSchema, 'paylianceUsers');
    module.exports = {
        paylianceCusObjModel: mongoose.model('PaylianceCusObj', paylianceCusObjSchema, 'PaylianceCusObj'),
        paylianceACHObjModel: mongoose.model('PaylianceACHObj', paylianceACHObjSchema, 'PaylianceACHObj'),
        paylianceRemitRequestModel: mongoose.model('PaylianceRemitRequest', paylianceRequestToRemitSchema, 'PaylianceRemitRequest'),
        paylianceTransactionModel: mongoose.model('paylianceTransactionObj', paylianceTransactionObjSchema, 'paylianceTransactionObj'),
        paylianceTransactionStatusModel: mongoose.model('ACHTransactionStatus', transactionStatusSchema, 'ACHTransactionStatus'),
        notificationToken: mongoose.model('NotificationToken', notificationToken, 'NotificationToken')
    };    


})();