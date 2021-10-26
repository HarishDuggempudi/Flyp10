(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var AdministratorsSchema = new Schema({
        SanctionID:{
            type: String,
            trim: true,
        },
     
        AdminID: {
            type: String,
           
            trim: true,
        },
        AdminFirstName:{
            type:String,
            trim: true
        },
        AdminLastName: {
            type: String,
        
            trim: true,

        },
        AdminEmail: {
            type: String,
            trim: true,

        }


    });
    module.exports = mongoose.model('Sanction-Administrators', AdministratorsSchema, 'Sanction-Administrators');
    // module.exports = mongoose.model('User', userSchema1, 'User');

})();