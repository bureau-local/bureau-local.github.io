var margin = {
      top: 30,
      right: 10,
      bottom: 10,
      left: 10
    },
    width = 800,
    height = 800;

  var projection = d3.geo.albers()
      .center([0, 53])
      .rotate([2.8, 0])
      .parallels([49, 56])
      .scale(7000)
      .translate([width / 2, height / 2]);
  
  var path = d3.geo.path()
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
  
  function draw(uk){
  
    // ---------- MAP ----------
  
    svg.selectAll(".lad")
      .data(topojson.feature(uk, uk.objects.lad).features)
      .enter().append("path")
      .attr("class", function(d) { return "lad " + d.properties.lad16cd[0]; })
      .attr("d", path)
      .style("fill", function(d) { if (dvdict[d.properties.lad16nm] == "x") { return "#ff5a5d"} })
      .style("opacity", function(d) { if (dvdict[d.properties.lad16nm] == "x") { return 0.9} });
  
    svg.append("path")
      .datum(topojson.mesh(uk, uk.objects.lad, function(a, b) { return a !== b && (a.properties.lad16cd[0] !== "W" && a.properties.lad16cd[0] !== "S"); }))
      .attr("d", path)
      .attr("class", "lad-boundary");
  
    svg.append("path")
      .datum(topojson.mesh(uk, uk.objects.lad, function(a, b) { return a === b && (a.properties.lad16cd[0] === "W" && a.properties.lad16cd[0] === "S"); }))
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
    svg.append("path")
      .attr("class", "arrow")
      .attr('marker-end', 'url(#arrowhead)')
      .datum([projection([0.6,54.9]),projection([-1.1,54.1])])
      .attr("d", swoopy);

    svg.append("path")
      .attr("class", "arrow")
      .attr('marker-end', 'url(#arrowhead)')
      .datum([projection([0.45,50.7]),projection([-0.35,51.45])])
      .attr("d", swoopy);

    svg.append("path")
      .attr("class", "arrow")
      .attr('marker-end', 'url(#arrowhead)')
      .datum([projection([-6,50.5]),projection([-3.1,51.25])])
      .attr("d", swoopy);

    svg.append("path")
      .attr("class", "arrow")
      .attr('marker-end', 'url(#arrowhead)')
      .datum([projection([-5.2,52]),projection([-2.8,52.7])])
      .attr("d", swoopy);
  
  }; // end of draw()
  
  function init() {
    queue()
      .defer(d3.json, "lad_topo.json")
      .defer(d3.csv, "data.csv")
      .await(function(error, uk, dvdata){

        dvdict = {}

        dvdata.forEach(function(d) {
          la = d.la
          flag = d.flag
          dvdict[la] = flag
        })
  
        window.dvdict = dvdict
  
        draw(uk)
  
      });
  };

  init();