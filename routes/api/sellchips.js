// const { Router } = require('express');
//import config from '../../config';
const jwt = require('jsonwebtoken');
//Support Model
var Router = require('router')
var router = Router()
const SellChips = require('../../models/SellChips');
const auth = require('../../middleware/auth');
const Payment = require('../../models/Payment');// import User from '../../models/User';
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

    // router.get('/remaing',auth, async (req, res) => {
    //     // const id = req.params.id;
    //     jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    //         if (err) {
    //             res.sendStatus(403);
    //         } else {
    //             try {
    //                 const id = authData.user._id;
    //                 console.log("id",id);
    //                 const chips = await Payment.findById({id});
    //                 if (!chips) throw Error('No queries');
    //                 res.status(200).json(chips);
    //                 res.status(201).json(chips.amount);
    //             } catch (e) {
    //                 res.status(400).json({ msg: e.message });
    //             }
    //         }
    //     });
    // });

    const addChips = function (a, b) {
        return a + b;
    }
    const subtractChips = function (a, b) {
        return a - b;
    }
    app.post('/api/sellchips', auth, async (req, res) => {
        const { paytm_no, amount } = req.body;
        // Simple validation
        if (!paytm_no || !amount) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        const existingNumber = await Payment.find({ paytm_no });
        const userId = existingNumber._id
        const existAmount = existingNumber.amount;
        res.status(200).json({ existingNumber });
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            
            const currentUser = await Payment.findOne({ paytm_no: authData.user.ph });
            const id = currentUser._id
            const currentUserAmount = currentUser.amount;
            if (err) {
                res.sendStatus(403);
            } else {
                try {
                    const newSellChips = new SellChips({
                        paytm_no,
                        amount
                    });

                    const result1 = await Payment.findByIdAndUpdate(id,
                        {
                            amount: subtractChips(currentUserAmount, amount),
                        },
                        { new: true }
                    );

                    const result2 = await Payment.findByIdAndUpdate(userId,
                        {
                            amount: addChips(existAmount, amount),
                        },
                        { new: true }
                    );
                    // res.send(result1,result2);

                    const sellChips = await newSellChips.save();
                    if (!sellChips) throw Error('Something went wrong saving the challenge');
                    res.status(200).json({ sellChips,result1,result2 });
                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }
            }
        });
    });


    app.get('/api/sellchips', async (req, res) => {
        try {
          const sellChips = await SellChips.find();
          if (!sellChips) throw Error('No queries');
      
          res.status(200).json(sellChips);
        } catch (e) {
          res.status(400).json({ msg: e.message });
        }
      });


    // const subtractChips = function (a, b) {
    //     return a - b;
    // }
    // router.put('/sellchips', auth, async (req, res) => {
    //     const { paytm_no, amount } = req.body;
    //     // const status = "Accepted";
    //     // const findNumber = await Payment.findOne({ paytm_no})
    //     // const existAmount = findNumber.amount;
    //     // console.log(findNumber.amount);
    //     // if(amount <= existAmount){
    //     const result = await Payment.findByIdAndUpdate(findNumber,
    //         {
    //             amount: subtractChips(existAmount, amount),
    //         },
    //         { new: true }
    //     );
    //     res.send(result);
    // }else{
    //     res.send({message:'You do not have sufficient amount' })
    // }

    //     jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    //         console.log(authData.user._id);
    //         //const number = req.body.paytm_no
    //         const id = authData.user._id;

    //         // const currentUser = number.name;
    //         //const currentAmount = number.user.amount;
    //         // const userNumber = currentUser.paytm_no;
    //         const findNumber = await Payment.findOne({
    //             userId: { $eq: id }
    //         })
    //         console.log("currentUser", findNumber);
    //         if (err) {
    //             res.sendStatus(403);
    //         } else {
    //             console.log("paytm", paytm_no);
    //             const findNumber = await Payment.findOne({ paytm_no })
    //             const existAmount = findNumber.amount;
    //             // console.log(findNumber.amount);
    //             if (amount <= existAmount) {
    //                 const result = await Payment.findByIdAndUpdate(findNumber,
    //                     {
    //                         amount: subtractChips(existAmount, amount),
    //                     },
    //                     { new: true }
    //                 );
    //                 res.send(result);
    //             } else {
    //                 res.send({ message: 'You do not have sufficient amount or this paytm_no not register with us!' })
    //             }
    //         }
    //     });
    // });

}