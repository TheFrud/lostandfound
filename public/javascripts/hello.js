$(document).ready(function(){
	console.log("Ready!")

	const borttappat_checkbox = $("#borttappat_checkbox")
	const upphittat_checkbox = $("#upphittat_checkbox")

	borttappat_checkbox.prop("checked", true)
	upphittat_checkbox.prop("checked", true)

	borttappat_checkbox.click(() => {
		$(".borttappat").toggle(400)
	})

	upphittat_checkbox.click(() => {
		$(".upphittat").toggle(400)
	})

})