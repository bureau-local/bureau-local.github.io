// simple line graph made using https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0

var margin = {top: 120, right: 50, bottom: 30, left: 105},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var _x = d3.scaleTime().range([0, width]);
var _y = d3.scaleLinear().range([height, 0]);

var area = d3.area()
    .x(function(d) { return _x(d.date); })
    .y0(height)
    .y1(function(d) { return _y(d.revenue); });

// define the line
var valueline = d3.line()
    .x(function(d) { return _x(d.date); })
    .y(function(d) { return _y(d.revenue); });

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


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
      .attr("transform", "translate(0," + height + ")")
      .style("font", "14px futura")
      .call(d3.axisBottom(_x));


  // Add the Y Axis
  svg.append("g")
      .style("font", "16px futura")
      .call(d3.axisLeft(_y));


  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 1 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .style("font-size", "30px")
      .text("JBS revenue, US$bn");



//Add annotations
  var labels = [{
    note: {
      title: "2012",
      align: "left",
      label: "Tesco cancels beef contracts after Greenpeace links JBS to deforestation in the Amazon"
    },
    data: { date: "2012", close: 19.7 },
    dy: -80,
    dx: -320
  }, {
    note: {
      title: "2017",
      align: "right",
      label: "Two JBS plants accused of buying cattle from illegally deforested land"
    },
    data: { date: "2017", close: 42.16 },
    dy: 60,
    dx: -80
  }, {
    note: {
      title: "2017",
      align: "right",
      label: "Batista brothers charged with insider trading and detained"
    },
    data: { date: "2017", close: 42.16 },
    dy: 200,
    dx: -60
  }, {
    note: {
      title: "2017",
      align: "right",
      label: "Waitrose halts JBS beef sales after the company is linked to modern slavery"
    },
    data: { date: "2017", close: 42.16 },
    dy: 330,
    dx: -25
  }, {
    note: {
      title: "2018",
      align: "left",
      label: "Farmers file a case against Pilgrim's Pride in the US for alleged price fixing"
    },
    data: { date: "2018", close: 49.7 },
    dy: 0,
    dx: -480
  }].map(function (l) {
    return l;
  });

var timeFormat = d3.timeFormat("%Y");

  window.makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutCircle).textWrap(250).notePadding(5).accessors({ x: function x(d) {
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

  svg.append("g").attr("class", "annotation-test").call(makeAnnotations);

  svg.select("g.x-axis").call(d3.axisBottom(_x));

  svg.select("path.line")
  .attr("d", valueline);
});

if (_x <= 400) {
  caveatprojection = 18
} else {
  caveatprojection = 10
}

svg.append("g").attr("class", "caveat").attr("transform", "translate(" + [0, height-caveatprojection] + ")").append("text").text("").call(wrap, width/1.2)
    var logo = svg.append("g").attr("class", "logo-image");
    var logoSize = width/11

    logo.append("svg:image")
        .attr("class", "logo")
        .attr("x",width-logoSize)
        .attr("y", height-logoSize)
        .attr("width", logoSize)
        .attr("height", logoSize)
        .attr("opacity", 0.9)
        .attr("xlink:href", "../tbij.png");

  // wrap text function - I learned this nifty trick from the FT
         function wrap(text, width) {
           text.each(function() {
             var text = d3.select(this),
                 words = text.text().split(/\s+/).reverse(),
                 word,
                 line = [],
                 lineNumber = 0,
                 lineHeight = 1.3, // ems
                 y = text.attr("y"),
                 dy = parseFloat(text.attr("dy"));
                 if(!dy){dy = 0}else{dy = dy};
                 var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
             while (word = words.pop()) {
               line.push(word);
               tspan.text(line.join(" "));
               if (tspan.node().getComputedTextLength() > width) {
                 line.pop();
                 tspan.text(line.join(" "));
                 line = [word];
                 // console.log(line);
                 tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
               }
             }
           });
         }
