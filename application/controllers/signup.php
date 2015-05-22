<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Signup extends CI_Controller {
	public function index()
	{
		$header=array('title'=>'Join the moment community');
		$this->load->view('header',$header);
		$this->load->view('signup');
		$this->load->view('footer');
	}
}