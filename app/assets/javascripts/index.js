/*jshint esnext: true */


// Sets the view

const mapViewDiv = document.getElementById("mapView");
const listViewDiv = document.getElementById("listView");


if(localStorage.getItem("currentView") === null || localStorage.getItem("currentView") === undefined) {
	// If the user has never changed the view (localstorage not set) this code is run.
	mapViewDiv.style.display = "block";	
} else if(localStorage.getItem("currentView") === "listView"){
	listViewDiv.style.display = "block";
} else if(localStorage.getItem("currentView") === "mapView") {
	mapViewDiv.style.display = "block";
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
			if(m.typ === "borttappat") {
				m.setMap(null);
			}
		})

		show_borttappat = false;

	} else if(show_borttappat === false) {
		markers.forEach((m) => {
			if(m.typ === "borttappat") {
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
			if(m.typ === "upphittat") {
				m.setMap(null);
			}
		})

		show_upphittat = false;

	} else if(show_upphittat === false) {
		markers.forEach((m) => {
			if(m.typ === "upphittat") {
				m.setMap(map);
			}
		})

		show_upphittat = true;
	}
});