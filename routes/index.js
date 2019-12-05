/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();
const sendMail = require('../controllers/maillController');
/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
  sendMail.sendMail();
});

module.exports = router;
