const { Schema, model } = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const SetChallenge = new Schema({
    name: {
        type: String
    },
    amount: {
        type: Number
    },
    roomCode:{
        type :Number
    },
    paytm_no:{
        type :Number
    }
});
const Challenge = model('Challenge', SetChallenge);
module.exports = Challenge;