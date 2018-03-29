var express = require('express');
var router = express.Router();
var csrf = require('csurf'); //import protection to hashed password
var csrfProtection = csrf(); //initiate it here like a middleware
router.use(csrfProtection);
var passport = require('passport');
// var passport = require("../config/passport");

var Product = require("../models/product");
/* GET home page. */
router.get('/', function(req, res, next) {
  //were referencing model here and using `find()` method to query the database
  Product.find(function(err, prod){
   if (err) {
     //check1
     return done(err);
   }
    var productChunks = []; //were gonna render this array below, in our HOOK, as a key in our hbs page
    var chunksPerRow = 3;//just to say, we want each row to contain three cards/container
    //here we loop through prod
    for (var i = 0; i < prod.length; i += chunksPerRow) {// i is incremented by three
      productChunks.push(prod.slice(i, i + chunksPerRow)) // logic for keeping each row at three chunks
    }
    res.render("shop/index", {
      title: "Shopping Cart",//hook
      products: productChunks//hook
    });
  });
});
//create our signup route (get)
router.get('/user/signup', function(req, res, next){
  //using flash messages after validation is complete
  var throwMessage = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: throwMessage, hasErrors: throwMessage.length>0}) // this is being handled by the csurf package
})
//passport doesnt know the authenticate method because its not imported in this file
//you can import passport here, OR you can require config/passport in the app.js
router.post('/user/signup', passport.authenticate('local-signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}))

router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
})
module.exports = router;
