// const { Router } = require('express');
//import config from '../../config';
const jwt = require('jsonwebtoken');
//Support Model
var Router = require('router')
var router = Router()
const SellChips = require('../../models/SellChips');
const auth = require('../../middleware/auth');
const Payment = require('../../models/Payment');
// const router = Router();
const JWT_SECRET = "secret";
module.exports = (app) => {
    app.get('/api/sellchips', auth, async (req, res) => {

        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                try {
                    const chips = await SellChips.find();
                    if (!chips) throw Error('No queries');
                    res.status(200).json(chips);
                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }
            }
        });
    });

    // const AddAmount = function (a, b) {
    //     return a + b;
    // }

    const subtractChips = function (a, b) {
        return a - b;
    }

    app.put('/api/sellChips', auth, async (req, res) => {
        const { paytm_no, amount } = req.body;
        // Simple validation
        if (!paytm_no || !amount) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        // console.log("existingNumber",existingNumber);
        // res.status(200).json({ existingNumber });


        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const existingNumber = await Payment.findOne({ paytm_no: paytm_no });
            const chipsId = existingNumber._id
            console.log("existingNumber", chipsId)
            const existAmount = existingNumber.amount
            // const id = authData.user._id
            const currentUser = await Payment.findOne({ paytm_no: authData.user.ph });
            const currentUserId = currentUser._id
            const currentUserAmount = currentUser.amount
            let AddAmount = parseInt(existAmount + amount)
            console.log("currentUser", AddAmount);
            if (err) {
                res.sendStatus(403);
            } else {
                try {

                   
                    let res1 = await Payment.findByIdAndUpdate(currentUserId,
                        {
                            amount: subtractChips(currentUserAmount, amount)
                        },
                        { new: true }
                    );
                    let res2 = await Payment.findByIdAndUpdate(chipsId,
                        {
                            amount: AddAmount
                        },
                        { new: true }
                    );
                    const newSellChips = new SellChips({
                        paytm_no,
                        amount
                    });
                    const sellChips = await newSellChips.save();
                    if (!sellChips) throw Error('Something went wrong saving the challenge');
                    res.status(200).json({ sellChips, res1, res2 });
                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }
            }
        });
    });

}