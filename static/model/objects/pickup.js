class Pickup extends createjs.Shape {

  constructor(params={}) {
    super();
    const settings = makeSettings({
      position: { x:0, y:0 },
      respawnTime: 4000,
      radius: 10,
      state: "green"
    }, params);
    this.id               = nextID();
    this.isPickup         = true;
    this.isCollidable     = true;
    this.respawnTime      = settings.respawnTime;
    this.position         = settings.position;
    this.state            = settings.state;
    this.radius           = settings.radius;
    this.color            = game.player.colors[this.state];
    this.hitbox           = new SAT.Circle(this.position.toSAT(), this.radius);
    this.time             = 0;

    this.graphics.c().f(this.color).dc(0,0,this.radius);
  }

  update(e) {
    if (!this.isCollidable && (this.time -= e.delta) <= 0) {
      this.isCollidable = true;
      this.alpha = 1;
    }
  }

  getEditor(container) {
    $(container)
     .append(
       $("<label>Position : </label>")
         .append(`<input type='number' placeholder='x' size=4 id='pt1x' value=${this.position.e(1)}>`)
         .append(`<input type='number' placeholder='y' size=4 id='pt1y' value=${this.position.e(2)}>`)
     )
     .append(
       $("<label>Radius : </label>")
         .append(`<input type='number' size=4 id='radius' min=0 value=${this.radius}>`)
     )
     .append(
       $("<label>Respawn time : </label>")
         .append(`<input type='number' min=0 id='respawnTime' min=0 value=${this.respawnTime}>`)
     )
     .append(
       $("<label>State : </label>")
         .append(`<input type='text' size=4 id='state' list='states' value=${this.state}>`)
     );
     return ()=>{
       return new Pickup({
         position: { x:Number($("#pt1x").val()), y:Number($("#pt1y").val()) },
         state: $("#state").val(),
         radius: Number($("#radius").val()),
         respawnTime: Number($("#respawnTime").val()),
       });
     };
  }

  toJSON() {
    return {
      type: "Pickup",
      params: {
        position: { x:this.position.e(1), y:this.position.e(2) },
        state: this.state,
        radius: this.radius,
        respawnTime: this.respawnTime,
      }
    };
  }

  onCollide(otherObj, collision) {
    if (otherObj.isPlayer) {
      otherObj.state = this.state;
      this.isCollidable = false;
      this.alpha = 0.1;
      this.time = this.respawnTime;
    }
  }

}
TP.Pickup = Pickup;
Pickup.inCreate = true;
