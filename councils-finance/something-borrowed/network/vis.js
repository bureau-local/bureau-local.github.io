var positioning = "map"

// vanilla JS window width and height
var w=window,
d=document,
e=d.documentElement,
g=d.getElementsByTagName('body')[0],
x=w.innerWidth||e.clientWidth||g.clientWidth,
y=w.innerHeight||e.clientHeight||g.clientHeight;

var graphWidth = Math.min(x, 800)

var margin = {
    top: 30,
    right: 10,
    bottom: 10,
    left: 10
  },
  width = graphWidth,
  height = graphWidth;

var svg = d3.select(".container").append("svg")
    .attr("position", "absolute")
    .attr("width", width)
    .attr("height", height)
    .append("g");

if (width < 400) {
  var radiusRange = d3.scaleLinear().domain([1000000, 188063800]).range([3, 18])
} else if (width < 600) {
  var radiusRange = d3.scaleLinear().domain([1000000, 188063800]).range([4, 24])
} else {
  var radiusRange = d3.scaleLinear().domain([1000000, 188063800]).range([5, 30])
}

var ScaleRange = d3.scaleLinear().domain([320, 800]).range([1500, 4000]);
var scale = ScaleRange(width)

var distanceRange = d3.scaleLinear().domain([320, 800]).range([12, 40]);
var distance = distanceRange(width)

var stenghtRange = d3.scaleLinear().domain([320, 800]).range([-60, -300]);
var strenght = stenghtRange(width)

// Projection and path
var projection = d3.geoAlbers()
    .center([0, 54.2])
    .rotate([4.8, 0])
    .parallels([49, 60])
    .scale(scale)
    .translate([width / 1.8, height / 1.8]);

var path = d3.geoPath()
    .projection(projection);

var linkForce = d3.forceLink()
    .id(function (d) { return d.name })
    .distance(distance)

var simulation = d3.forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(strenght))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .stop()

// ---------- MAP ----------
function draw(gb, authFeatures, graphNodes, graphLinks) {

  simulation.nodes(graphNodes)
    .on('tick', ticked)

  simulation.force('link').links(graphLinks)
  
  // ---------- GREAT BRITAIN ----------
  var map = svg.selectAll(".country")
    .data(topojson.feature(gb, gb.objects.gb).features)
    .enter().append("path")
    .attr("class", function(d) { return "country " + d.properties.ctry18nm[0]; })
    .attr("d", path);
  
  svg.append("path")
    .datum(topojson.mesh(gb, gb.objects.gb, function(a, b) { return a !== b; }))
    .attr("d", path)
    .attr("class", "country-boundary");

  // ---------- AUTHORITIES ----------
  var authorities = svg.selectAll(".authorities")
    .data(topojson.feature(authFeatures, authFeatures.objects.authorities).features)
    .enter().append("path")
    .attr("class", function(d) {return "authority " + d.properties.code })
    .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(authFeatures, authFeatures.objects.authorities, function(a, b) { return a !== b; }))
    .attr("d", path)
    .attr("class", "authority-boundary");

  svg.append("path")
    .datum(topojson.mesh(authFeatures, authFeatures.objects.authorities, function(a, b) { return a === b; }))
    .attr("d", path)
    .attr("class", "authority-boundary");

  var links = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graphLinks)
    .enter().append('line');

  var nodes = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(graphNodes)
    .enter().append('circle')
    .attr("fill", function(d) { return (d.name == "Thurrock") ? "#ef3340" : "#706f6f"})
    .attr("r", 0);

  nodes.append('title')
    .text(function (d) { return d.name })

  fixed(true)
  d3.select('#toggle').on('click', toggle)

  function fixed(immediate) {
    graphNodes.forEach(function (d) {
      var pos = projection([d.lon, d.lat])
      d.x = pos[0]
      d.y = pos[1]
    })

    var t = d3.transition()
      .duration(immediate ? 0 : 600)
      .ease(d3.easeElastic.period(0.5))

    update(links.transition(t), nodes.transition(t))
  }

  function ticked() {
    update(links, nodes)
  }

  function update(links, nodes) {
    links
      .attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })

    nodes
      .attr('cx', function (d) { return d.x })
      .attr('cy', function (d) { return d.y })
  }

  function mouseover(d) {
    var format = d3.format(".2s")
    var repaymentText = format(d.repayment).replace("M", "m")
    var interestText = format(d.interest)

    locAuthText = ""
    thurrockText = "<span style='color: #ef3340'>Thurrock</span>"

    if (d.repayment > 0) {
      locAuthText += d.name + " lent £" + repaymentText + " to " + thurrockText
      if (d.interest > 0) {
        locAuthText += ", which paid £" + interestText + " back in interest"
      } else {
        locAuthText
      }
    } else {
      locAuthText = thurrockText + " paid " + d.name + " £" + interestText + " back in interest for its loans" 
    }
    d3.select("#tooltipData").html(locAuthText)

    if (d.name == "Thurrock") {
      d3.select("#tooltipData").html(null)
    }

  }

  function toggle() {
    if (positioning === 'map') {
      positioning = 'sim'
      map.attr('opacity', 0.1)
      authorities.attr('opacity', 0.1)
      nodes.attr("r", function(d) { return radiusRange(d.repayment); })
      nodes.on("mouseover", mouseover)
      d3.select('#intro-text').attr("hidden", "true")
      d3.select('#toggle').text("See the map")
      d3.select('.vis-text').style("max-width", "98%")
      d3.select('#tooltip').attr("hidden", null)
      simulation.alpha(1).restart()
    } else {
      positioning = 'map'
      map.attr('opacity', 1)
      authorities.attr('opacity', 1)
      nodes.attr("r", 0)
      nodes.on("mouseover", null)
      d3.select('#toggle').text("View as network")
      d3.select('.vis-text').style("max-width", "35%")
      d3.select('#tooltip').attr("hidden", "true")
      d3.select('#intro-text').attr("hidden", null)
      simulation.stop()
      fixed()
    }
  }
  
}; // end of draw()

function init() {
  queue()
    .defer(d3.json, "gb-topo.json")
    .defer(d3.json, "authorities-topo.json")
    .defer(d3.csv, "nodes.csv")
    .defer(d3.csv, "links.csv")
    .await(function(error, gb, authorities, graphNodes, graphLinks){ 
      draw(gb, authorities, graphNodes, graphLinks)
    });
};

init();