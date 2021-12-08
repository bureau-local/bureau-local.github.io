// navigate to dashboard
function navigate(area) {
  this.location.href = "dashboard.html?" + area
}

// select submit
async function onSelect(event) {
  event.preventDefault() // wait what does this do?
  selection = document.getElementById("select-menu").value
  navigate(selection)
}

// search submit
async function onSubmit(event) {
  event.preventDefault()
  search = document.getElementById("search").value
  navigate(search)
}

const selectMenu = document.getElementById("select-menu")
selectMenu.addEventListener("change", onSelect)
