(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var routineSchema = new Schema({
       routineid :{
        type:Schema.Types.ObjectId,
        trim: true
       },
    status :{
        type:String,   
        trim: true,
        default:'0'
    },
        scoretype: {
            type:String,   
            trim: true
        },
		comment: {
            type:String,   
            trim: true
        },
		dod: {
            type:String,   
            trim: true
        },
        
        score:{
            type:Number,
            trim: true
        },
        judgeid :{
            type:Schema.Types.ObjectId,
            trim: true
        },
        judgedBy:{
            type:String,
            trim: true
        },
        judgedOn:{
            type: Date,
            default: Date.now
        },
        addedBy: {
            type:String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        deleted: {
            type: Boolean,
            default: false
        },
        uploadingType:{
            type:String,
            trim: true,
			default:'1'
        },
    
    });

    module.exports = mongoose.model('Technician_Routine', routineSchema, 'Technician_Routine');

})();