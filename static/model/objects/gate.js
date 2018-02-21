/**
 * A Gate in the world
 */
 TP.classes.push(function () {
 class Gate extends createjs.Shape {

  constructor(params={}) {
   super();
   const settings = makeSettings({
     pt1: $V([0,0]),
     pt2: $V([100,0]),
     state: "green",
     friction: 0,
   }, params);
   // this.id             = nextID();
   this.isGate         = true;
   this.isCollidable   = true;
   this.isSolid        = true;
   this.inEditorList   = true;
   this.state          = settings.state;
   this.color          = game.player.colors[this.state];
   this.friction       = settings.friction;
   this.points         = null;
   this.body           = Matter.Body.create({ isStatic:true, label:"Gate" });
   this.pt1            = settings.pt1;
   this.pt2            = settings.pt2;
   this.position       = null;

   this.body.displayObject = this;
   Matter.Body.set(this.body, "friction", settings.friction);

   this.redraw();
  }

  redraw() {
   const pt2offset = this.pt2.subtract(this.pt1);
   const thickDir = pt2offset.toUnitVector().rotate(Math.PI/2, Vector.Zero(2)).x(2);
   this.position = this.pt1.add(pt2offset.x(0.5));
   this.points = [
     Vector.Zero(2).subtract(thickDir),
     pt2offset.subtract(thickDir),
     pt2offset.add(thickDir),
     Vector.Zero(2).add(thickDir),
   ];
   Matter.Body.set(this.body, {
     vertices: this.points.map(p => p.toM()),
     position: this.position.toM()
   });
   // this.graphics.c().s(this.color).ss(3)
   //  .mt(...pt2offset.x(-0.5).elements)
   //  .lt(...pt2offset.x(0.5).elements);
   var v = this.body.vertices.map(v => toSylv(v).subtract(this.position));
   this.graphics.c().f(this.color)
    .mt(...v[0].elements)
    .lt(...v[1].elements)
    .lt(...v[2].elements)
    .lt(...v[3].elements)
    .cp();
  }

  getEditor(container, dragManager) {
   $(container)
    .append(`<p>ID : ${this.id}</p>`)
    .append(
      $("<label>Point 1  </label>")
        .append(`X : <input type='number' placeholder='x' size=4 id='pt1x' value=${this.pt1.e(1)}>`)
        .append(`Y : <input type='number' placeholder='y' size=4 id='pt1y' value=${this.pt1.e(2)}>`)
    )
    .append(
      $("<label>Point 2  </label>")
        .append(`X : <input type='number' placeholder='x' size=4 id='pt2x' value=${this.pt2.e(1)}>`)
        .append(`Y : <input type='number' placeholder='y' size=4 id='pt2y' value=${this.pt2.e(2)}>`)
    )
    .append(
      $("<label>State : </label>")
        .append(`<input type='text' size=4 id='state' list='states' min=0 value=${this.state}>`)
    )
    .append(
      $("<label>Friction : </label>")
        .append(`<input type='number' size=4 id='friction' max=1 min=0 step=0.01 value=${this.friction}>`)
    );
  dragManager.addPoint("pt1", this.pt1, pos => {
    this.pt1 = pos.dup();
    dragManager.updatePoint("pt2", this.pt2);
    this.redraw();
    $("#pt1x").val(this.pt1.e(1));
    $("#pt1y").val(this.pt1.e(2));
  });
  dragManager.addPoint("pt2", this.pt2, pos => {
    this.pt2 = pos.dup();
    dragManager.updatePoint("pt1", this.pt1);
    this.redraw();
    $("#pt2x").val(this.pt2.e(1));
    $("#pt2y").val(this.pt2.e(2));
  });
  return ()=>{
    return new Gate({
      pt1: { x:Number($("#pt1x").val()), y:Number($("#pt1y").val()) },
      pt2: { x:Number($("#pt2x").val()), y:Number($("#pt2y").val()) },
      state: $("#state").val(),
      friction: Number($("#friction").val()),
    });
  };
  }

  toJSON() {
   return {
     type: "Gate",
     params: {
       pt1: { x:this.pt1.e(1), y:this.pt1.e(2) },
       pt2: { x:this.pt2.e(1), y:this.pt2.e(2) },
       state: this.state,
       friction: this.friction,
     }
   };
  }

  update(e) {
    if (game.player.state !== this.state && !this.isSolid) {
      Matter.World.add(game.world, this.body);
      this.isSolid = true;
    } else if (game.player.state === this.state && this.isSolid) {
      Matter.Composite.remove(game.world, this.body);
      this.isSolid = false;
    }
  }

 }
 TP.Gate = Gate;
Gate.inCreate = true;
window.Gate = Gate;
})
