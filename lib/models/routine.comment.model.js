(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var RoutineCommentSchema = new Schema({
        
        userid:{
            type:String,
            required:true,
            trim: true,
        },
        routineid:{
            type: Schema.Types.ObjectId,
            required:true,
            trim: true,
            
        },
        routinetitle:{
            type:String,
            required:true,
            trim: true,
            
        },
        judgeid:{
            type:String,
            required:true,
            trim: true,
            
        },
        judgename:{
            type:String,
            required:true,
            trim: true,
            
        },
        comment:{
            type:String,         
            trim: true,
            
        },
	  type:{		  
		    type:String,
            required:true,
            trim: true,        
        },
	   element:{
			type:String,
            trim: true,        
        },
        factor:{
			type:String,
            required:true,
            trim: true,        
        },
		bonus:{
			type:String,
            required:true,
            trim: true,        
        },
		value:{
			type:String,
            required:true,
            trim: true,        
        },
		total:{
			type:String,
            required:true,
            trim: true,        
        },
        time:{
            type:String,
            required:true,
            trim: true,
            
        },
        sport:{
            type:String,
            default:false
        },
        level:{
            type:String,
            default:false
        },
        event:{
            type:String,
            default:false
        },
        read:{
            type:Boolean,
            default:false
        },
        active:{
            type:Boolean,
            default:true
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

    });
    module.exports = mongoose.model('Routinecomment-4/16', RoutineCommentSchema, 'Routinecomment-4/16');
   // module.exports = mongoose.model('User', userSchema1, 'User');

})();