(function () {

    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var promocodeSchema = new Schema({
        Promocode: {
            type:String,
            required: true,
           
        },
       
       userid:{
       type:Schema.Types.ObjectId
       },
        deleted: {
            type:Boolean,
            default:false
        },
       
        IsUsed: {
            type:Boolean,
            default:true
        },
        addedBy: {
            type:String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type:String,
            trim: true
        },
        updatedOn: {
            type: Date
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            type:String,
            trim: true
        },
        deletedOn: {
            type: Date
        }
    });

    module.exports = mongoose.model('Promocode', promocodeSchema, 'Promocode');

})();