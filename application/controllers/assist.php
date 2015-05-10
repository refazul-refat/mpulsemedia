<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Assist extends CI_Controller {
	public function index(){
		if($this->input->get('video_id')){
			$vid=$this->input->get('video_id');
			$return=file_get_contents('https://www.youtube.com/get_video_info?video_id='.$vid);
			echo $return;
			die();
		}
	}
}