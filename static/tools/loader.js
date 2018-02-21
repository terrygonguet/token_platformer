/* Loads all the necessary game files and handles loading screen */

/** Only globals allowed :
 *  game, input, queue, debug, config
 */
var game;
var assets = [];
var debug = location.host === "localhost";
const TP = {
  classes:[]
}; // Namespace
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

(function () {
  const assetQueue = new createjs.LoadQueue();
  const scriptQueue = new createjs.LoadQueue();
  var manifests = null;

  scriptQueue.on("complete", handleComplete, this);
  scriptQueue.on("fileload", handleFileLoad, this);
  scriptQueue.on("fileerror", handleFileError, this);

  assetQueue.on("complete", handleComplete, this);
  assetQueue.on("fileload", handleFileLoad, this);
  assetQueue.on("fileerror", handleFileError, this);
  assetQueue.installPlugin(createjs.Sound);
  var nbassets = 0;
  var nbscripts = 0;

  $.getJSON("/filestoload", res => {
    scriptQueue.loadManifest(res.scripts.map(a => ({ id:a.match(/\/(\w+?)\..+$/)[1], src:a })));
    assetQueue.loadManifest(res.assets.map(a => ({ id:a.match(/\/(\w+?)\..+$/)[1], src:a })));
    manifests = res;
  });

  function handleComplete() {
    update();
    if (assetQueue.loaded && scriptQueue.loaded) finish();
  }

  function handleFileLoad	(e) {
    console.log(e.item.id + " loaded.");
    nbassets += (e.target === assetQueue ? 1 : 0);
    nbscripts += (e.target === scriptQueue ? 1 : 0);
    update();
  }

  function handleFileError (e) {
    console.log(e.item.id + " failed.");
    update();
  }

  function finish() {
    console.log("Loading complete.");
    assets = assetQueue.getItems();
    var i = 0;
    while (TP.classes.length) {
      try {
        TP.classes[0]();
        TP.classes.shift();
      } catch (e) {
        TP.classes.push(TP.classes.shift());
      }
      if(i++ > 100) break;
    }
    stage.removeAllChildren();
    stage = container = txtLoading = txtAssets = txtScripts = null;
    game = new Game("game");
  }

  // to keep the canvas in full page size
  window.addEventListener('resize', function resize() {
    $("#game")[0].width = window.innerWidth;
    $("#game")[0].height = window.innerHeight;
    stage && update();
  }, false);
  window.dispatchEvent(new Event("resize"));

  var stage = new createjs.Stage("game");
  var container = new createjs.Container();
  var txtLoading = new createjs.Text("Loading", (0.2 * (innerHeight < innerWidth ? innerHeight : innerWidth)) + "px Joystix", "#EEE");
  var txtAssets = new createjs.Text("Assets", "30px Joystix", "#EEE");
  var txtScripts = new createjs.Text("Scripts", "30px Joystix", "#EEE");
  container.shadow = new createjs.Shadow("#E1E", 0, 0, 15);
  container.addChild(txtLoading);
  container.addChild(txtAssets);
  container.addChild(txtScripts);
  stage.addChild(container);

  function update() {
    if (manifests) {
      txtLoading.set({ x:20, y:0, maxWidth:innerWidth });
      var loadHeight = txtLoading.getMeasuredHeight();
      txtAssets.set({ x:20, y:loadHeight });
      txtScripts.set({ x:20, y:loadHeight + 30 });
      var bounds = container.getBounds();
      container.set({ x:innerWidth/2 - bounds.width/2, y:innerHeight/2 - bounds.height/2 });
      txtAssets.text = txtAssets.text.match(/(\w+)/)[1].padEnd(8, " ") + " [" + ">".repeat(nbassets).padEnd(manifests.assets.length, " ") + "]";
      txtScripts.text = txtScripts.text.match(/(\w+)/)[1].padEnd(8, " ") + " [" + ">".repeat(nbscripts).padEnd(manifests.scripts.length, " ") + "]";
      stage.update();
    }
  }
})();
