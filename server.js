const express = require("express");
const app = express();
app.use(express.static(__dirname + "dist"));
app.listen(process.env.PORT || 4200);

//pathlocation strategy

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
console.log("console listening at ", PORT);
