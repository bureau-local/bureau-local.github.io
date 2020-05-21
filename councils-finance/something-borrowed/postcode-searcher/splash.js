const encodeBRMA = (search) => {
  search = search.replace(/ /g, '_')
  return encodeURIComponent(search)
}

// navigate to dashboard
function navigate (search) {
  var param = encodeBRMA(search)
  this.location.href = "dashboard.html?" + param
}

// search submit
async function onSubmit(event) {
  event.preventDefault()
  search = document.getElementById("search").value
  error = document.getElementById("postcode-error")

  // show error for invalid postcodes
  if (!isPostcode(search)) {
    error.innerHTML = "We couldn\'t find this postcode"
    return
  }

  try {
    search = await lookup(search)
    // sendSearchEvent(search)
    navigate(search)
  } catch (e) {
    if (e.message === "noMatch") {
      error.innerHTML = "No local authority in your area lent Thurrock money according to the council's payment to suppliers data. <a href='https://docs.google.com/document/d/1vbtpFLNk2lFQh5jPl9Ko_w8l-IloZ-WzHabPrFpFcjk' target='_blank' style='text-decoration: none;'><span class='error emphasise'>&#9998;</span></a> <a class='error' href='https://docs.google.com/document/d/1vbtpFLNk2lFQh5jPl9Ko_w8l-IloZ-WzHabPrFpFcjk' target='_blank' style='text-decoration-color: #ef3340;'>Help us investigate</a>."
    } else {
      error.innerHTML = "We couldn\'t find this postcode"
    }
  }
}

// lookup for brma
async function lookup (search) {
  const url = 'https://api.postcodes.io/postcodes/' + encodeURIComponent(search)
  const response = await window.fetch(url)
  const json = await response.json()

  const longitude = json && json.result && json.result.longitude
  if (!longitude) {
    throw new Error()
  }

  const latitude = json && json.result && json.result.latitude
  if (!latitude) {
    throw new Error()
  }

  const point = turf.point([longitude, latitude])
  
  const shapeCollections = [
    citiesShapes,
    ladShapes,
    countiesShapes,
    policeShapes,
    fireShapes,
    combAuthShapes
  ]

  const matches = []
  for (var collection in shapeCollections) {
    for (var shape in shapeCollections[collection].features) {
      const geometry = shapeCollections[collection].features[shape].geometry
      const geoType = geometry.type
      const coordinates = geometry.coordinates

      var polygon
      if (geoType == "Polygon") {
        polygon = turf.polygon(coordinates)
      } else if (geoType == "MultiPolygon") {
        polygon = turf.multiPolygon(coordinates)
      }

      // check if point in polygon
      if (turf.booleanPointInPolygon(point, polygon)) {
        const foundCode = shapeCollections[collection].features[shape].properties.code
        matches.push(foundCode)
        break
      }
    }
  }

  if (matches.length === 0) {
      throw new Error("noMatch")
  }

  return matches.join(",")
}

// Postcode validation
const isPostcode = (value) => {
  value = value.toLowerCase().trim();
  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/ig
  const matches = value.match(postcodeRegex)
  return matches && matches.length
}

// analytics
// const sendSearchEvent = (label) => {
//   window.gtag("event", "search", {
//     event_category: "engagement",
//     event_label: label
//   })
// }

const searchForm = document.getElementById("form")
searchForm.addEventListener("submit", onSubmit)

const searchIcon = document.getElementById("search-button")
searchIcon.addEventListener("click", onSubmit)
