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
    },
    paytm_no:{
        type :Number
    },
    challengeAmount:{
        type:Number
    },
    status:{
        type:String
    }
});
const Challenge = model('Challenge', SetChallenge);
module.exports = Challenge;