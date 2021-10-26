(function() {

    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var Flyp10APIUser = new Schema({
        username: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            trim: true
        },
        deleted: {
            type: Boolean,

        },
        organization: {
            type: String
        }

    });

    module.exports = mongoose.model('Flyp10_API_User', Flyp10APIUser, 'Flyp10_API_User');

})();