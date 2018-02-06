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
    this.hasJumped      = false;
    this.jumpForce      = 500;
    this.momentum       = $V([0,0]);
    this.acceleration   = 2700;
    this.rotationSpeed  = 1.7;
    this.colors         = {
      hasJump: "#373", noJump: "#733",
    };
    this.maxSpeed       = {
      down: 1200, horizontal: 400
    };

    this.graphics.c().s("#888").f(this.colors.hasJump).dp(0,0,this.radius,3,0.5,-90);
    debug && this.graphics.ef().dc(0,0,this.radius);

    this.set({ x: this.position.e(1), y: this.position.e(2) });
  }

  update(e) {
    var moveforce = input.direction.x(e.sdelta * this.acceleration);
    var gravforce = game.gravity.x(e.sdelta);
    this.momentum = this.momentum.add(gravforce).add(moveforce);
    if (!moveforce.modulus()) {
      if (Math.abs(this.momentum.e(1)) < this.acceleration * e.sdelta)
        this.momentum.elements[0] = 0;
      else
        this.momentum = this.momentum.subtract($V([this.momentum.toUnitVector().e(1), 0]).x(this.acceleration * e.sdelta));
    };
    if (input.keys.jump && !this.hasJumped) {
      this.hasJumped = true;
      this.momentum.elements[1] = -this.jumpForce;
    }
    this.momentum = $V([
      this.momentum.e(1).clamp(-this.maxSpeed.horizontal, this.maxSpeed.horizontal),
      this.momentum.e(2).clamp(-Infinity, this.maxSpeed.down)
    ]);
    var oldpos = this.position.dup();
    this.setPos(this.position.add(this.momentum.x(e.sdelta)));
    this.rotation += this.position.subtract(oldpos).e(1) * this.rotationSpeed;

    var color = this.hasJumped ? this.colors.noJump : this.colors.hasJump;
    this.graphics.c().s("#888").f(color).dp(0,0,this.radius,3,0.5,-90);
    debug && this.graphics.ef().dc(0,0,this.radius);
  }

  setPos(pos) {
    this.position = pos.dup();
    this.hitbox.pos = this.position.toSAT();
    this.set({ x: this.position.e(1), y: this.position.e(2) });
  }

  onCollide(otherObj, collision, e) {
    if (otherObj.isSolid) {
      this.setPos(this.position.subtract(collision.overlapV.toSylv()));
      this.momentum = this.momentum.subtract(collision.overlapV.toSylv().x(1 / e.sdelta));
      var anglefrom	= otherObj.hitbox.edges[0].toSylv().angleFrom($V([1,0]));
      if (anglefrom < Math.PI / 4 || anglefrom > 3 * Math.PI / 4) {
        this.hasJumped = false;
      }
    }
  }

}
TP.Player = Player;
