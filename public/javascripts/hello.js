$(document).ready(function(){
	// Map/Lista Toggle
	var toogleModeButton;
	const page = $("#page").text();
	if(page === "Annonser"){
		toogleModeButton = $("#toggleModeButton");
	} else if (page === "Skapa annons" || page === "Annons") {
		toogleModeButton = $("#laggTillAnnonsVersionToggleModeButton");
	}
	
	// google.maps.event.trigger(map, "resize");

	const fadeSpeed = 0;

	initToggleMode();

	function initToggleMode() {
		var toggleState = localStorage.getItem("toggleState");
		console.log("Initiating page, toggleState = " + toggleState);
		if(toggleState === "" || toggleState === undefined || toggleState === null){
			setToggleModeKartvy();
		}
		else {
			if(toggleState === "Kartvy"){
				console.log("setToggleModeKartvy()");
				setToggleModeKartvy();
			} else if(toggleState === "Listvy"){
				console.log("setToggleModeListvy()");
				setToggleModeListvy();
			}
		}
	}

	toogleModeButton.click(() => {
		console.log("Button clicked!");
		var toggleState = localStorage.getItem("toggleState");
		console.log(toggleState);
		if(page === "Skapa annons" || page === "Annons"){
			return;
		}
		if(toggleState === "Kartvy"){
			console.log("Setting to Listvy.");
			setToggleModeListvy();
		} else if(toggleState === "Listvy"){
			console.log("Setting to Kartvy.");
			setToggleModeKartvy();
		}
		
		
	})

	function setToggleModeKartvy() {
		toogleModeButton.html("Kartvy");
		$("#mapView").show(fadeSpeed)
		$("#listView").hide(fadeSpeed)

		// Crucial code --->>> (google.maps.event.trigger(map, "resize");)
		// So that the map shows up properly after unhiding it.
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);

		localStorage.setItem('toggleState', "Kartvy");
	}	

	function setToggleModeListvy() {
		toogleModeButton.html("Listvy");
		$("#listView").show(fadeSpeed)
		$("#mapView").hide(fadeSpeed)
		localStorage.setItem('toggleState', "Listvy");
	}

	// Borttappat/Upphittat Toggle
	const borttappat_checkbox = $("#borttappat_checkbox")
	const upphittat_checkbox = $("#upphittat_checkbox")

	borttappat_checkbox.prop("checked", true)
	upphittat_checkbox.prop("checked", true)

	borttappat_checkbox.click(() => {
		$(".borttappat").toggle(fadeSpeed)
	})

	upphittat_checkbox.click(() => {
		$(".upphittat").toggle(fadeSpeed)
	})

})