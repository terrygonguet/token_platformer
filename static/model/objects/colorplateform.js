class ColorPlateform extends Plateform {

  constructor(params={}) {
    const settings = makeSettings({
      state: "green",
      strokeColor: game.player.colors["green"],
    }, params);
    super(settings);
    this.isColorPlateform   = true;
    this.state              = settings.state;
  }

  onCollide(otherObj, collision, e) {
    if (otherObj.isPlayer) otherObj.state = this.state;
  }

  getEditor(container, dragManager) {
    var apply = super.getEditor(container, dragManager);
    $(container)
      .append(
        $("<label>State to switch to : </label>")
          .append(`<input type='text' size=4 id='state' list='states' value=${this.state}>`)
      );
    return ()=>{
      return new ColorPlateform(_.merge(apply().toJSON().params, { state: $("#state").val() }));
    };
  }

  toJSON() {
    return _.merge(super.toJSON(), {
      type:"ColorPlateform",
      params: { state: this.state }
    });
  }

}
TP.ColorPlateform = ColorPlateform;
ColorPlateform.inCreate = true;
