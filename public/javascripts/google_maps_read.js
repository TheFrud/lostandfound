var myLatlng;
var map;
var marker;

var lat = $("#lat").html();
var lng = parseFloat($("#lng").html());

console.log(lat)

function initMap() {
    console.log("initMap()")

    myLatlng = new google.maps.LatLng(lat,lng);

    var mapOptions = {
        zoom: 8,
        center: myLatlng
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Place a draggable marker on the map
    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable:true,
        title:"Drag me!"
    });

}