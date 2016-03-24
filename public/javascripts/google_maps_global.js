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

            if(item.hasOwnProperty('coordslat') && item.hasOwnProperty("coordslng")){
                console.log("Inside item");
                var itemLatLng = new google.maps.LatLng(item.coordslat, item.coordslng);
                marker = new google.maps.Marker({
                    position: itemLatLng,
                    map: map,
                    draggable:false,
                    title: item.rubrik
                });  
            }

        })

    }, function(error){
        console.log(error);
    })
}

