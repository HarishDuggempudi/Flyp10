(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var AthleteGroupReservationSchema =  new Schema({
        SanctionID:{
            type: String,
            
            trim: true,
        },
        ReservationID: {
            type: String,
            
            trim: true
        },
        MeetReservationID:{
            type:mongoose.Schema.Types.ObjectId,
            trim: true
        },
        Name: {
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
        Type: {
            type: String,
            trim: true
        },
        Apparatus: {
            type: String,
            trim: true,
        },
        Level: {
            type: String,
            trim: true,
        },
        AgeGroup: {
            type: String,
            trim: true,
        },
        ScratchDate: {
            type: Date,
            trim: true,
        },
        deleted :{
            type:Boolean,
            default:false
        },
        deletedOn :{
            type:Date,
            
        }
        


    });
    module.exports = mongoose.model('EventMeet-AthleteGroup-Reservation', AthleteGroupReservationSchema, 'EventMeet-AthleteGroup-Reservation');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();