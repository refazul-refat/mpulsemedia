<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Authenticate extends CI_Controller {

	function base64url_encode($s) {
		return str_replace(array('+', '/'), array('-', '_'), base64_encode($s));
	}

	function base64url_decode($s) {
   		return base64_decode(str_replace(array('-', '_'), array('+', '/'), $s));
	}
	public function index()
	{
		if($this->input->get('token')){
			$token=$this->base64url_decode(($this->input->get('token')));
			$this->load->library('encrypt');
			$key = 'shared-secret-key';
			
			$this->load->library('session');
			$string = $this->encrypt->decode($token, $key);
			$parts = explode(',',$string);
			if($parts[0]=='ok'){
				$this->session->set_userdata('uid',$parts[1]);
				$this->session->set_userdata('user',$parts[2]);
			}
		}
		header('Location:'.base_url());
		die();
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */