var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },//reference User model as an id - this is creating an id
  cart: { type: Object, required: true },//object stores cart session
  address: { type: String, required: true },
  name: { type: String, required: true },
  paymentId: { type: String, required: true } //able to capture stripe payment id
});

module.exports = mongoose.model("Order", schema);
