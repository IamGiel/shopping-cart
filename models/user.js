//1. import mongoose here as well
//2. a variable that uses the mongoose object
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');//we will use this to hash password

//define model
var userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
})
//here we use a method to encrypt the password (encryptPassword can be renamed to your liking)
userSchema.methods.encryptPassword = function(password){
  //this line says, use bcrypt, hash password synchronously.  Pass-in password and apply 5 rounds of bcrypt salt generator
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
//below we will compare if both hashed password is a match! (validPassword can be renamed to your liking)
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);//`this.password` refers the current user input for the password field
}
module.exports = mongoose.model("User", userSchema);
