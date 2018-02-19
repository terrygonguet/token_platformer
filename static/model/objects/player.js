/**
 * The player object
 */
class Player extends createjs.Shape {

  constructor(params) {
    super();
    const settings = makeSettings({
      position: { x:0, y:0 }
    }, params);
    // this.id             = nextID();
    this.isPlayer       = true;
    this.isCollidable   = true;
    this.isSolid        = true;
    this.radius         = 20;
    this.body           = Matter.Bodies.circle(...settings.position.elements, this.radius);
    this.position       = settings.position;
    this.state          = "green"; // enum { green, red }
    this.jumpForce      = 12;
    this.maxSpeed       = 4.5;
    this.acceleration   = 2700;
    this.colors         = {
      green: "#11EE11", red: "#EE1111",
    };
    this.shadow         = new Neon(this.color);

    Matter.World.add(game.world, this.body);
    this.body.label = "Player";
    this.body.displayObject = this;
    this.body.friction = 0.2;
    // Matter.Body.setDensity(this.body, 0.01);

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
        var v = this.body.velocity;
        Matter.Body.setVelocity(this.body, $V([v.x,-this.jumpForce]).toM());
      }
    });
  }

  get color() {
    return this.colors[this.state];
  }

  get position() {
    return toSylv(this.body.position);
  }

  set position(val) {
    Matter.Body.setPosition(this.body, val.toM());
  }

  update(e) {
    var v = this.body.velocity;
    if (Math.abs(v.x) < this.maxSpeed || Math.sign(v.x * input.direction.e(1)) < 0) {
      Matter.Body.applyForce(this.body, this.body.position, input.direction.x(0.01).toM());
    }
    if (!input.direction.modulus()) {
      if (Math.abs(v.x) > 0.1) Matter.Body.applyForce(this.body, this.body.position, $V([v.x,0]).toUnitVector().x(-0.001).toM());
      else Matter.Body.setVelocity(this.body, $V([0, v.y]).toM());
    }
    // Matter.Body.setAngularVelocity(this.body, 0);
    this.rotation += this.body.velocity.x * 2.5;

    this.shadow.color !== this.color && (this.shadow = new Neon(this.color));
  }

}
TP.Player = Player;
