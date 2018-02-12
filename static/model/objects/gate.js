/**
 * A Gate in the world
 */
 class Gate extends createjs.Shape {

   constructor(params={}) {
     super();
     const settings = makeSettings({
       pt1: $V([0,0]),
       pt2: $V([100,0]),
       state: "green",
     }, params);
     // this.id             = nextID();
     this.isGate         = true;
     this.isCollidable   = true;
     this.isSolid        = true;
     this.inEditorList   = true;
     this.state          = settings.state;
     this.color          = game.player.colors[this.state];
     this.points         = null;
     this.hitbox         = null;
     this.position       = settings.pt1.dup();
     this.pt1            = settings.pt1;
     this.pt2            = settings.pt2;

     this.redraw();
   }

   redraw() {
     const pt2offset = this.pt2.subtract(this.pt1);
     const thickDir = pt2offset.toUnitVector().rotate(Math.PI/2, Vector.Zero(2));
     this.points = [
       Vector.Zero(2).add(thickDir),
       pt2offset.add(thickDir),
       Vector.Zero(2).subtract(thickDir),
       pt2offset.subtract(thickDir),
     ];
     this.hitbox = new SAT.Polygon(this.pt1.toSAT(), this.points.map(p => p.toSAT()));
     this.graphics.c().s(this.color).ss(3).mt(0,0).lt(...this.points[1].elements);
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
      );
    dragManager.addPoint("pt1", this.position, pos => {
      this.position = pos.dup();
      this.pt1 = pos.dup();
      this.hitbox.pos = pos.toSAT();
      dragManager.updatePoint("pt2", this.pt2);
      this.redraw();
      $("#pt1x").val(this.position.e(1));
      $("#pt1y").val(this.position.e(2));
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
       }
     };
   }

   update(e) {
     this.isSolid = game.player.state !== this.state;
   }

   // onCollide(otherObj, collision) {
   //
   // }

 }
 TP.Gate = Gate;
Gate.inCreate = true;
