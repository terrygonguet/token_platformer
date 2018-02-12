class Camera extends createjs.EventDispatcher {

  constructor() {
    super();
    this.center = $V([ 0,0 ]);
  }

  get smallSide() {
    return innerWidth < innerHeight ? innerWidth : innerHeight;
  }

  get bigSide() {
    return innerWidth > innerHeight ? innerWidth : innerHeight;
  }

  update(e) {
    if (!game.player) return;
    const playerPos = game.player.position.dup();
    const dist = this.center.distanceFrom(playerPos);
    if (dist > 0.8 * this.bigSide) {
      this.center = playerPos;
    } else if (dist > 0.3 * this.smallSide) {
      var diff = playerPos.subtract(this.center);
      this.center = this.center.add(diff.toUnitVector().x(dist - 0.3 * this.smallSide));
    }
    for (var child of game.children) {
      if (child.position) {
        var screenPos = this.localToGlobal(child.position);
        child.set({
          x: screenPos.e(1), y: screenPos.e(2)
        });
      }
    }
  }

  globalToLocal(pos) {
    return pos.add(this.center).subtract($V([ innerWidth/2, innerHeight/2 ]));
  }

  localToGlobal(pos) {
    return $V([ innerWidth/2, innerHeight/2 ]).subtract(this.center).add(pos);
  }

}
TP.Camera = Camera;
