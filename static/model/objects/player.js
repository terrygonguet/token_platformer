/**
 * The player object
 */
class Player extends createjs.Shape {

  constructor(params) {
    super();
    const settings = makeSettings({
      position: { x:0, y:0 }
    }, params);
    this.id             = nextID();
    this.isPlayer       = true;
    this.isCollidable   = true;
    this.isSolid        = true;
    this.radius         = 20;
    this.hitbox         = new SAT.Circle(settings.position.toSAT(), this.radius);
    this.position       = settings.position;
    this.state          = "green"; // enum { green, red }
    this.jumpForce      = 500;
    this.momentum       = $V([0,0]);
    this.acceleration   = 2700;
    this.rotationSpeed  = 1.6;
    this.colors         = {
      green: "#11EE11", red: "#EE1111",
    };
    this.shadow         = new Neon(this.color);
    this.maxSpeed       = {
      down: 1200,
      up: 1200,
      horizontal: 400
    };

    this.graphics.c().s("#888").f("#000").dp(0,0,this.radius,3,0,-90);
    debug && this.graphics.ef().dc(0,0,this.radius);

    input.on("debug", ()=>{
      this.graphics.c().s("#888").f("#000").dp(0,0,this.radius,3,0,-90);
      debug && this.graphics.ef().dc(0,0,this.radius);
    });

    input.on("jump", e => {
      if (e.originalEvent.repeat) return ;
      if (this.state === "green") {
        this.state = "red";
        this.momentum.elements[1] = -this.jumpForce;
      }
    });
  }

  get color() {
    return this.colors[this.state];
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
    var slowdown = $V([0,0]);
    if (Math.abs(this.momentum.e(1)) > this.maxSpeed.horizontal && moveforce.modulus()) {
      slowdown = slowdown.add($V([-this.momentum.e(1),0]).toUnitVector().x(this.acceleration * e.sdelta));
    }
    if (this.momentum.e(2) < -this.maxSpeed.up) {
      slowdown = slowdown.add($V([0,-this.momentum.e(2)]).toUnitVector().x(this.acceleration * e.sdelta));
    } else if (this.momentum.e(2) > this.maxSpeed.down) {
      slowdown = slowdown.add($V([0,-this.momentum.e(2)]).toUnitVector().x(this.acceleration * e.sdelta));
    }
    this.momentum = this.momentum.add(slowdown);

    var oldpos = this.position.dup();
    this.setPos(this.position.add(this.momentum.x(e.sdelta)));
    this.rotation += this.position.subtract(oldpos).e(1) * this.rotationSpeed;

    this.shadow.color !== this.color && (this.shadow = new Neon(this.color));
  }

  setPos(pos) {
    this.position = pos.dup();
    this.hitbox.pos = this.position.toSAT();
  }

  onCollide(otherObj, collision, e) {
    if (otherObj.isSolid) {
      var knockback = null;
      var anglefrom	= collision.overlapN.toSylv().angleFrom($V([0,1]));
      if (anglefrom <= Math.PI / 4 || anglefrom >= 3 * Math.PI / 4) {
        knockback = $V([0, collision.overlapV.y]);
      } else {
        knockback = collision.overlapV.toSylv();
      }
      this.setPos(this.position.subtract(knockback));
      e.sdelta !== 0 && (this.momentum = this.momentum.subtract(knockback.x(1 / e.sdelta)));
    }
  }

}
TP.Player = Player;
