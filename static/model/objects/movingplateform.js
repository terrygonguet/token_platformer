TP.classes.push(function () {
class MovingPlateform extends Plateform {

  constructor(params={}) {
    const settings = makeSettings({
      moveTo: { x:100, y:0 },
      speed: 50,
    }, params);
    super(settings);
    this.isMovingPlateform   = true;
    this.moveTo              = settings.moveTo;
    this.speed               = settings.speed;
    this.direction           = 1;
  }

  update(e) {
    if (this.position.distanceFrom(this.moveTo) <= this.speed * e.sdelta) this.direction = -1;
    else if (this.position.distanceFrom(this.pt1) <= this.speed * e.sdelta) this.direction = 1;
    const direction = this.moveTo.subtract(this.pt1).toUnitVector().x(this.direction * this.speed * e.sdelta);
    this.position = this.position.add(direction);
    Matter.Body.setPosition(this.body, this.position.toM());
  }

  getEditor(container, dragManager) {
    var apply = super.getEditor(container, dragManager);
    $(container)
      .append(
        $("<label>Move to  </label>")
          .append(`X : <input type='number' placeholder='x' size=4 id='mt1x' value=${this.moveTo.e(1)}>`)
          .append(`Y : <input type='number' placeholder='y' size=4 id='mt1y' value=${this.moveTo.e(2)}>`)
      )
      .append(
        $("<label>Speed  </label>")
          .append(`<input type='text' size=4 id='speed' value=${this.speed}>`)
      );
    dragManager.addPoint("moveTo", this.moveTo, pos => {
      this.moveTo = pos.dup();
      this.direction = 1;
      this.position = this.pt1;
      $("#mt1x").val(this.moveTo.e(1));
      $("#mt1y").val(this.moveTo.e(2));
    });
    return ()=>{
      return new MovingPlateform(_.merge(apply().toJSON().params, {
        moveTo: { x:Number($("#mt1x").val()), y:Number($("#mt1y").val()) },
        speed: Number($("#speed").val()),
      }));
    };
  }

  toJSON() {
    return _.merge(super.toJSON(), {
      type:"MovingPlateform",
      params: {
        moveTo: { x:this.moveTo.e(1), y:this.moveTo.e(2) },
        speed: this.speed,
      }
    });
  }

}
TP.MovingPlateform = MovingPlateform;
MovingPlateform.inCreate = true;
window.MovingPlateform = MovingPlateform;
})
