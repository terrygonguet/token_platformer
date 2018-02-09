class ForceZone extends Zone {

  constructor(params={}) {
    const settings = makeSettings({
      acceleration: 1000,
      direction: { x:0, y:-1 },
    }, params);
    super(settings);
    this.isForceZone   = true;
    this.acceleration  = settings.acceleration;
    this.direction     = settings.direction.toUnitVector();
    this.onTouch       = function (player, collision, e) {
      player.momentum = player.momentum.add(this.direction.x(this.acceleration * e.sdelta));
      console.log(player.momentum.inspect());
    };
  }

  getEditor(container) {
    var apply = super.getEditor(container);
    $(container)
     .append(
       $("<label>Acceleration : </label>")
         .append(`<input type='number' min=0 size=4 id='acceleration' value=${this.acceleration}>`)
     )
      .append(
        $("<label>Direction : </label>")
        .append(`X : <input type='number' placeholder='x' size=4 id='dirx' value=${this.direction.e(1)}>`)
        .append(`Y : <input type='number' placeholder='y' size=4 id='diry' value=${this.direction.e(2)}>`)
      );
     return ()=>{
       return new ForceZone(_.merge(apply().toJSON().params, {
         acceleration: $("#acceleration").val(),
         direction: { x:$("#dirx").val(), y:$("#diry").val() },
       }));
     };
  }

  toJSON() {
    return {
      type: "ForceZone",
      params: _.merge(super.toJSON(), {
        acceleration: this.acceleration,
        direction: { x:this.direction.e(1), y:this.direction.e(2) },
      })
    };
  }

}
TP.ForceZone = ForceZone;
ForceZone.inCreate = true;
