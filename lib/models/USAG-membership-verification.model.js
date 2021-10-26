(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        SchemaObj = mongoose.Schema;


    var SchemaObj = new SchemaObj({
        MemberID:{
            type: String,
            trim: true,
        },
        Email:{
            type:String
        },
        FirstName:{
            type:String,
            trim: true
        },
        LastName: {
            type: String,
            trim: true,
        },
        USCitizen: {
            type: String,
            trim: true,
        },
        DOB: {
            type: String,
            trim: true,
        },
        ClubID: {
            type: Array,
          
        },
        ClubAbbrev: {
            type: Array,
            trim: true,
        },
        ClubName: {
            type: Array,
            trim: true,
        },
        ClubStatus: {
            type: Array,
            trim: true,
        },
        InternationalClub: {
            type: Array,
            trim: true,
        },
        MemberType: {
            type: String,
            trim: true,
        },
        Discipline: {
            type: Array,
            trim: true,
        },
        Level:{
            type: String,
            trim: true,
        },
        InternationalMember:{
            type: String,
            trim: true,
        },
        Eligible:{
            type: String,  
        },
        IneligibleReason:{
            type: String
        },
        Flyp10UserID :{
            type:mongoose.Schema.Types.ObjectId,
            trim: true
        }
    });
    module.exports = mongoose.model('USAG-Membership-Verification', SchemaObj, 'USAG-Membership-Verification');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();