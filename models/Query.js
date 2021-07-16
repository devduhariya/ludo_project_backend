const { Schema, model } = require('mongoose');
// const ObjectID = require('mongodb').ObjectID;
const SupportSchema = new Schema({
   whatsapp: {
      type: Number,
      required: true
   },

   paytm: {
      type: Number,
      required: true
   },

   reciver_Paytm: {
      type: Number,
      required: true
   },
   txn_Id: {
      type: String,
      required: true
   },
   amount: {
      type: Number,
      required: true
   },
   message: {
      type: String,
      required: true
   },
   screenshots: {
      type: String,
      required: true
   }
});
const Query = model('Query', SupportSchema);
module.exports = Query;