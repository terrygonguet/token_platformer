class Zone extends createjs.Shape {

  constructor(params={}) {
    super();
    const settings = makeSettings({
      position: $V([0,0]),
      dimensions: $V([50,50]),
      color: "#3af735",
      alpha: 0.3,
    }, params);
    this.id            = nextID();
    this.isZone        = true;
    this.position      = settings.position;
    this.dimensions    = settings.dimensions;
    this.color         = settings.color;
    this.alpha         = settings.alpha;
    this.isCollidable  = true;
    this.onInside      = null;
    this.onTouch       = null;
    this.hitbox        = (new SAT.Box(this.position.toSAT(), this.dimensions.e(1), this.dimensions.e(2))).toPolygon();

    const pts = this.hitbox.points;
    this.graphics.c().f(this.color)
      .mt(0,0)
      .lt(...pts[1].toSylv().elements)
      .lt(...pts[2].toSylv().elements)
      .lt(...pts[3].toSylv().elements)
      .lt(0,0)
      .cp();
  }

  getEditor(container) {
    $(container)
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

  onCollide(otherObj, collision, e) {
    if (!otherObj.isPlayer) return;
    if (collision.aInB) {
      this.onInside && this.onInside.bind(this)(otherObj, collision, e);
    } else {
      this.onTouch && this.onTouch.bind(this)(otherObj, collision, e);
    }
  }

}
TP.Zone = Zone;
