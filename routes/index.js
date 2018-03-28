var express = require('express');
var router = express.Router();
var Product = require('../models/product')

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, prod){
    if (err) throw err;
    var productChunks = [];
    var chunksPerRow = 3;//just to say, we want each row to contain three cards/container
    //here we loop through prod
    for (var i = 0; i < prod.length; i += chunksPerRow) {// i is incremented by three
      productChunks.push(prod.slice(i, i + chunksPerRow)) // logic for keeping each row at three chunks
    }
    res.render("shop/index", {
      title: "Shopping Cart",
      products: productChunks
    });
  });
});

module.exports = router;
