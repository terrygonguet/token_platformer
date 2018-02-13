class DeathLine extends createjs.Shape {

  constructor(params={}) {
    super();
    const settings = makeSettings({
      height: 250
    }, params);
    // this.id               = nextID();
    this.isDeathLine      = true;
    this.inEditorList     = true;
    this.height           = settings.height;
    this.position         = $V([0,settings.height]);

    this.graphics.c().s("#E11").ss(2).mt(-2000,0).lt(2000,0);
  }

  update(e) {
    if(game.player.position.e(2) + game.player.radius > this.height) {
      game.children.find(c => c.isSpawnPoint).spawn();
    }
  }

  getEditor(container, dragManager) {
    $(container)
      .append(`<p>ID : ${this.id}</p>`)
      .append(
       $("<label>Radius : </label>")
         .append(`<input type='number' size=4 id='height' value=${this.height}>`)
      );
    dragManager.addPoint("height", this.position, pos => {
      this.height = pos.e(2);
      this.position = $V([0,this.height]);
      $("#height").val(this.height);
    });
    return ()=>{
     return new DeathLine({
       height: Number($("#height").val()),
     });
    };
  }

  toJSON() {
    return {
      type: "DeathLine",
      params: {
        height: this.height,
      }
    };
  }

}
TP.DeathLine = DeathLine;
DeathLine.inCreate = true;
