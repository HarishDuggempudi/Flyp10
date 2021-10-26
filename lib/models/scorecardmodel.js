(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var ScordSchema = new Schema({
      
		sportid:{
			type:Schema.Types.ObjectId,
            required:true,
            trim: true,
		},
        skillvalue:{
            type:Boolean,
            default:true
        },
        execution:{
            type:Boolean,
            trim: true
        },factor:{
            type:Boolean,
            trim: true
        }
      , time:{
        type:Boolean,
        trim: true,
        default:true
        },
        bonus:{
            type:Boolean,
            trim: true,
            default:true
         }
		,
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
        }
    });
    module.exports = mongoose.model('ScoreCard-Config', ScordSchema, 'ScoreCard-Config');
   // module.exports = mongoose.model('User', userSchema1, 'User');

})();