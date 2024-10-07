var ImageEditor = require("tui-image-editor");
var blackTheme = require("./black-theme.js");

var instance = new ImageEditor(document.querySelector("#tui-image-editor"), {
  includeUI: {
    loadImage: {
      path: "img/sampleImage.jpg",
      name: "SampleImage",
    },
    theme: blackTheme, // or whiteTheme
    menu: ["shape", "filter"],
    initMenu: "filter",
    uiSize: {
      width: "1000px",
      height: "700px",
    },
    menuBarPosition: "bottom",
  },
  cssMaxWidth: 700,
  cssMaxHeight: 500,
  selectionStyle: {
    cornerSize: 20,
    rotatingPointOffset: 70,
  },
});

const Editor = () => {
  return (
    <div>
      <h1>TUI Image Editor Test</h1>
      <div id="editor"></div>
      <h2 style="color: #fff">Editor</h2>
      <div id="editor"></div>
      <h2 style="color: #fff">Viewer</h2>
      <div id="viewer"></div>{" "}
    </div>
  );
};

export default Editor;
