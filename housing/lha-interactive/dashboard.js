const decodeBRMA = (brma) => {
  brma = decodeURIComponent(brma)
  return brma.replace(/_/g, ' ')
}

// load the brma data
param = this.location.search.substring(1)
brma = decodeBRMA(param)
brmaData = summaryData[brma]

// if the data is undefined return to the first page
if (brmaData == undefined) {
  this.location.href = "splash.html"
}

// change the name of BRMA in the interactive
document.getElementById("brma-name").innerHTML = brma

// change the number of affordable listings in the interactive
var affordableListings = brmaData["affordable-listings"]
document.getElementById("affordable-listings").innerHTML = affordableListings

// change the total number of listings in the interactive
var totalListings = brmaData["total-listings"]
document.getElementById("total-listings").innerHTML = " / " + totalListings

// add css rule to slide the gradient from 100 to 1 style sheet
var cssSheetName = "dashboard.css"
var selector = "link[href$='" + cssSheetName + "']"
var stylesheet = document.querySelector(selector).sheet

var percent = affordableListings / totalListings.replace(",", "")
var limit = 100 - Math.floor((percent * 100))

frames = ""
for (let i = 0; i <= limit; i ++) {
  colorUpTo = (100 - i)
  if (i == limit) {
    colorUpTo = (percent * 100)
  }
  gradient = "linear-gradient(to top, #e66 " + colorUpTo + "%, #444 0)"
  frame = i + "% {background-image: " + gradient + "}"
  frames += frame
}

var final_frame = "100% {background-image: " + gradient + "}"
frames += final_frame
stylesheet.insertRule("@keyframes dropSlide {" + frames + "}")

// change the second sentence of the vis text
var monthlyTopUp = "£" + brmaData["monthly-top-up"]
if (percent < 0.3) {
  start  = " The average benefit allowance in your area would need to increase by <span style='font-size: 2rem; font-weight: bold; color:#ff5a5d;'>"
  end = "</span> a month for someone to afford the cheapest 30% of homes."
  sentence = start + monthlyTopUp + end
  document.getElementById("second-sentence").innerHTML = sentence
} else {
  sentence = " Unlike most areas, you would be able to afford to rent the cheapest 30% of homes with the current benefit allowance in your area."
  document.getElementById("second-sentence").innerHTML = sentence
}

// analytics
var searchAgainButton = document.getElementById("search-again")
searchAgainButton.addEventListener("submit", sendSearchAgainEvent)
const sendSearchAgainEvent = (label) => {
  window.gtag('event', 'on-click', {
    event_category: 'engagement',
    event_label: "search-again"
  })
}

