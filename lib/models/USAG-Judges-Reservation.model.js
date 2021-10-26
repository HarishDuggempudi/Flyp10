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
        ReservationID: {
            type: String,
           
            trim: true,
        },
        FirstName: {
            type: String,
          
            trim: true,

        },
        LastName: {
            type: String,
            
            trim: true,

        },
        USAGID: {
            type: String,
            
            trim: true,

        },
        InternationalMember: {
            type: String,
            default:'0',
            trim: true

        },
       
        MemberType: {
            type: String,
            trim: true
        },
       
        ScratchDate: {
            type: Date,
            trim: true,
        },
        Discipline: {
            type: Array,
            trim: true,
        },
        deleted :{
            type:Boolean,
            default:false
        },
        deletedOn :{
            type:Date
        },
        addedOn: {
            type: Date,
            default: Date.now
        }


    });
    module.exports = mongoose.model('USAG-Judges-Reservation', AthleteReservationSchema, 'USAG-Judges-Reservation');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();