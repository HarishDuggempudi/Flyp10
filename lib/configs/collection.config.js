(function(collectionConfig) {
    'use strict';

    module.exports = {
        getCollections: [{
                name: 'ApiAccessManager',
                model: require('../models/apiaccess.management.server.model')
            },

            {
                name: 'DefaultUserStatus',
                model: require('../models/app.default.user.status.server.model')
            },
            {
                name: 'AuthorizationToken',
                model: require('../models/authorization.token.management.server.model')
            },
            {
                name: 'Banner',
                model: require('../models/banner.server.model')
            },
            {
                name: 'BlogCategory',
                model: require('../models/blog.server.model').BlogCategory
            },
            {
                name: 'BlogTag',
                model: require('../models/blog.server.model').BlogTag
            },
            {
                name: 'Blog',
                model: require('../models/blog.server.model').Blog
            },
            {
                name: 'BlogComment',
                model: require('../models/blog.server.model').BlogComment
            },
            {
                name: 'BlogMetaTag',
                model: require('../models/blog.server.model').BlogMetaTag
            },
            {
                name: 'BlogDocument',
                model: require('../models/blog.server.model').BlogDocument
            },
            {
                name: 'user_ccinfo',
                model: require('../models/card.server.model')
            },
            {
                name: 'city',
                model: require('../models/city.model')
            },
            {
                name: 'CloudinarySetting',
                model: require('../models/cloudinary.setting.config.server.model')
            },
            {
                name: 'CommentSetting',
                model: require('../models/comment.setting.server.model')
            },
            {
                name: 'Contact',
                model: require('../models/contact.server.model')
            },
            {
                name: 'Converge_Transaction',
                model: require('../models/converge.server.model')
            },
            {
                name: 'convergeErrorlog',
                model: require('../models/convergeerror.server.model')
            },
            {
                name: 'CountryCurrency',
                model: require('../models/countrycurrency.server.model')
            },
            {
                name: 'MailService',
                model: require('../models/email.service.server.model')
            },
            {
                name: 'EmailTemplate',
                model: require('../models/email.template.server.model')
            },
            {
                name: 'EnrollMeet',
                model: require('../models/enroll.mode')
            },
            {
                name: 'ErrorLog',
                model: require('../models/error.log.server.model')
            },
            {
                name: 'EventManager',
                model: require('../models/event.management.server.model')
            },
            {
                name: 'EventSportList',
                model: require('../models/eventlist.server.model')
            },
            {
                name: 'EventMeet',
                model: require('../models/eventmeet.model')
            },

            {
                name: 'EventSportsMeet',
                model: require('../models/eventmeet.server.model').EventSportMeet
            }, {
                name: 'UserSportEvents',
                model: require('../models/eventmeet.server.model').UserEvent
            },
            {
                name: 'EventMeetCoachMapping',
                model: require('../models/eventmeetcoachmapping.server.model')
            },
            {
                name: 'EventMeetForJudging',
                model: require('../models/eventMeetForJudges.server.model')
            },
            {
                name: 'EventMeetGroup',
                model: require('../models/eventmeetgroup.server.model')
            },
            {
                name: 'Faq',
                model: require('../models/faq.server.model')
            },
            {
                name: 'Flyp10_Activity_Log',
                model: require('../models/Flyp10ActivityLog.server.model')
            },
            {
                name: 'GoogleAnalytics',
                model: require('../models/google.analytics.server.model')
            },
            {
                name: 'GoogleMaps',
                model: require('../models/google.maps.server.model')
            },
            {
                name: 'HtmlModuleContent',
                model: require('../models/html.module.server.model')
            },
            {
                name: 'ImageGallery',
                model: require('../models/image.gallery.server.model').ImageGallery
            },
            {
                name: 'Image',
                model: require('../models/image.gallery.server.model').Image
            },
            {
                name: 'ImageSlider',
                model: require('../models/image.slider.server.model')
            },
            {
                name: 'IPBlocker',
                model: require('../models/ip.block.server.model')
            },
            {
                name: 'Flyp10_Judges_Sport',
                model: require('../models/Judge-Sportdetail.server.model')
            },
            {
                name: 'LibraryComments',
                model: require('../models/library.comment.model')
            },
            {
                name: 'LoginAttempt',
                model: require('../models/login.attempt.server.model')
            },
            {
                name: 'NewsCategory',
                model: require('../models/news.server.model').NewsCategory
            },
            {
                name: 'NewsImage',
                model: require('../models/news.server.model').NewsImage
            },
            {
                name: 'News',
                model: require('../models/news.server.model').News
            },
            {
                name: 'Notification',
                model: require('../models/notifications.management.server.model')
            },

            {
                name: 'OrganizationInformation',
                model: require('../models/organizationInformation.server.model')
            },
            {
                name: 'LoginParallelCheck',
                model: require('../models/parallel.login.server.model')
            },
            {
                name: 'Partner',
                model: require('../models/partner.server.model')
            },
            {
                name: 'PasswordChangeVerifyToken',
                model: require('../models/password.change.verify.server.model')
            },
            {
                name: 'PaylianceACHObj',
                model: require('../models/payliance.mgmt.server.modal').paylianceACHObjModel
            },
            {
                name: 'PaylianceRemitRequest',
                model: require('../models/payliance.mgmt.server.modal').paylianceRemitRequestModel
            },
            {
                name: 'paylianceTransactionObj',
                model: require('../models/payliance.mgmt.server.modal').paylianceTransactionModel
            },
            {
                name: 'ACHTransactionStatus',
                model: require('../models/payliance.mgmt.server.modal').paylianceTransactionStatusModel
            },
            {
                name: 'NotificationToken',
                model: require('../models/payliance.mgmt.server.modal').notificationToken
            },

            {
                name: 'PricingSetting',
                model: require('../models/pricingsetting')
            },
            {  
                name:'Promocode',
            model:require('../models/promocode.model')
         },
            {
                name: 'RoleManager',
                model: require('../models/role.management.server.model')
            },

            {
                name: 'RoutineJudgesMap',
                model: require('../models/routine-judgeMapping')
            },
            {
                name: 'Routinecomment-4/16',
                model: require('../models/routine.comment.model')
            },
            {
                name: 'Routinecomment',
                model: require('../models/routine.judgesnotes')
            },
            {
                name: 'Routine',
                model: require('../models/routine.server.model')
            },
            {
                name: 'Technician_Routine_Comment',
                model: require('../models/routine.techniciannotes')
            },
            {
                name: 'ScoreCard-Config',
                model: require('../models/scorecardmodel')
            },
            {
                name: 'Routine-Share-Info',
                model: require('../models/sharedroutine.server.model')
            }, {
                name: 'Sport',
                model: require('../models/sport.server.model').SportsModel
            },
            {
                name: 'Category',
                model: require('../models/sport.server.model').CategoryModel
            },
            {
                name: 'Level',
                model: require('../models/sport.server.model').LevelModel
            },
            {
                name: 'SportsEvent',
                model: require('../models/sport.server.model').EventModal
            },
            {
                name: 'SportsElement',
                model: require('../models/sport.server.model').Element
            },
            {
                name: 'SportsElementGroup',
                model: require('../models/sport.server.model').ElementGroup
            },
            {
                name: 'Mapping',
                model: require('../models/sport.server.model').MappingModel
            },
            {
                name: 'SportPricing',
                model: require('../models/sport.server.model').PricingModel
            },
            {
                name: 'state',
                model: require('../models/state.model')
            },
            {
                name: 'TeamMember',
                model: require('../models/team.management.server.model').TeamManagement
            },
            {
                name: 'TeamMate',
                model: require('../models/team.management.server.model').TeamMate
            },
            {
                name: 'Technician_Routine',
                model: require('../models/Technician_Routine.model')
            },
            {
                name: 'Testimonial',
                model: require('../models/testimonial.server.model')
            },
            {
                name: 'TextEditorFile',
                model: require('../models/text.editor.file.model')
            },
            {
                name: 'Transaction',
                model: require('../models/transaction.server.model')
            },
            {
                name: 'UserRegistrationConfirmToken',
                model: require('../models/user.confirm.registration.server.model')
            },
            {
                name: 'Flyp10_User',
                model: require('../models/user.server.model')
            },
            {
                name: 'UserUnBlockTokens',
                model: require('../models/user.unblock.server.model')
            },
            {
                name: 'user_wallet',
                model: require('../models/wallet.server.model')
            },
            {
                name: 'Flyp10_WorldMeet',
                model: require('../models/worldmeetSchema.server.model')
            },
            {
                name: 'zipcode',
                model: require('../models/zipcode.model')
            },

            {
                name: 'EventMeet-Judge-Map',
                model: require('../models/EventMeet-Judge-Map.model')
            },
            {
                name: 'USAG-Athlete-Reservation',
                model: require('../models/eventmeet-athlete-reservation.model')
            },
            {
                name: 'USAG-Coach-Reservation',
                model: require('../models/eventmeet-coach-reservation.model')
            },
            {
                name: 'USAG-Judge-Reservation',
                model: require('../models/USAG-Judges-Reservation.model')
            },
            {
                name: 'USAG-Club-Reservation',
                model: require('../models/eventmeet-reservations.model')
            },
            {
                name: 'USAG-Sanction',
                model: require('../models/eventmeet-sanction.model')
            },
            {
                name: 'USAG-Sanction-Administrators',
                model: require('../models/sanction-administrators.model')
            },
            {
                name: 'USAG-EventMeet-Judges',
                model: require('../models/USAG-Eventmeet-Judges.model')
            },
            {
                name: 'USAG-Members',
                model: require('../models/USAG-membership-verification.model')
            },
            {
                name: 'USAG-Socre-Calculation',
                model: require('../models/USAG-Score-Calculation.model')
            },
            {
                name: 'SportLevelSort',
                model: require('../models/SportLevelSortOrder.model')
            },


        ]
    }


})();