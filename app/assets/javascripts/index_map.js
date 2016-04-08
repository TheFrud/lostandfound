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
                if(item.typ === "borttappat") {
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                }

                else if(item.typ === "upphittat") {
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