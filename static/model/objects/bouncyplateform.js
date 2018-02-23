TP.classes.push(function () {
class BouncyPlateform extends Plateform {

  constructor(params={}) {
    const settings = makeSettings({
      bounciness: 0.9,
    }, params);
    super(settings);
    this.isBouncyPlateform   = true;
    this.bounciness          = settings.bounciness;
  }

  onCollide(otherObj, collision, e) {
    if (otherObj.isPlayer) {
      otherObj.momentum.elements[1] *= -this.bounciness;
    }
  }

  getEditor(container, dragManager) {
    var apply = super.getEditor(container, dragManager);
    $(container)
      .append(
        $("<label>Bounciness : </label>")
          .append(`<input type='text' size=4 id='bounciness' value=${this.bounciness}>`)
      );
    return ()=>{
      return new BouncyPlateform(_.merge(apply().toJSON().params, { bounciness: Number($("#bounciness").val()) }));
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
// BouncyPlateform.inCreate = true;
// window.BouncyPlateform = BouncyPlateform;
})
