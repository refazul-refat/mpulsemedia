<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Recent extends CI_Controller {
	public function index()
	{
		$header=array('title'=>'Recently Created');
		$this->load->view('header',$header);
		$this->load->view('content');
		$this->load->view('footer');
	}
}