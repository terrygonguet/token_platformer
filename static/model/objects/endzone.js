class EndZone extends Zone {

  constructor(params={}) {
    const settings = makeSettings({
      nextLevel: "lvl1",
    }, params);
    super(settings);
    this.isEndZone     = true;
    this.nextLevel     = settings.nextLevel;
    this.onInside      = function () {
      game.loadLevel(this.nextLevel);
    };
  }

  getEditor(container, dragManager) {
    var apply = super.getEditor(container, dragManager);
    $(container)
     .append(
       $("<label>Next Level : </label>")
         .append(`<input type='text' size=4 id='nextLevel' value=${this.nextLevel}>`)
     );
     return ()=>{
       return new EndZone(_.merge(apply().toJSON().params, {
         nextLevel: $("#nextLevel").val(),
       }));
     };
  }

  toJSON() {
    return _.merge(super.toJSON(), {
      type: "EndZone",
      params: {
        nextLevel: this.nextLevel,
      }
    });
  }

}
TP.EndZone = EndZone;
EndZone.inCreate = true;
