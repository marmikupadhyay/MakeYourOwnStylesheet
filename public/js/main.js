document.addEventListener("DOMContentLoaded", e => {
  var searchBar = document.getElementById("search-sheets");
  document.getElementById("search-btn").addEventListener("click", e => {
    window.location.href = `/user/dashboard/?s=${searchBar.value}`;
  });
  //Function to get Collabarators
});

getColabs();

function formSubmit(event, str) {
  event.preventDefault();
  const sheetID = userform.getElementsByTagName("input")[0].id;
  var url = `/sheet/${str}user/${sheetID}`;
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.onload = function () {
    getColabs();
  };

  request.onerror = function () {
    console.log(request.responseText);
  };
  request.setRequestHeader("Content-type", "application/json");
  var formData = new FormData(event.target); // create FormData from form that triggered event
  var objData = { name: formData.get("person") };
  request.send(JSON.stringify(objData));
}

let userform = document.getElementById("add-user-form");
let userform2 = document.getElementById("remove-user-form");

userform.addEventListener("submit", e => {
  formSubmit(e, "add");
  userform.reset();
});
userform2.addEventListener("submit", e => {
  formSubmit(e, "remove");
  userform2.reset();
});

//Function to Display Collabarators
function displayColabs(colabs) {
  var collabList = document.getElementById("collab-list");
  collabList.innerHTML = "";
  colabs.forEach(colab => {
    var item = document.createElement("li");
    item.className = "collection-item";
    item.innerHTML = colab;
    collabList.appendChild(item);
  });
}

//Function to get collaborators
async function getColabs() {
  var collabList = document.getElementById("collab-list");
  var sheetID = collabList.getAttribute("data-id");
  var res = await fetch(`/sheet/collablist/${sheetID}`);
  var data = await res.json();
  displayColabs(data.users);
}
