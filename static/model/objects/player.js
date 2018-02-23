/**
 * The player object
 */
 TP.classes.push(function () {
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
    this.inEditorList   = true;
    this.radius         = 20;
    this.body           = Matter.Bodies.circle(...settings.position.elements, this.radius);
    this.position       = settings.position;
    this.state          = "green"; // enum { green, red }
    this.jumpForce      = 12;
    this.maxSpeed       = 5;
    this.acceleration   = 25;
    this.curspeed       = 0;
    this.colors         = {
      green: "#11EE11", red: "#EE1111",
    };
    this.shadow         = new Neon(this.color);

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
    if (input.direction.modulus()) {
      this.curspeed = (this.curspeed + this.acceleration * e.sdelta * Math.sign(input.direction.e(1))).clamp(-this.maxSpeed,this.maxSpeed);
    } else {
      this.curspeed = (this.curspeed + this.acceleration * e.sdelta * Math.sign(-this.curspeed));
      Math.abs(this.curspeed) <= this.acceleration * e.sdelta && (this.curspeed = 0);
    }
    Matter.Body.setVelocity(this.body, $V([this.curspeed, this.body.velocity.y]).toM());
    this.rotation += this.body.velocity.x * 2.5;

    this.shadow.color !== this.color && (this.shadow = new Neon(this.color));
  }

  getEditor(container, dragManager) {
    $(container)
      .append(`<p>ID : ${this.id}</p>`)
      .append(
        $("<label>Max speed : </label>")
          .append(`<input type='number' size=4 id='maxSpeed' value=${this.maxSpeed}>`)
      )
      .append(
        $("<label>Acceleration : </label>")
          .append(`<input type='number' size=4 id='acceleration' value=${this.acceleration}>`)
      )
      .append(
        $("<label>Jump force : </label>")
          .append(`<input type='number' size=4 id='jumpForce' value=${this.jumpForce}>`)
      )
    return ()=>{
      this.maxSpeed = Number($("#maxSpeed").val());
      this.acceleration = Number($("#acceleration").val());
      this.jumpForce = Number($("#jumpForce").val());
      Matter.World.add(game.world, this.body);
      return this;
    };
  }

}
TP.Player = Player;
window.Player = Player;
})
