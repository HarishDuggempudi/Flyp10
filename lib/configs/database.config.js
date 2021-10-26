// db.createUser({user: "flyp10", pwd: "st@t_52317#2018!", roles:["readWrite"]}); 



// db.createUser({ user: "flyp10user" , pwd: "st@t_52317#2018!", roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]}) 


// C:\Users\Administrator\AppData\Roaming\npm\pm2-dev -> C:\Users\Administrator\AppData\Roaming\npm\node_modules\pm2\bin\pm2-dev 
// C:\Users\Administrator\AppData\Roaming\npm\pm2 -> C:\Users\Administrator\AppData 

// db.auth("flyp10","st@t_52317#2018!"); 

(function() {

    'use strict';

    module.exports = {
        //    development: { 
        //      username: '', 
        //     password: '', 
        //      host: 'localhost', 
        //      port: '27017', 
        //     dbName: 'flyp10-dev' 
        //   },    
        development: {
            username: 'flyp10Root',
            password: 'statFlyP10adMin',
            host: '104.248.222.253',
            port: '27017',
            dbName: 'flyp10live'
        },
        // development: { 
        //     username: '', 
        //     password: '', 
        //     host: 'localhost', 
        //     port: '27017',  mongodump -h 104.248.222.253:27017 -d flyp10live -u flyp10Root -p statFlyP10adMin -o "/DUMP"
        //     dbName: 'flip10test' mongodump --host localhost -d sparklms --port 27017 --username adminSpark --password spark#2k18! --out "C:\dump" 
        // }, mongodump --host ds239359.mlab.com -d prj_nodebeatstest --port 39359 --username nodebeatstest --password nodebeatstest --out /opt/backup/flyp10 
        production: {
            username: 'flyp10Root',
            password: 'statFlyP10adMin',
            host: '104.248.222.253',
            port: '27017',
            dbName: 'flyp10live'
        },
        test: {
            username: 'demouser',
            password: 'demouser',
            host: 'ds119728.mlab.com',
            port: '19728',
            dbName: 'prj_nodebeats'
        },
        dbBackup: {
            opt1: {
                type: 'archive',
                name: 'prj_nodebeats.archive',
                active: false,
                gzip: true
            },
            opt2: {
                type: 'bson',
                name: 'prj_nodebeats',
                active: true
            }
        }
    }
})();