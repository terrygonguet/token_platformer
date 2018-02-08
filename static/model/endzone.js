class EndZone extends createjs.Shape {

  constructor(params) {
    super();
    const settings = makeSettings({
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

  onCollide(otherObj, collision) {
    if (!otherObj.isPlayer) return;
    if (collision.aInB) {
      game.loadLevel(this.nextLevel);
    }
  }

}
TP.EndZone = EndZone;
