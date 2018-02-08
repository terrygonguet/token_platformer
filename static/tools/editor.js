function openEditor(c) {
  if (!debug || !c.getEditor) return;
  var apply = c.getEditor($("#editor").show().empty());
  input.enabledListeners.keydown = false;
  createjs.Ticker.paused = true;
  $("#editor")
  .append(
    $("<div></div>")
    .append(
      $("<button>Apply</button>").click(function () {
        game.removeChild(c);
        var newobj = apply();
        game.addChild(newobj);
        openEditor(newobj);
        game.update({ delta:0, paused:false });
      })
    )
    .append(
      $("<button>Remove</button>").click(function () {
        game.removeChild(c);
        closeEditor();
      })
    )
    .append(
      $("<button>JSON</button>").click(function () {
        $("#editor textarea").detach();
        var area = $("<textarea cols=50 rows=25></textarea>");
        var lvl = _.assign({}, game.levelData, { objects:[] });
        for (var child of game.children) {
          if (!child.toJSON) continue;
          lvl.objects.push(child.toJSON());
        }
        $(area).text(JSON.stringify(lvl, null, 2)).appendTo("#editor");
      })
    )
    .append(
      $("<button>Create</button>").click(function () {
        $("#editor").prepend(
          $("<label>Class name : </label>")
            .append("<input type='text' value='Plateform' id='className'/>")
            .append(
              $("<button>New</button>").click(()=>{
                game.addChild(new TP[$("#className").val()]());
                game.update({ delta:0, paused:false });
              })
            )
        );
      })
    )
    .append(
      $("<button>Cancel</button>").click(function () {
        closeEditor();
      })
    )
  );
}

function closeEditor() {
  createjs.Ticker.paused = false;
  $("#editor").hide();
  input.enabledListeners.keydown = true;
}

input.on("mousedown", e => {
  const local = game.camera.globalToLocal(input.mousePos).toSAT();
  for (var collidable of game.collidables) {
    const test = "pointIn" + (collidable.hitbox instanceof SAT.Circle ? "Circle" : "Polygon");
    if (SAT[test](local, collidable.hitbox)) {
      openEditor(collidable);
      break;
    }
  }
});
