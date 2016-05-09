/*jshint esnext: true */

var myLatlng;
var map;
var marker;

var lat = $("#lat").html();
var lng = $("#lng").html();
var typ = $("#typ").html();

function initMap() {
    console.log("initMap()");
    // getAnnons();

    myLatlng = new google.maps.LatLng(lat,lng);

    var mapOptions = {
        zoom: 10,
        center: myLatlng
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable:false
    });

    // Set marker color
    if(typ === "Borttappat") {
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    }

    else if(typ === "Upphittat") {
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');  
    }

}

// Optimera när denna ska anropas...
/*
function getAnnons() {
    console.log("getAnnons()");
    const url = "http://192.168.1.45:9000/getannons";

    const dataPromise = $.ajax(url);

    dataPromise.then(function(data){
        console.log(data);

        if(data.hasOwnProperty('coordslat') && data.hasOwnProperty("coordslng")){

            var itemLatLng = new google.maps.LatLng(item.coordslat, item.coordslng);
            var marker = new google.maps.Marker({
                position: itemLatLng,
                map: map,
                draggable:false,
                title: item.rubrik
            });

            // Set marker color
            if(item.typ === "borttappat") {
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
            }

            else if(item.typ === "upphittat") {
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')   
            }
            
        }

    }, function(error){
        console.log(error);
    })
}
*/