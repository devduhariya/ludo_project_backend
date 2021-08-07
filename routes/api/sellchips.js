
require('dotenv').config()
const jwt = require('jsonwebtoken');
const Payment = require('../../models/Payment');
const auth = require('../../middleware/auth');
const SellChips = require('../../models/SellChips')
const https = require('https');

const JWT_SECRET = "secret";
module.exports = (app) => {
    app.get('/api/sellChips', auth, async (req, res) => {
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const Role = authData.user.role;
            const allTranctions = await SellChips.find();

            let allTranctionSatus = null;
            let tranctionsWithStatusPending = [];

            if (err) {
                res.sendStatus(403);
            }
            else {
                if (Role === 'admin') {
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
                }
                else {
                    res.sendStatus(401);
                }
            }
        });
    });

    const subtractChips = function (a, b) {
        return a - b;
    }


    app.post('/api/sellChips', auth, async (req, res) => {
        const { paytm_no, amount } = req.body;
        // Simple validation
        if (!paytm_no || !amount) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        console.log("reeq body", req.body)
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                try {
                    const currentUser = await Payment.findOne({ paytm_no: authData.user.ph });
                    const currentUserId = currentUser._id
                    const currentUserAmount = currentUser.amount
                    if(currentUserAmount>=amount){
                        let res1 = await Payment.findByIdAndUpdate(currentUserId,
                            {
                                amount: subtractChips(currentUserAmount, amount)
                            },
                            { new: true }
                        );
                        const newPayment = new SellChips({
                            paytm_no,
                            amount
                        });
                        newPayment.status = "pending"
                        const payment = await newPayment.save();
                        console.log("New Paymewnt", newPayment)
                        if (!payment) throw Error('error while saving payment');
                        res.status(200).json({ payment, res1 });
                    }else{
                        res.json({message:"insufficient chips"})
                    }
                   
                   
                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }
            }
        });
    });
    const AddAmount = function (a, b) {
        return a + b;
    }
    app.put('/api/sellChips/:id', async (req, res) => {

        const id = req.params.id;

        const Status = "Accepted";
        const product = await SellChips.findById({ _id: id })

        let amount = product.amount
        let chips = await Payment.findOne({ paytm_no: product.paytm_no });
        const chipsId = chips._id
        // if (product.status === 'Accepted') {
        //     const result1 = await Payment.findByIdAndUpdate(chipsId,
        //         {
        //             amount: AddAmount(existAmount, amount)
        //         },
        //         { new: true }
        //     );
        //     res.send(result1);
        // } else 
        if (product.status === 'pending') {
            let existAmount = chips.amount;
            await SellChips.findByIdAndUpdate(id,
                {
                    status: Status
                },
                { new: true }
            );
            // res.send(result2);

            const result1 = await Payment.findByIdAndUpdate(chipsId,
                {
                    amount: AddAmount(existAmount, amount)
                },
                { new: true }
            );
            res.send(result1);

        } else {
            res.sendStatus(403);
        }
    });
    app.delete('/api/sellChips/:id', async (req, res) => {
        const id = req.params.id;
        const product = await SellChips.findById({ _id: id })
        if (product) {
            await SellChips.deleteOne({ _id: id });
            res.status(200).send({ message: 'request removed' });
        } else {
            res.status(400).send({ message: "no request" })
        }
    });

    // app.get('/api/sellChips/totalchips', auth, async (req, res) => {

    //     jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    //         if (err) {
    //             res.sendStatus(403);
    //         } else {
    //             try {
    //                 let currentUserAmount = 0
    //                 const chips = await SellChips.findOne({ paytm_no: authData.user.ph }
    //                 );

    //                 console.log("chips", chips.amount);
    //                 if (!chips) {
    //                     res.json(currentUserAmount)
    //                 }
    //                 if (chips.status === "Accepted") {
    //                     currentUserAmount = chips.amount;

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

    // app.get('/api/sellChips/all', async (req, res) => {
    //     try {
    //         const query = await SellChips.find();
    //         if (!query) throw Error('No queries');

    //         res.status(200).json(query);
    //     } catch (e) {
    //         res.status(400).json({ msg: e.message });
    //     }
    // });
}





















// // const { Router } = require('express');
// //import config from '../../config';
// const jwt = require('jsonwebtoken');
// //Support Model
// var Router = require('router')
// var router = Router()
// const SellChips = require('../../models/SellChips');
// const auth = require('../../middleware/auth');
// const Payment = require('../../models/Payment');
// const Result = require('../../models/GameResult');
// // const router = Router();
// const JWT_SECRET = "secret";
// module.exports = (app) => {
//     app.get('/api/sellchips', auth, async (req, res) => {

//         jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
//             if (err) {
//                 res.sendStatus(403);
//             } else {
//                 try {
//                     const chips = await SellChips.find();
//                     if (!chips) throw Error('No queries');
//                     res.status(200).json(chips);
//                 } catch (e) {
//                     res.status(400).json({ msg: e.message });
//                 }
//             }
//         });
//     });










//     // const AddAmount = function (a, b) {
//     //     return a + b;
//     // }

//     const subtractChips = function (a, b) {
//         return a - b;
//     }

//     app.post('/api/sellChips', auth, async (req, res) => {
//         const { paytm_no, amount } = req.body;
//         // Simple validation
//         if (!paytm_no || !amount) {
//             return res.status(400).json({ msg: 'Please enter all fields' });
//         }
//         // console.log("existingNumber",existingNumber);
//         // res.status(200).json({ existingNumber });


//         jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
//             // const existingNumber = await Payment.findOne({ paytm_no: paytm_no });
//             // const chipsId = existingNumber._id
//             // console.log("existingNumber", chipsId)
//             // const existAmount = existingNumber.amount
//             // const id = authData.user._id
//             const currentUser = await Payment.findOne({ paytm_no: authData.user.ph });
//             const currentUserId = currentUser._id
//             const currentUserAmount = currentUser.amount
//             // let AddAmount = parseInt(existAmount + amount)
//             console.log("currentUser", AddAmount);
//             if (err) {
//                 res.sendStatus(403);
//             } else {
//                 try {


//                     let res1 = await Payment.findByIdAndUpdate(currentUserId,
//                         {
//                             amount: subtractChips(currentUserAmount, amount)
//                         },
//                         { new: true }
//                     );
//                     // let res2 = await Payment.findByIdAndUpdate(chipsId,
//                     //     {
//                     //         amount: AddAmount
//                     //     },
//                     //     { new: true }
//                     // );
//                     const newSellChips = new SellChips({
//                         paytm_no,
//                         amount
//                     });
//                     const sellChips = await newSellChips.save();
//                     if (!sellChips) throw Error('Something went wrong saving the challenge');
//                     res.status(200).json({ sellChips, res1 });
//                 } catch (e) {
//                     res.status(400).json({ msg: e.message });
//                 }
//             }
//         });
//     });

//     const AddAmount = function (a, b) {
//         return a + b;
//     }
//     app.put('/api/sellChips/:id', async (req, res) => {

//         const id = req.params.id;

//         // const Status = "Accepted";
//         const product = await SellChips.findById({ _id: id })
//         console.log("product",product)
//         let amount = product.amount
//         let chips = await Payment.findOne({ paytm_no: product.paytm_no });
//         let existAmount = chips.amount;
//         const chipsId = chips._id
//         // if (product.status === 'Accepted') {
//         //     const result1 = await Payment.findByIdAndUpdate(chipsId,
//         //         {
//         //             amount: AddAmount(existAmount, amount)
//         //         },
//         //         { new: true }
//         //     );
//         //     res.send(result1);
//         // } else 
//         // if (product.status === 'pending') {
//         //     await Payment.findByIdAndUpdate(id,
//         //         {
//         //             status: Status
//         //         },
//         //         { new: true }
//         //     );
//             // res.send(result2);

//             const result1 = await Payment.findByIdAndUpdate(chipsId,
//                 {
//                     amount: AddAmount(existAmount, amount)
//                 },
//                 { new: true }
//             );
//             res.send(result1);

//         // }
//     });

// }