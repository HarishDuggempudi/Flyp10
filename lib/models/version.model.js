(function () {

    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        utilityHelper = require('../helpers/utilities.helper');

    var VersionManagement = new Schema({
        version: {
            type: String,
            trim: true
        },
        forceUpdate : {
            type: Boolean,
            trim: true
        },
        
    });

    module.exports = mongoose.model('Version-Management', VersionManagement, 'Version-Management');

})();