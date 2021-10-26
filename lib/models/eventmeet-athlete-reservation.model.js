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
        MeetReservationID:{
            type:mongoose.Schema.Types.ObjectId,
            trim: true
        },
        Name: {
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
        Gender: {
            type: String,
            
            trim: true,

        },
        DOB: {
            type: String,
          
            trim: true,

        },
        InternationalMember: {
            type: String,
            default:'0',
            trim: true

        },
        USCitizen: {
            type: String,
            default:'0',
            trim: true

        },
        MemberType: {
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
            type:Date
        }


    });
    module.exports = mongoose.model('EventMeet-Athlete-Reservation', AthleteReservationSchema, 'EventMeet-Athlete-Reservation');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();