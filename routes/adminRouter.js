const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage }).single('file');

router.route('/creatCountry').post(adminController.createCountry);
router.route('/uploadCountryCSV').post(upload, adminController.uploadCountryCSV);
router.route('/getCountry').get(adminController.getCountry);

module.exports = router;
