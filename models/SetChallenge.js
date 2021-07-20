const { Schema, model } = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const SetChallenge = new Schema({
    name: {
        type: String
    },
    amount: {
        type: Number,
        required:true
    },
    roomCode:{
        type :Number,
        required: true
    },
    paytm_no:{
        type :Number
    }
});
const Challenge = model('Challenge', SetChallenge);
module.exports = Challenge;