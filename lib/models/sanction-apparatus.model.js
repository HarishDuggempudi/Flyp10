(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var AthleteReservationSchema = new Schema({
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
        Levels: {
            type: Array,
            trim: true,
        },
    });
    module.exports = mongoose.model('Eventmeet_Sanction_Apparatus', AthleteReservationSchema, 'Eventmeet_Sanction_Apparatus');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();