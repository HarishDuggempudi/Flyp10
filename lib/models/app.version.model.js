(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var appSchema = new Schema({
        Appversion: {
            type:Number,          
            trim: true
        },
		Forceupdate: {
            type:Boolean,          
            trim: true,
            
        },
	  
    });

    module.exports = mongoose.model('App-Version', appSchema, 'App-Version');

})();