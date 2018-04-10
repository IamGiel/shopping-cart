var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");
// var csrf = require('csurf'); //import protection to hashed password
// var csrfProtection = csrf(); //initiate it here like a middleware
// router.use(csrfProtection);
// var passport = require('passport');

var Product = require("../models/product");
/* GET home page. */
router.get("/", function(req, res, next) {
  successMsg = req.flash('success')[0];
  //were referencing model here and using `find()` method to query the database
  Product.find(function(err, prod) {
    if (err) {
      //check1
      return done(err);
    }
    var productChunks = []; //were gonna render this array below, in our HOOK, as a key in our hbs page
    var chunksPerRow = 3; //just to say, we want each row to contain three cards/container
    //here we loop through prod
    for (var i = 0; i < prod.length; i += chunksPerRow) {
      // i is incremented by three
      productChunks.push(prod.slice(i, i + chunksPerRow)); // logic for keeping each row at three chunks
    }
    res.render("shop/index", {
      title: "Shopping Cart", //hook
      products: productChunks, //hook
      successMsg: successMsg,
      noMessages: !successMsg
    });
  });
});

router.get("/add-to-cart/:id", function(req, res, next) {
  //push my product to the cart
  //cart object in a session
  var prodId = req.params.id; //retrieve id here
  var cart = new Cart(req.session.cart ? req.session.cart : {}); //create a new cart while passing the old cart
  //use mongoose to find product by id
  Product.findById(prodId, function(err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log("add to cart >>>>>>", req.session.cart);
    res.redirect("/");
  });
});

router.get("/shopping-cart", function(req, res, next) {
  if (!req.session.cart) {
    //saying, if there is no session stored currently
    return res.render("shop/shopping-cart", { products: null });
  }
  var cart = new Cart(req.session.cart); //otherwise, create new cart session store it in cart variable
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  }); //call it here, defined in variable keys so we can call it again in handlebars pages
});

router.get("/checkout", function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart); //create new card off of the session
  var errMsg = req.flash('error')[0];
  res.render("shop/checkout", { total: cart.totalPrice, errMsg: errMsg, noError:!errMsg });
});

router.post("/checkout", function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart); //create new card off of the session
  //here we use stripe to make a charge to user
  var stripe = require("stripe")("sk_test_Ypo9FzGeUXetzwgutn9Y5AyA"); //test key

  stripe.charges.create(
    {
      amount: cart.totalPrice * 100, //this is in cents so multiple to 100 to get a dollar
      currency: "usd", // US Dollar
      source: req.body.stripeToken, // off of the hidden input field in the javascript file
      description: "Test Charge"
    },
    function(err, charge) {
      // asynchronously called
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/checkout");
      }
      req.flash('success', "successful purchase!");
      req.cart = null;//reset the cart
      res.redirect('/');
    }
  );
});

module.exports = router;
