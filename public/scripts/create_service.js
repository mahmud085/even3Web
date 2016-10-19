$(document).ready(function(){
	$('#upload_photo').click(function(){
		$("#pic").trigger('click');
	});

	var add_ticket = $('.ticket_container').html();
	
	$('#event_price_paid,#event_price_free').change(function(){
		if(this.value === 'paid'){
			$(".ticket_type").show();
		}
		else if(this.value === 'free'){
			$(".ticket_type").hide();   
			$('.ticket_container').remove();
			$(".ticket_type .add_new_event").before('<div class=\"ticket_container\">' + add_ticket + '</div>');
		}else{

		}
	 	
	});

	$('.add_new_event').click(function(){
	 $('.ticket_container').last().after('<div class=\"ticket_container\">' + add_ticket + '</div>');
	})
});