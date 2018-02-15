(function () {
  if(isMobile) {
    $(".mobile").show();
    debug = false;
    setTimeout(function setscale() {
      if (!game) setTimeout(setscale, 100);
      else game.scale = 0.7;
    }, 100);
    function touch(e) {
      e.preventDefault();
      screenfull.request();
      var tt = e.targetTouches[0];
      var el = $(e.target);
      if (el.attr("id") === "jump") {
        var evt = new createjs.Event("jump");
        e.repeat = e.type !== "touchstart";
        _.assign(evt, {
          originalEvent:e
        });
        input.dispatchEvent(evt);
      } else if (el.attr("id") === "horizontal") {
        var offset = el.offset();
        if (tt.clientX - offset.left < 0.5 * el.width()) {
          input.keys.left = true;
          input.keys.right = false;
        } else {
          input.keys.left = false;
          input.keys.right = true;
        }
      }
    }
    function stoptouch(e) {
      e.preventDefault();
      var el = $(e.target);
      if (el.attr("id") === "jump") {
        input.keys.jump = false;
      } else if (el.attr("id") === "horizontal") {
        input.keys.left = false;
        input.keys.right = false;
      }
    }
    document.addEventListener("touchstart", touch);
    document.addEventListener("touchmove", touch);
    document.addEventListener("touchend", stoptouch);
    document.addEventListener("touchcancel", stoptouch);
  }
})();
