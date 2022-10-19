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
var affordableListings = brmaData["Affordable"]
document.getElementById("affordable-listings").innerHTML = affordableListings

// change the total number of listings in the interactive
var totalListings = brmaData["Total"]
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

// change the second sentence of the vis text
var monthlyTopUp = brmaData["Monthly top-up"]
if (percent < 0.3) {
  start  = " The average benefit allowance in your area would need to increase by <span style='font-size: 2rem; font-weight: bold; color:#ef3340;'>"
  end = "</span> a month for someone to afford the cheapest 30% of homes."
  sentence = start + monthlyTopUp + end
  document.getElementById("second-sentence").innerHTML = sentence
} else {
  sentence = " Unlike most areas, you would be able to afford to rent any of the cheapest 30% of homes with the current benefit allowance in your area."
  document.getElementById("second-sentence").innerHTML = sentence
}

// toggle between pages
function togglePage(target){
  targetPage = target.href.slice(-6)

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

// Share buttons
// add URL to share button
tweetText = `🏘️ In ${brma}, Local Housing Allowance only covered rent in ${affordableListings} of ${totalListings} properties @bureaulocal looked at.%0a%0a` +
            "🔍 Search data for your area: t.co/xXDEPNq2xj%0a" +
            "🔗 Read the full story: bit.ly/3MgeiJq"
modifiedHREF = `https://twitter.com/intent/tweet?text=${tweetText}`
document.getElementById("social-share-btn-twitter").href = modifiedHREF

// analytics
const sendSearchAgain = (label) => {
  window.gtag("event", "on-click", {
    event_category: "behaviour",
    event_label: label
  })
}

const searchAgainButton = document.getElementById("search-again")
searchAgainButton.addEventListener("click", sendSearchAgain("search-again"))
