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
		header('Location:'.base_url());
		die();
	}
	public function passive(){
	}
}

/* End of file location.php */
/* Location: ./application/controllers/location.php */