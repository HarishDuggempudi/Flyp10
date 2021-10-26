(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var ShareSchema = new Schema({
      
		RoutineID:{
			type:Schema.Types.ObjectId,
            required:true,
		},
        SubmittedBy:{
            type:Schema.Types.ObjectId,
            required:true,
        },
        sharedwith:{
            type: Array,
            value: [String]
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
        }
    });
    module.exports = mongoose.model('Routine-Share-Info', ShareSchema, 'Routine-Share-Info');
   // module.exports = mongoose.model('User', userSchema1, 'User');

})();