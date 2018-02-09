/*
 * The main class handling updates and graphics
 */

class Game extends createjs.Stage {

  /**
   * @param {String} canvasName ID of the <canvas> element to wrap
   */
  constructor (canvasName) {
    super(canvasName);
    // createjs props
    this.tickEnabled  = false;

    // other props
    this.txtFps       = new QuickText({ x: 10, y: 30 });
    this.txtrendertime= new QuickText({ x: 10, y: 50 });
    this.txtqwerty    = new QuickText({ x: 10, y: 10, text: debug ? "Escape for the menu" : "" });
    this.renderVals   = [];
    this.collider     = new Collider();
    this.camera       = new Camera();
    this.player       = null;
    this.levelData    = null;
    this.gravity      = $V([ 0, 900 ]);
    this.screencenter = $V([window.innerWidth/2, window.innerHeight/2]);
    this.maxdelta     = 300;
    this.deathLine    = 0;

    this.setHandlers();

    this.loadLevel("lvl1");
  }

  /**
   * To separate the handlers from the constructor
   */
  setHandlers () {
    createjs.Ticker.timingMode = createjs.Ticker.RAF ;
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", this.update, this);

    input.enableMouseMouve();

    // Events stuff ----------------------------------------------------------------------
    window.addEventListener("resize", e => this.screencenter = $V([window.innerWidth/2, window.innerHeight/2]));

    // input stuff -------------------------------------------------------------------------------
    input.on("pause", () => createjs.Ticker.paused = !createjs.Ticker.paused);
    input.on("debug", () => debug = !debug);
  }

  /**
   * Cleans up the Stage and builds everything according to the data supplied
   * @param {Object} data : the Object from the server
   */
  init (data) {
    this.removeAllChildren();
    this.levelData = data;
    this.deathLine = data.deathLine;

    var deathLine = new createjs.Shape();
    deathLine.position = $V([0, this.deathLine]);
    deathLine.graphics
      .ss(2).s("#E11")
      .mt(-5000,0)
      .lt(5000,0)

    this.addChild(deathLine);
    this.addChild(this.txtFps);
    this.addChild(this.txtrendertime);
    this.addChild(this.txtqwerty);
    this.player = new Player();
    this.addChild(this.player);

    for (var object of data.objects) {
      this.addChild(new TP[object.type](object.params));
    }

    var sp = _.values(this.children).find(c => c.isSpawnPoint);
    if (!sp) throw "No spawn point found";
    sp.spawn();
  }

  loadLevel(filename) {
    $.getJSON(`levels/${filename}.json`, (data, status) => this.init(data))
    .fail(err => {
      console.log(err);
      $("#messagebox").show();
      $("#game").hide();
      $("#title").text("Error");
      $("#message").html(err.responseText);
    });
  }

  /**
   * @param {eventdata} e
   */
  update (e) {
    let time = performance.now(); // perf monitoring
    e.sdelta = e.delta / 1000; // shorthand
    this.txtFps.text = (debug ? createjs.Ticker.getMeasuredFPS().toFixed(0) + " FPS" : "");
    // more perf monitoring
    this.rendertime = 0;
    if (e.delta <= this.maxdelta && !e.paused) {
      this.children.forEach(c => c.update && c.update(e));
      this.collider.update(e);
      this.camera.update(e);
      super.update(e);
    }
    game.rendertime += (performance.now() - time);
    this.renderVals.push(game.rendertime);
    if (this.renderVals.length > 100) this.renderVals.shift(); // render values smoother
    this.txtrendertime.text = (debug ? "render time " + (this.renderVals.reduce((a,b)=>a+b, 0)/100).toPrecision(3) + " ms" : "");
  }

  get collidables() {
    return this.children.filter(c => c.isCollidable);
  }

  addChild (child) {
    super.addChild(child);
  }

  removeChild (child) {
    super.removeChild(child);
  }

}
TP.Game = Game;
