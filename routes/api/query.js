// const { Router } = require('express');
//import config from '../../config';
const jwt = require('jsonwebtoken');
const Query =require('../../middleware/auth');
const auth = require('../../middleware/auth')
// const router = Router();
const JWT_SECRET   = "secret";
// var Router = require('router')
// var router = Router()
/**
 * @route   GET api/query
 * @desc    Get All queries
 * @access  Public
 */
 module.exports =(app)=>{
app.get('/api/query', async (req, res) => {
  try {
    const query = await Query.find();
    if (!query) throw Error('No queries');

    res.status(200).json(query);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

app.post('/api/query', auth, async (req, res) => {
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
}
