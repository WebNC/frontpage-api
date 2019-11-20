var express = require('express');
var router = express.Router();
var auth = require("../config/auth")
var userControllers = require("../controllers/userControllers")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login',auth.optional,userControllers.login );
router.post('/register', auth.optional,userControllers.register);
router.get('/me',auth.required,userControllers.me)
module.exports = router;
