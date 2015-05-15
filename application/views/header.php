<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title><?php echo $title;?></title>
		<link rel='stylesheet' href='assets/css/style.css'/>
		
		<script type='text/javascript' src='assets/js/lib/jquery-2.1.3.min.js'></script>
		<script type='text/javascript' src='assets/js/lib/swfobject.js'></script>
	</head>
	<body>
		<script>
		  window.fbAsyncInit = function() {
			FB.init({
			  appId      : '946381225384146',
			  xfbml      : true,
			  version    : 'v2.3'
			});
			FB.getLoginStatus(function(response) {
			  if (response.status === 'connected') {
				console.log('Logged in.');
			  }
			  else {
				FB.login(function(){},{scope: 'email'});
			  }
			});
		  };
		  (function(d, s, id){
			 var js, fjs = d.getElementsByTagName(s)[0];
			 if (d.getElementById(id)) {return;}
			 js = d.createElement(s); js.id = id;
			 js.src = "//connect.facebook.net/en_US/sdk.js";
			 fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));
		</script>
		<a href='<?php echo base_url();?>'>Home</a>
		<a href='history'>History</a>
		<a href='recent'>Recently Created<a/>
		<a href='playlist'>Playlist</a>
		<div
		  class="fb-like"
		  data-share="true"
		  data-width="450"
		  data-show-faces="true">
		</div>