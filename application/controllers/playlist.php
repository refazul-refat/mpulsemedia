<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Playlist extends CI_Controller {
	public function index()
	{
		$this->load->model('core');
		
		if(!($this->input->cookie('auid',TRUE)==='' || $this->input->cookie('auid',TRUE)==='destroy')){
			$auid=$this->input->cookie('auid',TRUE);
		}
		else{
			$auid=$this->core->getRandomId(32);
			$cookie = array(
				'name'   => 'auid',
				'value'  => $auid,
				'expire' => '31536000'
			);
			$this->input->set_cookie($cookie);
		}

		$data=array('auid'=>$auid);
		$header=array('title'=>'Playlist');
		
		$this->load->view('header',$header);
		$this->load->view('playlist',$data);
		$this->load->view('footer');
	}
}