/**
 * The player object
 */
class Player extends createjs.Shape {

  constructor(params) {
    super();
    this.id             = nextID();
    this.isPlayer       = true;
    this.isCollidable   = true;
    this.isSolid        = true;
    this.radius         = 20;
    this.hitbox         = new SAT.Circle(params.position.toSAT(), this.radius);
    this.position       = params.position;

    this.graphics.c().s("#888").f("#373").dp(0,0,this.radius,3,0.5,-90);
    debug && this.graphics.ef().dc(0,0,this.radius);

    this.set({ x: this.position.e(1), y: this.position.e(2) });
  }

  update(e) {
    var force = game.gravity.x(e.sdelta).add(input.direction.x(e.sdelta * 300));
    this.setPos(this.position.add(force));
  }

  setPos(pos) {
    this.position = pos.dup();
    this.hitbox.pos = this.position.toSAT();
    this.set({ x: this.position.e(1), y: this.position.e(2) });
  }

  onCollide(otherObj, collision) {
    if (otherObj.isSolid) {
      this.setPos(this.position.subtract($V([collision.overlapV.x, collision.overlapV.y])));
    }
  }

}
TP.Player = Player;
