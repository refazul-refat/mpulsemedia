<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Recent extends CI_Controller {
	public function index()
	{
		$this->load->model('core');
		$header=array('title'=>'Recent');
		$this->load->view('header',$header);
		$this->load->view('recent');
		$this->load->view('footer');
	}
}