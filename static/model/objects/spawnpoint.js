class SpawnPoint extends createjs.DisplayObject {

  constructor(params={}) {
    super();
    const settings = makeSettings({
      point: { x:0, y:0 },
      state: "green"
    }, params);
    // this.id               = nextID();
    this.isSpawnPoint     = true;
    this.inEditorList     = true;
    this.point            = settings.point;
    this.state            = settings.state;
  }

  spawn() {
    Matter.Body.set(game.player.body, {
      position: this.point.toM(),
      velocity: { x:0, y:0 },
    })
    game.player.state = this.state;
  }

  getEditor(container, dragManager) {
    $(container)
     .append(`<p>ID : ${this.id}</p>`)
     .append(
       $("<label>Respawn point : </label>")
         .append(`<input type='number' placeholder='x' size=4 id='pt1x' value=${this.point.e(1)}>`)
         .append(`<input type='number' placeholder='y' size=4 id='pt1y' value=${this.point.e(2)}>`)
     )
     .append(
       $("<label>State : </label>")
         .append(`<input type='text' size=4 id='state' list='states' value=${this.state}>`)
     );
   dragManager.addPoint("point", this.point, pos => {
     this.point = pos;
     $("#pt1x").val(this.point.e(1));
     $("#pt1y").val(this.point.e(2));
   });
   return ()=>{
     return new SpawnPoint({
       point: { x:Number($("#pt1x").val()), y:Number($("#pt1y").val()) },
       state: $("#state").val(),
     });
   };
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
