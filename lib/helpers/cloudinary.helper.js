(function (cloudinaryHelper) {

    'use strict';

    var path = require('path');

    cloudinaryHelper.singleImageUpload = function (cloudinary, req, res, next) {
       
        if(req.file.originalname == 'blob'){
            let tmp_ext = req.file.mimetype;
            let ext = tmp_ext.substr(tmp_ext.indexOf('/')+1)
            req.file.originalname = ext

            let tmp_fileName = req.file.filename
            let filename = tmp_fileName.substr(0,tmp_fileName.indexOf('.')+1) + ext 
            req.file.filename = filename

            // let tmp_path = req.file.path
            // let path = tmp_path.substr(0,tmp_path.lastIndexOf('/')+1) + filename 
            // req.file.path = path

        }
        console.log(' req.file', req.file)
        cloudinary.uploader.upload(
            req.file.path,
            function (err, result) {
            },
            {               
                public_id: path.basename(req.file.path, path.extname(req.file.filename)),
                format: (path.extname(req.file.filename)).substring(1),
                // format: req.app.get('cloudinaryextension'),
                quality: 60
            }
        );
        next();
    };

    
    cloudinaryHelper.deleteImage = function (fileName, cloudinary, req, res, next) {
        cloudinary.uploader.destroy(
            path.basename(fileName, path.extname(fileName)),
            function (result) {
            },
            {
                invalidate: true
            });
    };

})(module.exports);