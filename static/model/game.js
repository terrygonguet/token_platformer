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
    this.entities     = {};
    this.collidables  = [];
    this.player       = null;
    this.dimensions   = null;
    this.background   = null;
    this.foreground   = null;
    this.renderVals   = [];
    this.screencenter = $V([window.innerWidth/2, window.innerHeight/2]);

    this.setHandlers();
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
    this.entities     = {};
    this.collidables  = [];
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
    !e.paused && this.children.forEach(c => c.update && c.update(e));
    super.update(e);
    game.rendertime += (performance.now() - time);
    this.renderVals.push(game.rendertime);
    if (this.renderVals.length > 100) this.renderVals.shift(); // render values smoother
    this.txtrendertime.text = (debug ? "render time " + (this.renderVals.reduce((a,b)=>a+b, 0)/100).toPrecision(3) + " ms" : "");
  }

  addChild (child) {
    if (child.isEntity) {
      if (this.entities[child.id]) return;
      this.entities[child.id] = child;
    }

    if (child.isCollidable && this.collidables.indexOf(child) === -1)
      this.collidables.push(child);
  }

  removeChild (child) {
    super.removeChild(child);
    if (child.isEntity) delete this.entities[child.id];
    if (child.isCollidable) this.collidables.splice(this.collidables.indexOf(child), 1);
  }

}
TP.Game = Game;
