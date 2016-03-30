/*jshint esnext: true */

const initializer = require("./init_page");

initializer.initPage();


// Html elements
const typSelector = $("#typ");
const fillThis = $("#fillThis");
const hitteLonDiv = $("#hittelon_div");

// When select value changes > Change fillThis-value.
typSelector.change(function() {
	setFormType();
});

// Changes the fillThis-value.
var setFormType = function () {

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
		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
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

console.log("Fileselect: " + fileSelect);

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

		const url = jsRoutes.controllers.HomeController.upload();

		xhr.open('POST', url.url, true);

		// Set up a handler for when the request finishes.
		xhr.onload = function () {
			if (xhr.status === 200) {
				// File(s) uploaded.
				// Hide progress_bar
				progress_bar.style.display = "none";
			
				hiddenForm.value = xhr.responseText;
				console.log("Server response: " + xhr.responseText);

				var contentString = "<img class='media-object img-rounded' src='/assets/images/annons_imgs/"+xhr.responseText+"' alt='...'><br>";
				
				var server_success_msg = "Bild uppladdad!";
				uploaded_image_div.innerHTML = contentString;
				uploaded_image_div.style.display = "visible";
				img_upload_succeess_div.style.display =  "block";
				img_upload_failure_div.style.display = "none";
				img_upload_succeess_div.innerHTML = server_success_msg;
				console.log(server_success_msg);

				// "Imagefitting"
				// https://github.com/karacas/imgLiquid
				$(".imgLiquidFill").imgLiquid();

			} 

			else {
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


};