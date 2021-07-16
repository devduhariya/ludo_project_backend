const { Schema, model } = require('mongoose');
// const ObjectID = require('mongodb').ObjectID;
const SellChipsSchema = new Schema({
    paytm_no: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});
const SellChips = model('SellChips', SellChipsSchema);
module.exports = SellChips;