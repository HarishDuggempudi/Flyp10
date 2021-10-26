(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var LevelLimitSchema = new Schema({
        SanctionID:{
            type: String,
            trim: true,
        },
        SID:{
            type:mongoose.Schema.Types.ObjectId,
            trim: true
        },
        Name: {
            type: String,
            trim: true,
        },
        LevelName: {
            type: String,
            trim: true,
        },
        MaxParticipants: {
            type: String,
            trim: true,
        },
       
        


    });
    module.exports = mongoose.model('Eventmeet_Sanction_LevelLimit', LevelLimitSchema, 'Eventmeet_Sanction_LevelLimit');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();