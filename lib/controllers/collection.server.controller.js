var collectionController = (function() {

    'use strict';

    var dataProviderHelper = require('../data/mongo.provider.helper'),
        collectionConfig = require('../configs/collection.config'),
        json2csv = require('json2csv').parse
        // fs= Promise.promisifyAll(require('fs'))

    var request = require('request');
    var mongoose = require('mongoose');

    function CollectionModule() {}
    var _p = CollectionModule.prototype;

    _p.getAllCollections = function(req) {
        var collection = collectionConfig.getCollections;
        // console.log(collection)
        return collection;
    }

    _p.getCollection = function(req, res, next) {
        var query = {};
        var modelname = req.query.name;
        //    console.log(modelname)
        var collection = collectionConfig.getCollections;
        //  console.log(collection)
        var c = collection.find((c) => c.name == modelname);
        //  console.log(c.model);
        return dataProviderHelper.find(c.model, query);


    }
    _p.getCollectionKeys = function(req, res, next) {

        var modelname = req.query.name;
        var query = [{
                "$project": {
                    "data": { "$objectToArray": "$$ROOT" }
                }
            },
            { "$project": { "data": "$data.k" } },
            { "$unwind": "$data" },
            {
                "$group": {
                    "_id": null,
                    "keys": { "$addToSet": "$data" }
                }
            }
        ]
        var collection = collectionConfig.getCollections;
        var c = collection.find((c) => c.name == modelname);
        return dataProviderHelper.aggregate(c.model, query);
    }
    _p.exportCollection = function(req, res, next) {
        var collectiondata = req.body.data;
        var modelname = req.body.name
        var query = {};
        // var modelname = req.query.name;
        //    console.log(modelname)
        var collection = collectionConfig.getCollections;
        //  console.log(collection)
        var c = collection.find((c) => c.name == modelname);
        //  console.log(c.model);
        var collectiondata = dataProviderHelper.find(c.model, query);

        if (collectiondata.length > 0) {
            var excel = require('exceljs');
            var workbook = new excel.Workbook(); //creating workbook
            var sheet = workbook.addWorksheet(modelname); //creating worksheet

            sheet.addRow().values = Object.keys(collectiondata[0])
            collectiondata.forEach(function(item) {
                var valueArray = [];
                valueArray = Object.values(item); // forming an array of values of single json in an array
                sheet.addRow().values = valueArray; // add the array as a row in sheet
            })

            workbook.xlsx.writeFile('./temp.xlsx').then(function() {
                //console.log("file is written");
            })

            var tempfile = require('tempfile');
            var tempFilePath = tempfile('.xlsx');
            // console.log("tempFilePath : ", tempFilePath);
            sheet.mergeCells()
            workbook.xlsx.writeFile(tempFilePath).then(function() {
                res.sendFile(tempFilePath, function(err) {
                    // console.log('---------- error downloading file: ', err);
                });
                // console.log('file is written');
            });
        } else {
            res.send({ success: false, msg: "No data found." })
        }

    }


    return {

        getAllCollections: _p.getAllCollections,
        getCollection: _p.getCollection,
        exportCollection: _p.exportCollection,
        getCollectionKeys: _p.getCollectionKeys
    };

})();

module.exports = collectionController;