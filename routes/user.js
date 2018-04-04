//so this file is created to house all of our user routes
var express = require("express");
var router = express.Router();
var csrf = require("csurf"); //import protection to hashed password
var csrfProtection = csrf(); //initiate it here like a middleware
router.use(csrfProtection);
var passport = require("passport");
require("../config/passport");


router.get("/profile", isLoggedIn, function(req, res, next) {
  res.render("user/profile");
});

router.get("/logout", isLoggedIn, function(req, res, next) {
  req.logout(); //also a method used by passport
  res.redirect("/user/logout");
});

//GROUPING BY MIDDLEWARE: Having this notloggedIn function here before all the other routes
router.use("/", notLoggedIn, function(req, res, next){
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
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup",
    failureFlash: true
  })
);

//====== signin route GET and POST ======
//create our signin route (get)
router.get("/signin", function(req, res, next) {
  //using flash messages after validation is complete
  var throwMessage = req.flash("error");
  res.render("user/signin", {
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
    successRedirect: "/user/profile",
    failureRedirect: "/user/signin", //if cant signin, reroute here.
    failureFlash: true
  })
);

module.exports = router;

//PROTECT ROUTES
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){//passport method that checks session
    return next();//which means continue
  }
  res.redirect('/')
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    //passport method that checks session
    return next(); //which means continue
  }
  res.redirect("/");
}