/**
 * A plateform in the world
 */
 class Plateform extends createjs.Shape {

   constructor(params) {
     super();
     const pt2offset = params.pt2.subtract(params.pt1);
     this.id             = nextID();
     this.isPlateform    = true;
     this.isCollidable   = true;
     this.isSolid        = true;
     this.hitbox         = new SAT.Polygon(params.pt1.toSAT(), [
                             new SAT.V(),
                             pt2offset.toSAT()
                           ]);
     this.position       = params.pt1;

     this.graphics.c().s("#EEE").ss(3).mt(0,0).lt(...pt2offset.elements);

     this.set({ x: this.position.e(1), y: this.position.e(2) });
   }

   update(e) {

   }

   onCollide(otherObj, collision) {

   }

 }
 TP.Plateform = Plateform;
