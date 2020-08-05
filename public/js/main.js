document.addEventListener("DOMContentLoaded", e => {
  var searchBar = document.getElementById("search-sheets");
  document.getElementById("search-btn").addEventListener("click", e => {
    window.location.href = `/user/dashboard/?s=${searchBar.value}`;
  });
});
