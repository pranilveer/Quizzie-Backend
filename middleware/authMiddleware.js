// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env; // Make sure to set your secret key in environment variables

const authenticateUser = (req, res, next) => {
  const token = req.headers('Authorization').split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};
module.exports = authenticateUser;
