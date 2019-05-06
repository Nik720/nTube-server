const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
 // destination
 destination: function (req, file, cb) {
     cb(null, 'uploads')
 },
 filename: function (req, file, cb) {
     var extension = path.extname(file.originalname);
     var file = path.basename(file.originalname,extension);
     var id = file +'_'+ Date.now() + extension;
     cb(null,id);
 }
});

var upload = multer({
 storage: storage,
 limits: {
   files: 1,
   fileSize: 100 * 1024 * 1024 // 1mb, in bytes
 }
});

module.exports = upload;