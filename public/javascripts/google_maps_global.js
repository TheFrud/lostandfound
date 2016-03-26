var myLatlng;
var map;
var marker;
var sthlmlat = 59.328519;
var sthlmlng = 18.067878;

function initMap() {
    console.log("initMap()")
    
    myLatlng = new google.maps.LatLng(sthlmlat,sthlmlng);

    var mapOptions = {
        zoom: 6,
        center: myLatlng
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    getAnnonser();
}

// Optimera när denna ska anropas...
function getAnnonser() {
    console.log("getAnnonser()");
    const url = "http://192.168.1.45:9000/getannonser";

    const dataPromise = $.ajax(url);

    dataPromise.then(function(data){
        console.log(data);

        data.annonser.forEach(function(item){

            // Tittar ifall annonsen innehåller koordinater.
            // Annars är ju markörer irrelevant.
            if(item.hasOwnProperty('coordslat') && item.hasOwnProperty("coordslng")){

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
                
                // Gör så att en inforuta kommer upp när man klickar på markören.
                var contentString = "<h3><a href='http://192.168.1.45:9000/annons/"+item.id+"'>" + item.rubrik + "</a></h3>" + 
                "<img class='media-object' src='/assets/images/annons_imgs/"+item.img+"' alt='...' height='42' width='42'>" +
                 "<br>" + item.text;

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });    

            }



        })

    }, function(error){
        console.log(error);
    })
}

