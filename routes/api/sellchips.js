require('dotenv').config()
const jwt = require('jsonwebtoken');
const Payment = require('../../models/Payment');
const auth = require('../../middleware/auth');
const https = require('https');

const JWT_SECRET   = "secret";
module.exports = (app) => {
    app.get('/api/sellchips', auth, async (req, res) => {
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            const Role = authData.user.role;
            const allTranctions = await Payment.find();

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

    app.post('/api/sellchips', auth, async (req, res) => {
        const { paytm_no, amount } = req.body;
        // Simple validation
        if (!paytm_no || !amount) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                try {
                    const newPayment = new Payment({
                        paytm_no,
                        amount
                    });
                    newPayment.status = "pending"
                    const payment = await newPayment.save();
                    if (!payment) throw Error('error while saving payment');
                    res.status(200).json({ payment });
                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }
            }
        });
    });
    const SubtractAmount = function (a, b) {
        return a-b;
    }
    app.put('/api/sellchips/:id', async (req, res) => {

        const id = req.params.id;

        const status = "Accepted";
        const product = await Payment.findById({ _id: id })

        let amount = product.amount
        let chips = await Payment.findOne({ paytm_no: product.paytm_no });
        let existAmount = chips.amount;
        const chipsId = chips._id
        if (chips.status === 'Accepted') {
            const result = await Payment.findByIdAndUpdate(chipsId,
                {
                    amount: SubtractAmount(existAmount, amount)
                },
                { new: true }
            );
            res.send(result);
        } else if (chips.status === 'pending') {
            const result = await Payment.findByIdAndUpdate(chipsId,
                {
                    status,
                    amount: amount
                },
                { new: true }
            );
            res.send(result);
        }
    });

    app.delete('/api/sellchips/:id', async (req, res) => {
        const id = req.params.id;
        const product = await Payment.findById({ _id: id })
        if (product) {
            await Payment.deleteOne({ _id: id });
            res.status(200).send({ message: 'request removed' });
        } else {
            res.status(400).send({ message: "no request" })
        }
    });

    app.get('/api/sellchips/totalchips', auth, async (req, res) => {

        jwt.verify(req.token, JWT_SECRET, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                try {
                    let currentUserAmount = 0
                    const chips = await Payment.findOne({ paytm_no: authData.user.ph }
                    );

                    console.log("chips", chips.amount);
                    if (!chips) {
                        res.json(currentUserAmount)
                    }
                    if (chips.status === "Accepted") {
                        currentUserAmount = chips.amount;

                        console.log("currentUserAmount", currentUserAmount);
                        res.status(200).json(currentUserAmount);
                    } else if (chips.status === "pending") {
                        res.json(currentUserAmount)
                    }
                } catch (e) {
                    res.status(400).json({ msg: e.message });
                }
            }
        });
    });

    app.get('/api/sellchips/all', async (req, res) => {
        try {
            const query = await Payment.find();
            if (!query) throw Error('No queries');

            res.status(200).json(query);
        } catch (e) {
            res.status(400).json({ msg: e.message });
        }
    });
}