const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const secretKey = jwtSecret || 'my_secret';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, company_id: user.company_id, email: user.email }, secretKey, {
    expiresIn: '8h',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = {
  generateToken,
  verifyToken
};
