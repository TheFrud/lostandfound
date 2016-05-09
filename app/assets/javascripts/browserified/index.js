(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	$("#toggleView").html("<i class='fa fa-globe'></i> Kartvy");
} else if(localStorage.getItem("currentView") === "mapView") {
	mapViewDiv.style.display = "block";
	$("#toggleView").html("<i class='fa fa-list'></i> Listvy");
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

$("#toggleView").on("click", function(){
	console.log("Clicked");
	const currentView = localStorage.getItem("currentView");

	if(currentView == "mapView"){
		changeToListView();
	} else if(currentView == "listView"){
		changeToMapView();
	}
	
});

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

	$("#toggleView").html("<i class='fa fa-list'></i> Listvy");

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

	$("#toggleView").html("<i class='fa fa-globe'></i> Kartvy");

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
},{"./index_map":2,"./init_page":3}],2:[function(require,module,exports){
/*jshint esnext: true */

var myLatlng;
var map;
var markers = [];
var sthlmlat = 59.328519;
var sthlmlng = 18.067878;   

const getMap = function() {
    return map;
};

const getMarkers = function() {
    return markers;
};

const initializeMap = function() {

    myLatlng = new google.maps.LatLng(sthlmlat,sthlmlng);

    var mapOptions = {
        zoom: 6,
        center: myLatlng
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    addAnnonserToMap();    
};

const addAnnonserToMap = function() {

        annonser.forEach((item) => {
            
            // Tittar ifall annonsen innehåller koordinater.
            // Annars är ju markörer irrelevant.
            if(item.hasOwnProperty('coordslat') && item.hasOwnProperty("coordslng")){

                var itemLatLng = new google.maps.LatLng(item.coordslat, item.coordslng);
                var marker = new google.maps.Marker({
                    position: itemLatLng,
                    map: map,
                    draggable:false,
                    title: item.rubrik,
                    typ: item.typ
                });

                // Set marker color
                if(item.typ === "Borttappat") {
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                }

                else if(item.typ === "Upphittat") {
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');   
                }
                
                var contentString = "<div class='map-info-window'>" +
                "<h3><a href='http://192.168.1.45:9000/annons/"+item.id+"'>" + item.rubrik + "</a></h3>" + 
                "<div class='imgLiquidFill imgLiquid' style='width:50px; height:50px;'>" +
                "<img class='media-object' src='/assets/images/annons_imgs/"+item.img+"' alt='...'>" +
                 "</div>" +
                 "<br>" + item.text +
                 "</div>";
                 

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                    
                    // "Imagefitting"
                    // https://github.com/karacas/imgLiquid
                    $(".imgLiquidFill").imgLiquid();
                });

                markers.push(marker);    
            }
        });
        
};



// Exports
module.exports.initializeMap = initializeMap;
module.exports.getMap = getMap;
module.exports.getMarkers = getMarkers;
},{}],3:[function(require,module,exports){
/*jshint esnext: true */

module.exports = {
	initPage: function() {

		console.log("Initializing page...");

		// Get string value
		const active_page = $("#active_page").html();

		// Page names to check for
		const annonser_page = "Annonser";
		const annons_page = "Annons";
		const skapa_annons_page = "Skapa annons";

		// Buttons of interest
		const annonser_button = document.getElementById("annonser_button");
		const skapa_annons_button = document.getElementById("skapa_annons_button");

		// Classes to set
		const primary = "btn btn-primary";
		const secondary = "btn btn-secondary";

		const primaryLarge = "btn btn-primary btn-lg";
		const secondaryLarge = "btn btn-secondary btn-lg";

		// Set page options depending on page
		switch (active_page) {
			case annonser_page:
				console.log("Annonser page");

				// Set buttons
				annonser_button.className = primary;
				skapa_annons_button.className = secondary;

				break;
			case annons_page:
				console.log("Annons page");

				// Set buttons
				annonser_button.className = secondary;
				skapa_annons_button.className = secondary;

				break;
			case skapa_annons_page:
				console.log("Skapa annons page");

				// Set buttons
				annonser_button.className = secondary;
				skapa_annons_button.className = primary;
				console.log(skapa_annons_button);

				break;
		}	
	}
};
},{}]},{},[1]);
