/**
 * A plateform in the world
 */
 class Plateform extends createjs.Shape {

   constructor(params) {
     super();
     const settings = makeSettings({
       thickness: 20,
       edgeOffset: 15,
       strokeColor: "#EEE",
       fillColor: "#000",
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
     this.position       = settings.pt1;

     this.graphics.c().f(this.fillColor).s(this.strokeColor).ss(3)
      .mt(0,0)
      .lt(...this.points[1].elements)
      .lt(...this.points[2].elements)
      .lt(...this.points[3].elements)
      .lt(0,0).cp();
   }

   // update(e) {
   //
   // }

   // onCollide(otherObj, collision) {
   //
   // }

 }
 TP.Plateform = Plateform;
