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

    app.get('/api/setChallenge', auth, async (req, res) => {

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


    app.get('/api/setChallenge/all', auth, async (req, res) => {
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {

            //     const product = await Challenge.find()
            // if (product) {
            //     // await Challenge.deleteOne({ _id: id });
            //     res.status(200).json(product);
            // } else {
            //     res.status(400).send({ message: "no request"})
            // }


            // const Role = authData.user.role;
            const allTranctions = await Challenge.find();

            let allTranctionSatus = null;
            let tranctionsWithStatusPending = [];

            if (err) {
                res.sendStatus(403);
            }
            else {
                // if (Role === 'admin') {
                try {
                    for (let i = 0; i < allTranctions.length; i++) {
                        allTranctionSatus = allTranctions[i].status;
                        if (allTranctionSatus === "pending") {

                            tranctionsWithStatusPending.push(allTranctions[i])
                        }
                    }
                    return res.status(200).json(
                        tranctionsWithStatusPending
                    );
                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }
                // }
                // else {
                //     res.sendStatus(401);
                // }
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
                if (totalchips >= amount) {
                    const newChallenge = new Challenge({
                        name,
                        amount,
                        paytm_no,
                        roomCode
                    });
                    newChallenge.status = "pending"
                    const ans = await Payment.findByIdAndUpdate(userId,
                        {
                            amount: subtractCurrentUserChips(totalchips, amount)

                        },
                        { new: true }
                    );
                    const challenge = await newChallenge.save();
                    if (!challenge) throw Error('Something went wrong saving the challenge');
                    res.status(200).json({ challenge, ans });
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
        const Status = "Accepted";
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {

            const product = await Challenge.findById({ _id: id })
            // let winningAmount = null
            const sameUser = product.paytm_no
            const challengeAmount = product.amount
            const result = await Payment.findOne({ paytm_no: authData.user.ph })
            const userId = result._id;
            const challengeSetterUser = authData.user.ph
            const currentUserAmount = result.amount
            if (err) {
                res.sendStatus(403);
            }
            else {
                if (challengeAmount > currentUserAmount) {
                    res.status(400).json({ message: 'insufficient chips' });
                }
                if (sameUser == challengeSetterUser) {
                    res.status(404).json({ message: 'you cannot play challnge set by own' })
                }
                else {
                    const ans = await Payment.findByIdAndUpdate(userId,
                        {
                            amount: subtractChips(currentUserAmount, challengeAmount)

                        },
                        { new: true }
                    );

                    const findChallenge = await Challenge.findById(id);
                    const userId1 = findChallenge._id
                    //    console.log('findChallenge',findChallenge)
                    if (findChallenge.status === "pending") {
                        //await Challenge.deleteOne({ _id: id });
                        const changeStatus = await Challenge.findByIdAndUpdate(userId1,
                            {
                                status: Status,
                            },
                            { new: true }
                        );
                        res.status(200).json({ changeStatus });
                    } else {
                        res.status(404)
                    }
                    // if(findChallenge.status === "Accepted") {
                    //     await Challenge.findOneAndDelete(id);
                    // }
                    const Admin = 7357525272
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

    app.put('/api/roomCode/:id', auth, async (req, res) => {

        const id = req.params.id;
        const { roomCode } = req.body

        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            // const product = await Challenge.findById({ _id: id })
            // const user1 = authData.user.ph
            // console.log("product", product.user1)
            const product = await Challenge.findById(id)
            // console.log("product.roomCode",product.roomCode)
            const challengeSetterUser = product.paytm_no
            if (challengeSetterUser === authData.user.ph) {
                const result1 = await Challenge.findByIdAndUpdate(id,
                    {
                        roomCode
                    },
                    { new: true }
                );
                res.send(result1);
            } else {
                // const getChallengeRoomcode = await Challenge.findById(id)
                res.status(404);
                // console.log("product.roomCodeeeee",getChallengeRoomcode)
            }


            // }
        });

    });

    app.get('/api/getRoomCode/:id', auth, async (req, res) => {

        const id = req.params.id;
        // const { roomCode } = req.body

        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            // const product = await Challenge.findById({ _id: id })
            // const user1 = authData.user.ph
            // console.log("product", product.user1)
            const product = await Challenge.findById(id)
            // console.log("product.roomCode",product.roomCode)
            const challengeSetterUser = product.paytm_no
            if (challengeSetterUser !== authData.user.ph) {
                // const result1 = await Challenge.findByIdAndUpdate(id,
                //     {
                //         roomCode
                //     },
                //     { new: true }
                // );
                res.json(product);
            } else {
                // const getChallengeRoomcode = await Challenge.findById(id)
                res.status(404);
                // console.log("product.roomCodeeeee",getChallengeRoomcode)
            }


            // }
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

    app.get('/api/getChallenges', auth, async (req, res) => {
        // const id = req.params.id;
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const product = await Challenge.find()
            if (product.status == "pending") {
                // await Challenge.deleteOne({ _id: id });
                res.status(200).send({ product });
            } else {
                res.status(400).send({ message: "no request", product })
            }
        })
    });


}