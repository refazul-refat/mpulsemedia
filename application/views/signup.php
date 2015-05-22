<div id="container">
	<form method='POST' action='http://api.mpulsemedia.com/v1/login/signup'>
		User : <input type='text' placeholder='User' value='' autocomplete='off' name='user' id='user'/><br/>
		Email : <input type='text' placeholder='Email' value='' autocomplete='off' name='email' id='email'/><br/>
		Password : <input type='password' placeholder='password' value='' autocomplete='off' name='password' id='password'/><br/>
		<input type='hidden' name='redirect' value="<?php echo base_url();?>"/>
		<input type='hidden' name='fallback'/>
		<input type='submit' value='Register'/>
	</form>
</div>
<script type='text/javascript' src='assets/js/core.js'></script>