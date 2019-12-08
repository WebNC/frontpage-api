const express = require('express');

const router = express.Router();

// cloudinary
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const user = require('../controllers/userControllers');

cloudinary.config({ cloud_name: 'dpsdkyleb', api_key: 649252332669658, api_secret: '8ZfEWNU8eJGybHofn3lUya2qdVk' });

const storage = cloudinaryStorage({
  cloudinary, folder: 'teacher-finder', allowedFormats: ['jpg', 'png'], transformation: [{ width: 5000, height: 5000, crop: 'limit' }],
});

const parser = multer({ storage });

router.post('/avatar', parser.single('avatar'), user.upload);

module.exports = router;
