$(document).ready(function(){
	var t=setInterval(function(){
		if($('#auid').text()){
			clearInterval(t);
			auid=$('#auid').text();
			
			Playlist.load({auid:auid},function(response){
				for(var i=0;i<response.length;i++){
					var current=0;
					var moments=[];
					var next_moments=[];
					for(var j=0;j<response[i].moments.length;j++){
						moments.push(response[i].moments[j].id);
						next_moments.push(response[i].moments[j].id);
					}
					//console.log(moments);
					current=moments[0];
					moments=moments.join(',');
					next_moments=next_moments.slice(1).join(',');
					var playlist=$('<div>',{class:'playlist'}).attr('data-state','saved').attr('data-playlist',response[i].id).attr('data-current',current).attr('data-moments',moments).attr('data-next_moments',next_moments);
					var remove=$('<div>',{class:'remove'}).text('x').appendTo(playlist);
					var title=$('<div>',{class:'title'}).text(response[i].title+' ('+response[i].moment_count+')').appendTo(playlist);
					
					$(playlist).appendTo($('#playlist-container'));
				}
				$('.playlist').click(function(){
					var current=$(this).attr('data-current');
					var moments=$(this).attr('data-moments');
					var next_moments=$(this).attr('data-next_moments');
					console.log('All - '+moments);
					console.log('Current - '+current);
					console.log('Next - '+next_moments);
					window['player']=null;
					if(current==0)return;
				
					play($(this));
				});
				$('.remove').click(function(e){
					e.stopPropagation();
					var that=$(this);
					Playlist.remove({id:$(this).parent().attr('data-playlist')},function(response){
						$(that).parent().remove();
					});
				});
			});

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
						
						$('#record').unbind('click');
						$('#record').click(function(){
							var playlist=$('<div>',{class:'playlist'}).attr('data-state','unsaved');
							var title=$('<input>',{type:'text',autocomplete:'off',placeholder:'Playlist Title',class:'title'}).appendTo(playlist);
							var save_private=$('<button>',{class:'button save'}).attr('data-public','false').text('Save Private').appendTo(playlist);
							var publish=$('<button>',{class:'button save'}).attr('data-public','true').text('Publish').appendTo(playlist);
							$('#playlist-container').append(playlist);

							$('.moment').each(function(e){
								var moment=$(this);
								var plus=$('<div>',{class:'plus'}).css('display','inline-block').text('+');
								$(plus).click(function(event){
									event.preventDefault();

									var item=$('<div>',{}).attr('data-moment',$(this).parent().attr('data-moment')).text($(this).parent().attr('data-tag'));
									$(this).remove();
									$(playlist).append(item);
								});
								$(moment).append(plus);
							});
							$(this).hide();
							$('#cancel').fadeIn();
							$('.save').fadeIn();

							$('.save').unbind('click');
							$('.save').click(function(){
								var status_public=0;
								var moments=[];
								if($(this).attr('data-public')=='true')status_public=1;

								$('[data-state="unsaved"]').children().each(function(e){
									var moment=$(this).attr('data-moment');
									if(moment!=undefined){
										moments.push(moment);
									}
								});
								var title=$('[data-state="unsaved"] .title').val();
								moments=moments.join(',');
								$.ajax({
									url:api_base+'playlists',
									method:'POST',
									data:{title:title,publisher_id:auid,moment_ids:moments,token:token,method:'rewrite',unique:'true',status_public:status_public},
									dataType:'json',
									statusCode:{
										201:function(response){
											var current=0;
											var moments=[];
											var next_moments=[];
											for(var j=0;j<response.moments.length;j++){
												moments.push(response.moments[j].id);
												next_moments.push(response.moments[j].id);
											}
											//console.log(moments);
											current=moments[0];
											moments=moments.join(',');
											next_moments=next_moments.slice(1).join(',');
											
											var playlist=$('<div>',{class:'playlist'}).attr('data-state','saved').attr('data-playlist',response.id).attr('data-current',current).attr('data-moments',moments).attr('data-next_moments',next_moments).appendTo($('#playlist-container'));
											var remove=$('<div>',{class:'remove'}).text('x').appendTo(playlist);
											var title=$('<div>',{class:title}).text(response.title+' ('+response.moment_count+')').appendTo(playlist);
											
											$(playlist).unbind('click');
											$(playlist).click(function(){
												var current=$(this).attr('data-current');
												var moments=$(this).attr('data-moments');
												var next_moments=$(this).attr('data-next_moments');
												console.log('All - '+moments);
												console.log('Current - '+current);
												console.log('Next - '+next_moments);
												window['player']=null;
												if(current==0)return;
												
												play($(this));
											});
											$(remove).unbind('click');
											$(remove).click(function(){
												var that=$(this);
												$.ajax({
													url:api_base+'playlists/'+$(that).parent().attr('data-playlist'),
													data:{method:'delete',token:token},
													method:'POST',
													dataType:'json',
													statusCode:{
														204:function(response){
															$(that).parent().remove();
														}
													}
												});
											});
											$('[data-state="unsaved"]').remove();
											$('.plus').remove();
											$('#cancel').hide();
											$('#record').fadeIn();
											$('.save').hide();
											console.log(response);
										}
									}
								});
							});
						});
						$('#cancel').click(function(){
							$(this).hide();
							$('#record').fadeIn();
							$('[data-state="unsaved"]').remove();
							$('.plus').remove();
						});
					}
				}
			});
		}
		console.log('-waiting-');
	},1000);
});