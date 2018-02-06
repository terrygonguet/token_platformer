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
    this.collidables  = [];
    this.renderVals   = [];
    this.collider     = new Collider();
    this.camera       = new Camera();
    this.gravity      = $V([ 0, 900 ]);
    this.screencenter = $V([window.innerWidth/2, window.innerHeight/2]);
    this.maxdelta     = 300;

    this.setHandlers();
  }

  /**
   * To separate the handlers from the constructor
   */
  setHandlers () {
    createjs.Ticker.timingMode = createjs.Ticker.RAF ;
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", this.update, this);

    createjs.Ticker.on("tick", this.init, this, true);

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
    this.collidables  = [];

    this.addChild(this.txtFps);
    this.addChild(this.txtrendertime);
    this.addChild(this.txtqwerty);
    this.addChild(new Player({
      position: $V([ 150, 50 ])
    }));
    this.addChild(new Plateform({
      pt1: $V([ 100, 250 ]),
      pt2: $V([ 200, 250 ]),
    }));
    this.addChild(new Plateform({
      pt1: $V([ 500, 380 ]),
      pt2: $V([ 900, 300 ]),
    }));
    this.addChild(new Plateform({
      pt1: $V([ 200, 450 ]),
      pt2: $V([ 1500, 450 ]),
    }));
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

  addChild (child) {
    super.addChild(child);
    if (child.isCollidable && this.collidables.indexOf(child) === -1)
      this.collidables.push(child);
  }

  removeChild (child) {
    super.removeChild(child);
    if (child.isCollidable) this.collidables.splice(this.collidables.indexOf(child), 1);
  }

}
TP.Game = Game;
