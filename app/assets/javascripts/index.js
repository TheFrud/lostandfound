/*jshint esnext: true */

// Set current page
localStorage.setItem("currentPage", "Annonser");

// Get url (to check if user loaded page after a search or not)
const pathName = window.location.pathname;
console.log(pathName)

// Sets the view
const mapViewDiv = document.getElementById("mapView");
const listViewDiv = document.getElementById("listView");

// Get current view from localStorage and set it up accordingly
if(localStorage.getItem("currentView") === null || localStorage.getItem("currentView") === undefined) {
	// If the user has never changed the view (localstorage not set) this code is run.
	mapViewDiv.style.display = "block";	
} else if(localStorage.getItem("currentView") === "listView"){
	listViewDiv.style.display = "block";
} else if(localStorage.getItem("currentView") === "mapView") {
	mapViewDiv.style.display = "block";
}

console.log(localStorage.getItem("currentTyp"));

// Setup filter/search options. Get from localStorage.

// Setup typ
if(!localStorage.getItem("currentTyp") || pathName == "/") {
	// Set default
	$("#typ").val("Alla");
} else {
	$("#typ").val(localStorage.getItem("currentTyp"));
	// localStorage.removeItem("currentTyp");
}

// Setup category
if(!localStorage.getItem("currentCategory") || pathName == "/") {
	// Set default
	$("#category").val("Alla");
} else {
	$("#category").val(localStorage.getItem("currentCategory"));
	// localStorage.removeItem("currentCategory");
}
// Setup county
if(!localStorage.getItem("currentCounty") || pathName == "/") {
	// Set default
	$("#county").val("Alla");
} else {
	$("#county").val(localStorage.getItem("currentCounty"));
	// localStorage.removeItem("currentCounty");
}



// "Imagefitting"
// https://github.com/karacas/imgLiquid
$(".imgLiquidFill").imgLiquid();


const initializer = require("./init_page");
const initializer_map = require("./index_map");

initializer.initPage();
window.initMap = function() {
	initializer_map.initializeMap();
}

// Change to map view
$(window).on( "swiperight", function( event ) {
	changeToMapView();
});

// Change to list view
$(window).on( "swipeleft", function( event ) {
	changeToListView();
});

// Functions for when the views shift
const changeToMapView = function() {
	var map = initializer_map.getMap();

	if($("#mapView").is(":visible")){
		console.log("Already in map view...");
		return;
	}
	console.log("SWIPE TO MAP");
	$("#listView").fadeOut("slow", function(){
		$("#mapView").show();
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});	

	localStorage.setItem("currentView", "mapView");
}

const changeToListView = function() {
	if($("#listView").is(":visible")){
		console.log("Already in list view...");
		return;
	}

	console.log("SWIPE TO LIST");
	$("#mapView").fadeOut("slow", function() {
		$("#listView").show();
	});	

	localStorage.setItem("currentView", "listView");
}

// Search stuff
const typSelector = $("#typ");
const categorySelector = $("#category");
const countySelector = $("#county");

// When filter changes - Do search
// Typ change
typSelector.change(function() {
	// Get current value of selector
	const selected = $('#typ option:selected').text();

	// Save current value in localStorage
	localStorage.setItem("currentTyp", selected);

	// Execute search
	$("#executeSearch").click();

});

// Category change
categorySelector.change(function() {
	// Get current value of selector
	const selected = $('#category option:selected').text();

	// Save current value in localStorage
	localStorage.setItem("currentCategory", selected);

	// Execute search
	$("#executeSearch").click();

});
// County change
countySelector.change(function() {
	// Get current value of selector
	const selected = $('#county option:selected').text();

	// Save current value in localStorage
	localStorage.setItem("currentCounty", selected);

	// Execute search
	$("#executeSearch").click();

});

/* --- */

// Borttappat/Upphittat Toggle
const borttappat_checkbox = $("#borttappat_checkbox");
const upphittat_checkbox = $("#upphittat_checkbox");

const fadeSpeed = 150;

borttappat_checkbox.prop("checked", true);
upphittat_checkbox.prop("checked", true);

show_borttappat = true;
show_upphittat = true;

borttappat_checkbox.click(() => {
	// Get map
	var map = initializer_map.getMap();

	// Get markers
	var markers = initializer_map.getMarkers();

	$(".borttappat").toggle(fadeSpeed);

	if(show_borttappat === true){
		markers.forEach((m) => {
			if(m.typ === "Borttappat") {
				m.setMap(null);
			}
		})

		show_borttappat = false;

	} else if(show_borttappat === false) {
		markers.forEach((m) => {
			if(m.typ === "Borttappat") {
				m.setMap(map);
			}
		})

		show_borttappat = true;
	}
	

});

upphittat_checkbox.click(() => {
	// Get map
	var map = initializer_map.getMap();

	// Get markers
	var markers = initializer_map.getMarkers();

	$(".upphittat").toggle(fadeSpeed);

	if(show_upphittat === true){
		markers.forEach((m) => {
			if(m.typ === "Upphittat") {
				m.setMap(null);
			}
		})

		show_upphittat = false;

	} else if(show_upphittat === false) {
		markers.forEach((m) => {
			if(m.typ === "Upphittat") {
				m.setMap(map);
			}
		})

		show_upphittat = true;
	}
});