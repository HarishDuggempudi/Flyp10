(function() {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var SportLevelSortOrder = new Schema({
        sportId: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        levelId: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        level: {
            type: String,
            trim: true
        },
        sortValue: {
            type: Number,
            trim: true
        }


    });

    module.exports = mongoose.model('SportLevelSort', SportLevelSortOrder, 'SportLevelSort');

})();