// made with the help of
// https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
// and https://github.com/gka/d3-jetpack

// a wait var to be used to pause script
// while imgs load beore resizing items
var wait = ms => new Promise((r, j)=>setTimeout(r, ms))

// write the grid blocs, from the data loaded in the init()
function chart(data, total) {

  var w=window,
  d=document,
  e=d.documentElement,
  g=d.getElementsByTagName('body')[0],
  x=w.innerWidth||e.clientWidth||g.clientWidth,
  y=w.innerHeight||e.clientHeight||g.clientHeight;

  // create ticker
  var titles = d3.select("body")
    .append("g")
      .attr("class", "headings");

  titles.append("text")
      .attr("id", "vis-title-number")
      .text(total);

  titles.append("text")
        .attr("id", "vis-title")
        .text("people have died homeless since we began counting in October 2017. Here are their stories...");

 	// create grid
  var grid = d3.select("body")
  	.append("div")
      .attr("class", "grid");

  // create blocs
  blocs = grid.appendMany("div", data)
  	.attr("class", function(d) {return "item " + d.type})
  	.append("div")
  		.attr("class", "content");

  // add title
  blocs.append("div")
  	.attr("class", "title")
  	.append("h3")
  		.text(function(d) {return d.Name});

  // add img if type photo
  blocs.filter(function(d) {return d.type == "photo"}).append("img")
  	.attr("class", "photothumb")
  	.attr("src", function(d) {return d.img_file});

  // add intro
  blocs.append("div")
    .attr("class", "intro")
    .append("text")
      .text(function(d) {return writeIntro(d);})

  // add text
  blocs.filter(function(d) {return d.blurb != ""}).append("div")
    .attr("class", "desc")
   	.append("text")
   		.text(function(d) {return d.blurb;});

  // add credits
  credits = blocs.filter(function(d) {return d.reporting_by != "" || d.img_credit != ""}).append("div")
    .attr("class", "credit");
  
  credits.filter(function(d) {return d.reporting_by != ""}).append("p")
      .html(function(d) {return "As reported by <a target='_blank' href=" + d.reporting_link +">" + d.reporting_by + "</a>."})
  
  credits.filter(function(d) {return d.img_credit != ""}).append("p")
      .text(function(d) {return "Photo via " + d.img_credit + "."});

  // lets just give it a pause of half a second
  // before resising items as imgs load
  (async () => { await wait(500); resizeAllGridItems() })();

} // end of chart function


function resizeGridItem(item){
   grid = document.getElementsByClassName("grid")[0];
   rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
   rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
   rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
   item.style.gridRowEnd = "span "+rowSpan;
}

function resizeAllGridItems(){
   allItems = document.getElementsByClassName("item");
   for(x=0;x<allItems.length;x++){
      resizeGridItem(allItems[x]);
   }
}

// window.onload = resizeAllGridItems();

window.addEventListener("resize", resizeAllGridItems);

allItems = document.getElementsByClassName("item");
for(x=0;x<allItems.length;x++){
   imagesLoaded(allItems[x], resizeInstance);
}

function resizeInstance(instance){
   item = instance.elements[0];
   resizeGridItem(item);
}

// write intro 
function writeIntro(d) {
  return "Died in " + d.Location + ", " + writeDate(d) + writeAge(d.Age) + "."
}

// use the index from this array to translate
// numerical month notation to text
// (ie months[0] = January, months[5] = June...)
// (note, we will pass (Number(d.dod_month) - 1) bellow)
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function writeDate(d) {
  if (d.dod_day != "") {
    return "on " + months[Number(d.dod_month) - 1] + " " + d.dod_day + ", " + d.dod_year
  } else {
    return "in " + months[Number(d.dod_month) - 1] + ", " + d.dod_year
  }
}

// if we know the age write this sentence
function writeAge(d) {
  if (d != "") {
    return ", aged " + d
  } else {
    return ""
  }
}

// load data from csv
function init() {
	queue()
		.defer(d3.csv, "data.csv")
		.await(function(error, data){
      // the while loop removes entries not meant
      // for card display from the data array
      total = data.length
      i = data.length - 1;
      while (i >= 0) {
        if (data[i].type == "") {
          data.splice(i, 1);
        }
        i -= 1;
      }
			chart(data, total)
		});
	};

init();
