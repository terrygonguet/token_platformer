TP.classes.push(function () {
class Neon extends createjs.Shadow {

  /**
   * @param {HTMLColor} color : an HTML color string, if omitted the color will be randomized
   */
  constructor(color, size = 7) {
    var c = color || neonColor();
    super(c, 0, 0, size);
  }

}
TP.Neon = Neon;
window.Neon = Neon;
})
