class EndZone extends createjs.Shape {

  constructor(params={}) {
    super();
    const settings = makeSettings({
      position: $V([0,0]),
      dimensions: $V([10,10]),
      nextLevel: "lvl1",
      color: "rgba(80,230,80,0.3)",
    }, params);
    this.id            = nextID();
    this.isEndZone     = true;
    this.position      = settings.position;
    this.dimensions    = settings.dimensions;
    this.color         = settings.color;
    this.nextLevel     = settings.nextLevel;
    this.isCollidable  = true;
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
       $("<label>Next Level : </label>")
         .append(`<input type='text' size=4 id='nextLevel' value=${this.nextLevel}>`)
     );
     return ()=>{
       return new EndZone({
         position: { x:Number($("#pt1x").val()), y:Number($("#pt1y").val()) },
         dimensions: { x:Number($("#width").val()), y:Number($("#height").val()) },
         nextLevel: $("#nextLevel").val(),
       });
     };
  }

  toJSON() {
    return {
      type: "EndZone",
      params: {
        position: { x:this.position.e(1), y:this.position.e(2) },
        dimensions: { x:this.dimensions.e(1), y:this.dimensions.e(2) },
        nextLevel: this.nextLevel,
        color: this.color,
      }
    };
  }

  onCollide(otherObj, collision) {
    if (!otherObj.isPlayer) return;
    if (collision.aInB) {
      game.loadLevel(this.nextLevel);
    }
  }

}
TP.EndZone = EndZone;
