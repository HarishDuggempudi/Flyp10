(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;


    var RoutineJudgesMapSchema = new Schema({
        
        routineid:{
            type: Schema.Types.ObjectId,
            required:true,
            trim: true,           
        },
        judgeid:{
            type:Schema.Types.ObjectId,
            required:true,
            trim: true,         
        },
        addedOn:{
            type: Date,
            default: Date.now
        }

    });
    module.exports = mongoose.model('RoutineJudgesMap', RoutineJudgesMapSchema, 'RoutineJudgesMap');
   // module.exports = mongoose.model('User', userSchema1, 'User');

})();