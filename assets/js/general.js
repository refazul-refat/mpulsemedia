$(document).ready(function(){
	var t=setInterval(function(){
		if($('.fallback').first().text()){
			clearInterval(t);
			auid=$('.fallback').first().text();
			if($('#vuid').text())
				auid=$('#vuid').text();
			
			$.ajax({
				url:api_base+'moments/all?limit=100',
				method:'GET',
				dataType:'json',
				statusCode:{
					200:function(response){
						for(var i=0;i<response.length;i++){
							var moment=response[i];
							var m=$('<div>',{class:'moment'}).attr('data-moment',moment.id);
							$(m).attr('data-tag',moment.tag);
							
							var tag=$('<div>',{class:'moment_tag'}).css('display','inline-block').text(moment.tag).appendTo(m);
							$('#all').append(m);
						}
						var tag = document.createElement('script');
						tag.src = "https://www.youtube.com/iframe_api";
						var firstScriptTag = document.getElementsByTagName('script')[0];
						firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
						
						$('.moment .moment_tag').click(function(e){
							console.log($(this).parent().attr('data-moment'));
							Moment.playIt({id:$(this).parent().attr('data-moment')});
						});
						setInterval(function(){
							var term=$('#search').val().toLowerCase();
							$('.moment').each(function(){
								var t=$(this).attr('data-tag').toLowerCase();
								if(t.indexOf(term)==-1)
									$(this).fadeOut();
								else
									$(this).fadeIn();
							});
						},1000);
					}
				}
			});
		}
		console.log('-waiting-');
	},1000);
});