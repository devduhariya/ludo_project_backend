const { Schema, model } = require('mongoose');
// const ObjectID = require('mongodb').ObjectID;
const paymentSchema = new Schema({
   paytm_no: {
      type: Number,
      required: true
   },
   txn_ID: {
      type: String,
      required: true
   },
   amount: {
      type: Number,
      required: true
   },
   chips: {
      type: Number
   },
   addedDate: {
      type: Date, default: Date.now
   },
   status: {
      type: String
   },
});
const Payment = model('Payment', paymentSchema);
module.exports = Payment;










