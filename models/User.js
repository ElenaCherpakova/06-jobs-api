const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      'Please provide valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 6,
  },
});

//using mongoose middleware hashing password
UserSchema.pre('save', async function () {
  //generate random bytes using method genSalt() with number of rounds
  const salt = await bcrypt.genSalt(10);
  // ``this``` in this fn will to user document that's why we use regular function instead of arrow function
  // because this in arrow function will refer to the window object in the browser or the global object in Node.js
  // hash password using method hash() with password and salt in order to safely to store in our db
  this.password = await bcrypt.hash(this.password, salt);
});

//using mongoose middleware to generate token
UserSchema.methods.generateJWT = function () {
  //generate token using method sign() with payload and secret key
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model('User', UserSchema);
