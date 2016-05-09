// Set current page
localStorage.setItem("currentPage", "Annons");

const initializer = require("./init_page");

initializer.initPage();

// "Imagefitting"
// https://github.com/karacas/imgLiquid
$(".imgLiquidFill").imgLiquid();

// Change to annonser-page
$(window).on( "swiperight", function( event ) {
	const url = jsRoutes.controllers.HomeController.index();
	window.location.href = url.url;
});