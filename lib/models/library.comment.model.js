(function () {

    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

        var LibraryCommentSchema = new Schema({
        
            uid:{
                type:Schema.Types.ObjectId,
                required:true,
                trim: true,
            },
            uname:{
                type:String,
                required:true,
                trim: true,
            },
            rid:{
                type:String,
                required:true,
                trim: true,
                
            },
            submittedBy:{
                type:String,
                required:true,
                trim: true,                
            },
            comment:{
                type:String,
                required:true,
                trim: true,
                
            },
			avatar:{
                type:String,
                trim: true,            
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
            }        
        
        });   
        
    module.exports = mongoose.model('LibraryComments', LibraryCommentSchema, 'LibraryComments');
})();