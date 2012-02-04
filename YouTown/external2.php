<?

$url = $_GET['_'];

if(strpos($url, '%253A')) {
	$url = urldecode($url);
}

if(strpos($url, '%3A')) {
	$url = urldecode($url);
}

if(strpos($url, '://')) {
	$url = urlencode($url);
}

$baseUri = 'http://youtown.com:8080/';

if(strpos($_SERVER['SERVER_NAME'], 'youtown.nl') !== false) {
	$baseUri = 'http://youtown.nl:8080/';
}

//echo $baseUri;

$uri = $baseUri . 'extract?url='. $url .'&extractor=ArticleExtractor&output=json&restrictHTML=1&skipLowQuality=1';




//$uri = 'http://access.alchemyapi.com/calls/url/URLGetText?apikey=a1808a6c01f47af1c42ac81f22e0693a5b4267df&url=' . $url . '&outputMode=json';

//echo $uri;


$json = file_get_contents($uri);

$data = json_decode($json, true);
//print_r($data);
$text = trim($data['response']['content']);
//$text = '';
if(!empty($text)) {
	$page = nl2br($text);
	echo "<div class='article-body' style='background: #fff;'>{$page}</div>";
	
} else {
	echo "<div class='article-body no-content-from-api' style='background: #fff;'>Unable to get Content. <br />It is best to view actual site. <br />Please click on the button below to open the site in your browser.</div>";
}

?>