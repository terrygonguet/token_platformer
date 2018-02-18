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
    this.momentums      = {
      body: $V([0,0]),
      move: $V([0,0]),
    };
    this.acceleration   = 2700;
    this.rotationSpeed  = 1.6;
    this.colors         = {
      green: "#11EE11", red: "#EE1111",
    };
    this.shadow         = new Neon(this.color);
    this.maxSpeed       = {
      body: 1200,
      move: 400,
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
        this.momentums.body = $V([this.momentums.body.e(1), -this.jumpForce]);
      }
    });
  }

  get momentum() {
    return _.values(this.momentums).reduce((a,b) => a.add(b),Vector.Zero(2));
  }

  set momentum(val) {
    this.momentums.body = val.dup();
  }

  get color() {
    return this.colors[this.state];
  }

  update(e) {
    var moveforce = input.direction.x(e.sdelta * this.acceleration);
    var gravforce = game.gravity.x(e.sdelta);
    var body = this.momentums.body;
    var move = this.momentums.move;

    if(!input.direction.modulus()) {
      if (move.modulus() <= this.acceleration * e.sdelta)
        move = $V([0,0]);
      else
        moveforce = move.toUnitVector().x(-this.acceleration * e.sdelta);
    }
    this.momentums.move = move.add(moveforce).clamp([2*this.maxSpeed.move, 0]);

    this.momentums.body = this.momentums.body.add(gravforce);
    this.momentums.body = this.momentums.body.subtract(this.momentums.body.x(0.2 * e.sdelta));

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
      var anglefrom	= collision.overlapN.toSylv().angleFrom($V([0,1]));
      var knockback = collision.overlapV.toSylv();
      if (anglefrom <= Math.PI / 4 || anglefrom >= 3 * Math.PI / 4) {
        knockback.elements[0] = 0;
      }
      this.setPos(this.position.subtract(knockback));
      e.sdelta && (this.momentums.body = this.momentums.body.subtract($V([0,knockback.e(2)]).x(1/e.sdelta)));
    }
  }

}
TP.Player = Player;
