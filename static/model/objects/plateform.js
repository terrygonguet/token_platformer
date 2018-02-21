/**
 * A plateform in the world
 */
 TP.classes.push(function () {
 class Plateform extends createjs.Shape {

   constructor(params={}) {
     super();
     const settings = makeSettings({
       pt1: $V([0,0]),
       pt2: $V([100,0]),
       thickness: 20,
       edgeOffset: 15,
       strokeColor: "#EEEEEE",
       fillColor: "#000000",
       friction: 1,
     }, params);
     // this.id             = nextID();
     this.isPlateform    = true;
     this.isCollidable   = true;
     this.isSolid        = true;
     this.inEditorList   = true;
     this.thickness      = settings.thickness;
     this.edgeOffset     = settings.edgeOffset;
     this.strokeColor    = settings.strokeColor;
     this.fillColor      = settings.fillColor;
     this.friction       = settings.friction;
     this.points         = null;
     this.body           = Matter.Body.create({ isStatic:true, friction:settings.friction, label:"Plateform" });
     this.pt1            = settings.pt1;
     this.pt2            = settings.pt2;
     this.position       = null;

     this.body.displayObject = this;

     this.redraw();
   }

   redraw() {
    const pt2offset = this.pt2.subtract(this.pt1);
    const thickDir = pt2offset.toUnitVector().rotate(Math.PI/2, Vector.Zero(2)).x(this.thickness);
    this.position = this.pt1.add(pt2offset.x(0.5)).add(thickDir.x(0.5));
    this.points = [
      $V([0,0]),
      pt2offset,
      pt2offset.subtract(pt2offset.toUnitVector().x(this.edgeOffset)).add(thickDir),
      Vector.Zero(2).add(pt2offset.toUnitVector().x(this.edgeOffset)).add(thickDir),
    ];
    Matter.Body.set(this.body, {
      vertices: this.points.map(p => p.toM()),
      position: this.position.toM()
    });
    var v = this.body.vertices.map(v => toSylv(v).subtract(this.position));
    this.graphics.c().f(this.fillColor).s(this.strokeColor).ss(3)
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
        $("<label>Thickness : </label>")
          .append(`<input type='number' placeholder='20' size=4 id='thickness' min=0 value=${this.thickness}>`)
      )
      .append(
        $("<label>Edge offset : </label>")
          .append(`<input type='number' placeholder='15' size=4 id='edgeOffset' min=0 value=${this.edgeOffset}>`)
      )
      .append(
        $("<label>Edge color : </label>")
          .append(`<input type='color' size=4 id='strokeColor' value=${this.strokeColor}>`)
      )
      .append(
        $("<label>Fill color : </label>")
          .append(`<input type='color' size=4 id='fillColor' value=${this.fillColor}>`)
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
      return new Plateform({
        pt1: { x:Number($("#pt1x").val()), y:Number($("#pt1y").val()) },
        pt2: { x:Number($("#pt2x").val()), y:Number($("#pt2y").val()) },
        thickness: Number($("#thickness").val()),
        edgeOffset: Number($("#edgeOffset").val()),
        strokeColor: $("#strokeColor").val(),
        fillColor: $("#fillColor").val(),
        friction: $("#friction").val(),
      });
    };
   }

   toJSON() {
     return {
       type: "Plateform",
       params: {
         pt1: { x:this.pt1.e(1), y:this.pt1.e(2) },
         pt2: { x:this.pt2.e(1), y:this.pt2.e(2) },
         thickness: this.thickness,
         edgeOffset: this.edgeOffset,
         strokeColor: this.strokeColor,
         fillColor: this.fillColor,
         friction: this.friction,
       }
     };
   }

 }
 TP.Plateform = Plateform;
Plateform.inCreate = true;
window.Plateform = Plateform;
})
