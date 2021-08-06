const { Schema, model } = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const ResultSchema = new Schema({
    user1: [
        {
            user1: {
                type: String,
            },

            won: {
                type: Boolean
            },
            lost: {
                type: Boolean,
            },
            screenshots: {
                type: String
            },

        }
    ],
    user2: [
        {
            user2: {
                type: String,
            },
            won: {
                type: Boolean
            },
            lost: {
                type: Boolean,
            },
            screenshots: {
                type: String
            },
        }
    ],


    challengeAmount: {
        type: Number
    }
});
const Result = model('Result', ResultSchema);
module.exports = Result;