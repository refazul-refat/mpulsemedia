<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class History extends CI_Controller {
	public function index()
	{
		$header=array('title'=>'History');
		$this->load->view('header',$header);
		$this->load->view('content');
		$this->load->view('footer');
	}
}