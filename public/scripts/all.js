function getDate(){
	var currentDate = new Date()
	var day = currentDate.getDate()
	var month = currentDate.getMonth() + 1
	var year = currentDate.getFullYear();

	return month + "/" + day + "/" + year;
}


$(document).ready(function(){
	$('.hamburger').click(function(){
		$('.menu').slideToggle();
	});
});