<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class History extends CI_Controller {
	public function index()
	{
		$this->load->model('core');
		$header=array('title'=>'History');
		$this->load->view('header',$header);
		$this->load->view('history');
		$this->load->view('footer');
	}
}