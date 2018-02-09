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

  getEditor(container) {
    var apply = super.getEditor(container);
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
    return {
      type: "EndZone",
      params: _.merge(super.toJSON(), {
        nextLevel: this.nextLevel,
      })
    };
  }

}
TP.EndZone = EndZone;
EndZone.inCreate = true;
