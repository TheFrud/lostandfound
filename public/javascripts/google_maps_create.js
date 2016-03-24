
        var myLatlng;
        var map;
        var marker;
        var sthlmlat = 59.328519;
        var sthlmlng = 18.067878;

        function initMap() {
            console.log("initMap()")

            myLatlng = new google.maps.LatLng(sthlmlat, sthlmlng);

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

            marker.set("id", "myMarker");

            whenLoaded();
        }
        // $("#myMarker").move(function(){console.log("dasdsad")})
        var whenLoaded = function(){
            $("#coordslat").val(marker.position.lat);
            $("#coordslng").val(marker.position.lng);

            marker.addListener("dragend", function(){
                console.log("Drag end");
                $("#coordslat").val(marker.position.lat);
                $("#coordslng").val(marker.position.lng);
            })

        }


