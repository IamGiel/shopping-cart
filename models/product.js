//mongoose uses schemas
//we will define the products model here for the data
//this is how we will define how we interact with the data


//1. import mongoose here as well
//2. a variable that uses the mongoose object
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//this var creates a new schema; This the name of the schema we need to export below.
var schema = new Schema({
  //here we pass an argument which is a javascript object that defines that schema
  //look back your mock webpage and decide as to what you want in your schema

  imagePath: { type: String, required: true },
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Price: { type: Number, required: true }
});

module.exports = mongoose.model('Product', schema);//this line you name the model "Product" and the schema where this model is based on (set up above)

