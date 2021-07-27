// const { Router } = require('express');
//import config from '../../config';
const jwt = require('jsonwebtoken');
//Support Model
const Challenge = require('../../models/SetChallenge');
const auth = require('../../middleware/auth');
const Payment = require('../../models/Payment');
const Result = require('../../models/GameResult');
// const router = Router();
var Router = require('router');
const { findOne } = require('../../models/Payment');
var router = Router()
const JWT_SECRET = "secret";
module.exports = (app) => {

    app.get('/api/setChallenge/all', auth, async (req, res) => {

        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            // const name = authData.user.name;
            if (err) {
                res.sendStatus(403);
            } else {
                try {
                    const challenge = await Challenge.find();
                    if (!challenge) throw Error('No queries');
                    res.status(200).json(challenge);
                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }
            }
        });
    });

    const subtractCurrentUserChips = function (a, b) {
        return a - b;
    }
    app.post('/api/setChallenge', auth, async (req, res) => {
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const { amount, roomCode } = req.body;
            const name = authData.user.name;
            const paytm_no = authData.user.ph




            // console.log("authdata.user", authData.user.ph, authData.user.name)
            if (err) {
                res.sendStatus(403);
            } else {
                let chips = await Payment.findOne({ paytm_no: authData.user.ph });
                const totalchips = chips.amount;
                const userId = chips._id
                // console.log("usewrId",userId)
                // try {
                if (totalchips > amount) {
                    const newChallenge = new Challenge({
                        name,
                        amount,
                        roomCode,
                        paytm_no,
                    });
                    const ans = await Payment.findByIdAndUpdate(userId,
                        {
                            amount: subtractCurrentUserChips(totalchips, amount)

                        },
                        { new: true }
                    );
                    const challenge = await newChallenge.save();
                    if (!challenge) throw Error('Something went wrong saving the challenge');
                    res.status(200).json({ challenge,ans});
                } else {
                    res.status(400).json({ message: "you don't have sufficient chips" })
                }
            }
        });
    });

    const subtractChips = function (a, b) {
        return a - b;
    }

    const Totalchips = function (a, b, c) {
        return a + b + c;
    }
    app.put('/api/setChallenge/:id', auth, async (req, res) => {
        const id = req.params.id;

        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {

            const product = await Challenge.findById({ _id: id })
            // let winningAmount = null
            const challengeAmount = product.amount
            const result = await Payment.findOne({ paytm_no: authData.user.ph })
            const userId = result._id;

            const currentUserAmount = result.amount
            if (err) {
                res.sendStatus(403);
            }
            else {
                if (challengeAmount > currentUserAmount) {
                    res.status(400).json({ message: 'insufficient chips' });
                } else {
                    const ans = await Payment.findByIdAndUpdate(userId,
                        {
                            amount: subtractChips(currentUserAmount, challengeAmount)

                        },
                        { new: true }
                    );

                    const removeChallenge = await Challenge.findById({ _id: id })

                    if (removeChallenge) {
                        //await Challenge.deleteOne({ _id: id });
                        res.status(200).send(ans);
                    } else {
                        res.status(400).send({ message: "no request" })
                    }
                    const Admin = 9876543210
                    let chips = await Payment.findOne({ paytm_no: Admin });
                    let AdminId = chips._id
                    const adminChips = chips.amount
                    const addChipsToAdmin = await Payment.findByIdAndUpdate(AdminId,
                        {
                            amount: Totalchips(adminChips, challengeAmount, challengeAmount)

                        },
                        { new: true }
                    );
                    res.json(addChipsToAdmin)

                }
            }
        });

    });
    app.delete('/api/setChallenge/:id', async (req, res) => {
        const id = req.params.id;

        const product = await Challenge.findById({ _id: id })
        if (product) {
            await Challenge.deleteOne({ _id: id });
            res.status(200).send({ message: 'request removed' });
        } else {
            res.status(400).send({ message: "no request" })
        }
    });

}