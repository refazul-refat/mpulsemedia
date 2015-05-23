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
		<a href='<?php echo base_url();?>'>Home</a>
		| <a href='history'>History</a>
		| <a href='recent'>Recently Created</a>
		| <a href='playlist'>Playlist</a>
		<br/>
		<?php if($this->session->userdata('uid')):?>
		<div style='float:right;'>Logged in as <?php echo $this->session->userdata('display_name');?></div>
		<div><a href='logout'>Logout</a></div>
		<?php else:?>
		<a href='signup'>Register</a>
		| <a href='login'>Login</a>
		| <a target='_blank' href='https://www.facebook.com/dialog/oauth?app_id=946381225384146&redirect_uri=http://dev.mpulsemedia.com/web/facebook/&scope=email,user_friends,public_profile'>Sign up using Facebook</a>
		| <a target='_blank' href='https://accounts.google.com/o/oauth2/auth?scope=email%20profile&state=moment&redirect_uri=http%3A%2F%2Fdev.mpulsemedia.com%2Fweb%2Fgoogle%2F&response_type=code&client_id=856474361847-cveg7qql7bpnstvl48c5217usphcn76t.apps.googleusercontent.com'>Sign up using Google</a>
		<?php endif;?>
		<!--
		
		| <a target='_blank' href='https://accounts.google.com/o/oauth2/auth?scope=email%20profile&state=moment&redirect_uri=http%3A%2F%2Fdev.mpulsemedia.com%2Fweb%2Fgoogle%2F&response_type=code&client_id=856474361847-cveg7qql7bpnstvl48c5217usphcn76t.apps.googleusercontent.com'>Sign up using Google</a>
		-->