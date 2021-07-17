// const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID;
const { Schema } = mongoose;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  ph: {
    type: Number,
    required: true,
    minLength: 10,
    unique: true

  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true
  }
});
// const User = model('User', UserSchema);

// module.exports = User;
mongoose.model('user', UserSchema);