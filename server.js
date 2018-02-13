const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const server = require('http').Server(app);

server.listen(process.env.PORT || 80, function () {
  console.log("Server started");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

app.get("/levellist", function (req, res) {
  res.json(require('fs').readdirSync("./static/levels").map(f => f.replace(".json", "")));
});

app.post("/savelvl/:name", upload.array(), function (req, res) {
  require('fs').writeFileSync("./static/levels/"+req.params.name+".json", JSON.stringify(req.body, (k,v)=>{
    if(!isNaN(v)) return Number(v)
    else return v;
  }, 2));
  res.json({ message:"done", error:false });
});
