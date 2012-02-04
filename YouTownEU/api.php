<?

error_reporting(E_ALL);

function _docurl($url, $postdata = null) {
	$ckfile = 'cookie.txt';
	$c = curl_init();
	curl_setopt ($c, CURLOPT_COOKIEJAR, $ckfile);
	
	curl_setopt($c, CURLOPT_RETURNTRANSFER, true); //RETURN RESULTS
	curl_setopt($c, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($c, CURLOPT_AUTOREFERER, true);
	curl_setopt($c, CURLOPT_URL, $url);
	//curl_setopt($c, CURLOPT_HEADER, true);
	
	curl_setopt($c, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 GTB5');

	curl_setopt ($c, CURLOPT_COOKIEFILE, $ckfile);
		
	if(isset($postdata)) {
		curl_setopt($c, CURLOPT_POST, true);
		curl_setopt($c, CURLOPT_POSTFIELDS, $postdata);
	}
	if(curl_errno($c)) {
	    echo 'Curl error: ' . curl_error($c);
	}	return curl_exec($c);
}

if(isset($_GET['_'])) {
	$apiUrl = $_GET['_'];
	unset($_GET['_']);
	//echo $apiUrl; exit;
}
if(isset($_GET['_post'])) {
	unset($_GET['_post']);
	$postdata = $_GET;
} else {
	$getEscape = array();
	foreach($_GET as $k=>$g) {
		$getEscape[$k] = urldecode($g);
	}
	$postdata = null;
	$apiUrl .= '?' . http_build_query($getEscape); 
	
}

//echo "<pre>";
//echo $apiUrl;
$apiUrl = str_replace(" ", "%20", $apiUrl);
header('Content-type: application/json');
$b = _docurl($apiUrl, $postdata);
//var_dump($b);
echo $b;
?>
