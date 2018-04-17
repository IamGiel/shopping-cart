const express = require("express");
const app = express();
app.use(express.static(__dirname + "dist"));


var PORT = process.env.PORT || 8000;
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

var exphbs = require("express-handlebars");
var hbs = exphbs.create({ defaultLayout: "main"});


//pathlocation strategy

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/layouts/layouts.hbs"));
});
console.log("console listening at ", PORT);



app.listen(PORT, function(err) {
  if (!err) console.log("Site is live at ", PORT );
  else console.log(err);
});