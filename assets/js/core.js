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
Twitch=function(id){
	this.id=id;
};
Twitch.prototype.getResourceId=function(){
	return $('#'+this.id).attr('data-resource');
};
Twitch.prototype.getTitle=function(){
	return this.title;
};
Twitch.prototype.getPublisher=function(){
	return this.publisher;
};
Twitch.prototype.getDuration=function(){
	return this.duration;
};
Twitch.prototype.getThumbnail=function(){
	return this.thumbnail;
};
Twitch.prototype.getThumbnailAt=function(time,w,h){
	return this.thumbnail;
};
Twitch.prototype.seekTo=function(time){
	var that=this;
	$('#'+that.id)[0].videoSeek(time);
};
Twitch.prototype.getSource=function(){
	return 'twitch';
};
Twitch.prototype.getTarget=function(){
	return $('#'+this.id);
};
Twitch.prototype.init=function(callback){
	var that=this;
	if(that.isReady()){callback();return;}
	$.ajax({
		dataType: "jsonp",
		method:'GET',
		url: 'https://api.twitch.tv/kraken/videos/'+that.getResourceId(),
		success: function(response){
			that.title=response.title;
			that.publisher=response.channel.display_name;
			that.resource_id=response._id;
			that.duration=parseInt(response.length,10);
			that.thumbnail=response.preview;
			
			var t=setInterval(function(){
				if(that.getTarget()){
					clearInterval(t);
					console.log('--Twitch Ready--');
					$('#'+that.id).attr('data-ready',true);
					callback();
				}
			},1000);
		}
	});
};
Twitch.prototype.isReady=function(){
	return $('#'+this.id).attr('data-ready')=='true'?true:false;
};
Twitch.prototype.play=function(){
	$('#'+this.id)[0].playVideo();
};
Twitch.prototype.pause=function(){
	$('#'+this.id)[0].pauseVideo();
};
Twitch.prototype.getCurrentTime=function(){
	return $('#'+this.id)[0].getVideoTime();
};
Youtube=function(id){
	this.id=id;
	this.player=YT.get(id);
};
Youtube.prototype.getResourceId=function(){
	return $('#'+this.id).attr('data-resource');
};
Youtube.prototype.getTitle=function(){
	return this.player.getVideoData().title;
};
Youtube.prototype.getPublisher=function(){
	return this.player.getVideoData().author;
};
Youtube.prototype.getDuration=function(){
	return this.player.getDuration();
};
Youtube.prototype.getThumbnail=function(){
	return 'http://img.youtube.com/vi/'+this.getResourceId()+'/default.jpg';
};
Youtube.prototype.getThumbnailAt=function(time,w,h){
	var storyboard=$('#'+this.id).attr('data-storyboard_spec');
	var seconds=this.getDuration();
	try{
		var thumb={};
		var array=storyboard.split('|');

		thumb.url=array[0].replace('$L',array.length-2);

		var best=array.reverse()[0];
		var tokens=best.split('#');

		thumb.width=parseInt(tokens[0],10);
		thumb.height=parseInt(tokens[1],10);
		thumb.total=parseInt(tokens[2]);
		thumb.gridX=parseInt(tokens[3]);
		thumb.gridY=parseInt(tokens[4]);
		//var thumb.unknown=tokens[5];
		thumb.name=tokens[6];
		thumb.sigh=tokens[7];

		thumb.totalseconds=parseInt(seconds,10);
		this.thumb=thumb;
		//console.log(this.thumb);
		
		time=parseInt(time,10);

		var per=Math.ceil(this.thumb.totalseconds/this.thumb.total);
		var thumb=Math.floor((time/per)+1);

		var sheet=Math.floor(thumb/(this.thumb.gridX*this.thumb.gridY));
		var pos=(thumb%(this.thumb.gridX*this.thumb.gridY));

		var col=(pos%this.thumb.gridY);
		if(col<0)col=0;

		var row=Math.floor(pos/(this.thumb.gridX));
		if(row<0)row=0;

		//console.log(per,thumb,sheet,pos,col,row);

		var object={};object.style={};
		var url=this.thumb.url;
		url=url.replace('$N','M'+sheet)+'?sigh='+this.thumb.sigh;

		object.url=url;
		object.width=this.thumb.width;
		object.height=this.thumb.height;
		object.row=row;
		object.col=col;

		/* General
		object.style.width=this.thumb.width+'px';
		object.style.height=this.thumb.height+'px';
		object.style.backgroundImage='url('+url+')';
		object.style.backgroundPosition='-'+(col*this.thumb.width)+'px -'+(row*this.thumb.height)+'px';
		*/

		/* Fixed to 100x75 */
		object.style.width=w+'px';
		object.style.height=h+'px';
		object.style.backgroundImage='url('+url+')';
		object.style.backgroundPosition='-'+(col*w)+'px -'+(row*h)+'px';
		object.style.backgroundSize=(this.thumb.gridX*100)+'% '+(this.thumb.gridY*100)+'%';

		// Last page fix
		if(Math.floor(this.thumb.total/(this.thumb.gridX*this.thumb.gridY))==sheet){

			var lptotal=this.thumb.total%(this.thumb.gridX*this.thumb.gridY);
			var lpcolumn=Math.ceil(lptotal/this.thumb.gridY);
			object.style.backgroundSize=(this.thumb.gridX*100)+'% '+(lpcolumn*100)+'%';
		}
		//console.log(object);
		return object;

		/* Sample object
		object = {
			url		:	https://i.ytimg.com/sb/idLyobOhtO4/storyboard3_L2/M3.jpg,
			width	:	160,
			height	:	90,
			row		:	2,
			col		:	3,
			style:	:	{
							width				:	100px,
							height				:	75px,
							backgroundImage		:	url(https://i.ytimg.com/sb/MYP56QJpDr4/storyboard3_L2/M12.jpg?sigh=ZMDkkLACxYvP3ntjQguILtK5hfQ),
							backgroundPosition	:	-100px -225px,
							backgroundSize		:	500% 500%
						}
		}
		*/

		/* Measure Performance ~ Maximum 1 frame shift from youtube
		var test=document.getElementById('thumbtest');
		test.style.width=object.style.width;
		test.style.height=object.style.height;
		test.style.backgroundImage=object.style.backgroundImage;
		test.style.backgroundPosition=object.style.backgroundPosition;
		test.style.backgroundSize=object.style.backgroundSize;
		*/

	}
	catch(err){
		console.log('---Unable to parse storyboard spec---');
		return false;
	}
};
Youtube.prototype.seekTo=function(time){
	return this.player.seekTo(time);
};
Youtube.prototype.getSource=function(){
	return 'youtube';
};
Youtube.prototype.getTarget=function(){
	return $('#'+this.id);
};
Youtube.prototype.init=function(callback){
	var that=this;
	if(that.isReady()){callback();return;}
	//storyboard_spec 2nd attempt #see onYouTubePlayerAPIReady()
	$.ajax({
		url:'assist?video_id='+that.getResourceId(),
		dataType:'json',
		method:'GET',
		statusCode:{
			200:function(data){
				that.storyboard_spec=decodeURIComponent((/&storyboard_spec=(.*?)&/.exec(data.responseText) || [])[1]);
				$('#'+that.id).attr('data-ready',true);
				$('#'+that.id).attr('data-storyboard_spec',that.storyboard_spec);
				callback();
			}
		}
	});
};
Youtube.prototype.isReady=function(){
	return $('#'+this.id).attr('data-ready')=='true'?true:false;
};
Youtube.prototype.play=function(){
	this.player.playVideo();
};
Youtube.prototype.pause=function(){
	this.player.pauseVideo();
};
Youtube.prototype.getCurrentTime=function(){
	return this.player.getCurrentTime();
};
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
	save:function(object,tag){
		var data={
				token:token,
				tag:tag,
				time_start:object.getCurrentTime(),
				asset_source:object.getSource(),
				asset_resource_id:object.getResourceId(),
				asset_title:object.getTitle(),
				asset_publisher:object.getPublisher(),
				asset_duration:object.getDuration(),
				asset_thumbnail:object.getThumbnail(),
				auid:auid
		};
		console.log('--Saving Moment--');
		console.log(data);
		if(object.getSource()=='twitch')
			data['thumbnail_background_image']=object.getThumbnailAt(object.getCurrentTime());
		else if(object.getSource()=='youtube'){
			data['thumbnail_background_image']=object.getThumbnailAt(object.getCurrentTime(),300,175).style.backgroundImage;
			data['thumbnail_background_position']=object.getThumbnailAt(object.getCurrentTime(),300,175).style.backgroundPosition;
			data['thumbnail_background_size']=object.getThumbnailAt(object.getCurrentTime(),300,175).style.backgroundSize;
		}
		$.ajax({
			dataType:'json',
			method:'POST',
			url:api_base+'moments',
			data:data,
			statusCode:{
				201:function(response){
					console.log(response);
				}
			}
		});
	},
	play:function(mid){
		$.ajax({
			dataType:'json',
			method:'POST',
			url:api_base+'play/moment',
			data:{mid:mid,auid:auid},
			statusCode:{
				200:function(response){
					console.log(response);
				}
			}
		});
	},
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
		
			$(m).appendTo(container);
			$('.p-container').remove();
			$(container).appendTo($('body'));
			
			$(container).append($('<div>',{class:'moment_button'}).text('#moment').click(function(event){
				event.stopPropagation();
				var target=$(this).parent().children().first();
				var t;
				if($(target).attr('data-asset')=='twitch')
					t=new Twitch($(target).attr('id'));
				else if($(target).attr('data-asset')=='youtube')
					t=new Youtube($(target).attr('id'));
				console.log(t);
				t.pause();
				t.init(function(){
					var tag=prompt("Enter Tag","");
					if(tag!=null){
						Moment.save(t,tag);
					}
					t.play();
				});
			}));
		
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
							Moment.play(response.id);
						}
					}
				});
			}
			else if(response.asset.source==3){
				var attributes={};
				attributes['data-start']=response.time_start;
				if(response.asset.source==1)attributes['data-asset']='youtube';
				else if(response.asset.source==3)attributes['data-asset']='twitch';
				attributes['data-resource']=response.asset.resource_id;
	
				swfobject.embedSWF("http://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf",
					id,
					'80%',
					'100%',
					"11",
					null,
					{"eventsCallback":"function(e){onPlayerEvent(e,'"+id+"')}","embed":1,"videoId":response.asset.resource_id,"auto_play":"true"},
					{"allowScriptAccess":"always","allowFullScreen":"true"},
					attributes);
				Moment.play(response.id);
			}
		
			$(container).click(function(e){
				e.stopPropagation();
				$('.p-container').fadeIn().remove();
			});
		});
	}
};
function onPlayerReadyPassive(event){
}
function onPlayerStateChangePassive(event,object){
	if (event.data == YT.PlayerState.PLAYING) {
		if($(event.target.c).attr('data-once')=='false' || $(event.target.c).attr('data-once')==undefined){
			player.seekTo(parseInt($(object).attr('data-start'),10));
			$(event.target.c).attr('data-once','true');
		}
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
			if(response.asset.source==1)attributes['data-asset']='youtube';
			else if(response.asset.source==3)attributes['data-asset']='twitch';
			attributes['data-resource']=response.asset.resource_id;
	
			swfobject.embedSWF("http://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf",
				id,
				'80%',
				'100%',
				"11",
				null,
				{"eventsCallback":"function(e){onPlayerEvent(e,'"+id+"')}","embed":1,"videoId":response.asset.resource_id,"auto_play":"true"},
				{"allowScriptAccess":"always","allowFullScreen":"true"},
				attributes);
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
