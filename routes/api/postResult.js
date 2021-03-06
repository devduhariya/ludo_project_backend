
require('dotenv').config()
const jwt = require('jsonwebtoken');
const https = require('https');
const Payment = require('../../models/Payment');
const auth = require('../../middleware/auth')
const Result = require('../../models/GameResult')
const Challenge = require('../../models/SetChallenge');
// const { findOne } = require('../../models/Payment');
const multer = require('multer')
const JWT_SECRET = "secret";
const DIR = './public/';
// const uuidv4 = require('uuid');
module.exports = (app) => {


    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, DIR);
        },
        filename: (req, file, cb) => {
            const fileName = file.originalname.toLowerCase().split(' ').join('-');
            cb(null, Date.now() + '-' + fileName)
        }
    });

    var upload = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        }
    });

    // User model
    // let User = require('../models/User');

    // app.post('/upload/:id', upload.single('screenshots'), (req, res, next) => {
    //     const url = req.protocol + '://' + req.get('host')
    //     const newResult = new Result({
    //         screenshots: url + '/public/' + req.file.filename
    //     });
    //     newResult.save().then(result => {
    //         res.status(201).json({
    //             message: "User registered successfully!",
    //             userCreated: {
    //                 _id: result._id,
    //                 screenshots: result.screenshots
    //             }
    //         })
    //     }).catch(err => {
    //         console.log(err),
    //             res.status(500).json({
    //                 error: err
    //             });
    //     })
    // })

    // app.get("/upload", (req, res, next) => {
    //     Result.find().then(data => {
    //         res.status(200).json({
    //             message: "User list retrieved successfully!",
    //             users: data
    //         });
    //     });
    // });










    const subtractChips = function (a, b) {
        return a - b;
    }
    const TotalAmount = (a) => a + a

    app.post('/api/result/:id', auth, async (req, res) => {
        const id = req.params.id;
        // const url = req.protocol + '://' + req.get('host')
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const product = await Challenge.findById({ _id: id })

            console.log("user1", product)
            const challengeAmount = product.amount

            const ans = await Payment.findOne({ paytm_no: authData.user.ph })
            // const userId = ans._id;
            let user2 = ans.paytm_no
            // const currentUserAmount = ans.amount
            const { won } = req.body

            if (err) {
                res.sendStatus(403);
            }
            else {
                // if (challengeAmount > currentUserAmount) {
                //     res.status(400).json({ message: 'insufficient chips' });
                // } else {
                // const ans = await Payment.findByIdAndUpdate(userId,
                //     {
                //         amount: subtractChips(currentUserAmount, challengeAmount)

                //     },
                //     { new: true }
                // );
                const newResult = new Result({
                    user2: {
                        user2,
                        won,
                        // screenshots: url + '/public/' + req.file.filename
                    },

                    challengeAmount: TotalAmount(challengeAmount)

                });
                newResult.ChallengeId = id
                console.log(newResult.user2);
                const GameResult = await newResult.save();
                if (!GameResult) throw Error('Something went wrong saving the challenge');
                res.status(200).json(newResult);

                // }
            }
        });

    });
    const addWiningAmount = (a, b) => a + b
    app.put('/api/result/:id', auth, async (req, res) => {

        const id = req.params.id;
        // const url = req.protocol + '://' + req.get('host');
        const { won } = req.body


        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const product = await Result.findById({ _id: id })
            const user1 = authData.user.ph
            console.log("product", product)
            const result1 = await Result.findByIdAndUpdate(id,
                {
                    user1: {
                        user1,
                        won,
                        // screenshots: url + '/public/' + req.file.filename
                    },
                },
                { new: true }
            );
            res.send(result1);
            // }

            setTimeout(async()=>{
                const chips = await Result.findById(id);
                console.log('chips', chips)
                const user1Number = chips.user1[0].user1
                const user2Number = chips.user2[0].user2
                const winingAmount = chips.challengeAmount;
                const user1Status = chips.user1[0].won
                // const user1Status = chips.user1[0].lost
                const user2Status = chips.user2[0].won
                // const user2Status = chips.user2[0].lost
                if (user1Status == true && user2Status == false) {
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
                else if (user2Status == true && user1Status == false) {
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
                else if (user2Status == true && user1Status == true || user2Status == false && user1Status == false) {
                    const Admin = 7357525272
                    let chips = await Payment.findOne({ paytm_no: Admin });
                    let AdminId = chips._id
                    const adminChips = chips.amount
                    const addChipsToAdmin = await Payment.findByIdAndUpdate(AdminId,
                        {
                            amount: addWiningAmount(adminChips, winingAmount)

                        },
                        { new: true }
                    );
                    res.json(addChipsToAdmin)
                }

            }, 500);

        });

    });


    app.get('/api/results/:id', auth, async (req, res) => {
        const id = req.params.id;
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {

            try {
                const query = await Result.find({ ChallengeId: id });
                if (!query) throw Error('No queries');

                res.status(200).json(query);
            } catch (e) {
                res.status(400).json({ msg: e.message });
            }
        });
    });

    app.get('/api/allresults', auth, async (req, res) => {
        // const id = req.params.id;
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {

            try {
                const query = await Result.find();
                if (!query) throw Error('No queries');

                res.status(200).json(query);
            } catch (e) {
                res.status(400).json({ msg: e.message });
            }
        });
    });









    // const subtractChips = function (a, b) {
    //     return a - b;
    // }
    // const TotalAmount = (a) => a + a

    // app.post('/api/result/:id', auth, async (req, res) => {
    //     const id = req.params.id;
    //     // const url = req.protocol + '://' + req.get('host')
    //     jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    //         const product = await Challenge.findById({ _id: id })

    //         console.log("user1", product)
    //         const challengeAmount = product.amount

    //         const ans = await Payment.findOne({ paytm_no: authData.user.ph })
    //         const userId = ans._id;
    //         let user2 = ans.paytm_no
    //         const currentUserAmount = ans.amount
    //         const { won,lost} = req.body

    //         if (err) {
    //             res.sendStatus(403);
    //         }
    //         else {
    //             if (challengeAmount > currentUserAmount) {
    //                 res.status(400).json({ message: 'insufficient chips' });
    //             } else {
    //                 const ans = await Payment.findByIdAndUpdate(userId,
    //                     {
    //                         amount: subtractChips(currentUserAmount, challengeAmount)

    //                     },
    //                     { new: true }
    //                 );
    //                 const newResult = new Result({
    //                     user2: {
    //                         user2,
    //                         won,
    //                         lost,
    //                         // screenshots: url + '/public/' + req.file.filename
    //                     },

    //                     challengeAmount: TotalAmount(challengeAmount)

    //                 });
    //                 console.log(newResult);
    //                 const GameResult = await newResult.save();
    //                 if (!GameResult) throw Error('Something went wrong saving the challenge');
    //                 res.status(200).json({ GameResult });

    //             }
    //         }
    //     });

    // });

    // app.put('/api/result/:id', auth, async (req, res) => {

    //     const id = req.params.id;
    //     // const url = req.protocol + '://' + req.get('host');
    //     const { won,lost} = req.body


    //     jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    //         const product = await Result.findById({ _id: id })
    //         const user1 = authData.user.ph
    //         console.log("product", product.user1)
    //         const result1 = await Result.findByIdAndUpdate(id,
    //             {
    //                 user1: {
    //                     user1,
    //                     won,
    //                     lost,
    //                     // screenshots: url + '/public/' + req.file.filename
    //                 },
    //             },
    //             { new: true }
    //         );
    //         res.send(result1);
    //         // }
    //     });

    // });






    // const addWiningAmount = (a, b) => a + b

    // app.get('/api/result/winner/:id', auth, async (req, res) => {
    //     const id = req.params.id;
    //     jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
    //         if (err) {
    //             res.sendStatus(403);
    //         } else {
    //             try {

    //                 const chips = await Result.findById(id);
    //                 console.log('chips',chips)
    //                 const user1Number = chips.user1[0].user1
    //                 const user2Number = chips.user2[0].user2
    //                 const winingAmount = chips.challengeAmount;
    //                 const user1Status = chips.user1[0].won
    //                 // const user1Status = chips.user1[0].lost
    //                 const user2Status = chips.user2[0].won
    //                 // const user2Status = chips.user2[0].lost
    //                 if (user1Status ==true && user2Status ==false) {
    //                     const chipsUserHave = await Payment.findOne({ paytm_no: user1Number })
    //                     console.log("chipsUserHave", chipsUserHave)
    //                     const existAmount = chipsUserHave.amount
    //                     const UserOneTotalAmount = await Payment.findOneAndUpdate({ paytm_no: user1Number },
    //                         {
    //                             amount: addWiningAmount(existAmount, winingAmount)
    //                         },
    //                         { new: true }
    //                     );
    //                     res.json(UserOneTotalAmount)
    //                 }
    //                 else if (user2Status == true && user1Status ==false) {
    //                     const chipsUserHave = await Payment.findOne({ paytm_no: user2Number })
    //                     console.log("chipsUserHave", chipsUserHave)
    //                     // const user2Id = chipsUserHave_id
    //                     const existAmount = chipsUserHave.amount
    //                     const UserTwoTotalAmount = await Payment.findOneAndUpdate({ paytm_no: user2Number },
    //                         {
    //                             amount: addWiningAmount(existAmount, winingAmount)
    //                         },
    //                         { new: true }
    //                     );
    //                     // console.log("UserTwoTotalAmount", UserTwoTotalAmount)
    //                     res.json(UserTwoTotalAmount)
    //                 }
    //                 else if(user2Status ==true && user1Status ==true || user2Status == false && user1Status == false){
    //                     const Admin = 7357525272
    //                     let chips = await Payment.findOne({ paytm_no: Admin });
    //                     let AdminId = chips._id
    //                     const adminChips = chips.amount
    //                     const addChipsToAdmin = await Payment.findByIdAndUpdate(AdminId,
    //                         {
    //                             amount: addWiningAmount(adminChips, winingAmount)

    //                         },
    //                         { new: true }
    //                     );
    //                     res.json(addChipsToAdmin)
    //                 }


    //             } catch (e) {
    //                 res.status(400).json({ msg: e.message });
    //             }
    //         }
    //     });
    // });

}