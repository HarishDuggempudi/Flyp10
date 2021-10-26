(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;
      
    var sportSchema = new Schema({
        sportName: {
            type: String,
            required: true,
            trim: true
        },
        sportid: {
            type:Schema.Types.ObjectId,
            trim: true
        },
     judgePanel:{
        type:String,
        trim: true
     },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedOn: {
            type: Date
        }
    });

    

    

  
    
   
	

    module.exports = mongoose.model('Sport-Judges-Panel', sportSchema, 'Sport-Judges-Panel');  

})();