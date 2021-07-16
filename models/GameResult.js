import { Schema, model } from 'mongoose';
const ObjectID = require('mongodb').ObjectID;

// var Comments = new Schema({
//     user1: {
//         type: Number
//     },
//     won: {
//         type: String,
//     },
//     screenshots: {
//         type: String
//     },
// });
// var Comments2 = new Schema({
//     user2: {
//         type: Number
//     },
//     won: {
//         type: String,
//     },
//     screenshots: {
//         type: String
//     },
// });
const ResultSchema = new Schema({
    user1: [
        {
            user1: {
                type: String,
            },

            won: {
                type: String,
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
                type: String,
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
export default Result;