
require('dotenv').config()
// const { Router } = require('express')
const jwt = require('jsonwebtoken');
//import config from '../../config';
// const router = Router();
// const router = require('express').Router()
const https = require('https');
const Payment = require('../../models/Payment');
const auth = require('../../middleware/auth')
const Result = require('../../models/GameResult')
const Challenge = require('../../models/SetChallenge')
const JWT_SECRET = "secret";
module.exports = (app) => {
    // app.get('/api/buychips', auth, async (req, res) => {
    //     jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    //         const Role = authData.user.role;
    //         const allTranctions = await Payment.find();

    //         let allTranctionSatus = null;
    //         let tranctionsWithStatusPending = [];

    //         if (err) {
    //             res.sendStatus(403);
    //         }
    //         else {
    //             if (Role === 'admin') {
    //                 try {
    //                     for (let i = 0; i < allTranctions.length; i++) {
    //                         allTranctionSatus = allTranctions[i].status;
    //                         if (allTranctionSatus === "pending") {

    //                             tranctionsWithStatusPending.push(allTranctions[i])
    //                         }

    //                     }
    //                     return res.status(200).json(
    //                         tranctionsWithStatusPending
    //                     );
    //                 } catch (e) {
    //                     res.status(400).json({ msg: e.message });
    //                 }
    //             }
    //             else {
    //                 res.sendStatus(401);
    //             }
    //         }
    //     });
    // });

    // app.post('/api/gameResult', auth, async (req, res) => {
    //     const { paytm_no, txn_ID, amount } = req.body;
    //     // Simple validation
    //     if (!paytm_no || !txn_ID || !amount) {
    //         return res.status(400).json({ msg: 'Please enter all fields' });
    //     }
    //     jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    //         if (err) {
    //             res.sendStatus(403);
    //         } else {
    //             try {
    //                 const newPayment = new GameResult({
    //                     paytm_no,
    //                     txn_ID,
    //                     amount
    //                 });
    //                 // newPayment.status = "pending"
    //                 const payment = await newPayment.save();
    //                 if (!payment) throw Error('error while saving payment');
    //                 res.status(200).json({ payment });
    //             } catch (e) {
    //                 res.status(400).json({ msg: e.message });
    //             }
    //         }
    //     });
    // });


    const subtractChips = function (a, b) {
        return a - b;
    }

    app.post('/api/result/:id', auth, async (req, res) => {
        const id = req.params.id;
    
        //  const {screenshots} = req.body
        // const {screenshots,won} = req.body;
        // const {secondUser:[won,lost,screenshots]} = req.body;
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const product = await Challenge.findById({ _id: id })
            // let winningAmount = null
            console.log("user1", product)
            const challengeAmount = product.amount
            let user1 = product.paytm_no
            // console.log("user1", product)
            // const { currentUserNumber } = authData.user.ph;
            const ans = await Payment.findOne({ paytm_no: authData.user.ph })
            const userId = ans._id;
            let user2 = ans.paytm_no
            const currentUserAmount = ans.amount
            // const  {won} = req.body;
            const { result, screenshots } = req.body
            // const { won1, screenshots1 } = req.body
            // console.log("usscreenshotser2",req.body)
            if (err) {
                res.sendStatus(403);
            }
            else {
                if (challengeAmount > currentUserAmount) {
                    res.status(400).json({ message: 'insufficient chips' });
                } else {
                    // const ans = await Payment.findByIdAndUpdate(userId,
                    //     {
                    //         amount: subtractChips(currentUserAmount, challengeAmount)
    
                    //     },
                    //     { new: true }
                    // );
                    const newResult = new Result({
                        user2: {
                            user2,
                            result,
                            screenshots
                        },
                        // user2: {
                        //     user2,
                        //     won: won1,
                        //     screenshots: screenshots1,
                        // },
    
                    });
                    const GameResult = await newResult.save();
                    // console.log("fisrstuser", newResult);
                    // console.log("fisrstuser", newResult.secondUser)
                    if (!GameResult) throw Error('Something went wrong saving the challenge');
                    res.status(200).json({ GameResult});
    
                }
            }
        });
    
    });



    // const AddAmount = function (a, b) {
    //     return a + b;
    // }
    // app.put('/api/buychips/:id', async (req, res) => {

    //     const id = req.params.id;

    //     const status = "Accepted";
    //     const product = await Payment.findById({ _id: id })
    //     // const existingStatus = product.status;

    //     let amount = product.amount
    //     // console.log("amount", product)
    //     // await Payment.findByIdAndUpdate(id,
    //     //     {
    //     //         amount
    //     //     },
    //     //     { new: true }
    //     // );
    //     let chips = await Payment.findOne({ paytm_no: product.paytm_no });
    //     let existAmount = chips.amount;
    //     // console.log("existAmount", chips)
    //     const chipsId = chips._id
    //     if (chips.status === 'Accepted') {
    //         const result = await Payment.findByIdAndUpdate(chipsId,
    //             {
    //                 amount: AddAmount(existAmount, amount)
    //             },
    //             { new: true }
    //         );
    //         res.send(result);
    //     } else if (chips.status === 'pending') {
    //         const result = await Payment.findByIdAndUpdate(chipsId,
    //             {
    //                 status,
    //                 amount: amount
    //             },
    //             { new: true }
    //         );
    //         res.send(result);
    //     }
    // });

    // app.delete('/api/buychips/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const product = await Payment.findById({ _id: id })
    //     if (product) {
    //         await Payment.deleteOne({ _id: id });
    //         res.status(200).send({ message: 'request removed' });
    //     } else {
    //         res.status(400).send({ message: "no request" })
    //     }
    // });

    // app.get('/api/buychips/totalchips', auth, async (req, res) => {

    //     jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    //         if (err) {
    //             res.sendStatus(403);
    //         } else {
    //             try {
    //                 let currentUserAmount = 0
    //                 // const chips = await Payment.findOne({paytm_no:{eq:currentUserNumber}});
    //                 const chips = await Payment.findOne({ paytm_no: authData.user.ph }
    //                 );

    //                 console.log("chips", chips.amount);
    //                 if (!chips) {
    //                     res.json(currentUserAmount)
    //                 }
    //                 if (chips.status === "Accepted") {
    //                     currentUserAmount = chips.amount;

    //                     // const currentUserAmount = chips.amount;

    //                     console.log("currentUserAmount", currentUserAmount);
    //                     res.status(200).json(currentUserAmount);
    //                 } else if (chips.status === "pending") {
    //                     res.json(currentUserAmount)
    //                 }
    //             } catch (e) {
    //                 res.status(400).json({ msg: e.message });
    //             }
    //         }
    //     });
    // });

    // app.get('/api/buychips/all', async (req, res) => {
    //     try {
    //         // console.log('auth',auth)
    //         const query = await Payment.find();
    //         if (!query) throw Error('No queries');

    //         res.status(200).json(query);
    //     } catch (e) {
    //         res.status(400).json({ msg: e.message });
    //     }
    // });
}