/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();
const studentController = require('../controllers/studentController');


router.post('/contract/request', studentController.requestContract);
router.get('/contract/read', studentController.readContract);
router.post('/contract/edit', studentController.editContract);

router.post('/contract/rating', studentController.ratingContract);
router.post('/contract/comment', studentController.commentContract);
router.post('/contract/report', studentController.reportContract);


router.post('/payment', studentController.payment);
module.exports = router;
