const { Router } = require('express');
//import config from '../../config';
const jwt = require('jsonwebtoken');
//Support Model
const Challenge = require('../../models/SetChallenge');
const auth = require('../../middleware/auth');
const Payment =require('../../models/Payment');
const Result = require('../../models/GameResult');

const router = Router();
const  JWT_SECRET  = process.env.JWT_SECRET;

router.get('/', auth, async (req, res) => {

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

router.get('/all', auth, async (req, res) => {

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

router.post('/', auth, async (req, res) => {
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
            // try {
            if (totalchips > amount) {
                const newChallenge = new Challenge({
                    name,
                    amount,
                    roomCode,
                    paytm_no
                });
                const challenge = await newChallenge.save();
                if (!challenge) throw Error('Something went wrong saving the challenge');
                res.status(200).json({ challenge });
            } else {
                res.status(400).json({ message: "you don't have sufficient chips" })
            }
        }
    });
});

router.get('/result', async (req, res) => {
    try {
        const query = await Result.find();
        if (!query) throw Error('No queries');

        res.status(200).json(query);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


const subtractChips = function (a, b) {
    return a - b;
}

const Totalchips = function (a) {
    return a + a;
}
router.post('/:id', auth, async (req, res) => {
    const id = req.params.id;

    //  const {screenshots} = req.body
    // const {screenshots,won} = req.body;
    // const {secondUser:[won,lost,screenshots]} = req.body;
    jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
        const product = await Challenge.findById({ _id: id })
        // let winningAmount = null
        const challengeAmount = product.amount
        let user1 = product.paytm_no
        console.log("user1", product)
        // const { currentUserNumber } = authData.user.ph;
        const result = await Payment.findOne({ paytm_no: authData.user.ph })
        const userId = result._id;
        let user2 = result.paytm_no
        const currentUserAmount = result.amount
        // const  {won} = req.body;
        const { won, screenshots } = req.body
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
                        amount: subtractChips(currentUserAmount, challengeAmount),
                        wiiningAmount:Totalchips(challengeAmount)

                    },
                    { new: true }
                );
                const newResult = new Result({
                    user2: {
                        user2,
                        won,
                        screenshots
                    },
                    // user2: {
                    //     user2,
                    //     won: won1,
                    //     screenshots: screenshots1,
                    // },

                    
                });
                const GameResult = await newResult.save();
                console.log("fisrstuser", newResult);
                // console.log("fisrstuser", newResult.secondUser)
                if (!GameResult) throw Error('Something went wrong saving the challenge');
                res.status(200).json({ GameResult });

            }
        }
    });

});


const AddAmount = function (a, b) {
    return a + b;
}
router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
        let user1 = authData.user.ph
        const {won,screenshots} = req.body;
        const product = await Result.findById({ _id: id })
        if (err) {
            res.sendStatus(403);
        }
        else {
            const ans = await Result.findByIdAndUpdate(id,
                {
                    user1: {
                        user1,
                        won,
                        screenshots
                    },
                },
                { new: true }
            );
            res.status(200).json({ ans });
        }
    });

});
module.exports = router;