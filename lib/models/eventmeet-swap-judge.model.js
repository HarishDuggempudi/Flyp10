(function() {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var startCode = new Schema({

        sportId: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        levelId: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        eventmeetId: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        panel: {
            type: String,
            trim: true
        },
        reasonForSwap: {
            type: String,
            trim: true
        },
        judgeIdChangeFrom: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        judgeIdChangeTo: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        addedBy: {
            type: String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },


    });
    module.exports = mongoose.model('EventMeet-Swap-Judge', startCode, 'EventMeet-Swap-Judge');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();