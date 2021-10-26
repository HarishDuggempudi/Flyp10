(function () {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;
        var ElementGroupSchema = new Schema({
            elementGroup: {
                type:String,
                trim: true,
                required: true
            },
            active: {
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
        var ElementSchema = new Schema({
            elementName: {
                type:String,
                trim: true,
                required: true
            },
			event:{
			   type:Schema.Types.ObjectId,
               trim: true,
			   required: true
			},
			skillValue:{
			   type:Number,
               trim: true,
			   required: true
			},
			factor:{
			   type:Number,
               trim: true,
			   required: true
			},
            active: {
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
    var sportSchema = new Schema({
        sportName: {
            type: String,
            required: true,
            trim: true
        },
        imageName: {
            type:String,
            trim: true
        },
        imageProperties: {
            imageExtension: {
                type:String,
                trim: true
            },
            imagePath: {
                type:String,
                trim: true
            }
        },
        active: {
            type:Boolean,
            default:false
        }, 
        addnotes:{
            type:Boolean,
            default:false
        },
        fieldsConfig: {
            eventMapping: {
                added:{
                    type:Boolean,
                    default:true
                }
            },
            levelMapping: {
                added:{
                    type:Boolean,
                    default:true
                }
            },
            categoryMapping: {
                added:{
                    type:Boolean,
                    default:true
                }
            },
            elementMapping: {
                added:{
                    type:Boolean,
                    default:true
                }
            },
            elementGroupMapping: {
                added:{
                    type:Boolean,
                    default:true
                }
            },
            baseMapping: {
                added:{
                    type:Boolean,
                    default:true
                }
            }
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

    var mappingSchema = new Schema({
        sport: {
            type: Schema.Types.ObjectId,
            trim: true
        },
        level: {
            type: Array,
            value: []
        },
        mappingFieldsVal: [
            {
                event: Schema.Types.ObjectId,
                category: Schema.Types.ObjectId,
                element: Schema.Types.ObjectId,
                elementGroup: Schema.Types.ObjectId,
                base: Number
            }
        ]
    })

    var categorySchema = new Schema({
        categoryName: {
            type: String,
            required: true,
            trim: true
        },
        active: {
            type:Boolean,
            default:true
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

    var LevelSchema = new Schema({
        level: {
            type: String,
            required: true,
            trim: true
        },
        maxscore: {
            type: String,
            trim: true
        },
        active: {
            type:Boolean,
            default:true
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
    
    var EventSchema = new Schema({
      
        Event: {
            type:String,
            trim: true,
            required: true
        },
        eventFullname: {
            type:String,
            trim: true,
            required: true
        },
        difficultyFactor: {
            type:String,
            trim: true,
            required: true
        },
        active: {
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
	 var pricingSchema = new Schema({
        sport: {
            type: String,
            required: true,
            trim: true
        },
		sportid: {
            type: Schema.Types.ObjectId,
            required: true,
            trim: true
        },
		scoretype: {
            type: String,
            required: true,
            trim: true
        },
		competitor: {
            type: String,
            required: true,
            trim: true
        },
		judge: {
            type: String,
            required: true,
            trim: true
        },
        technician:{
            type :String,
            trim:true,
            default:'0'
        },
        active: {
            type:Boolean,
            default:true
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

    module.exports = {
        SportsModel: mongoose.model('Sport', sportSchema, 'Sport'),
        CategoryModel: mongoose.model('Category', categorySchema, 'Category'),
        LevelModel: mongoose.model('Level', LevelSchema, 'Level'),
        EventModal: mongoose.model('SportsEvent',EventSchema,'SportsEvent'),
        Element:mongoose.model('SportsElement',ElementSchema,'SportsElement'),
        ElementGroup:mongoose.model('SportsElementGroup',ElementGroupSchema,'SportsElementGroup'),
        MappingModel: mongoose.model('Mapping', mappingSchema, 'Mapping'),
		PricingModel:mongoose.model("SportPricing",pricingSchema,"SportPricing")
    };    

})();