TP.classes.push(function () {
class BouncyPlateform extends Plateform {

  constructor(params={}) {
    const settings = makeSettings({
      bounciness: 0.9,
    }, params);
    super(settings);
    this.isBouncyPlateform   = true;
    this.bounciness          = settings.bounciness;

    this.body.label = "BouncyPlateform";
    this.body.restitution = settings.bounciness;
  }

  getEditor(container, dragManager) {
    var apply = super.getEditor(container, dragManager);
    $(container)
      .append(
        $("<label>Bounciness : </label>")
          .append(`<input type='number' min=0 max=1 step=0.05 size=4 id='bounciness' value=${this.bounciness}>`)
      );
    return ()=>{
      return new BouncyPlateform(_.merge(apply().toJSON().params, { bounciness: Number($("#bounciness").val()).clamp(0,1) }));
    };
  }

  toJSON() {
    return _.merge(super.toJSON(), {
      type:"BouncyPlateform",
      params: { bounciness: this.bounciness }
    });
  }

}
TP.BouncyPlateform = BouncyPlateform;
BouncyPlateform.inCreate = true;
window.BouncyPlateform = BouncyPlateform;
})
