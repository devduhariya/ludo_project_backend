import { Schema, model } from 'mongoose';
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
export default Challenge;