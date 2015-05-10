var token='TqD5p_0h9ZEH8Bef5pV1r9d8AX9u05MT';
var api_base='http://api.mpulsemedia.com/v1/';
var secure_api_base='https://api.mpulsemedia.com/v1/';
function makeId(){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	for( var i=0; i < 32; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}
Playlist={
	load:function(object,callback){
		var auid=object.auid;
		$.ajax({
			url:api_base+'users/'+auid+'/playlists?token='+token,
			method:'GET',
			dataType:'json',
			statusCode:{
				200:function(response){
					if(typeof callback==='function')callback(response);
				}
			}
		});
	},
	remove:function(object,callback){
		var id=object.id;	
		$.ajax({
			url:api_base+'playlists/'+id,
			data:{method:'delete',token:token},
			method:'POST',
			dataType:'json',
			statusCode:{
				204:function(response){
					if(typeof callback==='function')callback(response);
				}
			}
		});
	}
};
Moment={
	load:function(object,callback){
		var id=object.id
		$.ajax({
			url:api_base+'moments/'+id+'?token='+token,
			method:'GET',
			dataType:'json',
			statusCode:{
				200:function(response){
					if(typeof callback==='function')callback(response);
				}
			}
		});
	},
	playIt:function(object){
		Moment.load({id:object.id},function(response){
			console.log(response);
			var id=makeId();
			var resource=response.asset.resource_id;
			var m=$('<div>',{id:id})
				.attr('data-moment',response.id)
				.attr('data-start',parseInt(response.time_start,10))
				.attr('data-end',parseInt(response.time_end,10))
				.attr('data-resource',response.asset.resource_id);
			if(response.asset.source==1)
				$(m).attr('data-asset','youtube').addClass('yt-player').addClass('player');
			else if(response.asset.source==2)
				$(m).attr('data-asset','netflix');
			else if(response.asset.source==3)
				$(m).attr('data-asset','twitch').addClass('tw-player').addClass('player');
		
			var container=$('<div>',{id:'container-'+id,class:'p-container'});
			var next=$('<div>',{class:'next-thumbnail'});
		
			$(m).appendTo(container);
			$(next).appendTo(container);
			$('.p-container').remove();
			$(container).appendTo($('body'));
		
			if(response.asset.source==1){
				$.ajax({
					url:'assist?video_id='+response.asset.resource_id,
					dataType:'json',
					method:'GET',
					statusCode:{
						200:function(data){
							var storyboard_spec=decodeURIComponent((/&storyboard_spec=(.*?)&/.exec(data.responseText) || [])[1]);
							$('#'+id).attr('data-ready',true);
							$('#'+id).attr('data-storyboard_spec',storyboard_spec);
					
							player = new YT.Player(id, {
								height: '100%',
								width: '80%',
								videoId: resource,
								events: {
									'onReady': onPlayerReadyPassive,
									'onStateChange': function(e){onPlayerStateChangePassive(e,$('#'+id));}
								}
							});
						}
					}
				});
			}
			else if(response.asset.source==3){
				var attributes={};
				attributes['data-start']=response.time_start;
	
				swfobject.embedSWF("http://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf",
					id,
					'80%',
					'100%',
					"11",
					null,
					{"eventsCallback":"function(e){onPlayerEvent(e,'"+id+"')}","embed":1,"videoId":response.asset.resource_id,"auto_play":"true"},
					{"allowScriptAccess":"always","allowFullScreen":"true"},
					attributes);
			
				$('#'+id).attr('data-ready',true);
			}
		
			$(container).click(function(e){
				e.stopPropagation();
				$('.p-container').fadeIn().remove();
			});
			$(next).click(function(e){
				e.stopPropagation();
				var current=$(playlist).attr('data-next_moments').split(',')[0];
				var moments=$(playlist).attr('data-moments');
				var next_moments=$(playlist).attr('data-next_moments').split(',').slice(1).join(',');
			
				$(playlist).attr('data-current',current);
				$(playlist).attr('data-next_moments',next_moments);
				console.log('All - '+moments);
				console.log('Current - '+current);
				console.log('Next - '+next_moments);
				if(current=='')return;
			
				play(playlist);
			});
		});
	}
};
function onPlayerReadyPassive(event){
}
function onPlayerStateChangePassive(event,object){
	if (event.data == YT.PlayerState.PLAYING) {
		player.seekTo(parseInt($(object).attr('data-start'),10));
	}
}
function onPlayerEvent(data,id){
	data.forEach(function(event) {
		if (event.event == "videoPlaying") {
			var player = $('#'+id)[0];
			if($(player).attr('data-start')){
				player.videoSeek(parseInt($(player).attr('data-start'),10));
			}
			player.pauseVideo();
		}
	});
};
function play(playlist){
	Moment.load({id:$(playlist).attr('data-current')},function(response){
		console.log(response);
		var id=makeId();
		var resource=response.asset.resource_id;
		var m=$('<div>',{id:id})
			.attr('data-moment',response.id)
			.attr('data-start',parseInt(response.time_start,10))
			.attr('data-end',parseInt(response.time_end,10))
			.attr('data-resource',response.asset.resource_id);
		if(response.asset.source==1)
			$(m).attr('data-asset','youtube').addClass('yt-player').addClass('player');
		else if(response.asset.source==2)
			$(m).attr('data-asset','netflix');
		else if(response.asset.source==3)
			$(m).attr('data-asset','twitch').addClass('tw-player').addClass('player');
		
		var container=$('<div>',{id:'container-'+id,class:'p-container'});
		var next=$('<div>',{class:'next-thumbnail'});
		
		$(m).appendTo(container);
		$(next).appendTo(container);
		$('.p-container').remove();
		$(container).appendTo($('body'));
		
		if(response.asset.source==1){
			$.ajax({
				url:'assist?video_id='+response.asset.resource_id,
				dataType:'json',
				method:'GET',
				statusCode:{
					200:function(data){
						var storyboard_spec=decodeURIComponent((/&storyboard_spec=(.*?)&/.exec(data.responseText) || [])[1]);
						$('#'+id).attr('data-ready',true);
						$('#'+id).attr('data-storyboard_spec',storyboard_spec);
					
						player = new YT.Player(id, {
							height: '100%',
							width: '80%',
							videoId: resource,
							events: {
								'onReady': onPlayerReadyPassive,
								'onStateChange': function(e){onPlayerStateChangePassive(e,$('#'+id));}
							}
						});
					}
				}
			});
		}
		else if(response.asset.source==3){
			var attributes={};
			attributes['data-start']=response.time_start;
	
			swfobject.embedSWF("http://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf",
				id,
				'80%',
				'100%',
				"11",
				null,
				{"eventsCallback":"function(e){onPlayerEvent(e,'"+id+"')}","embed":1,"videoId":response.asset.resource_id,"auto_play":"true"},
				{"allowScriptAccess":"always","allowFullScreen":"true"},
				attributes);
			
			$('#'+id).attr('data-ready',true);
		}
		
		$(container).click(function(e){
			e.stopPropagation();
			$('.p-container').fadeIn().remove();
		});
		$(next).click(function(e){
			e.stopPropagation();
			var current=$(playlist).attr('data-next_moments').split(',')[0];
			var moments=$(playlist).attr('data-moments');
			var next_moments=$(playlist).attr('data-next_moments').split(',').slice(1).join(',');
			
			$(playlist).attr('data-current',current);
			$(playlist).attr('data-next_moments',next_moments);
			console.log('All - '+moments);
			console.log('Current - '+current);
			console.log('Next - '+next_moments);
			if(current=='')return;
			
			play(playlist);
		});
	});
}
