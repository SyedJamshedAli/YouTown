<?
$url = $_GET['_'];

if(strpos($url, '%253A')) {
	$url = urldecode($url);
}

if(strpos($url, '%3A')) {
	$url = $url;
}

if(strpos($url, '://')) {
	$url = urlencode($url);
}

$urlBoiler = 'http://boilerpipe-web.appspot.com/extract?url=' . $url . '&extractor=ArticleExtractor&output=htmlFragment';

//echo '<p>' . $urlBoiler . '</p>';

//$urlBoiler = 'http://boilerpipe-web.appspot.com/extract?url=http%3A//www.enid.org//index.aspx%3Fpage%3D25%26recordid%3D574&extractor=ArticleExtractor&output=htmlFragment';

$str = file_get_contents($urlBoiler);

//$head = array('<head>', '<HEAD>');
//$str = str_replace($head, '</head><base href="'.$url.'" />', $str);
$doc = new DOMDocument();

$doc->loadHTML($str);

$body = $doc->getElementsByTagName('body')->item(0);


function innerHTML($el) {
  $doc = new DOMDocument();
  $doc->appendChild($doc->importNode($el, TRUE));
  $html = trim($doc->saveHTML());
  $tag = $el->nodeName;
  return preg_replace('@^<' . $tag . '[^>]*>|</' . $tag . '>$@', '', $html);
}

$page = innerHTML($body);
//$page = '<b>' . $urlBoiler . '</b>' . $page;
//$page = preg_replace("/<img[^>]+\>/i", "", $page);
//$page = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $page);

echo "<div class='article-body' style='background: #fff;'>{$page}</div>";
?>