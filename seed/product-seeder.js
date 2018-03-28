//import the product model
var Product = require("../models/product");

//these next two lines are taken from app.js
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shopping"); //added this to connect to mongo db

var products = [
  //turned this into an array so we can have multiple products to loop over
  new Product({
    imagePath:
      "https://compass-ssl.xbox.com/assets/13/07/1307d85d-e58d-44b6-8734-22577a44941e.jpg?n=Minecraft-2017_sharing_200x200.jpg",
    Title: "MineCraft",
    Description: "Create a world in your imagination!!!",
    Price: 12
  }),
  new Product({
    imagePath:
      "https://vignette.wikia.nocookie.net/callofduty/images/b/b0/CODH_Promotional_Image.png/revision/latest?cb=20141122193327",
    Title: "Call of Duty",
    Description: "When duty calls...",
    Price: 14
  }),
  new Product({
    imagePath:
      "http://oceanofgames.com/wp-content/uploads/2014/10/Counter-Strike-Global-Offensive-Free-Download.jpg",
    Title: "Counter Strike, Global Offensive",
    Description:
      "Strategic combat, domination and strategic attack simulation!",
    Price: 12
  }), //new set of three games
  new Product({
    imagePath:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3K59vkuuSUG_LK6uqNbleRo6HuQuUinsdzR4KulHXtexiMm54",
    Title: "Civilization",
    Description: "Command and conquer!!!",
    Price: 12
  }),
  new Product({
    imagePath:
      "https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends.jpg",
    Title: "League of Legends",
    Description: "Its time for a little fantasy!!!",
    Price: 14
  }),
  new Product({
    imagePath:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrnT4fVAwaBLzpjHx0sovi37JJho4ePxGUQiyOCQ4J-4jj_cKZFQ",
    Title: "Start-Craft II",
    Description:
      "Reign over the stars and beyond",
    Price: 12
  })
];

// //here we gonna loop over the seeds above
// for (var i = 0; i < product.length; i++) {
//   products[i].save(); //this save() method is mongoose method that saves our data in mongo db
// }

// mongoose.disconnect();

//notes: since this is not going to be a normal part of the application, this will just be ran manually using nodejs,
//we also required mongoose on top
//we added the connection code to mongo db then we disconnect.
//saving to the db is asynchronous, we start the loop and save item, and we will disconnect.
//chances are, that disconnect will happen before all the saving happens, so we need to create a helper
//that allows us to save all items and then disconnect

//with helper:
var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, res) {
    //this save() we will have a callback
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

//SOME MONGO CLI
// db.products.find({ Title: "Call of Duty" });
