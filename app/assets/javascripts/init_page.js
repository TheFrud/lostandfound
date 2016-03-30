/*jshint esnext: true */

module.exports = {
	initPage: function() {

		console.log("Initializing page...");

		// Get string value
		const active_page = $("#active_page").html();

		// Page names to check for
		const annonser_page = "Annonser";
		const annons_page = "Annons";
		const skapa_annons_page = "Skapa annons";

		// Buttons of interest
		const annonser_button = document.getElementById("annonser_button");
		const skapa_annons_button = document.getElementById("skapa_annons_button");

		// Classes to set
		const primary = "btn btn-primary btn-lg";
		const secondary = "btn btn-secondary btn-lg";

		// Set page options depending on page
		switch (active_page) {
			case annonser_page:
				console.log("Annonser page");

				// Set buttons
				annonser_button.className = primary;
				skapa_annons_button.className = secondary;

				break;
			case annons_page:
				console.log("Annons page");

				// Set buttons
				annonser_button.className = secondary;
				skapa_annons_button.className = secondary;

				break;
			case skapa_annons_page:
				console.log("Skapa annons page");

				// Set buttons
				annonser_button.className = secondary;
				skapa_annons_button.className = primary;
				console.log(skapa_annons_button);

				break;
		}	
	}
};