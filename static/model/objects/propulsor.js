TP.classes.push(function () {
class Propulsor extends createjs.Shape {

  constructor(params={}) {
    super();
    const settings = makeSettings({
      position: { x:0, y:0 },
      direction: { x:0, y:-1 },
      force: 4000,
    }, params);
    // this.id               = nextID();
    this.isPropulsor      = true;
    this.isCollidable     = true;
    this.inEditorList     = true;
    this.position         = settings.position;
    this.hitbox           = new SAT.Polygon(this.position.toSAT(), [
      new SAT.V(0,-30),
      new SAT.V(12,0),
      new SAT.V(-12,0),
    ]);
    this._direction       = settings.direction;
    this.direction        = settings.direction;
    this.force            = settings.force;
    this.ready            = true;
    this.cooldown         = 100;

    this.graphics.c().f("yellow").mt(-12,0).lt(12,0).lt(0,-30).cp();
  }

  set direction(val) {
    this._direction = val;
    var angle = this._direction.angleFrom($V([0,-1])) * Math.sign(this._direction.e(1));
    this.rotation = angle * 57.29578;
    this.hitbox.setAngle(angle);
  }

  get direction() {
    return this._direction;
  }

  getEditor(container, dragManager) {
    $(container)
      .append(`<p>ID : ${this.id}</p>`)
      .append(
       $("<label>Position : </label>")
         .append(`<input type='number' placeholder='x' size=4 id='pt1x' value=${this.position.e(1)}>`)
         .append(`<input type='number' placeholder='y' size=4 id='pt1y' value=${this.position.e(2)}>`)
      )
      .append(
       $("<label>Direction : </label>")
         .append(`<input type='number' placeholder='x' size=4 id='dirx' value=${this.direction.e(1)}>`)
         .append(`<input type='number' placeholder='y' size=4 id='diry' value=${this.direction.e(2)}>`)
      )
      .append(
       $("<label>Force : </label>")
         .append(`<input type='number' size=4 id='force' min=0 value=${this.force}>`)
      );
    dragManager.addPoint("position", this.position.add($V([0,25])), pos => {
      this.position = pos.subtract($V([0,25]));
      this.hitbox.pos = pos.subtract($V([0,25])).toSAT();
      $("#pt1x").val(this.position.e(1));
      $("#pt1y").val(this.position.e(2));
      dragManager.updatePoint("direction", this.position.add(this.direction.x(100)));
    });
    dragManager.addPoint("direction",
      this.position.add(this.direction.x(100)),
      pos => {
        this.direction = pos.subtract(this.position).toUnitVector();
        $("#dirx").val(this.direction.e(1));
        $("#diry").val(this.direction.e(2));
      });
    return ()=>{
     return new Propulsor({
       position: { x:Number($("#pt1x").val()), y:Number($("#pt1y").val()) },
       direction: { x:Number($("#dirx").val()), y:Number($("#diry").val()) },
       force: Number($("#force").val()),
     });
    };
  }

  toJSON() {
    return {
      type: "Propulsor",
      params: {
        position: { x:this.position.e(1), y:this.position.e(2) },
        direction: { x:this.direction.e(1), y:this.direction.e(2) },
        force: this.force,
      }
    };
  }

  onCollide(otherObj, collision) {
    if (otherObj.isPlayer && this.ready) {
      console.log(this, otherObj);
      otherObj.position = this.position.dup();
      otherObj.momentum = this.direction.x(this.force);
      this.ready = false;
      setTimeout(() => this.ready = true, this.cooldown);
    }
  }

}
// TP.Propulsor = Propulsor;
// Propulsor.inCreate = true;
// window.Propulsor = Propulsor;
})
