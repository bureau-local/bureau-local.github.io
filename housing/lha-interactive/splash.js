const encodeBRMA = (brma) => {
  brma = brma.replace(/ /g, '_')
  return encodeURIComponent(brma)
}

// navigate to dashboard
function navigate (brma) {
  var param = encodeBRMA(brma)
  this.location.href = "dashboard.html?" + param
}

// search submit
async function onSubmit(event) {
  event.preventDefault()
  search = document.getElementById("search").value
  error = document.getElementById("error")

  // show error for invalid postcodes
  if (!isPostcode(search)) {
    error.innerHTML = "We couldn\'t find this postcode"
    return
  }

  try {
    search = await lookup(search)
    sendSearchEvent(search)
    navigate(search)
  } catch (e) {
    error.innerHTML = "We couldn\'t find this postcode"
  }
}

// lookup for brma
async function lookup (search) {
  const url = 'https://api.postcodes.io/postcodes/' + encodeURIComponent(search)
  const response = await window.fetch(url)
  const json = await response.json()

  const eastings = json && json.result && json.result.eastings
  if (!eastings) {
    throw new Error()
  }

  const northings = json && json.result && json.result.northings
  if (!northings) {
    throw new Error()
  }

  const point = turf.point([eastings, northings])
  for (var shape in brmaShapes.features) {
    const brmaGeometry = brmaShapes.features[shape].geometry
    const geoType = brmaGeometry.type
    const coordinates = brmaGeometry.coordinates

    var polygon
    if (geoType == "Polygon") {
      polygon = turf.polygon(coordinates)
    } else if (geoType == "MultiPolygon") {
      polygon = turf.multiPolygon(coordinates)
    }

    // check if point in polygon
    if (turf.booleanPointInPolygon(point, polygon)) {
      const foundName = brmaShapes.features[shape].properties.Name
      return foundName
    }
  }

  if (!foundName) {
    throw new Error()
  }
}

// Postcode validation
const isPostcode = (value) => {
  value = value.toLowerCase().trim();
  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/ig
  const matches = value.match(postcodeRegex)
  return matches && matches.length
}

// analytics
const sendSearchEvent = (label) => {
  window.gtag("event", "search", {
    event_category: "engagement",
    event_label: label
  })
}

const searchForm = document.getElementById("form")
searchForm.addEventListener("submit", onSubmit)
