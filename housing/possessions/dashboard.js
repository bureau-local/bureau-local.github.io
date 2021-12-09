const decodeArea = (area) => {
  area = decodeURIComponent(area)
  return area.replace(/_/g, ' ')
}

function getText(number, singular, plural) {
  dataHTML = "<span class='emphasise'>" + number + "</span>"
  if (number == 1) {
    dataText = dataHTML += " " + singular
  } else {
    dataText = dataHTML += " " + plural
  }
  return dataText
}

// navigate from search to new dashboard page 
function navigate(area) {
  this.location.href = "dashboard.html?" + area
}

// select submit
async function onSelect(event) {
  event.preventDefault()
  selection = document.getElementById("select-menu").value
  navigate(selection)
}

// load the interctive data
param = this.location.search.substring(1)
area = decodeArea(param)
caseData = caseData[area]

// if the data is undefined return to the first page
if (caseData == undefined) {
  this.location.href = "splash.html"
}

// change the case count for the area in the interactive
document.getElementById("case-count").innerHTML = caseData["Count"]

// change the name of the region/court in the interactive
document.getElementById("area-name").innerHTML = caseData["Area"]

// add the average hearing duration
avgHearingDuration = caseData["Average hearing duration"]
document.getElementById("avg-hearing-duration").innerHTML = avgHearingDuration

// change the number of hearings that took under five minutes
fiveMinData = caseData["Less than five minutes"]
fiveMinText = getText(fiveMinData, "case", "cases") 
document.getElementById("five-minutes-text").innerHTML = fiveMinText

// change the number of hearings issued with mandatory grounds
groundsData = caseData["Mandatory grounds"]
groundsText = getText(groundsData, "case logged was", "cases logged were")
document.getElementById("grounds-text").innerHTML = groundsText

// change the number of covid mentions
covidData = caseData["Covid mentions"]
covidText = getText(covidData, "case", "cases")
document.getElementById("covid-text").innerHTML = covidText

// add the line from court
document.getElementById("line-from-court").innerHTML = caseData["Line"]

// change the number of section 21
section21Data = caseData["Section 21"]
section21Text = getText(section21Data, "case", "cases")
document.getElementById("section-21-text").innerHTML = section21Text

// change the number of hearings where the occupier had no representation
noRepresentation = caseData["No representation"]
document.getElementById("no-representation").innerHTML = noRepresentation

// change the number of hearings involving children
childrenData = caseData["Children involved"]
childrenText = getText(childrenData, "hearing", "hearings")
document.getElementById("children-text").innerHTML = childrenText

// Get regional breakdown
if (caseData["Area type"] == "Region") {
  breakdownDiv = document.getElementById("regional-breakdown")
  breakdown = caseData["Regional breakdown"]
  breakdownSize = Object.keys(breakdown).length
  if (breakdownSize == 1) {
    tableCaption = document.getElementById("table-caption")
    city = Object.keys(breakdown)[0]
    text = "All hearings we attended within the region took place in " + city
    tableCaption.textContent = text
  } else {
    tableHTML = "<table><thead><tr><th>Area</th><th>Count</th></tr></thead><tbody>"
    for (const area in breakdown) {
      count = breakdown[area]
      areaTableRow = "<tr><td>" + area + "</td><td>" + count + "</td></tr>"
      tableHTML += areaTableRow
    }
    tableHTML += "</tbody></table>"
    // add the table below the caption
    breakdownDiv.insertAdjacentHTML("beforeend", tableHTML)
  }
  // make the table visible
  breakdownDiv.style = "visibility: visible"
}

// Event listener for search bar
const selectMenu = document.getElementById("select-menu")
selectMenu.addEventListener("change", onSelect)
