(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var startCode = new Schema({

       eventmeetId :{
        type:mongoose.Schema.Types.ObjectId,
        trim:true
       },
       startcode:{
        type:String,
        trim:true
       },
       createdBy:{
        type:String,
        trim: true
    },
    createdOn:{
        type: Date,
        default: Date.now
    },


    });
    module.exports = mongoose.model('EventMeet-StartCode', startCode, 'EventMeet-StartCode');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();