/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/send-chat', chatController.sendChat);
router.post('/get-chat', chatController.getChat);
router.post('/get-partner-list', chatController.getPartnerList);
router.post('/create-room', chatController.createRoom);
module.exports = router;
