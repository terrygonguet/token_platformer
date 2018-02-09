class ShittyPlateform extends Plateform {

  constructor(params={}) {
    const settings = makeSettings({
      disapearTime: 1000,
      respawnTime: 4000,
    }, params);
    super(settings);
    this.isShittyPlateform   = true;
    this.disapearTime        = settings.disapearTime;
    this.respawnTime         = settings.respawnTime;
    this.time                = 0;
    this.state               = "fixed"; // enum { fixed, crumbling, broken }
  }

  onCollide(otherObj) {
    if (this.state === "fixed" && otherObj.isPlayer) {
      this.state = "crumbling";
      this.time = this.disapearTime;
    }
  }

  update(e) {
    switch (this.state) {
      case "fixed":
        break;
      case "crumbling":
        this.alpha = this.time / this.disapearTime;
        if ((this.time -= e.delta) <= 0) {
          this.state = "broken";
          this.time = this.respawnTime;
          this.isSolid = false;
        }
        break;
      case "broken":
        if ((this.time -= e.delta) <= 0) {
          this.state = "fixed";
          this.time = 0;
          this.alpha = 1;
          this.isSolid = true;
        }
        break;
    }
  }

  getEditor(container) {
    var apply = super.getEditor(container);
    $(container)
      .append(
        $("<label>Disapear time : </label>")
          .append(`<input type='number' min=0 size=4 id='disapearTime' value=${this.disapearTime}>`)
      )
      .append(
        $("<label>Respawn time : </label>")
          .append(`<input type='number' min=0 size=4 id='respawnTime' value=${this.respawnTime}>`)
      );
    return ()=>{
      return new ShittyPlateform(_.merge(apply().toJSON().params, {
        disapearTime: Number($("#disapearTime").val()),
        respawnTime: Number($("#respawnTime").val()),
      }));
    };
  }

  toJSON() {
    return _.merge(super.toJSON(), {
      type:"ShittyPlateform",
      params: {
        disapearTime: this.disapearTime,
        respawnTime: this.respawnTime,
      }
    });
  }

}
TP.ShittyPlateform = ShittyPlateform;
ShittyPlateform.inCreate = true;
