  (function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var zipcodeSchema = new Schema({
        StateID: {
            type:Number,          
            trim: true
        },
		CityID: {
            type:String,          
            trim: true
        },
		ZipCodeID: {
            type:String,          
            trim: true
        },
	    Zip: {
            type:String,          
            trim: true
        },
       Zip4: {
            type:String,          
            trim: true
        }
    });

    module.exports = mongoose.model('zipcode', zipcodeSchema, 'zipcode');

})();