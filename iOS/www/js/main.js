//diferent constants

if(typeof(console) === 'undefined') {
	console = {};
	console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}


var DIRECTION_URL = "http://maps.google.com/";
var NUM_LOCATIONS = 5;
var CITYLIFE_BASE_URL = null;

var maxRows = 25;
var CACHEGETJSONTIMEOUT = 30; //minutes to cache getJSON data; see cacheDataGet()
var APPLIVE = true;
var EU = false;

if (APPLIVE){
	CITYLIFE_BASE_URL = "http://youtown.com";
	WEBAPP_BASE_URL = 'http://app.youtown.com/';
}
else{
	CITYLIFE_BASE_URL = "http://youtown.redwerk.com";
	WEBAPP_BASE_URL = 'http://app.youtown.com/edge/';

}

if(location.href.indexOf('youtown.nl') > -1 || location.href.indexOf('__eu') > -1) {
	EU = true;
}

if(EU) {
	CITYLIFE_BASE_URL = "http://eu.youtown.com";	
}

var API = CITYLIFE_API_BASE_URL = CITYLIFE_BASE_URL + "/youtown/api/1.0/";

var MOCKDATA = {};
MOCKDATA.position = [43.6525,-79.3816667];

store = function() {
	return {
		set: function(id, data) {
			localStorage.setItem(id, JSON.stringify(data));
		},
		get: function(id) {
			data = localStorage.getItem(id);
			if(_.isNull(data) || _.isUndefined(data) || (data == 'undefined')) {
				return null;
			} else {
				return JSON.parse(data);
			
			}		
		},
		del: function(id) {
			localStorage.removeItem(id);
		},
		delAll: function(ids) {
			for(i=0; i< ids.length; i++) {
				localStorage.removeItem(ids[i]);
			}
		},
		findKey: function(part) {
			matches = [];
			for (var i = 0, len = localStorage.length; i < len; i++){
			        key = localStorage.key(i) + "";
					//console.log(typeof key);
			        if (key.indexOf(part) > -1) {
			            matches.push(key);
					}
			   }
			return matches;
		}
	}
}();
intervalID = null;
function setPos() {
	intervalID = window.setInterval(
	      function() {
				console.log('PG POLL CHECKER');
	          if (PhoneGap.available) {
	              window.clearInterval(intervalID);
				console.log('INTERVAL KILLED');	
					if (navigator.geolocation && store.get('config.position') == null) {
						//alert("To continue, please allow the browser to get your current Location.\n Click on OK when done.");
					  	navigator.geolocation.getCurrentPosition(function(position){
							//success
							pos = [];
							pos.push(position.coords.latitude);
							pos.push(position.coords.longitude);
							store.set('config.position', pos);

						}, function(){
							//on error
							console.log('Error on location');
							store.set('config.position.error', true);
							store.set('config.position.mock', true);
							store.set('config.position', MOCKDATA.position);
							$.mobile.changePage('location.html');
						}, {timeout:30000});

					}
	          }
	      },
	      500
	    );

}

function splashPos(mode) {
	var params = "geoloc=" + config.position.join(",");
    params += "&mode=" + mode;
    if (mode != SEARCH_MODE){
        params += "&num=" + NUM_LOCATIONS;
    }
    params += fullText ? "&fullText=" + encodeURIComponent(fullText) : "";
    
}

function pageScript(page, callBack) {
	$page = $(page);
	$page.data('pageLoadCallback', callBack);
	if(!$page.hasClass('ev-attached')) {
		$.when(callBack($page)).done(function(){
			$page.addClass('ev-attached');
		});
	}
}


//dont use api.php if in live server
////console.log('giger', location.href.indexOf('app.youtown.com'));

if(PhoneGap != undefined) {
	$.ajaxPrefilter( function( options ) {
	if(options.url.indexOf('.php') > -1) {
		options.url = WEBAPP_BASE_URL + options.url;
		console.log(options.url);
	}  
	
	/*if ( options.crossDomain ) {
		options.url = "api.php?_=" + encodeURIComponent( options.url );
		options.crossDomain = false;
	  }*/
	});
}


$(document).ajaxComplete(function() {
		setTimeout(function(){
			$.mobile.hidePageLoadingMsg();
		}, 4000); 
	
});

function resetFooterNav(page) {
	$page = $(page);
	
	imgs = $('div[data-id=global-footer]', $page).find('a img');
	_.each(imgs, function(img) {
		$img = $(img);
		src = $img.attr('src');
		if(src.indexOf('-checked.png')) {
			url = src.replace('-checked.png', '.png');
			$img.attr('src', url);
			$($img.parent()).removeClass('selected');
		}
	});
	
}

function setActiveFooterNav($page, url) {
	
	
	resetFooterNav($page);
	footer = $('div[data-id=global-footer]', $page);
	img = footer.find('a[href="'+url+'"] img');
		if(img.length > 0) {
			src = img.attr('src');
			if(footer.hasClass('main-footer-blue')) {
				imgurl = src.replace('.png', '-checked.png');
				img.attr('src', imgurl);
				$(img).parent().addClass('selected');
				
			}
			img.css({width: 48, height: 48});
			
		}
	//console.log('activefooter', $page, url, img);	
}

function addMainFooter($page, key) {
	
	id = _id = $page.attr('id');

	//test for footer
	//console.log('add iscroll footer', id);
	$page = $('#'+id); //cache buster
	$('div.iscroll-footer', $page).remove();
/*
	if($('div.iscroll-footer', $page).length > 0) {
		return ;
	} else {
		if($page.data('cached-footer')) {
			$('<div class="iscroll-footer" />').insertAfter($page.find('div[data-role=content]'))
				.promise()
				.done(function(){
					$page.find('.iscroll-footer').html($page.data('cached-footer')).trigger('create');
				})
			return;
		}
	}
	
*/
	
	if(key != undefined) id = key;
	
	hrefMap = {
		'news': 'news.html',
		'events': 'events.html',
		'maps': 'maps.html',
		'services': 'services.html',
		'home': 'home.html'
	};	
	
	href = hrefMap[id] || 'home.html';
	
	if(href == 'home.html') {
		fclass = 'main-footer-blue';
	} else {
		fclass = 'main-footer-black';
		fclass = 'main-footer-blue';
	}
	
	//blue = ['maps-block-list'];
	
	if(_id.indexOf('-block') > -1 && (_id != 'maps-block-list')) {
		fclass = 'main-footer-blue-block';
	}
	
	$('<div class="iscroll-footer" />').insertAfter($page.find('div[data-role=content]'))
		.promise()
		.done(function(){
			//console.log($('#iscroll-footer-tpl div[data-id=global-footer]'));
			//alert('r');
			$('#iscroll-footer-tpl div[data-id=global-footer]')
				.clone()
				.addClass(fclass)
				.appendTo($page.find('.iscroll-footer'))
					.promise().done(function(){
						setActiveFooterNav($page, href);
						updateLang(_id);
						$page.data('cached-footer', $page.find('div.iscroll-footer').html());
					});
		});
	
}

function preloadImages(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
        // Alternatively you could use:
        // (new Image()).src = this;
    });
}

function getCalendarDate(dd, short, noyear){
   var months = new Array(13);
   months[0]  = ["January", "Jan"];
   months[1]  = ["February", "Feb"];
   months[2]  = ["March", "Mar"];
   months[3]  = ["April", "Apr"];
   months[4]  = ["May", "May"];
   months[5]  = ["June", "Jun"];
   months[6]  = ["July", "Jul"];
   months[7]  = ["August", "Aug"];
   months[8]  = ["September", "Sep"];
   months[9]  = ["October", "Oct"];
   months[10] = ["November", "Nov"];
   months[11] = ["December", "Dec"];
   var now         = new Date(dd);
	if(typeof now == 'undefined') return '';
	
	//console.log('hr', now, monthnumber);	
   var monthnumber = now.getMonth();
   var monthname   = (short == undefined) ? months[monthnumber][0] :  months[monthnumber][1] ;
   var monthday    = now.getDate();
   var year        = now.getFullYear();
	//console.log('hr', now, monthnumber);

   if(year < 2000) { year = year + 1900; }
   var dateString = monthname +
                    ' ' +
                    monthday;
  if(noyear == undefined) {
		dateString += ', ' + year;
        
	}
	    
   return dateString;
} 

function getClockTime(timestamp)
{
   var now    = new Date(timestamp);
	if(typeof now == 'undefined') return '';

   //var hour   = now.getUTCHours();
   //var minute = now.getUTCMinutes();
  
	var hour   = now.getHours();
	var minute = now.getMinutes();
 	var basehr = now.getHours();
  //var second = now.getSeconds();
//console.log('getClock', hour, minute);
   var ap = "AM";
   if (hour   > 11) { ap = "PM";             }
   if (hour   > 12) { hour = hour - 12;      }
   if (hour   == 0) { hour = 12;             }
   if (hour   < 10) { hour   = "0" + hour;   }
   if (minute < 10) { minute = "0" + minute; }
//   if (second < 10) { second = "0" + second; }
	
	f24 = false;
	tformat = store.get('config.timeformat');
	if(tformat != null && tformat == 24) f24 = true;
	
	if(EU || f24) {
		hour = basehr;
		if (hour   < 10) { hour   = "0" + hour;   }
		ap = 'h';
	} else {
		ap = ' ' + ap;
	}
//console.log('getClock', hour, minute);

   var timeString = hour +
                    ':' +
                    minute +
                    //':' +
                    //second +
                    //" " +
                    ap;
   return timeString;
}
LANGUAGE_CONFIG_SET = store.get('config.language');

function formatDateTime(date, time, tz) {
	at = ' at ';
	tz = ' ' + tz; 
	
	if(EU || LANGUAGE_CONFIG_SET == 'nl') {
		at = ' om ';
		//tz = 'h';
	}
	
	date_ = date.split(" ");
	
	return date_[1] + " " + date_[0] + at + time + tz;
	
}

function nl2br(text){
	text = escape(text);
	if(text.indexOf('%0D%0A') > -1){
		re_nlchar = /%0D%0A/g ;
	}else if(text.indexOf('%0A') > -1){
		re_nlchar = /%0A/g ;
	}else if(text.indexOf('%0D') > -1){
		re_nlchar = /%0D/g ;
	}
	return unescape( text.replace(re_nlchar,'<br />') );
}

function makeKey(str) {
	nstr = str.split(" ").join('_');
	nstr = nstr.split('*').join('');
	nstr = nstr.split('/').join('');
	nstr = nstr.split('\\').join('');
	nstr = nstr.split('+').join('');
	nstr = nstr.split('-').join('');
	nstr = nstr.split('#').join('');
	nstr = nstr.split(',').join('_');
	nstr = nstr.split('.').join('_');
	nstr = nstr.split(':').join('_');
	return nstr;
}

function getParams(url, name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


function setIscrollCss() {
	headerHeight = $('.ui-page-active div[data-role=header]').height() || 45;
	footerHeight = $('.ui-page-active div[data-role=footer]').height() || 48;
	
	$('.iscroll-wrapper').css({top: headerHeight, bottom: footerHeight});
	
}

function makeIscroll(content, iscrollId) {
	
	if($('body').hasClass('isBlackBerry')) return;
	
	if(content.parent().hasClass('iscroll-scroller')) {
		return $(content).data('iscroll');
	}
	
	if(!$('body').hasClass('iscroll-bind')) {
		$('body').addClass('iscroll-bind');
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	}
	
	newcontent = ['<div id="'+iscrollId+'" class="iscroll-wrapper">',
	'<div class="iscroll-scroller">',
	content.html(), 
	'</div>',	
	'</div>'].join("");	
	
	content.html(newcontent).promise().done(function(){
		setIscrollCss();
		iscroll = new iScroll(iscrollId);
		$(content).data('iscroll', iscroll);
		//$(content).trigger('refresh');
		return iscroll;
	});
	
}

function pullRefresh(iscrollId, obj) {
		if(!$('body').hasClass('iscroll-bind')) {
			$('body').addClass('iscroll-bind');
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	//		$(document).bind('touchmove', function (e) { e.preventDefault(); }, false);
		}
	
	setIscrollCss();
	
	pullDownEl = document.getElementById(iscrollId+'-pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	
	//console.log('pullDownEl', pullDownEl);
/*	if(window['__ISCROLL_' + iscrollId] != undefined) {
	
		window['__ISCROLL_' + iscrollId].refresh();
		return;
	}
*/	
	myScroll = new iScroll(iscrollId, {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			} 
				
			if(obj != null && obj.onRefresh != null) obj.onRefresh(myScroll);
			
			$('.ui-page-active .main-footer-blue').css({bottom: 0});
			/*
			$(window).scrollTop(1);
			setTimeout(function(){
				$(window).scrollTop(0);
				
			}, 800)
			*/
			//console.log('onRefresh');
		},
		onScrollMove: function () {
			if (this.y > 7 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			} 
			
			if(obj != null && obj.onScrollMove != null) obj.onScrollMove(myScroll);
			
			//console.log('onScrollMove', this);
		},
		onScrollEnd: function () {
			
				if (pullDownEl.className.match('flip')) {
					pullDownEl.className = 'loading';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
					if(obj != null && obj.pullDownAction != null) obj.pullDownAction(myScroll);	// Execute custom function (ajax call?)
				} 
			
			if(obj != null && obj.onScrollEnd != null) obj.onScrollEnd(myScroll);
			//console.log('onScrollEnd');
		}
		
		
	});

	//setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
	//$('.ui-page-active div[data-role=content]').scrollTo(3);
	setTimeout(function(){
		myScroll.refresh();
		//alert('r');
		//$('.ui-page-active div[data-role=content]').scrollTo(0);
		//$('.ui-page-active div[data-role=footer]').css({bottom: 0});
	}, 300);
	
	
	window['__ISCROLL_' + iscrollId] = myScroll;
	return myScroll;
}

function makeIscrollPullRefresh(content, iscrollId, obj, cb) {
	
	if($('body').hasClass('isBlackBerry')) return;
	
	
	if(!$('body').hasClass('iscroll-bind')) {
		$('body').addClass('iscroll-bind');
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//		$(document).bind('touchmove', function (e) { e.preventDefault(); }, false);
	}
	
	newcontent = ['<div id="'+iscrollId+'" class="iscroll-wrapper">',
	'<div class="iscroll-scroller">',
	'<div data-iscroll-class="iscroll-pullDown" id="'+iscrollId+'-pullDown"><span class="pullDownIcon"></span><span class="pullDownLabel">Pull down to refresh...</span></div>',
	content.html(), 
	'</div>',	
	'</div>'].join("");	

	newcontent2 = ['<div id="'+iscrollId+'" class="iscroll-wrapper">',
	'<div class="iscroll-scroller">',
	'<div data-iscroll-class="iscroll-pullDown" id="'+iscrollId+'-pullDown"><span class="pullDownIcon"></span><span class="pullDownLabel">Pull down to refresh...</span></div>',
	
	'</div>',	
	'</div>'].join("");	
	
	
//	content.wrap($(newcontent2)).promise().done(function(){
	
	content.html(newcontent).promise().done(function(){
		
		setIscrollCss();
		
		pullDownEl = document.getElementById(iscrollId+'-pullDown');
		pullDownOffset = pullDownEl.offsetHeight;
		
		//console.log('pullDownEl', pullDownEl);
		
		myScroll = new iScroll(iscrollId, {
			useTransition: true,
			topOffset: pullDownOffset,
			onRefresh: function () {
				if (pullDownEl.className.match('loading')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				} 
					
				if(obj != null && obj.onRefresh != null) obj.onRefresh(myScroll);
				
				$('.ui-page-active .main-footer-blue').css({bottom: 0});
				/*
				$(window).scrollTop(1);
				setTimeout(function(){
					$(window).scrollTop(0);
					
				}, 800)
				*/
				//console.log('onRefresh');
			},
			onScrollMove: function () {
				if (this.y > 7 && !pullDownEl.className.match('flip')) {
					pullDownEl.className = 'flip';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
					this.minScrollY = 0;
				} else if (this.y < 5 && pullDownEl.className.match('flip')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
					this.minScrollY = -pullDownOffset;
				} 
				
				if(obj != null && obj.onScrollMove != null) obj.onScrollMove(myScroll);
				
				//console.log('onScrollMove', this);
			},
			onScrollEnd: function () {
				
					if (pullDownEl.className.match('flip')) {
						pullDownEl.className = 'loading';
						pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
						if(obj != null && obj.pullDownAction != null) obj.pullDownAction(myScroll);	// Execute custom function (ajax call?)
					} 
				
				if(obj != null && obj.onScrollEnd != null) obj.onScrollEnd(myScroll);
				//console.log('onScrollEnd');
			}
			
			
		});

		//setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
		//$('.ui-page-active div[data-role=content]').scrollTo(3);
		setTimeout(function(){
			myScroll.refresh();
			//alert('r');
			//$('.ui-page-active div[data-role=content]').scrollTo(0);
			//$('.ui-page-active div[data-role=footer]').css({bottom: 0});
		}, 300);
		
		if(cb != null) cb(myScroll);
		
		window['__ISCROLL_' + iscrollId] = myScroll;
		return myScroll;
	});
	
}

function getConvertedDate(date) {
    var tokens = date.split(" ");
    var timeTokens = tokens[1].split(":");
    var dateTokens = tokens[0].split("/");
    var dateTime = new Date();
    dateTime = Date.UTC(dateTokens[2], dateTokens[1] - 1, dateTokens[0], timeTokens[0], timeTokens[1], timeTokens[2]);
    return dateTime;
}

function doLinkout(mailinfo, link, callback) {
	//console.log('mailinfo', mailinfo);
	$('#linkout-cont')
		.trigger('create')
		.show()
		.promise()
		.done(function(){
			
			$('#linkout-cont a.email').attr('href', '#').show(); 
			$('#linkout-cont a.safari').attr('href', '#').show();
			setTimeout(function(){
				//alert('yeardy');
				if(mailinfo == false) {
					$('#linkout-cont a.email').hide();
				} else {
					mail = 'mailto:';
					if(mailinfo.subject != undefined) mail += '?subject='+ mailinfo.subject;
					if(mailinfo.body  != undefined) mail += '&body=' + mailinfo.body.replace("/\n/g", "%0A");
					$('#linkout-cont a.email').attr('href', mail).attr('rel', 'external').trigger('create');
				}
				//alert($('#linkout-cont a.email').attr('href'));
				
				if(link == false) {
					$('#linkout-cont a.safari').hide();
				} else {
					$('#linkout-cont a.safari').attr('href', link).attr('target', '_blank').attr('rel', 'external').trigger('create'); 
					//	$('#linkout-cont a.safari').attr('href', link).trigger('create'); 
				}
				
				
				if(callback != undefined) callback();
			}, 10);
		}).addClass('pimped');
	
}

function addLinkout(mailinfo, link, callback) {
	console.log('mailinfo', mailinfo, $('#linkout-cont2'));
	$('#linkout-cont2')
		.trigger('create')
		.show()
		.promise()
		.done(function(){
			
			$('#linkout-cont2 a.email').attr('href', '#').show(); 
			$('#linkout-cont2 a.safari').attr('href', '#').show();
			setTimeout(function(){
				//alert('yeardy');
				if(mailinfo == false) {
					$('#linkout-cont2 a.email').hide();
				} else {
					mail = 'mailto:';
					if(mailinfo.subject != undefined) mail += '?subject='+ mailinfo.subject;
					if(mailinfo.body  != undefined) mail += '&body=' + mailinfo.body.replace("/\n/g", "%0A");
					$('#linkout-cont2 a.email').attr('href', mail).attr('rel', 'external').trigger('create');
				}
				//alert($('#linkout-cont a.email').attr('href'));
				
				if(link == false) {
					$('#linkout-cont2 a.safari').hide();
				} else {
					$('#linkout-cont2 a.safari').attr('href', link).attr('target', '_blank').attr('rel', 'external').trigger('create'); 
					//	$('#linkout-cont a.safari').attr('href', link).trigger('create'); 
				}
				
				
				if(callback != undefined) callback();
			}, 10);
		});
	
}

function getJSONcached(uri, params, cb) {
	function cacheDataID(str, params) {
		
		if(!_.isUndefined(params)) {
			for(k in params) {
				str += k + '_' + params[k] + '_';
			}
		}
		
		return 'json.cache.' + makeKey(str);
	}
	
	function cacheDataSave(ID, data) {
		d = new Date();
		logtime = d.valueOf();
		store.set(ID, {data: data, logtime: logtime});

	}

	function cacheDataGet(ID) {
		timeout = CACHEGETJSONTIMEOUT || 10;
		cacheTime = 1000 * 60 * timeout; 
		d = new Date();
		timenow = d.valueOf();

		cdata = store.get(ID);
		if(!_.isNull(cdata)) {
			logtime = cdata.logtime;
			if((timenow - logtime) > cacheTime) {
				console.log('json-cacher expired');
				return null;
			} else {
				return cdata.data;
			}
		} else {
			return null;
		}

	}
	ID = cacheDataID(uri, params);
	cached = cacheDataGet(ID);
	
	console.log('cacheID ' + ID + ' ' + (ID.indexOf('news') > -1 || ID.indexOf('events') > -1 ));
	//if((ID.indexOf('news') > -1 || ID.indexOf('events') > -1 || ID.indexOf('services') > -1 ) && cached != undefined)
    if((ID.indexOf('news') > -1 || ID.indexOf('events') > -1  || ID.indexOf('maps') > -1  || ID.indexOf('services') > -1 ) && cached != undefined)
      {
		if(cached.callInfo != undefined) {
			//issue with cached Data;
			store.del(ID);
			cached = null; 
		}
	}
	
	console.log('json-cacher id ');
	console.log(ID);
	function getJSONCallback(data) {
		cacheDataSave(ID, data);
		cb(data);
	}
	
	if(_.isNull(cached)) {
		console.log('json cacher ajax run');
		$.getJSON(uri, params, getJSONCallback);
	} else {
		console.log('json cacher cacher run');
        console.log(cached);
		setTimeout(function(){
			cb(cached);
		}, 300);
	}
}

store.set('config.language_support', {'en': 'English', 'nl': 'Nederlands'});
if(store.get('config.language') == null) {
	store.set('config.language', 'en');
}
if(store.get('config.timeformat') == null) {
	store.set('config.timeformat', 12);
}

if(location.href.indexOf('__lang') > -1) {
	//console.log('lang', getParams(location.href, '__lang'))
	language = getParams(location.href, '__lang');
	supplang = store.get('config.language_support');
	if(supplang[language] != undefined) store.set('config.language', language);
	
}
languageMap = {
	nl: {
		'splash' : {
			'choose-location' : 'Kies je lokatie',
			'my-location' : 'Mijn plaats',
			'other-location' : 'Andere plaats'
		},
		'location' : {
			'search-your-location' : 'Zoek een plaats',
			'city-or-country' : 'Gemeente naam',
			'5-last-location' : 'Laatst 5 gemeenten',
			'5-closest-location' : '5 dichtsbijzijnde gemeenten'
			 
		},
		'home': {
			'news' : 'Nieuws',
			'events' : 'Evenementen',
			'maps' : 'Kaarten',
			'services' : 'Diensten',
			'settings' : 'Instellingen'
		},
		'news' : {
			'news' : 'Nieuws',
			'search-news' : 'Zoeken',
			'next-25' : 'Volgende 25'
		},
		'news-block' : {
			'news' : 'Nieuws',
			
			'see' : 'News',
			'by' : 'Door',
			'read-full-article' : 'Lees hele artikel',
			'updated' : 'Gewijzigd',
			'cancel' : 'Annuleren',
			"email-friend": "Stuur naar vriend"
		},
		'events' : {
			'search-events' : 'Zoeken',
			'events' : 'Evenementen',
			'next-25' : 'Volgende 25'
			
		},
		'events-block' : {
			'events' : 'Evenementen',
			'start' : 'Start',
			'end' : 'Einde',
			'description': '&nbsp;',
			'more-info' : 'Meer Informatie',
			'directions-to-here' : 'Routebeschrijving',
			"email-friend": "Stuur naar vriend",
			"add-calendar": "Toevoegen aan kalender",
			"directions": "Route"
		},
		'maps' : {
			'search-maps' : 'Zoeken'
		},
		'services' : {
			'search-services' : 'Zoeken',
			'services' : 'Diensten'
		},
		'services-block' : {
			'services' : 'Diensten',
			'costs' : 'Kosten',
			'summary' : 'Samenvatting',
			'service-description' : 'Beschrijving',
			'what-to-bring' : 'Voorwaarden',
			'how-long-does-it-take' : 'Aanvraag',
			'directions-to-here' : 'Routebeschrijving',
			'map': "Kaart",
			'more-info' : 'Meer Informatie',
			"email-friend": "Stuur naar vriend",
			"email-department": "E-mail deze organisatie",
			"directions": "Route"
			
		},
		'settings' : {
			'start-screen' : 'Start scherm',
			'choose-location' : 'Kies lokatie',
			'settings' : 'Instellingen',
			'choose-language' : 'Kies Taal',
			'choose-time-format': 'Kies tijd formaat'
		},
		'settings-start' : {
			'news' : 'Nieuws',
			'events' : 'Evenementen',
			'maps' : 'Kaarten',
			'service' : 'Diensten',
			'settings' : 'Instellingen',
			'start-screen' : 'Start scherm'
			
		},
		'settings-lang' : {	
			'set-language' : 'Kies Taal'
		}
	}
}

function updateLangPlaceholder(pageId, ul, key) {
	lang = store.get('config.language');
	if(lang == 'en') return;
	if(languageMap[lang] == undefined) return;
	
	map = languageMap[lang][pageId]; 
	if(map == undefined) return;
	
	if(map[key] != undefined) {
		$(ul).attr('data-filter-placeholder', map[key]);
	}
	
	return;
}

function updateLang(pageId) {
	lang = store.get('config.language');
	if(lang == 'en') return;
	if(languageMap[lang] == undefined) return;
	
	map = languageMap[lang][pageId]; console.log('lmap', map);
	if(map == undefined) return;
	
	//matching based on exact "key to element class" match
	for( lclass in map) {
		if(map[lclass].length > 0) {
			orig = $('#' + pageId + ' .lang.' + lclass+':not([data-lang-orig])').html();
			origText = $('#' + pageId + ' .lang.' + lclass+':not([data-lang-orig])').text();
			if(orig == origText) {
				$('#' + pageId + ' .lang.' + lclass+':not([data-lang-orig])').html(map[lclass]).attr('data-lang-orig', orig);
			} else {
				//check if child is button
				if($('#' + pageId + ' .lang.' + lclass+':not([data-lang-orig])').hasClass('ui-btn')) {
					hasImg = $('#' + pageId + ' .lang.' + lclass+':not([data-lang-orig]) span.ui-btn-text img');
					bcont = $('#' + pageId + ' .lang.' + lclass+':not([data-lang-orig]) span.ui-btn-text');
					icon = '';
					//get icon image, add to translation
					if(hasImg.length > 0) {
						icon = $(hasImg[0]).clone().wrap('<div>').parent().html();
					} 
					bcont.html(icon + map[lclass]);
				}
			}
		}	
	}
	//console.log('lang parse', $('#' + pageId + ' .lang-parse'));
	//matching based on parsing element content, matched with keys
	if($('#' + pageId + ' .lang-parse:not([data-lang-orig])').length > 0) {
		
		for(i = 0; i < $('#' + pageId + ' .lang-parse').length; i++) {
			el = $('#' + pageId + ' .lang-parse')[i];
			orig = $(el).html();
			contKey = $(el).html().toLowerCase().replace(" ", '-');
			if(map[contKey] != undefined) $(el).html(map[contKey]).attr('data-lang-orig', orig);
		}
	}
	
	//match footer links
	mapFoot = languageMap[lang]['home'];
	//console.log('footer trans', $('#' + pageId + ' .footer-links .lang-parse').length);
	if($('#' + pageId + ' .footer-links .lang-parse:not([data-lang-orig])').length > 0) {
		for(i = 0; i < $('#' + pageId + ' .footer-links .lang-parse').length; i++) {
			el = $('#' + pageId + ' .footer-links .lang-parse')[i];
			//console.log('f', el);
			orig = $(el).html();
			contKey = $(el).html().toLowerCase().replace(" ", '-');
			if(mapFoot[contKey] != undefined) $(el).html(mapFoot[contKey]).attr('data-lang-orig', orig);
		}
	}	
}

function updateHeading(page) {
	h1 = $('div[data-role=header] h1', page);
	h1.addClass('main');
	h1.after('<h1 class="loading ui-title"><img src="img/ajax-loader.gif" height="13" width="13" style="" /> Loading ...</h1>');
}

$('div[data-role=page]').live('pagecreate', function(){
	pageId = $(this).attr('id');
	updateLang(pageId);
	updateHeading(this);
});

function initLocationByUri(callback) {
	if(location.href.indexOf('?city=') > -1 && location.href.indexOf('#') < 0) {
		loc = location.href.split('?city=')[1] || null;
		if(loc != null) {
			uri = API + 'location/';
			params = {};
			params.fullText = loc;
			params.mode = 'search_mode';
			$.getJSON(uri, params, function(data){
				if(data.length > 0 && data[0] != null && data[0] != undefined) {
					console.log(data[0]);
					store.set('config.location.set', data[0]);
					if(callback != undefined) callback(true);
				} else {
					if(callback != undefined) callback(false);
				}
				
				
				
			});	
		} else {
			if(callback != undefined) callback(false);
		}
	} else {
		if(callback != undefined) callback(false);
	}
	
}

$(document).ready(function(){
	
	$('a[rel=external]').live('vclick', function(ev){
          if($(this).hasClass('safari')) {
            useChildBrower = false;
            //window.location = url;
            return;                  
          }                      
		ev.preventDefault();
		//PhoneGap.exec("ChildBrowserCommand.showWebPage", $(this).attr('href'));
		//$('body').html( window.plugins.childBrowser);
		
		url = $(this).attr('href');
		if(url.indexOf('.php') > -1) {
			url = WEBAPP_BASE_URL + url;
		}
		handle = url.split(':')[0];
		console.log('handle openchild');
		console.log(handle);
		
		
		useChildBrower = true;
		
		
		if(handle != undefined && (handle.indexOf('mailto') > -1 || handle.indexOf('tel') > -1 )) {
			//console.log('open child '+ handle + ' ' + handle.indexOf('mailto'));
            useChildBrower = false;
			window.location = url;
		}
		
		if(url.indexOf('http://maps.google.com') > -1) {
			useChildBrower = false;
            window.location = url;
            //murl = url.replace('http://', 'http%253A');
            //Device.exec("openmap:q="+murl);
            
            
		}
		
		if($(this).hasClass('safari')) {
			useChildBrower = false;
			window.location = url;
		}
		
		console.log('useChildBrower ' + useChildBrower);
		
		if(useChildBrower) openChildBrowser(url);
		
	});
	
	
	footerImgs = ['img/news-small-blue.png', 'img/home-small-blue.png', 'img/events-small-blue.png', 'img/maps-small-blue.png', 'img/services-small-blue.png'];
	_.each(footerImgs, function(img){
		nimg2 = img.replace('-blue.png', '.png');
		nimg = img.replace('.png', '-checked.png');
		footerImgs.push(nimg);
		footerImgs.push(nimg2);
	});
	
	preloadImages(footerImgs);

	
	$('div[data-role=page]').live('pagebeforecreate', function(){
		if(!_.isUndefined(this.id)) {
			setclass = 'page-' + this.id;
			$('body').addClass(setclass);
			//$(this).attr('data-fullscreen', 'true');
		}
	}).live('pagehide', function(){
		if(!_.isUndefined(this.id)) {
			setclass = 'page-' + this.id;
			$('body').removeClass(setclass);
			//document.removeEventListener('touchmove', true);
		}
	});
	
	$('#splash').live('pagebeforecreate', function($loc){
		$splash = $(this);
		$splash.find('p.check-loc').hide(); 
		$splash.find('p.check-loc-next').hide(); 
		$splash.find('p.has-loc').hide(); 
		
		initLocationByUri(function($loc){
			$splash = $('#splash');
			
			myloc = null;
			myloc = store.get('config.location.set');
			if(!_.isNull(myloc)) {
				where = myloc.county;
				if(_.isEmpty(where) || where == 'default') {
					where = myloc.city;
				} else {
					where += ' County';
				}

				if(!_.isEmpty(myloc.state) && myloc.city.indexOf(',') < 0) where += ', ' + myloc.state;

				place = where;

				baseuri = 'home.html';
				start = store.get('config.startpage') || null;
				if(start !== null) {
					baseuri = start[0];
				}
				if(baseuri == '#home')	baseuri = 'home.html';

				$splash.find('p.has-loc a.myloc').html(place).attr('href', baseuri).removeClass('lang');
				console.log('innerx', $splash.find('p.has-loc a.myloc.ui-btn'), $loc, $splash.find('p.has-loc a.myloc.ui-btn span.ui-btn-inner')[0]);
				if($splash.find('p.has-loc a.myloc.ui-btn') && $splash.find('p.has-loc a.myloc.ui-btn span.ui-btn-inner')[0] == undefined && $loc == true) {
					nplace = ['<span class="ui-btn-inner ui-btn-corner-all">',
					'<span class="ui-btn-text">', place,  '</span>',
					'<span class="ui-icon ui-icon-arrow-d ui-icon-shadow"></span>',
					'</span>'].join("");
					$splash.find('p.has-loc a.myloc').html(nplace);
				}
				
				$splash.find('p.has-loc').show();
				
			} else {
				$.when(setPos()).done(function(){


					if(store.get('config.location.set') != null) {
						//do form on splash with location dropdown
						$splash.find('form').show();
						$splash.find('p.check-loc').hide(); 
					} else {
						//$splash.find('form').hide();
						$splash.find('p.check-loc').hide();
						$splash.find('p.check-loc-next').hide();
						$splash.find('p.has-loc').show();
						/*
						//redirect after 20 secs
						setTimeout(function(){
							$.mobile.changePage('location.html');	
						}, 20000);
						*/
					}
				});
			}
			
			
		});
		

	});
	
	$('#linkout-cont a').bind('vclick', function(ev){
		if($(this).hasClass('cancel')) {
			ev.preventDefault();
			$('#linkout-cont').hide();
		} else {
			//alert($(this).attr('href'));
			$(this).trigger('vclick');
			setTimeout(function(){
				$('#linkout-cont').hide();
			}, 500);
		}
		
		
	});
	
	if(screen.width < 500 ||
	 navigator.userAgent.match(/Android/i) ||
	 navigator.userAgent.match(/webOS/i) ||
	 navigator.userAgent.match(/iPhone/i) ||
	 navigator.userAgent.match(/iPod/i)) {
		$('body').addClass('ismobile');

	}

	if(
	 navigator.userAgent.match(/BlackBerry/i) ) {
		$('body').addClass('isBlackBerry');
	}

	if(
	 navigator.userAgent.match(/Android/i) ) {
		$('body').addClass('isDroid');
	}
	
	theUrl = location.href;
	if(theUrl.indexOf('__app=true') > -1 || PhoneGap != undefined) {
		$('body').addClass('isApp');
	}
	
	if(EU) {
		$('body').addClass('isEU');
		
		$('#splash').live('pagecreate', function(){
			$('#splash p.www a').html('eu.youtown.com').attr('href', 'http://eu.youtown.com');
		}); 
		
	}
	
});