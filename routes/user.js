//so this file is created to house all of our user routes
var express = require("express");
var router = express.Router();
var csrf = require("csurf"); //import protection to hashed password
var csrfProtection = csrf(); //initiate it here like a middleware
router.use(csrfProtection);
var passport = require("passport");
require("../config/passport");

var Order = require("../models/order");


router.get("/profile", isLoggedIn, function(req, res, next) {
  Order.find({user: req.user}, function(err, orders){
    if(err){
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order){
      //generate new cart for each looped values
      cart = new cart(order.cart);
      order.items = cart.generateArray();
    })
    res.render("user/profile", {orders: orders});
  });
});

router.get("/logout", isLoggedIn, function(req, res, next) {
  req.logout(); //also a method used by passport
  res.redirect("/user/logout");
});

//GROUPING BY MIDDLEWARE: Having this notloggedIn function here before all the other routes
router.use("/", notLoggedIn, function(req, res, next) {
  next();
});

//====== signup route GET and POST ======
//create our signup route (get)
router.get("/signup", function(req, res, next) {
  //using flash messages after validation is complete
  var throwMessage = req.flash("error");
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages: throwMessage,
    hasErrors: throwMessage.length > 0
  }); // this is being handled by the csurf package
});
//passport doesnt know the authenticate method because its not imported in this file
//you can import passport here, OR you can require config/passport in the app.js
router.post(
  "/signup",
  passport.authenticate("local-signup", {
    failureRedirect: "/user/signup",
    failureFlash: true
  }),
  function(req, res, next) {
    //if successful log in
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
);

//====== signin route GET and POST ======
//create our signin route (get)
router.get("/signin", function(req, res, next) {
  //using flash messages after validation is complete
  var throwMessage = req.flash("error");
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages: throwMessage,
    hasErrors: throwMessage.length > 0
  }); // this is being handled by the csurf package
});
//passport doesnt know the authenticate method because its not imported in this file
//you can import passport here, OR you can require config/passport in the app.js
router.post(
  "/signin",
  passport.authenticate("local-signin", {
    failureRedirect: "/user/signup", //if cant signin, reroute here.
    failureFlash: true
  }),
  function(req, res, next) {
    //if successful log in
    if (req.session.oldUrl) {
      res.redirect(req.session.oldUrl);
      req.session.oldUrl = null;
    } else {
      res.redirect("/user/profile");
    }
  }
);

module.exports = router;

//PROTECT ROUTES
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    //passport method that checks session
    return next(); //which means continue
  }
  res.redirect("/");
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    //passport method that checks session
    return next(); //which means continue
  }
  req.session.oldUrl = req.url; //storing the old URL, when user sign-in
  res.redirect("/");
}
