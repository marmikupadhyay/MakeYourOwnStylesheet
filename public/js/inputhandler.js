var cssString;
var list = [];
var sheetId;
cssString = {};
var edits;
var deletes;
var check = 0;

function disableBtns() {
  document.getElementById("sheet-title").addEventListener("input", e => {
    if (e.target.value == "") {
      document.getElementById("save").className += " disabled";
    } else if (document.getElementById("save").classList.contains("disabled")) {
      document.getElementById("save").classList.remove("disabled");
    }
  });

  document.getElementById("component-title").addEventListener("input", e => {
    var inputBtns = document.querySelectorAll(".input-btn");
    if (e.target.value == "") {
      document.getElementById("component-btn").className += " disabled";
      inputBtns.forEach(btn => {
        btn.className += " disabled";
      });
    } else if (
      document.getElementById("component-btn").classList.contains("disabled")
    ) {
      inputBtns.forEach(btn => {
        btn.classList.remove("disabled");
      });
      document.getElementById("component-btn").classList.remove("disabled");
    }
  });
}

function savePropertyListners() {
  //Adding click listeners to the properties buttons
  document.querySelector(".bg-btn").addEventListener("click", e => {
    background();
    showPreview();
  });
  document.querySelector(".font-btn").addEventListener("click", e => {
    fonts();
    showPreview();
  });
  document.querySelector(".border-btn").addEventListener("click", e => {
    border();
    showPreview();
  });
  document.querySelector(".pnm-btn").addEventListener("click", e => {
    marginAndPadding();
    showPreview();
  });
  document.querySelector(".text-btn").addEventListener("click", e => {
    text();
    showPreview();
  });
  document.querySelector(".shadow-btn").addEventListener("click", e => {
    shadows();
    showPreview();
  });
  document.querySelector(".display-btn").addEventListener("click", e => {
    displayAndPositioning();
    showPreview();
  });
  document.querySelector(".size-btn").addEventListener("click", e => {
    sizing();
    showPreview();
  });
  document.querySelector(".others-btn").addEventListener("click", e => {
    others();
    showPreview();
  });
}

//function to show preview of the properties
function showPreview() {
  var cmpName = document.getElementById("component-title").value;
  var tempCode = "";
  var codetext = {};
  if (document.getElementById("component-type").value == "class") {
    codetext[cmpName] = ".";
  }
  if (document.getElementById("component-type").value == "id") {
    codetext[cmpName] = "#";
  }

  codetext[cmpName] += `${document.getElementById("component-title").value}{`;
  for (property in csscode) {
    if (property == "background-image") {
      if (csscode[property] == "url()") {
        continue;
      }
    }
    var NA = ["", "px", "%", "em", "rem", "vh", "vw"];
    if (!NA.includes(csscode[property])) {
      codetext[cmpName] += `${property}:${csscode[property]};`;
      tempCode += `${property}:${csscode[property]};`;
    }
  }
  codetext[cmpName] += "}";

  var codeBlock = document.querySelector(".code");
  codeBlock.innerHTML = "";
  for (var i = 0; i < codetext[cmpName].length; i++) {
    if (codetext[cmpName][i] == ";" || codetext[cmpName][i] == "{") {
      codeBlock.innerHTML += `${codetext[cmpName][i]}</br>`;
    } else {
      codeBlock.innerHTML += `${codetext[cmpName][i]}`;
    }
  }
  console.log(tempCode);
  document.querySelector(".displayblock").style.cssText = tempCode;
}

//Function to handle the html file input
function handleFileInput() {
  const fileInput = document.getElementById("file-input");
  const previewBtn = document.getElementById("preview-btn");
  previewBtn.addEventListener("click", e => {
    if (fileInput.value == "") {
      return;
    }
    const selectedFile = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsText(selectedFile);
    var fileContent;
    var tempStyle = "";
    for (property in cssString) {
      tempStyle += `${cssString[property]}`;
    }
    reader.onload = e => {
      fileContent = e.target.result;
      var arr = fileContent.split("<body>");
      var arr = arr[1].split("</body>");
      fileContent = arr[0];
      var previewTab = window.open("about:blank", "");
      previewTab.document.write(`
      <html><head><style>${tempStyle}</style><title>Preview Page</title></head><body>${fileContent}</body></html>
      `);
    };
  });
}

//Document Loaded Listener
document.addEventListener("DOMContentLoaded", e => {
  getListItems();

  csscode = {};
  getCode();

  //Disabling Buttons If file name not provided
  disableBtns();

  //Adding click listeners to the properties buttons
  savePropertyListners();

  //handling File Inputs
  handleFileInput();

  //Adding click listener to the add component btn
  document.getElementById("component-btn").addEventListener("click", e => {
    var cmpName = document.getElementById("component-title").value;
    list.push(cmpName + `: ${document.getElementById("component-type").value}`);
    list = [...new Set(list)];
    showList(list);

    if (document.getElementById("component-type").value == "class") {
      cssString[cmpName] = ".";
    }
    if (document.getElementById("component-type").value == "id") {
      cssString[cmpName] = "#";
    }

    cssString[cmpName] += `${
      document.getElementById("component-title").value
    }{`;
    for (property in csscode) {
      if (property == "background-image") {
        if (csscode[property] == "url()") {
          continue;
        }
      }
      var NA = ["", "px", "%", "em", "rem", "vh", "vw"];
      if (!NA.includes(csscode[property])) {
        cssString[cmpName] += `${property}:${csscode[property]};`;
      }
    }
    cssString[cmpName] += "}";
  });

  //event listner to reset the inputs
  document.getElementById("reset-btn").addEventListener("click", e => {
    var area = document.querySelector(".collapsible");
    var inputs = area.getElementsByTagName("input");
    var selects = area.getElementsByTagName("select");
    document.getElementById("component-title").value = "";
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type == "text" || inputs[i].type == "number") {
        inputs[i].value = "";
      } else if (inputs[i].type == "color") {
        inputs[i].value = "#000000";
      }
    }
    for (var i = 0; i < selects.length; i++) {
      if (selects[i].options[0].disabled) {
        selects[i].selectedIndex = "1";
      } else {
        selects[i].selectedIndex = "0";
      }
    }
  });

  //Search Mechanism for components
  var cmpsearch = document.getElementById("charinput");
  cmpsearch.addEventListener("input", e => {
    var searchText = cmpsearch.value;
    let matches = list.filter(listitem => {
      const regex = new RegExp(`^${searchText}`, "gi");
      return listitem.match(regex);
    });
    if (searchText.length === 0) {
      matches = list;
    }
    showList(matches);
  });
});

//Function to get the Initial List Items
async function getListItems() {
  sheetId = document.getElementById("sheet-id").innerHTML;
  const res = await fetch(`/sheet/cmpnames/${sheetId}`);
  var data = await res.json();
  list = data.cmpNames;
  showList(list);
}

//Sheet Contents
async function getCode() {
  sheetId = document.getElementById("sheet-id").innerHTML;
  const res = await fetch(`/sheet/code/${sheetId}`);
  var data = await res.json();
  cssString = data.code;
}

//Function to display the list
function showList(list) {
  var container = document.getElementById("all-components");
  container.innerHTML = "";

  list.forEach(listitem => {
    var item = document.createElement("li");
    item.innerHTML = listitem;
    var parentCmp = "";
    var res = listitem.split(":");
    parentCmp = res[0];

    item.className = "collection-item";
    item.innerHTML += `
    <div class="cmp-btn-box">
    <a class="btn-floating waves-effect cmp-delete waves-light red" id="${parentCmp}"><i class="material-icons" onclick="M.toast({html: 'Component Deleted'})">delete</i></a>
    </div>`;
    container.appendChild(item);
  });

  deletes = document.querySelectorAll(".cmp-delete");

  deletes.forEach(btn => {
    btn.addEventListener("click", e => {
      var cmpName = e.target.parentElement.id;
      delete cssString[cmpName];
      for (var i = 0; i < list.length; i++) {
        let res = list[i].split(":");
        if (res[0] == cmpName) {
          list.splice(i, 1);
          i--;
        }
      }
      showList(list);
    });
  });
}

//Save Btn click listener
document.getElementById("save").addEventListener("click", e => {
  postSheet().then(console.log("done"));
});

//Download ClickListener
document.getElementById("download").addEventListener("click", e => {
  finalCss = "";
  for (property in cssString) {
    finalCss += `${cssString[property]}`;
  }
  saveSheet();
});

//Post toPutSheet to database
async function postSheet() {
  sheetId = document.getElementById("sheet-id").innerHTML;
  var sheetTitle = document.getElementById("sheet-title").value;
  try {
    const response = await axios.post(`/sheet/save/${sheetId}`, {
      sheetTitle,
      content: cssString
    });
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

//Function to download the sheet
function saveSheet() {
  var blob = new Blob([`${finalCss}`], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, `${document.getElementById("sheet-title").value}.css`);
}

//All the functions to take input and store in object

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
  csscode["border"] =
    document.getElementById("border-all").value +
    document.getElementById("border-units").value +
    " " +
    document.getElementById("border-style").value +
    " " +
    document.getElementById("border-color").value;
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
  csscode["visibility"] = document.getElementById("visibility").value;
}
