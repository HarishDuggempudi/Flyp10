(function() {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var RequestSchema = new Schema({
        Requestbody: {
            type: String,
            trim: true,
        },
        RequestURL: {
            type: String,
            trim: true
        },
        SanctionID: {
            type: String,
            trim: true,
        },
        addedOn: {
            type: Date,
            default: Date.now
        },

    });
    module.exports = mongoose.model('USAG-Scoring-API-Request', RequestSchema, 'USAG-Scoring-API-Request');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();