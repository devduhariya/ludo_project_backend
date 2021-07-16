const { Router } = require('express');
//import config from '../../config';
const jwt = require('jsonwebtoken');
const Query =require('../../middleware/auth');
const auth = require('../../middleware/auth')
const router = Router();
const  JWT_SECRET  = process.env.JWT_SECRET;

/**
 * @route   GET api/query
 * @desc    Get All queries
 * @access  Public
 */

router.get('/', async (req, res) => {
  try {
    const query = await Query.find();
    if (!query) throw Error('No queries');

    res.status(200).json(query);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { whatsapp, paytm, txn_Id, reciver_Paytm, amount, message, screenshots } = req.body;
  jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const newQuery = new Query({
          whatsapp,
          paytm,
          reciver_Paytm,
          txn_Id,
          amount,
          message,
          screenshots
        });
        const query = await newQuery.save();
        if (!query) throw Error('Something went wrong saving the query');
        res.status(200).json({ authData, query });
      } catch (e) {
        return res.status(400).json({ msg: e.message });
      }

    }
  });
});
module.exports = router;
