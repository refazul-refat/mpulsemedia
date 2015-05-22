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
			$key = 'shared-super-secret-key';
			
			$this->load->library('session');
			$string = $this->encrypt->decode($token, $key);
			$parts = explode(',',$string);
			if($parts[0]=='ok'){
				$this->session->set_userdata('uid',$parts[1]);
				$this->session->set_userdata('user',$parts[2]);
				$this->session->set_userdata('display_name',$parts[3]);
				$this->session->set_userdata('email',$parts[4]);
				$this->session->set_userdata('vuid',$this->base64url_encode($this->base64url_encode($token)));
			}
			if($parts[5])
				$this->session->set_userdata('vuid',$this->base64url_encode($this->base64url_encode($parts[5])));
		}
		header('Location:'.base_url());
		die();
	}
	public function test(){
		$double=$this->base64url_encode($this->base64url_encode('6u9HusPtoWwM9DYsGih6wSglXc9u+Zc/lAFfJ6V+FpaEA8VX8mPCRk05803HRCFmt43cvXazBWu5EeIgpy+R4A=='));
		echo $double.'<br/>';
		echo $this->base64url_decode($this->base64url_decode($double));
	}
}

/* End of file authenticate.php */
/* Location: ./application/controllers/authenticate.php */