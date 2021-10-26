  (function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var citySchema = new Schema({
        StateID: {
            type:Number,          
            trim: true
        },
		CityID: {
            type:String,          
            trim: true
        },
	    city: {
            type:String,          
            trim: true
        }
     
    });

    module.exports = mongoose.model('city', citySchema, 'city');

})();