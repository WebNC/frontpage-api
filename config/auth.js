const jwt = require('express-jwt');
require('dotenv').config();

const getTokenFromHeaders = (req) => {
  const { authorization } = req.headers;
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: process.env.JWT_KEY,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: process.env.JWT_KEY,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;
