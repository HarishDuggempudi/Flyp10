(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var ApparatusLimitSchema = new Schema({
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
        MaxParticipants: {
            type: String,
            trim: true,
        },
      


    });
    module.exports = mongoose.model('Eventmeet_Sanction_ApparatusLimit', ApparatusLimitSchema, 'Eventmeet_Sanction_ApparatusLimit');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();