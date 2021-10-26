(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        SchemaObj = mongoose.Schema;


    var SchemaObj = new SchemaObj({
        sportid:{
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
        },
        levelid:{
            type:mongoose.Schema.Types.ObjectId
        },
        eventid:{
            type:mongoose.Schema.Types.ObjectId,
            trim: true
        },
       calculation:{
        type:String,
        trim: true
       }
    });
    module.exports = mongoose.model('USAG-Socre-Calculation', SchemaObj, 'USAG-Socre-Calculation');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();