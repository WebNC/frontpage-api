/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();
const sendMailController = require('../controllers/maillController');
const skillController = require('../controllers/userControllers');
/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});
router.get('/sendmail', sendMailController.sendMail);
router.get('/skill', skillController.getSkill);

module.exports = router;
