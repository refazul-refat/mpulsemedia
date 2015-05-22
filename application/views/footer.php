		<div class='fallback' style='display:none;'></div>
		<?php if($this->session->userdata('vuid')):?>
		<div id='vuid' style='display:none;'><?php echo $this->session->userdata('vuid');?></div>
		<?php endif;?>
		<script type='text/javascript'>
			if(localStorage.getItem('fallback'));
			else
				localStorage.setItem('fallback',makeId());

			$('.fallback').text(localStorage.getItem('fallback'));
			$('input[name="fallback"]').val(localStorage.getItem('fallback'));
		</script>
	</body>
</html>