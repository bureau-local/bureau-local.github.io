var margin = {
      top: 30,
      right: 10,
      bottom: 10,
      left: 10
    },
    width = 800,
    height = 800;

var projection = d3.geoAlbers()
    .center([0, 53])
    .rotate([2.8, 0])
    .parallels([49, 56])
    .scale(7000)
    .translate([width / 2, height / 2]);
  
var path = d3.geoPath()
    .projection(projection);

// For swoopy arrows
var swoopy = swoopyArrow()
  .angle(Math.PI/2)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });
  
var svg = d3.select(".container").append("svg")
    .attr("position", "absolute")
    .attr("width", width)
    .attr("height", height)
    .append("g");

// Returns the percentile of the given value in a sorted numeric array.
function percentRank(arr, v) {
  // console.log(v)
    if (typeof v !== 'number') throw new TypeError('v must be a number');
    for (var i = 0, l = arr.length; i < l; i++) {
        if (v <= arr[i]) {
            while (i < l && v === arr[i]) i++;
            if (i === 0) return 0;
            if (v !== arr[i-1]) {
                i += (v - arr[i-1]) / (arr[i] - arr[i-1]);
            }
            return i / l;
        }
    }
    return 1;
}

// colour scale
var reds = d3.scaleSequential(d3.interpolateReds);

  
// ---------- MAP ----------
function draw(uk, data, colour_data, reds){
  console.log(reds(percentRank(colour_data, 29)))
  console.log(reds(percentRank(colour_data, 49)))
  console.log(reds(percentRank(colour_data, 41)))
  console.log(reds(percentRank(colour_data, 66)))
  
  svg.selectAll(".lad")
    .data(topojson.feature(uk, uk.objects["lad-geo"]).features)
    .enter().append("path")
    .attr("class", function(d) { return "lad " + d.properties.LAD18CD[0]; })
    .attr("d", path)
    .style("fill", function(d) { if (d.properties.LAD18CD in data && data[d.properties.LAD18CD] > 0.0001) { return reds(percentRank(colour_data, data[d.properties.LAD18CD]))} });
  
  svg.append("path")
    .datum(topojson.mesh(uk, uk.objects["lad-geo"], function(a, b) { return a !== b && (a.properties.LAD18CD[0] !== "W" && a.properties.LAD18CD[0] !== "S"); }))
    .attr("d", path)
    .attr("class", "lad-boundary");
  
  svg.append("path")
    .datum(topojson.mesh(uk, uk.objects["lad-geo"], function(a, b) { return a === b && (a.properties.LAD18CD[0] === "W" && a.properties.LAD18CD[0] === "S"); }))
    .attr("d", path)
    .attr("class", "lad-boundary WS");

  // ---------- ARROWS ----------

  // Define simple arrowhead marker
  svg.append('defs')
    .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-10 -10 20 20")
      .attr("refX", 0)
      .attr("refY", 0)
      .attr("markerWidth", 20)
      .attr("markerHeight", 20)
      .attr("stroke-width", 1)
      .attr("orient", "auto")
    .append("polyline")
      .attr("stroke-linejoin", "bevel")
      .attr("points", "-6.75,-6.75 0,0 -6.75,6.75");

  // Add arrows!
  // North East
  svg.append("path")
    .attr("class", "arrow")
    .attr('marker-end', 'url(#arrowhead)')
    .datum([projection([0.5,55.2]),projection([-1.2,54.8])])
    .attr("d", swoopy);

  // Wigan
  svg.append("path")
    .attr("class", "arrow")
    .attr('marker-end', 'url(#arrowhead)')
    .datum([projection([-4.8,53.2]),projection([-2.65,53.55])])
    .attr("d", swoopy);

  // West Midlands Met County
  svg.append("path")
    .attr("class", "arrow")
    .attr('marker-end', 'url(#arrowhead)')
    .datum([projection([-6,52]),projection([-2,52.5])])
    .attr("d", swoopy);

  // Enfield
  svg.append("path")
    .attr("class", "arrow")
    .attr('marker-end', 'url(#arrowhead)')
    .datum([projection([-0.2,50.5]),projection([-0.1,51.6])])
    .attr("d", swoopy);
  
}; // end of draw()

async function init() {
  const uk = await d3.json("lad-topo.json");
  const input_data = await d3.csv("sh-data.csv");
  var data = Object()
  var colour_data = Array()
  input_data.forEach(function(d) {
    la = d["LA code"]
    dependance = parseInt(d["Dependance on lease-based providers"])
    data[la] = dependance
    if (dependance > 0) {
      colour_data.push(dependance)
    }
  })
  // used for the color scale
  colour_data = colour_data.sort((a, b) => a - b)
  draw(uk, data, colour_data, reds)
};

init();