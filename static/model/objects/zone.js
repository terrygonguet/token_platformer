class Zone extends createjs.Shape {

  constructor(params={}) {
    super();
    const settings = makeSettings({
      position: $V([0,0]),
      dimensions: $V([50,50]),
      color: "#3af735",
      alpha: 0.3,
    }, params);
    // this.id            = nextID();
    this.isZone        = true;
    this.inEditorList  = true;
    this.position      = settings.position;
    this.dimensions    = settings.dimensions;
    this.color         = settings.color;
    this.alpha         = settings.alpha;
    this.isCollidable  = true;
    this.onInside      = null;
    this.onTouch       = null;
    this.body          = null;

    this.redraw();
    this.on("removed", e => Matter.World.remove(game.world, this.body), null, true);
  }

  redraw() {
    this.body && Matter.World.remove(game.world, this.body);
    this.body = Matter.Bodies.rectangle(...this.position.elements, ...this.dimensions.elements, { isStatic:true, isSensor:true });
    Matter.World.add(game.world, this.body);
    this.body.label = "Zone";
    this.body.displayObject = this;
    const pts = this.body.vertices.map(v => toSylv(v).subtract(this.position));
    this.graphics.c().f(this.color)
      .mt(...pts[0].elements)
      .lt(...pts[1].elements)
      .lt(...pts[2].elements)
      .lt(...pts[3].elements)
      .cp();
  }

  getEditor(container, dragManager) {
    $(container)
      .append(`<p>ID : ${this.id}</p>`)
      .append(
       $("<label>Position : </label>")
         .append(`<input type='number' placeholder='x' size=4 id='pt1x' value=${this.position.e(1)}>`)
         .append(`<input type='number' placeholder='y' size=4 id='pt1y' value=${this.position.e(2)}>`)
      )
      .append(
       $("<label>Width : </label>")
         .append(`<input type='number' size=4 id='width' min=0 value=${this.dimensions.e(1)}>`)
      )
      .append(
       $("<label>Height : </label>")
         .append(`<input type='number' size=4 id='height' min=0 value=${this.dimensions.e(2)}>`)
      )
      .append(
       $("<label>Color : </label>")
         .append(`<input type='color' id='color' value=${this.color}>`)
      )
      .append(
       $("<label>Alpha : </label>")
         .append(`<input type='number' min=0 max=1 step=0.1 id='alpha' value=${this.alpha}>`)
      );
    dragManager.addPoint("position", this.position, pos => {
      this.position = pos.dup();
      Matter.Body.setPosition(this.body, pos.toM());
      dragManager.updatePoint("dimensions", this.position.add(this.dimensions.x(0.5)));
      $("#pt1x").val(this.position.e(1));
      $("#pt1y").val(this.position.e(2));
    });
    dragManager.addPoint("dimensions", this.position.add(this.dimensions.x(0.5)), pos => {
      this.dimensions = pos.subtract(this.position).x(2);
      this.redraw();
      $("#width").val(this.dimensions.e(1));
      $("#height").val(this.dimensions.e(2));
    });
    return ()=>{
     return new Zone({
       position: { x:Number($("#pt1x").val()), y:Number($("#pt1y").val()) },
       dimensions: { x:Number($("#width").val()), y:Number($("#height").val()) },
       color: $("#color").val(),
       alpha: Number($("#alpha").val()),
     });
    };
  }

  toJSON() {
    return {
      type: "Zone",
      params: {
        position: { x:this.position.e(1), y:this.position.e(2) },
        dimensions: { x:this.dimensions.e(1), y:this.dimensions.e(2) },
        color: this.color,
        alpha: this.alpha,
      }
    };
  }

  collisionStart(pair) {
    var player = (pair.bodyA.displayObject.isPlayer ? pair.bodyA.displayObject : (pair.bodyB.displayObject.isPlayer ? pair.bodyB.displayObject : null));
    if (!player) return;
    if (pair.separation >= player.radius * 2) {
      this.onInside && this.onInside.bind(this)(player, pair);
    }
    this.onTouch && this.onTouch.bind(this)(player, pair);
  }

  collisionActive(pair) {
    this.collisionStart(pair);
  }

}
TP.Zone = Zone;
