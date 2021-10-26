(function() {

    'use strict';

    var mongoose = require('mongoose'),
        regex = require('./regex.server.model'),
        Schema = mongoose.Schema;

    var userSchema1 = new Schema({
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middleName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function(email) {
                    if (email) {
                        return regex.emailRegex.test(email);
                    } else {
                        return true;
                    }
                },
                message: '{VALUE} is not a valid email address!'
            }
        },
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            trim: true
        },
        passwordSalt: {
            type: String
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        mobileNumber: {
            type: String,
            trim: true
        },
        securityQuestion: {
            type: String,
            trim: true
        },
        securityAnswer: {
            type: String,
            trim: true
        },
        securityAnswerSalt: {
            type: String,
            trim: true
        },
        active: {
            type: Boolean,
            default: true
        },
        userRole: {
            type: String,
            trim: true,
            required: true
        },
        imageName: {
            type: String,
            trim: true
        },
        twoFactorAuthEnabled: {
            type: Boolean,
            default: false
        },
        twoFactorAuthSharedSecret: {
            type: String,
            trim: true
        },
        addedBy: {
            type: String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: String,
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
            type: String,
            trim: true
        },
        deletedOn: {
            type: Date
        },
        blocked: {
            type: Boolean,
            default: false
        },
        blockedBy: {
            type: String,
            trim: true
        },
        blockedOn: {
            type: Date
        },
        imageProperties: {
            imageExtension: {
                type: String,
                trim: true
            },
            imagePath: {
                type: String,
                trim: true
            }
        },
        userConfirmed: {
            type: Boolean,
            default: false
        }
    });
    var userSchema = new Schema({
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        cardToken: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function(email) {
                    if (email) {
                        return regex.emailRegex.test(email);
                    } else {
                        return true;
                    }
                },
                message: '{VALUE} is not a valid email address!'
            }
        },
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            trim: true
        },
        passwordSalt: {
            type: String
        },
        passphrase: {
            type: String
        },
        paylianceCID: {
            type: String,
            default: 0
        },
        subtype: {
            type: String,
            default: 0
        },
        promocode: {
            type: String,
            default: 0
        },
        subStart: {
            type: String,
            default: '0'
        },
        subEnd: {
            type: String,
            default: '0'
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        dob: {
            type: String,
            trim: true,

        },
        dateofbirth: {
            type: String,
            trim: true
        },
        securityQuestion: {
            type: String,
            trim: true
        },
        securityAnswer: {
            type: String,
            trim: true
        },
        securityAnswerSalt: {
            type: String,
            trim: true
        },
        active: {
            type: Boolean,
            default: true
        },
        userRole: {
            type: String,
            trim: true,
            required: true
        },
        userConfirmed: {
            type: Boolean,
            default: false
        },
        recruiterStatus: {
            type: String,
            default: '0'
        },
        imageName: {
            type: String,
            trim: true
        },
        twoFactorAuthEnabled: {
            type: Boolean,
            default: false
        },
        address: {
            required: true,
            type: String,
            trim: true
        },
        addedBy: {
            type: String,
            trim: true
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: String,
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
            type: String,
            trim: true
        },
        deletedOn: {
            type: Date
        },
        blocked: {
            type: Boolean,
            default: false
        },
        blockedBy: {
            type: String,
            trim: true
        },
        blockedOn: {
            type: Date
        },
        imageProperties: {
            imageExtension: {
                type: String,
                trim: true
            },
            imagePath: {
                type: String,
                trim: true
            }
        },
        isUSCitizen: {
            type: String,
            trim: true,
            default: '2'
        },
        country: {
            type: String,
            trim: true,
            default: 'United States'
        },
        referralType: {
            type: String,
            trim: true
        },
        referrer: {
            type: String,
            trim: true
        },
        alwaysSharedRoutine: {
            type: String,
            trim: true
        },
        EligibleJudgeForMyFlyp10Routine: {
            type: Boolean,
        }

    });
    module.exports = mongoose.model('Flyp10_User', userSchema, 'Flyp10_User');
    //    module.exports = mongoose.model('User', userSchema1, 'User');

})();