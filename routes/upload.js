const express = require('express');

const router = express.Router();
require('dotenv').config();

// cloudinary
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const user = require('../controllers/userControllers');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET });
const storage = cloudinaryStorage({
  cloudinary, folder: 'teacher-finder', allowedFormats: ['jpg', 'png'], transformation: [{ width: 5000, height: 5000, crop: 'limit' }],
});

const parser = multer({ storage });

router.post('/avatar', parser.single('avatar'), user.upload);

module.exports = router;
