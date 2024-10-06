const { verifyToken } = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Unauthorized');

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send('Invalid Token');
  }
};


module.exports = {
  authMiddleware
};
