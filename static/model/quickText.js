TP.classes.push(function () {
class QuickText extends createjs.Text {
  constructor(props = {})
  {
    super();
    let defaultSets = Object.assign({}, {
      text: "", color: "#EEE", font: "20px Joystix"
    }, props);
    this.set(defaultSets);
  }
}
TP.QuickText = QuickText;
window.QuickText = QuickText;
})
