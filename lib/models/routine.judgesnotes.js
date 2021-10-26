(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var RoutineCommentSchema = new Schema({
        
        userid:{
            type:Schema.Types.ObjectId,
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
            type:Schema.Types.ObjectId,
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
	   skillvalue:{		  
		    type:Number,
            required:true, 
            trim: true,        
        },
		execution:{		  
		    type:Number,
            required:true,
            trim: true,        
        },
	   element:{
			type:String,
            trim: true,        
        },
        factor:{
			type:Number,
            required:true,
            trim: true,        
        },
        bonus:{
			type:Number,
            required:true,
            trim: true,  
            default:0      
        },
		total:{
			type:Number,
            required:true,
            trim: true,        
        },
        time:{
            type:String,
            required:true,
            trim: true,
            
        },
		state:{
            type:String,
            default:' '
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
        overallComment:{
            type:String,
            trim: true
        },
        judgePanel :{
            type:String,
                
        },
        judgePanelid:{
            type:String,
            trim: true
        }

    });
    module.exports = mongoose.model('Routinecomment', RoutineCommentSchema, 'Routinecomment');
   // module.exports = mongoose.model('User', userSchema1, 'User');

})();