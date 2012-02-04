<?
if(empty($_GET['uid']) || $_GET['uid'] == 'undefined') {
	$uid = md5(rand());
} else {
	$uid = $_GET['uid'];
}
$datestamp = date('Ymd\THis', strtotime('now'));
$datestart = date('Ymd\THis', strtotime(urldecode($_GET['ds'])));
$dateend = date('Ymd\THis', strtotime(urldecode($_GET['de'])));
$summary = urldecode($_GET['s']);
	
header('Content-type: text/calendar; charset=utf-8');
header('Content-Disposition: inline; filename='.$uid.'.ics');
	
?>
BEGIN:VCALENDAR<?= "\n"; ?>
VERSION:2.0<?= "\n"; ?>
BEGIN:VEVENT<?= "\n"; ?>
UID:<?= $uid . "\n"; ?>
DTSTAMP:<?= $datestamp . "\n"; ?>
DTSTART:<?= $datestart . "\n"; ?>
DTEND:<?= $dateend . "\n"; ?>
SUMMARY:<?= $summary. "\n"; ?>
END:VEVENT<?= "\n"; ?>
END:VCALENDAR<?= "\n"; ?>