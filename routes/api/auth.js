// const { Router } =require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//import config from '../../config';
const jwt =require('jsonwebtoken');
//import auth from '../../middleware/auth';
// User Model
const SALT = 5;
const User = mongoose.model('user');
require ('dotenv').config();
var Router = require('router')
var router = Router()
// const User =require ('../../models/User');
const  auth = require('../../middleware/auth');

const JWT_SECRET   = "secret";
// const router = Router();

/**
 * @route   POST api/auth/login
 * @desc    Login user
 */
module.exports =(app)=>{
app.post('/api/auth/login', async (req, res) => {
  const { ph, password } = req.body;

  try {
    // Check for existing user
    const user = await User.findOne({ ph });
    if (!user) throw Error('User does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');

    const token = jwt.sign({ user }, JWT_SECRET);
    if (!token) throw Error('Couldnt sign the token');


    res.status(200).json({
      token: token,
      user: {
        id: user._id,
        name: user.name,
        ph: user.ph,
        role : user.role
      }
    });
    console.log(token);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   POST api/users
 * @desc    Register new user
 */

app.post('/api/auth/register', async (req, res) => {
  const { name, ph, email, password } = req.body;
  try {
    const user = await User.findOne({ ph });
    if (user) throw Error('User already exists');

    // const salt = await bcrypt.genSalt(10);
    // if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(password, SALT);
    if (!hash) throw Error('Something went wrong hashing the password');

    const newUser = new User({
      name,
      ph,
      email,
      password: hash
    });
    newUser.role = "user"
    const savedUser = await newUser.save();
    // console.log("user",savedUser);
    if (!savedUser) throw Error('Something went wrong saving the user');

    const token = jwt.sign({id:savedUser.id}, JWT_SECRET, {
      expiresIn: "5m"
    });
    const role = savedUser.role;
    res.status(200).json({
      token,
      role,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        ph: savedUser.ph,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 */

app.get('/api/auth', async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error('No queries');

    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

}

// module.exports = auth
