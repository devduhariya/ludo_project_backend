// const { Router } = require('express');
//import config from '../../config';
const jwt = require('jsonwebtoken');
//Support Model
const Challenge = require('../../models/SetChallenge');
const auth = require('../../middleware/auth');
const Payment = require('../../models/Payment');
const Result = require('../../models/GameResult');
  //multer
// const router = Router();
var Router = require('router')
var router = Router()
const JWT_SECRET   = "secret";
module.exports = (app) => {
    app.get('/api/setChallenge', auth, async (req, res) => {

        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const name = authData.user.name;
            if (err) {
                res.sendStatus(403);
            } else {
                try {
                    const challenge = await Challenge.find({ name });
                    if (!challenge) throw Error('No queries');
                    res.status(200).json(challenge);
                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }

            }
        });
    });

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
                // const userId = chips._id
                // try {
                if (totalchips > amount) {
                    const newChallenge = new Challenge({
                        name,
                        amount,
                        roomCode,
                        paytm_no
                    });

                    const ans = await Payment.findByIdAndUpdate(userId,
                        {
                            amount: subtractCurrentUserChips(totalchips, amount)

                        },
                        { new: true }
                    );
                    const challenge = await newChallenge.save();
                    if (!challenge) throw Error('Something went wrong saving the challenge');
                    res.status(200).json({ challenge });
                } else {
                    res.status(400).json({ message: "you don't have sufficient chips" })
                }
            }
        });
    });

    // app.get('/api/setChallenge/result', async (req, res) => {
    //     try {
    //         const query = await Result.find();
    //         if (!query) throw Error('No queries');

    //         res.status(200).json(query);
    //     } catch (e) {
    //         res.status(400).json({ msg: e.message });
    //     }
    // });


    const subtractChips = function (a, b) {
        return a - b;
    }

    const Totalchips = function (a,b) {
        return a + a;
    }
    app.put('/api/setChallenge/:id', auth, async (req, res) => {
        const id = req.params.id;

        //  const {screenshots} = req.body
        // const {screenshots,won} = req.body;
        // const {secondUser:[won,lost,screenshots]} = req.body;
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const product = await Challenge.findById({ _id: id })
            // let winningAmount = null
            const challengeAmount = product.amount
            // let user1 = product.paytm_no
            // console.log("user1", product)
            // const { currentUserNumber } = authData.user.ph;
            const result = await Payment.findOne({ paytm_no: authData.user.ph })
            const userId = result._id;
            // let user2 = result.paytm_no
            const currentUserAmount = result.amount
            // const  {won} = req.body;
            // const { won, screenshots } = req.body
            // const { won1, screenshots1 } = req.body
            // console.log("usscreenshotser2",req.body)
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