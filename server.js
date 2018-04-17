const express = require("express");
const app = express();
app.use(express.static(__dirname + "dist"));


var PORT = process.env.PORT || 8000;



//pathlocation strategy

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
console.log("console listening at ", PORT);



app.listen(PORT, function(err) {
  if (!err) console.log("Site is live at ", PORT );
  else console.log(err);
});