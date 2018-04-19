var moment = require("moment");
//cart object here
//javascript constructor at work here!

module.exports = function Cart(oldCart) {
  //whenever we create the cart we also pass the old cart init
  this.items = oldCart.items || {}; //old cart items
  this.totalQty = oldCart.totalQty || 0; //store total quantity
  this.totalPrice = oldCart.totalPrice || 0; //total price of my cart items
  this.purchaseDate = oldCart.purchaseDate;

  //this function allows us to add items in the cart
  //but also make some checks so that...
  //1. we dont repeat to add a similar item thats already in the cart
  //2. we are able to group items
  //so here we pass the parameters that we can reference in our logic
  this.add = function(item, id) {
    var storedItem = this.items[id]; //we are able to check if the items (object) have this key and been added already
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, Price: 0 }; //we are creating a new entry
    }
    storedItem.qty++;
    storedItem.Price = storedItem.item.Price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.Price;
  };

  //Reduce an item by one
  this.reduceItemByOne = function(id) {
    this.items[id].qty--;
    this.items[id].Price -= this.items[id].item.Price;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.Price;
  };

  //Reduce an item by one
  this.removeAll = function(id) {

    this.totalQty -= this.items[id].totalQty;
    this.totalPrice -= this.items[id].Price;
    delete this.items[id];
  };

  this.generateArray = function() {
    var arr = [];
    //loop through items and push them in arr
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };

  this.generateDate = function() {
    var dateArr = [];
    var date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    //loop through items and push them in arr
    for (var id in this.items) {
      dateArr.push(date);
    }
    return dateArr[0];
  };
};

//basically we get the old cart, assign the values of the old cart,
//we have function to add new items,
//and check if the item already exist if not we create an new one
