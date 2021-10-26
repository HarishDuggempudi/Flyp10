(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var JudgeSchema = new Schema({
        
        username:{
            type:String,
            required:true,
            trim: true,
            lowercase: true
        },
        sportName:{
            type:String,
            required:true,
            trim: true,
            
        },
        level:{
            type:String,
            required:true,
            trim: true,
            
        },
		userid:{
			type:Schema.Types.ObjectId,
            required:true,
            trim: true,
		},
		sportid:{
			type:Schema.Types.ObjectId,
            required:true,
            trim: true,
		},
		levelid:{
			type:Schema.Types.ObjectId,
            required:true,
            trim: true,
        },
        uploadingfor:{
            type:String,
            trim:true,
            default: '0'
        },
		expdate:{
            type:String,
            trim: true,      
        },
		status:{
            type:String,
            trim: true,
            default:'0'
        },
        active:{
            type:Boolean,
            default:true
        },
        docdescription:{
            type:String,
            trim: true
        },
        docName:{
            type:String,
            trim: true
        },
        originalfilename:{
            type:String,
            trim: true 
        },
        addedBy:{
            type:String,
            trim: true
        },
        addedOn:{
            type: Date,
            default: Date.now
        },
        updatedBy:{
            type:String,
            trim: true
        },
        updatedOn:{
            type: Date
        },
        deleted:{
            type: Boolean,
            default: false
        },
        deletedBy:{
            type:String,
            trim: true
        },
        deletedOn:{
            type: Date
        },
    
        docProperties: {
            docExtension:{
                type:String,
                trim: true
            },
             docPath: {
                type:String,
                trim: true
            }
        }
    });
    module.exports = mongoose.model('Flyp10_Judges_Sport', JudgeSchema, 'Flyp10_Judges_Sport');
   // module.exports = mongoose.model('User', userSchema1, 'User');

})();