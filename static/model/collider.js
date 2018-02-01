/**
 * Manages collisions every updates
 */
 class Collider extends createjs.EventDispatcher {

  constructor() {
    super();
    this.cache = {};
  }

  update() {
    for (let collidable1 of game.collidables) {
      for (let collidable2 of game.collidables) {

        let cache = this.cache[collidable1.id + "_" + collidable2.id];
        if (cache) {
          cache.res.overlapN.reverse();
          cache.res.overlapV.reverse();
          cache.collided && collidable1.onCollide && collidable1.onCollide(collidable2, cache.res);
          continue;
        }

        const test = "test" +
          (collidable1.hitbox instanceof SAT.Circle ? "Circle" : "Polygon") +
          (collidable2.hitbox instanceof SAT.Circle ? "Circle" : "Polygon");
        const res = new SAT.Response();
        const collided = SAT[test](collidable1.hitbox, collidable2.hitbox, res);
        collided && collidable1.onCollide && collidable1.onCollide(collidable2, res);
        this.cache[collidable2.id + "_" + collidable1.id] = { collided, res };
      }
    }
  }

}
