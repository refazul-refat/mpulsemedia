<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class History extends CI_Controller {
	public function index()
	{
		$this->load->model('core');
		
		if($this->input->cookie('auid')!=''){
			$cookie=$this->input->cookie('auid',TRUE);
		}
		else{
			$cookie = array(
				'name'   => 'auid',
				'value'  => $this->core->getRandomId(32),
				'expire' => '31536000'
			);
			$this->input->set_cookie($cookie);
		}

		$data=array('cookie'=>$this->input->cookie('auid',TRUE));
		$header=array('title'=>'Playlist');
		
		$this->load->view('header',$header);
		$this->load->view('history',$data);
		$this->load->view('footer');
	}
}