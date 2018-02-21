const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const server = require('http').Server(app);
const fs = require('fs');

server.listen(process.env.PORT || 80, function () {
  console.log("Server started");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

app.get("/levellist", function (req, res) {
  res.json(fs.readdirSync("./static/levels").map(f => f.replace(".json", "")));
});

app.post("/savelvl/:name", upload.array(), function (req, res) {
  fs.writeFileSync("./static/levels/"+req.params.name+".json", JSON.stringify(req.body, (k,v)=>{
    if(!isNaN(v)) return Number(v)
    else return v;
  }, 2));
  res.json({ message:"done", error:false });
});

app.get("/filestoload", function (req, res) {
  function readdirRec(path) {
    if (!path.endsWith("/")) path += "/";
    var files = fs.readdirSync(path).map(f => path + f);
    for (var i = 0; i < files.length; i++) {
      var stats = fs.statSync(files[i]);
      if (stats.isDirectory()) {
        files.unshift(...readdirRec(files.splice(i,1)[0]));
      }
    }
    return files.filter(f => !/(?:loader\d?\.js$|.*\.ttf$)/gm.exec(f));
  }
  res.json({
    assets:readdirRec("./static/resources").map(f => f.slice(8)),
    scripts:readdirRec("./static/model").concat(readdirRec("./static/tools")).map(f => f.slice(8))
  });
});
