/*jshint esnext: true */

// If geolocation isn't supported we will use these standard coords.
const sthlmlat = 59.328519;
const sthlmlng = 18.067878;

var myLatlng;
var map;
var mapOptions;
var marker;
var defaultLat = sthlmlat;
var defaultLng = sthlmlng;

const getMarker = function() {
    return marker;
};

// Note the callback function
// This should be implemented better
const initMap = function(callback) {

    // Get user location
    // THEN
    // Execute the callback I pass to the function (setLocation)
    // The callback will execute the rest of the initialization.
 
    console.log("initMap()");

    myLatlng = new google.maps.LatLng(defaultLat, defaultLng);

    mapOptions = {
        zoom: 8,
        center: myLatlng
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Place a draggable marker on the map
    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable:true,
        title:"Drag me!"
    });

    marker.set("id", "myMarker");

    // Note the callback function
    // This should be implemented better
    callback();

    whenLoaded();

    setLocation();

};

// $("#myMarker").move(function(){console.log("dasdsad")})
var whenLoaded = function(){
    $("#coordslat").val(marker.position.lat);
    $("#coordslng").val(marker.position.lng);

    marker.addListener("dragend", function(){
        console.log("Drag end");
        $("#coordslat").val(marker.position.lat);
        $("#coordslng").val(marker.position.lng);
    });

};

function setLocation() {

    getLocation();

    // Get user location
    function getLocation() {
        if (navigator.geolocation) {
            console.log("Got geolocation!");
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            // If geolocation isn't supported we will use these standard coords.
            console.log("No geolocation!");
            console.log("Using default coords...");

        }
    }
    function showPosition(position) {
        console.log("Setting coords to user position...");
        // defaultLat = position.coords.latitude;
        // defaultLng = position.coords.longitude; 
        var myLatlngUserPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.set("center", myLatlngUserPosition);
        marker.set("position", myLatlngUserPosition);

   
    }


}

module.exports.initMap = initMap;
module.exports.getMarker = getMarker;
