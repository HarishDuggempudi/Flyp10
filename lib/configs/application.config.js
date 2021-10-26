(function() {

    'use strict';

    module.exports = {
        user: {
            defaultUserFirstName: 'nodebeats',
            defaultUserLastName: 'user',
            defaultUsername: 'superadmin',
            defaultPassword: 'superadmin@123',
            defaultUserEmail: 'help@nodebeats.com',
            defaultUserRole: 'superadmin'
        },
        cloudinary: {
            defaultCloudName: 'nodebeats'
        },
        login: {
            maxFailedLoginAttempt: 5,
            initialBlockLoginAttemptForCertainTime: 3,
            maxBlockedTime: 1, //in minutes 1440
        },
        sports: {
            MFigureSkating: '5c09ecbd3cf89f48c0ccaffa',
            WFigureSkating: '5c09ed233cf89f48c0ccaffb'
        },
        USAGSports: {
            Women: '5d1aaabd2a91081752afd7e2',
            Men: '5ba9dc2ae0e34b2f789eee3f',
            Acro: '5f6cf47a9f14cc6cba511904',
            Rhythmic: '5f75dc14e208ce7ac70f3922',
            TANDT: '5f75f3a6e208ce7ac70f3958'
        },
        USAGVerificationAPI: {
            person: 'https://usagym.org/app/api/v4/person/'
        },
        EventNumber: {

            "5de1595d1290be1f5de49a73": {
                _id: "5de1595d1290be1f5de49a73",
                eventNumber: "1",
                name: "Vault – WGym – Comp"
            },
            "5dda97489aed5157726ff7a5": {
                _id: "5dda97489aed5157726ff7a5",
                eventNumber: "2",
                name: "Uneven Bars - Comp"
            },
            "5ddaa2c69aed5157726ff7af": {
                _id: "5ddaa2c69aed5157726ff7af",
                eventNumber: "3",
                name: "Beam - Comp"
            },
            "5dda97759aed5157726ff7a8": {
                _id: "5dda97759aed5157726ff7a8",
                eventNumber: "4",
                name: "Floor - WGym – Comp"
            },

            "5bc4e2cee7eeff2d68534df6": {
                _id: "5bc4e2cee7eeff2d68534df6",
                eventNumber: "1",
                name: "Floor - MGym"
            },
            "5ba9dcb3e0e34b2f789eee40": {
                _id: "5ba9dcb3e0e34b2f789eee40",
                eventNumber: "2",
                name: "Parallel Bars"
            },
            "5bc4e2cee7eeff2d68534df6": {
                _id: "5bc4e2cee7eeff2d68534df6",
                eventNumber: "3",
                name: "Rings"
            },
            "5beaff084b78f34168c5b591": {
                _id: "5beaff084b78f34168c5b591",
                eventNumber: "4",
                name: "Vault - MGym"
            },
            "5baa001222c63d2be4492d44": {
                _id: "5baa001222c63d2be4492d44",
                eventNumber: "5",
                name: "Pommel Horse"
            },
            "5bf0a5e479061945a0dde013": {
                _id: "5bf0a5e479061945a0dde013",
                eventNumber: "6",
                name: "High Bar"
            },


        }

    };
})();