const decodeSearch = (search) => {
  search = decodeURIComponent(search)
  return search.replace(/_/g, ' ')
}

// load the search data
param = this.location.search.substring(1)
localAuthorities = decodeSearch(param).split(",")

// change the match count in the interactive
var intToText = {
  0: "None",
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five"
}
var matchCount = intToText[localAuthorities.length]

// abbreviating numbers function
//SI symbol changed to m and b according to TBIJ style guide
var siSymbol = ["", "k", "m", "b", "T", "P", "E"];
function abbreviateNumber(number){
    // what tier? (determines SI symbol)
    var tier = Math.log10(number) / 3 | 0;
    // if zero, we don't need a suffix
    if(tier == 0) return number;
    // get suffix and determine scale
    var suffix = siSymbol[tier];
    var scale = Math.pow(10, tier * 3);
    // scale the number
    var scaled = number / scale;
    // format number and add suffix
    return scaled.toFixed(0) + suffix;
}

totalAmount = 0
paragraph = ""
for (var localAuthority in localAuthorities) {
  code = localAuthorities[localAuthority]
  name = lendersData[code]["name"]
  repayment = lendersData[code]["repayment"]
  totalAmount += parseInt(repayment)
  interest = lendersData[code]["interest"]
  if (repayment > 0) {
    sentence = name + " lent £" + abbreviateNumber(repayment)
    if (interest > 0) {
      sentence += " and received £" + abbreviateNumber(interest) + " in interest."
    } else {
      sentence += "."
    }
  } else {
    sentence = name + " received £" + abbreviateNumber(interest) + " in interest."
  }
  paragraph += "<li>" + sentence + "</li>"
}

// add page title to page
if (localAuthorities.length > 1) {
  visTitle = "<span class='emphasise'>" + matchCount + "</span> of your local authorities lent Thurrock a total of <span class='emphasise'>£" + abbreviateNumber(totalAmount)  + "</span>"
} else {
  visTitle = "Your local authority lent Thurrock a total of <span class='emphasise'>£" + abbreviateNumber(totalAmount)  + "</span>"
}
document.getElementById("vis-title").innerHTML = visTitle
// add text of local authority list to page
document.getElementById("vis-list").innerHTML = paragraph

// analytics
const sendSearchAgain = (label) => {
  window.gtag("event", "on-click", {
    event_category: "behaviour",
    event_label: label
  })
}

const searchAgainButton = document.getElementById("search-again")
searchAgainButton.addEventListener("click", sendSearchAgain("search-again"))
