<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Logout extends CI_Controller {

	function base64url_encode($s) {
		return str_replace(array('+', '/'), array('-', '_'), base64_encode($s));
	}

	function base64url_decode($s) {
   		return base64_decode(str_replace(array('-', '_'), array('+', '/'), $s));
	}
	public function index()
	{
		$this->session->sess_destroy();
		$cookie = array(
			'name'   => 'auid',
			'value'  => 'destroy',
			'expire' => '31536000'
		);
		$this->input->set_cookie($cookie);
		?>
		<div id='auid' style='display:none;'>destroy</div>
		<script type='text/javascript'>
			setTimeout(function(){
				window.location.replace('<?php echo base_url();?>');
			},1500);
		</script>
		<?php
	}
	public function passive(){
		$this->session->sess_destroy();
	}
}

/* End of file location.php */
/* Location: ./application/controllers/location.php */