class SpawnPoint extends createjs.DisplayObject {

  constructor(params={}) {
    super();
    const settings = makeSettings({
      point: { x:0, y:0 },
      state: "green"
    }, params);
    this.isSpawnPoint     = true;
    this.point            = settings.point;
    this.state            = settings.state;
  }

  spawn() {
    game.player.setPos(this.point.dup());
    game.player.state = this.state;
  }

  toJSON() {
    return {
      type: "SpawnPoint",
      params: {
        point: { x:this.point.e(1), y:this.point.e(2) },
        state: this.state
      }
    };
  }

}
TP.SpawnPoint = SpawnPoint;
SpawnPoint.inCreate = true;
