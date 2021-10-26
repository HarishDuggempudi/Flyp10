(function() {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var CountrySchema = new Schema({
        Name: {
            type: String,
            required: true,
            trim: true
        },
        code: {
            type: String,
            trim: true
        }

    });

    module.exports = mongoose.model('Country', CountrySchema, 'Country');

})();