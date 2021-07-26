
require('dotenv').config()
const jwt = require('jsonwebtoken');
const https = require('https');
const Payment = require('../../models/Payment');
const auth = require('../../middleware/auth')
const Result = require('../../models/GameResult')
const Challenge = require('../../models/SetChallenge');
const { findOne } = require('../../models/Payment');
const JWT_SECRET = "secret";
module.exports = (app) => {

    const subtractChips = function (a, b) {
        return a - b;
    }
    const TotalAmount = (a) => a + a
    
    app.post('/api/result/:id', auth, async (req, res) => {
        const id = req.params.id;

        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const product = await Challenge.findById({ _id: id })

            console.log("user1", product)
            const challengeAmount = product.amount

            const ans = await Payment.findOne({ paytm_no: authData.user.ph })
            const userId = ans._id;
            let user2 = ans.paytm_no
            const currentUserAmount = ans.amount
            const { result, screenshots } = req.body

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
                    const newResult = new Result({
                        user2: {
                            user2,
                            result,
                            screenshots
                        },

                        challengeAmount: TotalAmount(challengeAmount)

                    });
                    const GameResult = await newResult.save();
                    if (!GameResult) throw Error('Something went wrong saving the challenge');
                    res.status(200).json({ GameResult });

                }
            }
        });

    });

    app.put('/api/result/:id', auth, async (req, res) => {

        const id = req.params.id;
        const { result, screenshots } = req.body


        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const product = await Result.findById({ _id: id })
            const user1 = authData.user.ph
            console.log("product", product.user1)
            const result1 = await Result.findByIdAndUpdate(id,
                {
                    user1: {
                        user1,
                        result,
                        screenshots
                    },
                },
                { new: true }
            );
            res.send(result1);
            // }
        });

    });


    app.get('/api/results', async (req, res) => {
        try {
            const query = await Result.find();
            if (!query) throw Error('No queries');

            res.status(200).json(query);
        } catch (e) {
            res.status(400).json({ msg: e.message });
        }
    });

    const addWiningAmount = (a, b) => a + b

    app.put('/api/result/winner/:id', auth, async (req, res) => {
        const id = req.params.id;
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                try {

                    const chips = await Result.findById(id);
                    const user1Number = chips.user1[0].user1
                    const user2Number = chips.user2[0].user2
                    const winingAmount = chips.challengeAmount;
                    const user1Status = chips.user1[0].result
                    const user2Status = chips.user2[0].result
                    if (user1Status === "won" && user2Status === "lost") {
                        const chipsUserHave = await Payment.findOne({ paytm_no: user1Number })
                        console.log("chipsUserHave", chipsUserHave)
                        const existAmount = chipsUserHave.amount
                        const UserOneTotalAmount = await Payment.findOneAndUpdate({ paytm_no: user1Number },
                            {
                                amount: addWiningAmount(existAmount, winingAmount)
                            },
                            { new: true }
                        );
                        res.json(UserOneTotalAmount)
                    }
                    else if (user2Status === "won" && user1Status === "lost") {
                        const chipsUserHave = await Payment.findOne({ paytm_no: user2Number })
                        console.log("chipsUserHave", chipsUserHave)
                        // const user2Id = chipsUserHave_id
                        const existAmount = chipsUserHave.amount
                        const UserTwoTotalAmount = await Payment.findOneAndUpdate({ paytm_no: user2Number },
                            {
                                amount: addWiningAmount(existAmount, winingAmount)
                            },
                            { new: true }
                        );
                        // console.log("UserTwoTotalAmount", UserTwoTotalAmount)
                        res.json(UserTwoTotalAmount)
                    }


                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }
            }
        });
    });

}