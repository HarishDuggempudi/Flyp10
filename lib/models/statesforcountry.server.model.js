(function() {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var stateSchema = new Schema({

        abbreviation: {
            type: String,
            trim: true
        },
        name: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        }

    });

    module.exports = mongoose.model('StateforCountry', stateSchema, 'StateforCountry');

})();