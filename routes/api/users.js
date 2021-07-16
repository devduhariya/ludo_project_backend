const { Router } = require('express');
const User = require('../../models/User');
const auth = require('../../middleware/auth')
const router = Router();
//import config from '../../config';
const jwt = require('jsonwebtoken');
const  JWT_SECRET  = process.env.JWT_SECRET;

/**
 * @route   GET api/users
 * @desc    Get all users
 */
router.get('/:id', auth, async (req, res) => {
  const id = req.params.id;
  jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const users = await User.findOne({ userId: { $eq: id } });
        if (!users) throw Error('No users exist');
        res.json(users);
      } catch (e) {
        res.status(400).json({ msg: e.message });
      }

    }
  });
});

module.exports = router;
