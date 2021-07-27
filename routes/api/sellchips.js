// const { Router } = require('express');
//import config from '../../config';
const jwt  =require('jsonwebtoken');
//Support Model
var Router = require('router')
var router = Router()
const SellChips = require('../../models/SellChips');
const auth = require('../../middleware/auth');
const Payment = require('../../models/Payment');
// const router = Router();
const JWT_SECRET   = "secret";
module.exports =(app)=>{
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
const AddAmount = function (a, b) {
    return a + b;
}

const subtractChips = function (a, b) {
    return a - b;
}

app.post('/api/sellChips', auth, async (req, res) => {
    const { paytm_no, amount } = req.body;
    // Simple validation
    if (!paytm_no || !amount) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    // console.log("existingNumber",existingNumber);
    // res.status(200).json({ existingNumber });
    
    
    jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
        const existingNumber  = await Payment.findOne({paytm_no:paytm_no});
        const chipsId = existingNumber._id
        const existAmount = existingNumber.amount
        // const id = authData.user._id
        const currentUser  = await Payment.findOne({paytm_no:authData.user.ph});
        const currentUserId = currentUser._id
        const currentUserAmount = currentUser.amount

        // console.log("id",id);
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                const newSellChips = new SellChips({
                    paytm_no,
                    amount
                });
                const sellChips = await newSellChips.save();
                if (!sellChips) throw Error('Something went wrong saving the challenge');

                const result1 = await Payment.findByIdAndUpdate(chipsId,
                    {
                        amount: AddAmount(existAmount, amount)
                    },
                    { new: true }
                );
                const result2 = await Payment.findByIdAndUpdate(currentUserId,
                    {
                        amount: subtractChips(currentUserAmount, amount)
                    },
                    { new: true }
                );
                res.status(200).json({ sellChips,result1,result2});
            } catch (e) {
                res.status(400).json({ msg: e.message });
            }
        }
    });
});

// const subtractChips = function (a, b) {
//     return a - b;
// }
// app.put('/api/buychips/:id, async (req, res) => {
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