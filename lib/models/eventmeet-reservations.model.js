(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var ReservastionSchema = new Schema({

        SanctionID: {
            type: String,
           
            trim: true,
        },
        ClubUSAGID: {
            type: String,
           
            trim: true

        },
        ClubName: {
            type: String,
           
            trim: true

        },
        ClubAbbreviation: {
            type: String,
          
            trim: true

        },
        ClubInternational: {
            type: String,
           default:'0',
            trim: true

        },
        ClubContactUSAGID: {
            type: String,
            trim: true

        },
        ClubContact: {
            type: String,

            trim: true
        },
        ClubContactEmail: {
            type: String,
            trim: true
        },
        ClubContactPhone: {
            type: String,
            trim: true
        },
        ClubMeetContactUSAGID: {
            type: String,
            trim: true
        },
        ClubMeetContact: {
            type: String,
            trim: true

        },
        ClubMeetContactEmail: {
            type: String,
            trim: true
        },
        ClubMeetContactPhone: {
            type: String,
            trim: true

        },
        ClubStreetAddress1: {
            type: String,
            trim: true,
        },
        ClubStreetAddress2: {
            type: String,
            trim: true
        },
        ClubStreetCity: {
            type: String,
            trim: true
        },
        ClubStreetState: {
            type: String
        },
        ClubStreetZip: {
            type: String
        },

        ClubStreetCountry: {
            type: String
        },
      Details :{
        type: Array
      },
      deleted :{
        type:Boolean,
        default:false
    },
    deletedOn :{
        type:Date,
        
    },
    TimeStamp :{
        type:Date 
    }

    });
    module.exports = mongoose.model('EventMeet-Reservations', ReservastionSchema, 'EventMeet-Reservations');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();