document.addEventListener("DOMContentLoaded", e => {
  csscode = {};
  document.querySelector(".bg-btn").addEventListener("click", e => {
    background();
  });
  document.querySelector(".font-btn").addEventListener("click", e => {
    fonts();
  });
  document.querySelector(".border-btn").addEventListener("click", e => {
    border();
  });

  document.querySelector(".pnm-btn").addEventListener("click", e => {
    marginAndPadding();
  });

  document.querySelector(".text-btn").addEventListener("click", e => {
    text();
  });

  document.querySelector(".shadow-btn").addEventListener("click", e => {
    shadows();
  });

  document.querySelector(".display-btn").addEventListener("click", e => {
    displayAndPositioning();
  });

  document.querySelector(".size-btn").addEventListener("click", e => {
    sizing();
  });

  document.querySelector(".others-btn").addEventListener("click", e => {
    others();
  });

  document.getElementById("component-btn").addEventListener("click", e => {
    var cssString = "";
    for (property in csscode) {
      if (csscode[property] != "") {
        cssString += `${property}:${csscode[property]};`;
      }
    }
    console.log(cssString);
  });
});

function background() {
  csscode["background-color"] = document.getElementById("bg-color").value;
  csscode["background-image"] = `url(${
    document.getElementById("bg-image").value
  })`;
  csscode["background-repeat"] = document.getElementById("bg-repeat").value;
  csscode["background-position"] = document.getElementById("bg-position").value;
  csscode["background-attachment"] = document.getElementById(
    "bg-attachment"
  ).value;
}

function fonts() {
  csscode["font-size"] =
    document.getElementById("font-size").value +
    document.getElementById("font-units").value;
  csscode["font-family"] = document.getElementById("font-family").value;
  csscode["font-weight"] = document.getElementById("font-weight").value;
  csscode["font-variant"] = document.getElementById("font-variant").value;
  csscode["font-style"] = document.getElementById("font-style").value;
}

function border() {
  csscode["border-color"] = document.getElementById("border-color").value;
  csscode["border-style"] = document.getElementById("border-style").value;
  csscode["border"] =
    document.getElementById("border-all").value +
    document.getElementById("border-units").value;
  csscode["border-top"] =
    document.getElementById("border-top").value +
    document.getElementById("border-units").value;
  csscode["border-left"] =
    document.getElementById("border-left").value +
    document.getElementById("border-units").value;
  csscode["border-right"] =
    document.getElementById("border-right").value +
    document.getElementById("border-units").value;
  csscode["border-bottom"] =
    document.getElementById("border-bottom").value +
    document.getElementById("border-units").value;
  csscode["border-width"] =
    document.getElementById("border-width").value +
    document.getElementById("border-units").value;
  csscode["border-radius"] =
    document.getElementById("border-radius").value +
    document.getElementById("border-units").value;
}

function marginAndPadding() {
  csscode["margin"] =
    document.getElementById("margin-all").value +
    document.getElementById("margin-units").value;
  csscode["margin-top"] =
    document.getElementById("margin-top").value +
    document.getElementById("margin-units").value;
  csscode["margin-left"] =
    document.getElementById("margin-left").value +
    document.getElementById("margin-units").value;
  csscode["margin-right"] =
    document.getElementById("margin-right").value +
    document.getElementById("margin-units").value;
  csscode["margin-bottom"] =
    document.getElementById("margin-bottom").value +
    document.getElementById("margin-units").value;

  csscode["padding"] =
    document.getElementById("padding-all").value +
    document.getElementById("padding-units").value;
  csscode["padding-top"] =
    document.getElementById("padding-top").value +
    document.getElementById("padding-units").value;
  csscode["padding-left"] =
    document.getElementById("padding-left").value +
    document.getElementById("padding-units").value;
  csscode["padding-right"] =
    document.getElementById("padding-right").value +
    document.getElementById("padding-units").value;
  csscode["padding-bottom"] =
    document.getElementById("padding-bottom").value +
    document.getElementById("padding-units").value;
}
function text() {
  csscode["text-indent"] =
    document.getElementById("text-indent").value +
    document.getElementById("text-units").value;
  csscode["letter-spacing"] =
    document.getElementById("letter-spacing").value +
    document.getElementById("text-units").value;
  csscode["word-spacing"] =
    document.getElementById("word-spacing").value +
    document.getElementById("text-units").value;
  csscode["line-height"] =
    document.getElementById("line-height").value +
    document.getElementById("text-units").value;
  csscode["text-align"] = document.getElementById("text-align").value;
  csscode["text-decoration"] = document.getElementById("text-decoration").value;
  csscode["text-transform"] = document.getElementById("text-transform").value;
}

function shadows() {
  var boxunit = document.getElementById("box-shadow-units").value;
  csscode["box-shadow"] =
    document.getElementById("box-shadow-color").value +
    " " +
    document.getElementById("vertical-box-shadow").value +
    boxunit +
    " " +
    document.getElementById("horizontal-box-shadow").value +
    boxunit +
    " " +
    document.getElementById("box-shadow-blur").value +
    boxunit;
  var textunit = document.getElementById("text-shadow-units").value;
  csscode["text-shadow"] =
    document.getElementById("text-shadow-color").value +
    " " +
    document.getElementById("vertical-text-shadow").value +
    textunit +
    " " +
    document.getElementById("horizontal-text-shadow").value +
    textunit +
    " " +
    document.getElementById("text-shadow-blur").value +
    textunit;
}

function displayAndPositioning() {
  csscode["top"] =
    document.getElementById("top").value +
    document.getElementById("position-units").value;
  csscode["left"] =
    document.getElementById("left").value +
    document.getElementById("position-units").value;
  csscode["right"] =
    document.getElementById("right").value +
    document.getElementById("position-units").value;
  csscode["bottom"] =
    document.getElementById("bottom").value +
    document.getElementById("position-units").value;
  csscode["display"] = document.getElementById("display").value;
  csscode["position"] = document.getElementById("position").value;
  csscode["flex-direction"] = document.getElementById("flex-direction").value;
  csscode["flex-wrap"] = document.getElementById("flex-wrap").value;
  csscode["float"] = document.getElementById("float").value;
}

function sizing() {
  csscode["width"] =
    document.getElementById("width").value +
    document.getElementById("width-units").value;
  csscode["min-width"] =
    document.getElementById("min-width").value +
    document.getElementById("width-units").value;
  csscode["max-width"] =
    document.getElementById("max-width").value +
    document.getElementById("width-units").value;
  csscode["height"] =
    document.getElementById("height").value +
    document.getElementById("height-units").value;
  csscode["min-height"] =
    document.getElementById("min-height").value +
    document.getElementById("height-units").value;
  csscode["max-height"] =
    document.getElementById("max-height").value +
    document.getElementById("height-units").value;
  csscode["overflow-x"] = document.getElementById("overflow-x").value;
  csscode["overflow-y"] = document.getElementById("overflow-y").value;
}

function others() {
  csscode["z-index"] = document.getElementById("z-index").value;
  csscode["visibilty"] = document.getElementById("visibilty").value;
}
