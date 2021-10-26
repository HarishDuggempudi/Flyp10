(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var RequestSchema = new Schema({
        Requestbody:{
            type: String,
            trim: true,
        },
        RequestURL:{
            type:String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
       
    });
    module.exports = mongoose.model('USAG-Sanction-Reservation-API-Request', RequestSchema, 'USAG-Sanction-Reservation-API-Request');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();