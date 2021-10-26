(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var CoachReservationSchema = new Schema({
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
        InternationalMember: {
            type: String,
            trim: true,
            default:"0"

        },
        MemberType: {
            type: String,

            trim: true,
        },
        Discipline: {
            type: Array,
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
    module.exports = mongoose.model('EventMeet-Coach-Reservation', CoachReservationSchema, 'EventMeet-Coach-Reservation');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();