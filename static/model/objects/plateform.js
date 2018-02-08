/**
 * A plateform in the world
 */
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
     }, params);
     const pt2offset = settings.pt2.subtract(settings.pt1);
     const thickDir = pt2offset.toUnitVector().rotate(Math.PI/2, Vector.Zero(2)).x(settings.thickness);
     this.id             = nextID();
     this.isPlateform    = true;
     this.isCollidable   = true;
     this.isSolid        = true;
     this.thickness      = settings.thickness;
     this.edgeOffset     = settings.edgeOffset;
     this.strokeColor    = settings.strokeColor;
     this.fillColor      = settings.fillColor;
     this.points         = [
       $V([0,0]), pt2offset,
       pt2offset.subtract(pt2offset.toUnitVector().x(settings.edgeOffset)).add(thickDir),
       Vector.Zero(2).add(pt2offset.toUnitVector().x(settings.edgeOffset)).add(thickDir),
     ];
     this.hitbox         = new SAT.Polygon(settings.pt1.toSAT(), this.points.map(p => p.toSAT()));
     this.position       = settings.pt1.dup();
     this.pt1            = settings.pt1;
     this.pt2            = settings.pt2;

     this.graphics.c().f(this.fillColor).s(this.strokeColor).ss(3)
      .mt(0,0)
      .lt(...this.points[1].elements)
      .lt(...this.points[2].elements)
      .lt(...this.points[3].elements)
      .lt(0,0).cp();
   }

   getEditor(container) {
     $(container)
      .append(
        $("<label>Point 1  </label>")
          .append(`X : <input type='number' placeholder='x' size=4 id='pt1x' value=${this.position.e(1)}>`)
          .append(`Y : <input type='number' placeholder='y' size=4 id='pt1y' value=${this.position.e(2)}>`)
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
      );
      return ()=>{
        return new Plateform({
          pt1: { x:Number($("#pt1x").val()), y:Number($("#pt1y").val()) },
          pt2: { x:Number($("#pt2x").val()), y:Number($("#pt2y").val()) },
          thickness: $("#thickness").val(),
          edgeOffset: $("#edgeOffset").val(),
          strokeColor: $("#strokeColor").val(),
          fillColor: $("#fillColor").val(),
        });
      };
   }

   toJSON() {
     return {
       type: "Plateform",
       params: {
         pt1: { x:this.position.e(1), y:this.position.e(2) },
         pt2: { x:this.pt2.e(1), y:this.pt2.e(2) },
         thickness: this.thickness,
         edgeOffset: this.edgeOffset,
         strokeColor: this.strokeColor,
         fillColor: this.fillColor,
       }
     };
   }

   // update(e) {
   //
   // }

   // onCollide(otherObj, collision) {
   //
   // }

 }
 TP.Plateform = Plateform;
Plateform.inCreate = true;
