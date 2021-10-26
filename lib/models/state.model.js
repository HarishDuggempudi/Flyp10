  (function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var stateSchema = new Schema({
        StateID: {
            type:Number,          
            trim: true
        },
		abbreviation: {
            type:String,          
            trim: true
        },
	    name: {
            type:String,          
            trim: true
        }
     
    });

    module.exports = mongoose.model('state', stateSchema, 'state');

})();