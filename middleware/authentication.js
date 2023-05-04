const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationMiddleware = async (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('No token provided');
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, name } = payload;

    //if we want to remove User
    // const user = User.findById(userId).select('-password');
    // req.user = user;

    // attach the user to the song routes
    req.user = { userId, name };
    next();
  } catch (err) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = authenticationMiddleware;
