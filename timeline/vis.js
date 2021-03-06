// simple line graph made using https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
// parameters
var margin = {
    top: 120,
    right: 30,
    bottom: 100,
    left: 80
},
width = 800,
height = 800;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var _x = d3.scaleTime().range([margin.left, width-margin.right]);
var _y = d3.scaleLinear().range([height-margin.bottom, margin.top]);

var area = d3.area()
    .x(function(d) { return _x(d.date); })
    .y0(height-margin.bottom)
    .y1(function(d) { return _y(d.revenue); });

// define the line
var valueline = d3.line()
    .x(function(d) { return _x(d.date); })
    .y(function(d) { return _y(d.revenue); });

// append the svg object to the body of the page
var svg = d3.select(".container").append("svg")
    .attr("position", "absolute")
    .attr("width", width)
    .attr("height", height)
    .append("g");


// Get the data
d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.revenue = +d.revenue;
  });

  // Scale the range of the data
  _x.domain(d3.extent(data, function(d) { return d.date; }));
  _y.domain([0, d3.max(data, function(d) { return d.revenue; })]);

// Add the area
  svg.append("path")
        .data([data])
        .attr("class", "area")
        .attr("d", area);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + (height-margin.bottom) + ")")
      .style("font", "14px futura")
      .call(d3.axisBottom(_x).ticks(5));


  // Add the Y Axis
  svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .style("font", "16px futura")
      .call(d3.axisLeft(_y).ticks(5));


  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 1)
      .attr("x", -(height / 2))
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .style("font-size", "19px")
      .style("font-family", "Futura")
      .text("JBS revenue, US$bn");

//Add annotations
  var labels = [{
    note: {
      title: "2012",
      align: "right",
      label: "Tesco cancels beef contracts after Greenpeace links JBS to deforestation in the Amazon"
    },
    data: { date: "2012", close: 19.7 },
    dy: 45,
    dx: 0
  }, {
    note: {
      title: "2017",
      align: "right",
      label: "Two JBS plants accused of buying cattle from illegally deforested land"
    },
    data: { date: "2017", close: 42.16 },
    dy: 40,
    dx: -100
  }, {
    note: {
      title: "2017",
      align: "right",
      label: "Batista brothers charged with insider trading and detained"
    },
    data: { date: "2017", close: 42.16 },
    dy: 150,
    dx: -5
  }, {
    note: {
      title: "2017",
      align: "right",
      label: "Waitrose halts JBS beef sales after the company is linked to modern slavery"
    },
    data: { date: "2017", close: 42.16 },
    dy: 280,
    dx: 10
  }, {
    note: {
      title: "2018",
      align: "middle",
      label: "Farmers file a case against Pilgrim's Pride in the US for alleged price fixing"
    },
    data: { date: "2018", close: 49.7 },
    dy: 0,
    dx: -300
  }].map(function (l) {
    return l;
  });

var timeFormat = d3.timeFormat("%Y");

  window.makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutCircle).textWrap(200).notePadding(20).accessors({ x: function x(d) {
      return _x(parseTime(d.date));
    },
    y: function y(d) {
      return _y(d.close);
    },
  }).accessorsInverse({
    date: function date(d) {
      return timeFormat(_x.invert(d.x));
    },
    close: function close(d) {
      return _y.invert(d.y);
    }
  });

  svg.append("g").attr("class", "annotation-test").style("font-family", "Futura").call(makeAnnotations);

  svg.select("g.x-axis").call(d3.axisBottom(_x));

  svg.select("path.line").attr("d", valueline);

}); // closes d3.csv
