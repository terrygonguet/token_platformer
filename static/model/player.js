/**
 * The player object
 */
class Player extends createjs.Shape {

  constructor(params) {
    super();
    const settings = makeSettings({}, params);
    this.id             = nextID();
    this.isPlayer       = true;
    this.isCollidable   = true;
    this.isSolid        = true;
    this.radius         = 20;
    this.hitbox         = new SAT.Circle(settings.position.toSAT(), this.radius);
    this.position       = settings.position;
    this.startpos       = settings.position.dup();
    this.hasJumped      = false;
    this.jumpForce      = 500;
    this.momentum       = $V([0,0]);
    this.acceleration   = 2700;
    this.rotationSpeed  = 1.6;
    this.shadow         = new Neon("E1E");
    this.colors         = {
      hasJump: "#1E1", noJump: "#E11",
    };
    this.maxSpeed       = {
      down: 1200, horizontal: 400
    };

    this.graphics.c().s("#888").f("#000").dp(0,0,this.radius,3,0,-90);
    debug && this.graphics.ef().dc(0,0,this.radius);

    input.on("debug", ()=>{
      this.graphics.c().s("#888").f("#000").dp(0,0,this.radius,3,0,-90);
      debug && this.graphics.ef().dc(0,0,this.radius);
    });
  }

  update(e) {
    if (this.position.e(2) > game.deathLine) {
      this.position = this.startpos.dup();
      return;
    }
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
    this.shadow.color !== color && (this.shadow = new Neon(color));
  }

  setPos(pos) {
    this.position = pos.dup();
    this.hitbox.pos = this.position.toSAT();
  }

  onCollide(otherObj, collision, e) {
    if (otherObj.isSolid) {
      var knockback = null;
      var anglefrom	= otherObj.hitbox.edges[0].toSylv().angleFrom($V([1,0]));
      if (anglefrom <= Math.PI / 4 || anglefrom >= 3 * Math.PI / 4) {
        knockback = $V([0, collision.overlapV.y]);
        collision.overlapN.toSylv().angleFrom($V([0,1])) <= Math.PI / 4 && (this.hasJumped = false);
      } else {
        knockback = collision.overlapV.toSylv();
      }
      this.setPos(this.position.subtract(knockback));
      this.momentum = this.momentum.subtract(knockback.x(1 / e.sdelta));
    }
  }

}
TP.Player = Player;
