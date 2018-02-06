class Camera extends createjs.EventDispatcher {

  constructor() {
    super();
  }

  update(e) {
    for (var child of game.children) {
      if (child.position) {
        child.set({
          x: child.position.e(1), y: child.position.e(2)
        });
      }
    }
  }

}
TP.Camera = Camera;
