class Editor {

  static get object() {
    return game.children.find(c => c.id === Editor.objID);
  }

  static set object(val) {
    Editor.objID = (!val ? null : val.id);
  }

  static create() {
    game.addChild(new TP[Editor.ddlClassName.val()]());
    game.update({ delta:0, paused:false });
  }

  static apply() {
    game.removeChild(Editor.object);
    Editor.object = (Editor.objMaker ? Editor.objMaker() : null);
    game.addChild(Editor.object);
    Editor.open();
    game.update({ delta:0, paused:false });
  }

  static remove() {
    game.removeChild(Editor.object);
    Editor.close();
  }

  static toJSON() {
    var lvl = _.assign({}, game.levelData, { objects:[] });
    for (var child of game.children) {
      if (!child.toJSON) continue;
      lvl.objects.push(child.toJSON());
    }
    Editor.txtJSON.show().text(JSON.stringify(lvl, null, 2));
  }

  static open(type="editor") {
    if (!debug) return;
    switch (type) {
      case "editor":
        if (!Editor.object || !Editor.object.getEditor) return;
        Editor.objMaker = Editor.object.getEditor(Editor.propsContainer.empty().show());
        Editor.btnContainer.show();
        break;
      case "create":
        Editor.createContainer.show();
        break;
    }
    Editor.el.show();
    input.enabledListeners.keydown = false;
    createjs.Ticker.paused = true;
  }

  static close() {
    Editor.object = null;
    Editor.objMaker = null;
    Editor.el.hide();
    Editor.containers.hide();
    createjs.Ticker.paused = false;
    input.enabledListeners.keydown = true;
  }

}
TP.Editor = Editor;

Editor.el               = $("#editor");
Editor.propsContainer   = $("<div id='propsContainer'></div>");
Editor.btnContainer     = $("<div id='btnContainer'></div>");
Editor.createContainer  = $("<div id='createContainer'></div>");
Editor.btnApply         = $("<button class='NeonButton'>Apply</button>").click(e => Editor.apply());
Editor.btnRemove        = $("<button class='NeonButton'>Remove</button>").click(e => Editor.remove());
Editor.btnJSON          = $("<button class='NeonButton'>JSON</button>").click(e => Editor.toJSON());
Editor.btnClose         = $("<button class='NeonButton'>Close</button>").click(e => Editor.close());
Editor.txtJSON          = $("<textarea cols=50 rows=25></textarea>");
Editor.ddlClassName     = $("<select id='className'></select>");
Editor.btnNew           = $("<button class='NeonButton'>New</button>").click(e => Editor.create());
Editor.containers       = $([Editor.propsContainer[0], Editor.createContainer[0], Editor.btnContainer[0], Editor.txtJSON[0]]);
Editor.objID            = null;
Editor.objMaker         = null;

Editor.el
  .append(Editor.propsContainer)
  .append(
    Editor.btnContainer
      .append(Editor.btnApply)
      .append(Editor.btnRemove)
      .append(Editor.btnJSON)
      .append(Editor.btnClose)
  )
  .append(
    Editor.createContainer
      .append(
        $("<label>Class name : </label>")
          .append(Editor.ddlClassName)
          .append(Editor.btnNew)
          .append(Editor.btnClose.clone(true))
      )
  )
  .append(Editor.txtJSON);

Editor.close();

for (var className in TP) {
  if (TP[className].inCreate) {
    Editor.ddlClassName.append(`<option value="${className}">${className}</option>`);
  }
}
$("#className:first-child").attr("selected", "selected");

input.on("mouse1", e => {
  if (!debug) return;
  const local = game.camera.globalToLocal(input.mousePos).toSAT();
  for (var collidable of game.collidables) {
    const test = "pointIn" + (collidable.hitbox instanceof SAT.Circle ? "Circle" : "Polygon");
    if (SAT[test](local, collidable.hitbox)) {
      Editor.object = collidable;
      Editor.open();
      break;
    }
  }
});
input.on("mouse2", e => Editor.open("create"));

$(document.body).append(`
<datalist id="states">
  <option value="green"/>
  <option value="red"/>
</datalist>`);
