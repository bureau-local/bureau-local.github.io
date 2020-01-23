const decodeBRMA = (brma) => {
  brma = decodeURIComponent(brma)
  return brma.replace(/_/g, ' ')
}

// if no hash make the hash #page-1
if (this.location.hash == false) {
  this.location.hash = "#page-1"
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
var affordableListings = brmaData["affordable-listings-april-2019-lha"]
document.getElementById("affordable-listings").innerHTML = affordableListings

// change the total number of listings in the interactive
var totalListings = brmaData["total-listings"]
document.getElementById("total-listings").innerHTML = " / " + totalListings

// add css rule to slide the gradient from 100 to limit style sheet
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
  gradient = "linear-gradient(to top, #ef3340 " + colorUpTo + "%, #444 0)"
  frame = i + "% {background-image: " + gradient + "}"
  frames += frame
}

var final_frame = "100% {background-image: " + gradient + "}"
frames += final_frame
stylesheet.insertRule("@keyframes dropSlide {" + frames + "}")

// change text for first slide second sentence
var april2020LHAAffordable = brmaData["affordable-listings-april-2020-lha"]
var newAffordableHomes = april2020LHAAffordable - affordableListings
var newAffordableHomesPercent = (newAffordableHomes / totalListings.replace(",", ""))

if (newAffordableHomes === 0) {
  newAffordableHomes = "Despite this, <span class=emphasise>not 1</span> more of those homes would be"
} else if (newAffordableHomes === 1) {
  newAffordableHomes = "Despite this, only <span class=emphasise>1</span> more of those homes would be"
} else if (newAffordableHomesPercent > 0.03) {
  newAffordableHomes = "This would make <span class=emphasise>" + newAffordableHomes + "</span> of those homes "
} else {
  newAffordableHomes = "Despite this, only <span class=emphasise>" + newAffordableHomes + "</span> more of those homes would be"
}
document.getElementById("new-affordable-homes").innerHTML = newAffordableHomes

// change text for second slide
if (percent < 0.3) {
  monthlyTopUp = brmaData["monthly-top-up-april-2020-lha"]
  april2019LHA = brmaData["april-2019-lha"]
  april2020LHA = brmaData["april-2020-lha"]
  april2019RequiredIncrease = brmaData["monthly-top-up-april-2019-lha"]
  april2020MonthlyIncrease = Math.round((april2020LHA - april2019LHA) * 52.1429 / 12)

  // first sentence
  start  = "The allowance in your area is set to rise by "
  end = "<span class='emphasise'>£" + april2020MonthlyIncrease + "</span>. "
  firstSentence = start + end

  // second sentence
  if (april2020MonthlyIncrease < april2019RequiredIncrease) {
    secondSentence = "It would still need to increase by <span class='emphasise'>£" + Math.round(monthlyTopUp) + "</span> a month for you to afford the cheapest 30% of homes in " + brma + "."
  } else {
    // second sentence if the planned lha meets the affordability target
    secondSentence = "Unlike for most areas, you would be able to afford to \
                      rent any of the cheapest 30% of homes with the planned \
                      benefit allowance in " + brma + "."
  }

  secondSlideText = firstSentence + secondSentence

} else {
  // text if the current lha meets the affordability target
  var secondSlideText = "Unlike most areas, you would be able to afford to \
                         rent any of the cheapest 30% of homes with the \
                         current benefit allowance in " + brma + ".<br>";
}
document.getElementById("second-slide").innerHTML = secondSlideText

// toggle between pages
function togglePage(){

  hash = this.location.hash.substring(1)
  target = parseInt(hash.slice(-1)) + 1
  if (target > 3) {
    target = 1
  }
  targetPage = "page-" + target

  var toggle = document.getElementsByClassName("page-toggle");
  for(let i = 0; i < toggle.length; i++){
    if (toggle[i].classList.contains(targetPage)) {
      toggle[i].style.display = "block";
    } else {
      toggle[i].style.display = "none";
    }
  }

  // manually add the brma to the link back
  // because we can't do it while it's hidden
  document.getElementById("brma-link").innerHTML = brma
}

// analytics
const sendSearchAgain = (label) => {
  window.gtag("event", "on-click", {
    event_category: "behaviour",
    event_label: label
  })
}

const searchAgainButton = document.getElementById("search-again")
searchAgainButton.addEventListener("click", sendSearchAgain("search-again"))
