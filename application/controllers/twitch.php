<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Twitch extends CI_Controller {
	public function index(){
		if($this->input->get_post('code')){
			$code=$this->input->get_post('code');
			$app_id = "38kwob74ztwhf4dmopyyxk8jlwi45jg";
			$app_secret = "5nrbtfalpoywfh0hrpibu4sxiy2x53s";
			$my_url = "http://dev.mpulsemedia.com/web/twitch";
			$token_url = "https://graph.facebook.com/oauth/access_token?"
			. "client_id=" . $app_id . "&redirect_uri=" . urlencode($my_url)
			. "&client_secret=" . $app_secret . "&code=" . $code . "&scope=email,user_friends,public_profile";
			$response = @file_get_contents($token_url);
			parse_str($response,$param);
			
			if(isset($param['access_token'])){
				$access_token=$param['access_token'];
			
				$request_url='https://graph.facebook.com/v2.3/me?fields=id,name,gender,email,picture&access_token='.$access_token;
				$response=@file_get_contents($request_url);
				$user=json_decode($response);
				
				$ch = curl_init();

				curl_setopt($ch, CURLOPT_URL,'http://api.mpulsemedia.com/v1/users');
				curl_setopt($ch, CURLOPT_POST, 1);
				curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query(array('facebook' => $user)));
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
				curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
				curl_setopt($ch, CURLOPT_VERBOSE, true);

				// receive server response ...
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

				$result = json_decode(curl_exec($ch));
				//echo '<pre>';
				//print_r($result);
				//die();
				
				header('Location:'.base_url().'authenticate?token='.$result);
				die();
			}
		}
	}
}