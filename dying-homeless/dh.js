// made with the help of
// https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
// and https://github.com/gka/d3-jetpack

// a wait var to be used to pause script
// while imgs load beore resizing items
var wait = ms => new Promise((r, j) => setTimeout(r, ms))

// write the grids blocs, from the data loaded in the init()
function chart(data, total) {

  main = data.filter(d => d.type != "text3")
  thedetail = data.filter(d => d.type == "text3")

  var w=window,
  d=document,
  e=d.documentElement,
  g=d.getElementsByTagName('body')[0],
  x=w.innerWidth||e.clientWidth||g.clientWidth,
  y=w.innerHeight||e.clientHeight||g.clientHeight;

  // create main ticker
  var mainTitles = d3.select("body")
    .append("g")
      .attr("class", "headings");

  mainTitles.append("text")
      .attr("id", "vis-title-number")
      .text(total);

  mainTitles.append("text")
        .attr("id", "vis-title")
        .text("people have died homeless since we began counting in October 2017. Here are their stories...");
  
  buildGrid(main)

  // ---------- GRID 2 ----------

  // create ticker
  var niheTitles = d3.select("body")
    .append("g")
      .attr("class", "headings");

  niheTitles.append("text")
      .attr("id", "nihe-title-number")
      .text("148");

  niheTitles.append("text")
        .attr("id", "vis-title")
        .text("of our total were officially recognised as homeless and died while waiting to be housed by the Northern Irish Housing Executive.");

  buildGrid(thedetail)

  // everything should be on the page so let's resize all items
  resizeAllGridItems()

} // end of chart function

// write individual grid with corresponding blocs
function buildGrid(data) {
  
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
    .attr("onload", "resizeAllGridItems()")
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

  credits.each(function(d) {
    var toAppend = d3.select(this);
    if (d.reporting_by != "" && d.reporting_link != "") {
      toAppend.append("p").html(function(d) {return "As reported by <a target='_blank' href=" + d.reporting_link +">" + d.reporting_by + "</a>."})
    } else if (d.reporting_by != "") {
      toAppend.append("p").html(function(d) {return "Sourced from " + d.reporting_by + "."})
    }
  });

  credits.filter(function(d) {return d.img_credit != ""}).append("p")
      .text(function(d) {return "Photo via " + d.img_credit + "."});

} // end of buildGrid function

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
  if (d.dod_year != "") {
    return "Died in " + d.Location + ", " + writeDate(d) + writeAge(d.Age) + "."
  } else {
    return "Died in " + d.Location + writeAge(d.Age) + "."
  }
}

// use the index from this array to translate
// numerical month notation to text
// (ie months[0] = January, months[5] = June...)
// (note, we will pass (Number(d.dod_month) - 1) bellow)
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function writeDate(d) {
  if (d.dod_day != "") {
    if (d.type == "text3") {
      return "sometime before " + months[Number(d.dod_month) - 1] + " " + d.dod_day + ", " + d.dod_year
    } else {
      return "on " + months[Number(d.dod_month) - 1] + " " + d.dod_day + ", " + d.dod_year
    }
  } else if (d.dod_month != "") {
    return "in " + months[Number(d.dod_month) - 1] + ", " + d.dod_year
  } else {
    return "in " + d.dod_year
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
      // the total is used for the titles
      total = data.length
			chart(data, total)
		});
	};

init();
