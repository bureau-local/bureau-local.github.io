// set the dimensions and margins of the graph
var margin = {top: 80, right: 8, bottom: 50, left: 130},
    width = 800;
    height = 800;

// append the svg object to the body of the page
var svg = d3.select(".container").append("svg")
    .attr("position", "absolute")
    .attr("width", width)
    .attr("height", height)
    .append("g");

// parse the Data
d3.csv("data.csv")
	.then((data) => {
		return data.map((d) => {
			d.amount = +d.amount;
			return d;
        });
	})
	.then((data) => {
		
		yAxis = g => g
			.style("font", "13px 'Futura',sans-serif")
		    .attr("transform", `translate(${margin.left},0)`)
		    .call(d3.axisLeft(y).tickFormat(i => data[i].name).tickSize(0))
		    .call(g => g.select(".domain").remove())

		y = d3.scaleBand()
		    .domain(d3.range(data.length))
		    .range([margin.top, height - margin.bottom])
		    .padding(0.4)

		x = d3.scaleLinear()
		    .domain([0, d3.max(data, d => d.amount)])
		    .range([margin.left, width - margin.right])

		//Bars
		bars = svg.append("g")
		    .selectAll("rect")
		    .data(data)
		    .join("rect")
		      	.attr("x", x(0))
		      	.attr("y", (d, i) => y(i) + y.bandwidth() / 6)
		      	.attr("width", d => x(d.amount) - x(0))
		      	.attr("height", y.bandwidth() / 1.5)
		      	.attr("fill", function(d) { return d.name == "Thurrock" ? "#ef3340" : "#706f6f"; });


		//Labels
		svg.append("g")
			  	.attr("fill", "white")
			  	.attr("text-anchor", "middle")
			  	.style("font-family", "'Futura',sans-serif")
		  	.selectAll("text")
			.data(data)
			.join("text")
			  	.attr("x", function(d, i) { return i == 22 ? x(d.amount) + 4 : x(d.amount/2); })
			  	.attr("y", (d, i) => y(i) + y.bandwidth() / 2)
			  	.attr("dy", "0.35em")
			  	.attr("text-anchor", "middle")
			  	.text(function(d, i) { return d.amount > 1000000000 ? "£" + (d.amount/1000000000).toFixed(2) + "bn" : "£" + (Math.round(d.amount/1000000/5)*5) + "m" });

		  
		svg.append("g")
			.call(yAxis);

	})
