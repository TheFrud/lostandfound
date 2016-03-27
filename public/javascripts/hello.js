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

	/*
	--------------------------------------------
	*/
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

	/*
	--------------------------------------------
	*/

	// Change div in form depending on if the object which
	// is to be posted is "borttappat" eller "upphittat"

	// Html elements
    const typSelector = $("#typ")
	const fillThis = $("#fillThis")
	const hitteLonDiv = $("#hittelon_div");

	// When select value changes > Change fillThis-value.
	typSelector.change(function() {
		setFormType();
	});

	// Changes the fillThis-value.
	function setFormType() {

		// Messages
		const borttappatMsg = "tappade du bort";
		const upphittatMsg = "hittade du";

        // Get selected value from select input 
	    var selectValue = $( "#typ option:selected" ).text();

		// Set text in form
		if(selectValue === "Borttappat") {
		  	fillHtml(borttappatMsg);
		  	showHittelon();
		} else if(selectValue === "Upphittat") {
		  	fillHtml(upphittatMsg);
		  	hideHittelon();
		  	marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
		}

		// Hide hittelön-div
		function hideHittelon() {
			hitteLonDiv.hide();
		}

		// Show hittelön-div
		function showHittelon() {
			hitteLonDiv.show();
		}

		// Fill html
		function fillHtml(text) {
			fillThis.html(text);
		}
	}

	// Init when the page loads
	setFormType();



	/*
	-------------------------------------------
	*/

	// IMAGE UPLOAD CODE (have to be cleaned up)
	// var form = document.getElementById('form_upload_img');
	var fileSelect = document.getElementById('file');
	// var uploadButton = document.getElementById('upload_img');
	var hiddenForm = document.getElementById('img_path');
	var uploaded_image_div = document.getElementById("uploaded_image");
	var img_upload_failure_div = document.getElementById("img_upload_failure");
	var img_upload_succeess_div = document.getElementById("img_upload_succeess");
	var progress_bar = document.getElementById("progress_bar");


	fileSelect.onchange = function(event) {
		event.preventDefault();

		// Show progress_bar
		progress_bar.style.display = "block";

		// The rest of the code will go here...

		// Get the selected files from the input.
		var files = fileSelect.files;

		// Create a new FormData object.
		var formData = new FormData();
		
		var file = files[0];

		// Check the file type.
		if (file.type.match('image.*')) {

			// Add the file to the request.
			formData.append('img', file, file.name);
			

			// Set up the request.
			var xhr = new XMLHttpRequest();

			xhr.open('POST', 'http://192.168.1.45:9000/upload', true);

			// Set up a handler for when the request finishes.
			xhr.onload = function () {
			  if (xhr.status === 200) {
			    // File(s) uploaded.
			    // Hide progress_bar
				progress_bar.style.display = "none";
			
			    hiddenForm.value = xhr.responseText;

			    var contentString = "<br><img class='media-object' src='/assets/images/annons_imgs/"+xhr.responseText+"' alt='...' height='42' width='42'><br>"
			    
				var server_success_msg = "Bild uppladdad!";
			    uploaded_image_div.innerHTML = contentString;
			    uploaded_image_div.style.visibility = "visible";
			    img_upload_succeess_div.style.display =  "block";
			    img_upload_failure_div.style.display = "none";
			    img_upload_succeess_div.innerHTML = server_success_msg;
			    console.log(server_success_msg);


			  } else {
			  	// Hide progress_bar
				progress_bar.style.display = "none";
			    var server_fail_msg = "Kunde inte ladda upp bild!";
			    img_upload_succeess_div.style.display =  "none";
			    img_upload_failure_div.style.display = "block";
			    img_upload_failure_div.innerHTML = server_fail_msg;
				console.log(server_fail_msg);

			  }
			};		
			
			// Send the Data.
			xhr.send(formData);    
		} else {
			// Hide progress_bar
			progress_bar.style.display = "none";

			var wrong_filetyp_msg = 'Fel filtyp! Du måste välja en bild.';
			img_upload_succeess_div.style.display =  "none";
			img_upload_failure_div.style.display = "block";
			img_upload_failure_div.innerHTML = wrong_filetyp_msg;
			console.log(wrong_filetyp_msg);
		}


	}


	
	/*
	-------------------------- FORM SUBMIT (LOADING SPINNER)
	Funkar nog inte pg a att jag inte kör med Ajax:
	Sidan dör ju typ direkt efter att man klickat på submit i detta fall...
	*/

	/*
	const form_submit_button = document.getElementById("form_submit_button");
	const form_submit_spinner = document.getElementById("form_submit_spinner");

	$("#annons_form").submit(function() {
		form_submit_spinner.style.display = "block";
	})
	*/

	
})