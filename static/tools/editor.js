class Editor {

  static get object() {
    return game.gbid(Editor.objID);
  }

  static set object(val) {
    Editor.objID = (!val ? null : val.id);
  }

  static create() {
    game.addChild(new TP[Editor.ddlClassName.val()]());
    Editor.open("create");
    // game.update({ delta:0, paused:false });
  }

  static apply() {
    game.removeChild(Editor.object);
    var obj = (Editor.objMaker ? Editor.objMaker() : null);
    Editor.objID = obj.id;
    game.addChild(obj);
    Editor.open();
    // game.update({ delta:0, paused:false });
  }

  static remove() {
    game.removeChild(Editor.object);
    Editor.close();
  }

  static toJSON() {
    Editor.txtJSON.show().text(JSON.stringify(game.toJSON(), null, 2));
  }

  static open(type="editor") {
    if (!debug) return;
    Editor.containers.hide();
    game.gbcs(DragManager).forEach(c => c.visible = false);
    switch (type) {
      case "editor":
        if (!Editor.object) return;
        else if (Editor.object.getEditor) {
          Editor.propsContainer.empty().show();
          const id = this.objID;
          var manager = game.children.find(c => c.objID === id);
          if (!manager) {
            manager = new DragManager(Editor.object);
            game.addChild(manager);
          }
          manager.visible = true;
          Editor.objMaker = Editor.object.getEditor(Editor.propsContainer, manager);
          Editor.object.on("removed", () => game.removeChild(manager));
        }
        Editor.btnContainer.show();
        break;
      case "create":
        Editor.createContainer.show();
        Editor.propsContainer.empty().show();
        for (let object of game.children) {
          if (object.toJSON && object.inEditorList) {
            $(`<p objID='${object.id}'>${object.toJSON().type} : ${object.id}</p>`).click(function (e) {
              Editor.objID = Number($(this).attr("objID"));
              Editor.containers.hide();
              Editor.open();
            }).appendTo(Editor.propsContainer);
          }
        }
        break;
    }
    $("input", Editor.el).keydown(e => e.key==="Enter" && Editor.btnApply.click() || true)
    Editor.el.show();
    input.enableMouseMouve(true);
    Editor.cursorPos.show();
    input.enabledListeners.keydown = false;
    createjs.Ticker.paused = true;
    // game.update({ delta:0, paused:false });
  }

  static close() {
    Editor.object = null;
    Editor.objMaker = null;
    Editor.el.hide();
    Editor.containers.hide();
    input.enableMouseMouve(false);
    createjs.Ticker.paused = false;
    input.enabledListeners.keydown = true;
    game && game.gbcs(DragManager).forEach(c => c.visible = false);
  }

}
TP.Editor = Editor;

class DragManager extends createjs.Container {

  constructor(object) {
    super();
    this.points      = {};
    this.object      = object;
    this.objID       = object.id;
    this._visible    = true;
  }

  get visible() {
    return this._visible;
  }

  set visible(val) {
    this.children && this.children.forEach(c => {
      var displayPos = game.camera.localToGlobal(this.points[c.name].pos);
      c.set({ x:displayPos.e(1), y:displayPos.e(2) });
    });
    this._visible = val;
  }

  addPoint(name, startPos, callback) {
    if (this.points[name]) return ;
    this.points[name] = {
      pos: startPos.dup(), callback: callback.bind(this.object)
    };
    const dragAnchor = new createjs.Shape();
    dragAnchor.graphics.c().f(`rgba(${0x88},${0x88},${0x88},0.3)`).s("#EEE").dc(0,0,10);
    dragAnchor.on("pressmove", () => {
      this.onDrag(name, $V([game.mouseX, game.mouseY]));
    });
    var displayPos = game.camera.localToGlobal(startPos);
    dragAnchor.set({ x:displayPos.e(1), y:displayPos.e(2), name, isDragAnchor:true });
    this.addChild(dragAnchor);
  }

  updatePoint(name, pos) {
    if (!this.points[name]) return;
    this.points[name].pos = pos.dup();
    var displayPos = game.camera.localToGlobal(pos);
    this.children.find(c => c.name === name).set({ x:displayPos.e(1), y:displayPos.e(2) });
  }

  onDrag(name, newPos) {
    this.children.find(c => c.name === name).set({
      x:newPos.e(1), y:newPos.e(2)
    });
    this.points[name].pos = game.camera.globalToLocal(newPos).round();
    this.points[name].callback(this.points[name].pos);
    // game.update({ delta:0, paused:false });
  }
}
TP.Editor.DragManager = DragManager;

TP.classes.push(function () {
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
  Editor.cursorPos        = $("<p></p>").css({ position:"absolute", "pointer-events":"none", "padding-left":20 }).appendTo(document.body).hide();
  Editor.containers       = $([Editor.propsContainer[0], Editor.createContainer[0], Editor.btnContainer[0], Editor.txtJSON[0], Editor.cursorPos[0]]);
  Editor.objID            = null;
  Editor.objMaker         = null;
  Editor.dragManagers     = {};

  Editor.el
    .append(
      Editor.createContainer
      .append(
        $("<label>Class name : </label>")
        .append(Editor.ddlClassName)
        .append(Editor.btnNew)
        .append(Editor.btnJSON.clone(true))
        .append(Editor.btnClose.clone(true))
      )
      .append(
        $("<label>Jump to level : </label>")
        .append(
          $("<input type='text' id='txblvl' list='levels' value='lvl1'/>").keydown(e => e.key==="Enter" && $("#btnJump").click() || true)
        )
        .append(
          $("<button id='btnJump' class='NeonButton'>Jump</button>").click(e => game.loadLevel($("#txblvl").val()))
        )
      )
      .append(
        $("<label>Save level as : </label>")
        .append(
          $("<input type='text' id='txbsave' list='levels' value='lvl1'/>").keydown(e => e.key==="Enter" && $("#btnSave").click() || true)
        )
        .append(
          $("<button id='btnSave' class='NeonButton'>Save</button>").click(function (e) {
            $(this).attr("disabled", "");
            game.saveLevel($("#txbsave").val(), ()=>{
              var message = $("<label>Saved</label>").insertAfter(Editor.createContainer);
              $(this).removeAttr("disabled");
              setTimeout(function () {
                message.detach();
              }, 1500);
            });
          })
        )
      )
    )
    .append(Editor.propsContainer)
    .append(
      Editor.btnContainer
        .append(Editor.btnApply)
        .append(Editor.btnRemove)
        .append(Editor.btnJSON)
        .append(Editor.btnClose)
    )
    .append(Editor.txtJSON);

  function showGrid() {
    var grid = new createjs.Shape();
    grid.position = Vector.Zero(2);
    grid.isGrid = true;
    grid.dontRemove = true;
    grid.graphics.c().s("rgba(255,255,255,0.3)");
    for (var i = -3000; i <= 3000; i+=50) {
      grid.graphics.mt(i, -3000).lt(i, 3000);
    }
    for (var j = -3000; j < 3000; j+=50) {
      grid.graphics.mt(-3000, j).lt(3000, j);
    }
    game.addChildAt(grid, 0);
  }

  function hideGrid() {
    game.removeChild(game.gbc("Grid"));
  }

  setTimeout(function tryGrid() {
    if (game) {
      debug && showGrid();
      game.on("levelloaded", e => {
        $("#txbsave, #txblvl").val(e.level);
      });
      Editor.close();

      for (var className in TP) {
        if (TP[className].inCreate) {
          Editor.ddlClassName.append(`<option value="${className}">${className}</option>`);
        }
      }
      $("#className:first-child").attr("selected", "selected");

      input.on("mouse1", e => {
        if (!debug) return;
        const objs = game.getObjectsUnderPoint(...input.mousePos.elements);
        const anchor = objs.find(o => o.isDragAnchor);
        if (!anchor && objs[0] && objs[0].inEditorList) {
          Editor.object = objs[0];
          Editor.open();
        }
      });
      input.on("mouse2", e => Editor.open("create"));
      input.on("mousemove", e => {
        if (!debug) {
          Editor.cursorPos.hide();
          return;
        }
        var pos = game.camera.globalToLocal(input.mousePos);
        Editor.cursorPos
          .show()
          .text(pos.round().inspect())
          .css({ top:input.mousePos.e(2), left:input.mousePos.e(1) });
      });
      input.on("debug", () => {
        if (debug) showGrid();
        else hideGrid();
      });
      window.addEventListener("keydown", e => e.key==="Escape" && Editor.close());

      $(document.body).append(`
      <datalist id="states">
        <option value="green"/>
        <option value="red"/>
      </datalist>`);

      $.getJSON("/levellist", res => {
        var datalist = $("<datalist id='levels'></datalist>");
        for (let lvl of res) {
          datalist.append($("<option value='"+lvl+"'/> list='levels'"));
        }
        $(document.body).append(datalist);
      });
    }
    else setTimeout(tryGrid, 50);
  }, 50);
});
