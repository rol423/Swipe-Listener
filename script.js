var d, bdy, openTimer2, openTimer3, smartPhone, scrollTop, scrollLeft;

var actual_image = 0;
var slde_l =	0;
var swipelock =	0;

var startH2 =	0;

var sld_ar =	[];

var lb_ar =	[];
var lb_ar_node;

var map =	false;

function absLeft(el) {
	return (el.offsetParent) ?	el.offsetLeft + absLeft(el.offsetParent) :	el.offsetLeft;
}
function absTop(el) {
	return (el.offsetParent) ?	el.offsetTop + absTop(el.offsetParent) :	el.offsetTop;
}
function profile(id) {
	var elem_s =	document.getElementById(id).style;
	elem_s.display = ((elem_s.display == "none") || (elem_s.display == "")) ?	"block" :	"none";
}
function pg_start() {
	var anch, i;
	if (!document.getElementsByTagName) {
		return true;
	}
	d =	document;
	bdy =	d.getElementsByTagName("body")[0];
	smartPhone =	( /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ) ?	1 :	0;
	smartPhone =	( /MSIE 8/i.test(navigator.userAgent) ) ?	2 :	smartPhone;
	if ((d.getElementById("ytplayer")) && (smartPhone == 1)) {
		var q =	(d.getElementById("header").offsetWidth > 480) ?	"&vq=medium" :	"&vq=small";
		d.getElementById("ytplayer").src =	d.getElementById("ytplayer").src.replace(/&vq=hd720/, "");
	}
	for (var i = 0; (anch = d.getElementsByTagName("h3")[i]); i++) {
		if (anch.className.indexOf("opn") != -1) {
			if (i > 0) {
				d.getElementById(anch.id.replace(/hd_/, "c_")).className =	"nopn";
			} else {
				anch.className =	"opnd";
			}
			anch.onclick =	function() {
				ids =	d.getElementById(this.id.replace(/hd_/, "c_"));
				clsd =	(ids.className == "opn") ?	0 :	1;
				for (var i = 0; (anch = d.getElementsByTagName("h3")[i]); i++) {
					if (anch.className.indexOf("opnd") != -1) {
						d.getElementById(anch.id.replace(/hd_/, "c_")).className =	"nopn";
						anch.className =	"opn";
					}
				}
				if (clsd == 1) {
					evtrck("Aufgeklappt", this.innerHTML, location.href);
					ids.className =	"opn";
					this.className =	"opnd";
				} else {
					ids.className =	"nopn";
					this.className =	"opn";
				}
				// window.scrollTo(0, absTop(this) - 140);
				return false;
			};
		}
	}
	j =	0;
	for (i = 0; (anch = d.getElementsByTagName("a")[i]); i++) {
		if (anch.getAttribute("href")) {
			if (anch.getAttribute("href").indexOf("mailto:") != -1) {
				anch.onmouseup =	function() {
					evtrck("E-Mail-Click", this.href, location.href);
				}
			} else if (anch.getAttribute("href").indexOf("tel:") != -1) {
				anch.onmouseup =	function() {
					evtrck("Telefon-Click", this.href, location.href);
				}
			} else if ((anch.getAttribute("href").indexOf("http") != -1) && (anch.getAttribute("href").indexOf("love-suite") == -1)) {
				anch.onmouseup =	function() {
					evtrck("Externer Link (Link)", this.href, location.href);
					evtrck("Externer Link (Seite)", location.href, this.href);
				}
				anch.target =	"_blank";
			}
		}
		if ((anch.firstChild) && (anch.firstChild.nodeName == "IMG") && (anch.getAttribute("href").indexOf(".jpg") != -1)) {
			if (lb_ar_node != anch.parentNode.parentNode) {
				j++;
				lb_ar_node =	anch.parentNode.parentNode;
				lb_ar[j] =	[];
			}
			lb_ar[j].push(anch);
			anch.idx_no =	lb_ar[j].length;
			anch.set_no =	j;
			anch.onclick =	function() {
				darkbx(this.idx_no - 1, this.set_no);
				return false;
			}
		}
	}
	if (d.getElementById('gmap')) {
		GMinitialize();
	}
	if (d.getElementById("slide")) {
		sld_ar["slide"] =	[];
		for (i = 0; (anch = d.getElementById("slide").childNodes[i]); i++) {
			if ((anch.firstChild) && (anch.firstChild.nodeName == "IMG")) {
				if (anch.firstChild.getAttribute("srcset")) {
					anch.firstChild.orig_src =	anch.firstChild.src;
					if (window.innerWidth < 480) {
						anch.firstChild.src =	anch.firstChild.getAttribute("srcset").split(" ")[0];
					}
				}
				sld_ar["slide"].push(anch);
				if (slde_l == 0) {
					anch.firstChild.onload =	dimensions;
				}
				anch.idxno =	slde_l;
				slde_l++;
			}
		}
		if ((slde_l > 1) && (d.getElementById("pointer"))) {
			addSwipeListener(d.getElementById("slide"), function(e) {
				if (e.direction == "right") {
					imge_slde(actual_image - 1, "slide", 1);
				} else if (e.direction == "left") {
					imge_slde(actual_image + 1, "slide", 1);
				}
			});
			d.getElementById("pointer").innerHTML =	"<span id=\"pointer_left\"></span><span id=\"pointer_right\"></span>";
			d.getElementById("pointer_left").onclick =	function() {
				imge_slde(actual_image - 1, "slide", 1);
			}
			d.getElementById("pointer_right").onclick =	function() {
				imge_slde(actual_image + 1, "slide", 1);
			}	
		}
		imge_slde(actual_image, "slide", 0);
		openTimer2 =	setTimeout("autoswipe()", 13000);
	}

	window.onorientationchange =	dimensions;
	window.onresize =	dimensions;
	dimensions();
	return true;
}
function evtrck(a, b, c) {
// alert(a + " " + b + " " + c);
	if (typeof _gaq !== "undefined") {
		_gaq.push(['_trackEvent', a, b, c]);
	}
}
function dimensions() {
	if (d.getElementById("gr_outer")) {
		d.getElementById("gr_outer").style.left =	((avl_dim_screen("w") - d.getElementById("gr_outer").offsetWidth) / 2) + "px";
	}
	if (d.getElementById("slide")) {
		for (i = 0; (anch = d.getElementById("slide").childNodes[i]); i++) {
			if ((anch.firstChild) && (anch.firstChild.nodeName == "IMG") && (anch.firstChild.getAttribute("srcset"))) {
				if (window.innerWidth < 480) {
					if (anch.firstChild.src != anch.firstChild.getAttribute("srcset").split(" ")[0]) {
						anch.firstChild.src =	anch.firstChild.getAttribute("srcset").split(" ")[0];
					}
				} else {
					if (anch.firstChild.src != anch.firstChild.orig_src) {
						anch.firstChild.src =	anch.firstChild.orig_src;
					}
				}
				anch.firstChild.onload =	function() {
					d.getElementById("slide").style.height =	d.getElementById("trnsf_img_slide").firstChild.offsetHeight + "px";
				};
			}
		}
		d.getElementById("slide").style.height =	d.getElementById("trnsf_img_slide").firstChild.offsetHeight + "px";
	}
	if (map != false) {
		d.getElementById('gmap').style.height =	parseInt(d.getElementById('gmap').offsetWidth / 588 * 283) + "px";
		google.maps.event.trigger(map, 'resize');
	}
	if (d.getElementById("lgtbx")) {
		var awh =	Math.min((parseInt(avl_dim_screen("h") - 195) / 900 * 1382), (avl_dim_screen("w") - 60) * 0.9)
		d.getElementById("lgtbx").style.width =	awh + "px";
		d.getElementById("lgtbx").style.left =	parseInt((avl_dim_screen("w") - awh) / 2) + "px";
		var aw =	d.getElementById("lgtbx").offsetWidth - 60;
		d.getElementById("trnsf_img_drkbx").style.width =	parseInt(aw / 1382 * 900 / d.getElementById("trnsf_img_drkbx").height * d.getElementById("trnsf_img_drkbx").width) + "px";
		d.getElementById("lb_img_dv").style.height =	parseInt(aw / 1382 * 900) + "px";
	}
	if (d.getElementById("drkbx")) {
		d.getElementById("drktxt").style.textAlign =	((parseInt(window.orientation) > 0) && (parseInt(window.orientation) < 180)) ?	"center" :	"left";
		var dkbx =	d.getElementById("drkbx");
		if (d.getElementById("trnsf_img_drkbx")) {
			var timg =	d.getElementById("trnsf_img_drkbx").firstChild;
			var t =	(dkbx.offsetHeight > timg.offsetHeight) ?
				(dkbx.offsetHeight - timg.offsetHeight) / 2 :	0;
			var l =	(dkbx.offsetWidth > timg.offsetWidth) ?
				(dkbx.offsetWidth - timg.offsetWidth) / 2 :	0;
			timg.style.margin =	t + "px " + l + "px";
		}
		if (d.getElementById("drkvid")) {
			d.getElementById("drkvid").style.margin =	"66px 0";
			d.getElementById("drkvid").style.height =	(d.getElementById("drkbx").offsetHeight - 66 * 2) + "px";
		}
	}
}
function autoswipe() {
	openTimer2 =	setTimeout("autoswipe()", 13000);
	imge_slde(actual_image + 1, "slide", 0);
}
function imge_slde(idx, id, gc) {
	if (idx < 0) {
		idx =	slde_l - 1;
	}
	if (idx >= slde_l) {
		idx =	0;
	}
	var i, j =	0;
	var visib_imgs =	[];
	for (i = 0; (anch = sld_ar[id][i]); i++) {
		anch.id =	"";
		anch.className =	"imgwrp";
		if (anch.idxno >= idx) {
			visib_imgs.push(anch);
		}
	}
	for (i = 0; (anch = sld_ar[id][i]); i++) {
		if (anch.idxno < idx) {
			visib_imgs.push(anch);
		}
	}

	var disp_imgs_cnt =	Math.min(visib_imgs.length, 5);
	visib_imgs[0].className+=	" trnsf_0";
	visib_imgs[0].id =	"trnsf_img_" + id;
	if (gc == 1) {
		clearTimeout(openTimer2);
		evtrck("Aufruf Fotogalerie", visib_imgs[0].firstChild.src, location.href);
	}
	for (i = 1; i < disp_imgs_cnt; i+= 2) {
		visib_imgs[visib_imgs.length - (i + 1) / 2].className+=	" trnsf_" + i;
		visib_imgs[(i + 1) / 2].className+=	" trnsf_" + (i + 1);
	}
	actual_image =	idx;
	if ((d.getElementById("drktxt")) && (visib_imgs[0].firstChild))	{
		drk_hvr();
		d.getElementById("drktxt").innerHTML =	visib_imgs[0].firstChild.getAttribute("alt");
	}
	dimensions();
}

var scrstp_timeout;
var scrstp_dist =	0;
function scrollstep(dist) {
	if (scrstp_dist <= Math.abs(dist)) {
		scrstp_dist+=	Math.abs(dist) / 40;
		window.scrollBy(0, dist / 40);
		scrstp_timeout =	window.setTimeout("scrollstep(" + dist + ")", 25);
	} else {
		scrstp_dist =	0;
	}
}
function avl_dim(dir) {
	scrollTop = d.body.scrollTop || d.documentElement.scrollTop;
	scrolLeft = d.body.scrollLeft || d.documentElement.scrollLeft;
	if (d.documentElement.clientHeight > 0) {
		return (dir == "h") ?	d.documentElement.clientHeight + scrollTop :	d.documentElement.clientWidth + scrolLeft;
	} else if (window.innerHeight) {
		return (dir == "h") ?	window.innerHeight + scrollTop :	window.innerWidth + scrolLeft;
	} else {
		return (dir == "h") ?	d.body.clientHeight + scrollTop :	d.body.clientWidth + scrolLeft;
	}
}
function avl_dim_screen(dir) {
	if (d.documentElement.clientHeight > 0) {
		return (dir == "h") ?	d.documentElement.clientHeight :	d.documentElement.clientWidth;
	} else if (window.innerHeight) {
		return (dir == "h") ?	window.innerHeight :	window.innerWidth;
	} else {
		return (dir == "h") ?	d.body.clientHeight :	d.body.clientWidth;
	}
}
function ce_ap(elm, cls, id, par) {
	var elem =	d.createElement(elm);
	if (cls != "") {
		elem.className =	cls;
	}
	if (id != "") {
		elem.id =	id;
	}
	par.appendChild(elem);
	return elem;
}
function vido(id) {
	var txt =	d.getElementById(id).getAttribute("title");
	var dv =	ce_ap("div", "", "drkbx", bdy);
	elem =	ce_ap("div", "", "drknav", dv);
	elem.innerHTML =	"<div id=\"lb_close\" onclick=\"hide_drkbx();\"></div>";
	elem =	ce_ap("div", "", "drktxt", dv);
	elem.innerHTML =	txt;
	elem =	ce_ap("div", "", "drkvid", dv);
	elem.innerHTML =	d.getElementById(id).innerHTML;
	elem.style.display =	"block";
	drk_hvr();
	evtrck("Video", "Hotelvideo SORAT Hotel Ambassador Berlin", location.href);
	d.getElementById("outer").style.display =	"none";
	dimensions();
}
function getDocHeight() {
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
}
function darkbx(x, node) {
	var dv_inner, elem;
	//if (smartPhone == 2)	{
	 //	lightbx(x, node);
	//	return false;
	//}
	sld_ar["drkbx"] =	[];
	avl_dim('h');
	var dv =	ce_ap("div", "", "drkbx", bdy);
	var slde_l =	0;
	actual_image =	x;
	for (i = 0; (anch = lb_ar[node][i]); i++) {
		dv_inner =	ce_ap("div", "", "", dv);
		dv_inner.idxno =	slde_l;
		elem =	ce_ap("img", "", "", dv_inner);
		elem.src =	anch.getAttribute("href");
		elem.alt =	(anch.firstChild) ?	anch.firstChild.getAttribute("alt") :	anch.getAttribute("title");		
		sld_ar["drkbx"].push(dv_inner);
		slde_l++;
	}
	elem =	ce_ap("div", "", "drknav", dv);
	if (slde_l > 1) {
		addSwipeListener(d.getElementById("drkbx"), function(e) {
			if (e.direction == "right") {
				imge_slde(actual_image - 1, "drkbx", 1);
			} else if (e.direction == "left") {
				imge_slde(actual_image + 1, "drkbx", 1);
			}
		});
		elem.innerHTML =	"<div id=\"lb_close\" onclick=\"hide_drkbx();\"></div><span id=\"lb_links\" onclick=\"imge_slde(actual_image - 1, 'drkbx', 1);\"></span><span id=\"lb_rechts\" onclick=\"imge_slde(actual_image + 1, 'drkbx', 1);\"></span>";
	} else {
		elem.innerHTML =	"<div id=\"lb_close\" onclick=\"hide_drkbx();\"></div>";
	}
	elem =	ce_ap("div", "", "drktxt", dv);
	var txt =	(lb_ar[node][x].firstChild) ?	lb_ar[node][x].firstChild.getAttribute("alt") :	lb_ar[node][x].getAttribute("title");
	elem.innerHTML =	txt;
	imge_slde(actual_image, "drkbx", 1);
	d.getElementById("outer").style.display =	"none";
	dv.addEventListener('gesturechange', drk_hvr_rst, false);
	onComplete();
}
function drk_hvr_rst() {
	d.getElementById("drkbx").className =	"";
	d.getElementById("drkbx").onmousedown =	drk_hvr;
}
function drk_hvr() {
	clearTimeout(openTimer2);
	d.getElementById("drkbx").className =	"hvr";
	d.getElementById("drkbx").onmousedown =	null;
	if (smartPhone == 1) {
		clearTimeout(openTimer3);
		openTimer3 =	window.setTimeout("drk_hvr_rst()", 4500);
	}
}
function hide_drkbx() {
	clearTimeout(openTimer3);
	d.getElementById("outer").style.display =	"block";
	dimensions();
	bdy.removeChild(d.getElementById("drkbx"));
	window.scrollTo(0, scrollTop);
}

function lightbx(x, node, type) {
	lb_ar_node =	node;
	var dv =	ce_ap("div", "", "ueberblend3", bdy);
	dv =	ce_ap("div", "", "lgtbx", bdy);
	dv.innerHTML =	"<div id=\"lgtbx_imgtxtfrm\"><div id=\"lb_close\"></div>"
	+	"<div id=\"lb_img_dv\"><img id=\"trnsf_img_drkbx\" src=\"\" alt=\"\">"
	+	"<div id=\"lb_links\"></div>"
	+	"<div id=\"lb_rechts\"></div></div>"
	+	"<p id=\"lgtbx_p\">&nbsp;</p>"
	+	"<p id=\"lgtbx_p2\">&nbsp;</p></div>";
	d.getElementById("ueberblend3").style.display =	"block";
	d.getElementById('ueberblend3').onclick =	chk_hidelb;
	d.getElementById('lb_close').onclick =	hide_lgtbx;
	fill_lgtbx(x);
	openTimer2 =	setTimeout("viewIt5()", 100);
}
function viewIt5() {
	d.getElementById("lgtbx").style.visibility =	"visible";
	if (typeof d.getElementById('lgtbx').style.opacity != "string") {
		startH2 =	100;
		return true;
	}
	if ((d.getElementById("trnsf_img_drkbx")) && (d.getElementById("trnsf_img_drkbx").complete !== true)) {
		openTimer2 =	setTimeout("viewIt5()", 10);
	} else if (startH2 < 100) {
		startH2+=	3;
		d.getElementById('lgtbx').style.opacity = startH2 / 100;
		d.getElementById('ueberblend3').style.opacity = startH2 / 200;
		openTimer2 =	setTimeout("viewIt5()", 10);
	} else {
		startH2 =	0;
	}
}
function fill_lgtbx(x) {
	d.getElementById("lb_img_dv").removeChild(d.getElementById("trnsf_img_drkbx"));
	d.getElementById("lgtbx_p").style.visibility =	"hidden";
	d.getElementById("lb_img_dv").style.visibility =	"hidden";
	var img =	ce_ap("img", "", "trnsf_img_drkbx", d.getElementById("lb_img_dv"));
	img.src =	lb_ar[lb_ar_node][x].getAttribute("href");
	var txt =	(lb_ar[lb_ar_node][x].firstChild) ?	lb_ar[lb_ar_node][x].firstChild.getAttribute("alt") :	lb_ar[lb_ar_node][x].getAttribute("title");
	d.getElementById("lgtbx_p").innerHTML =	txt;
	if (lb_ar[lb_ar_node].length > 1) {
		d.getElementById("lgtbx_p2").replaceChild(d.createTextNode((x + 1) + "/" + (lb_ar[lb_ar_node].length)), d.getElementById("lgtbx_p2").firstChild);
		var prev =	(x > 0) ?	x - 1 :	lb_ar[lb_ar_node].length - 1;
		var next =	(x < lb_ar[lb_ar_node].length - 1) ?	x + 1 :	0;
		d.getElementById("lb_links").onclick =	function() {
			fill_lgtbx(prev);
		}
		d.getElementById("lb_rechts").onclick =	function() {
			fill_lgtbx(next);
		}
	} else {
		d.getElementById("lgtbx_p2").style.display =	"none";
		d.getElementById("lb_links").style.display =	"none";
		d.getElementById("lb_rechts").style.display =	"none";
	}
	onComplete();
}
function onComplete() {
	if (d.getElementById("trnsf_img_drkbx")) {
		var elem =	d.getElementById("trnsf_img_drkbx").firstChild;
		if ((elem.nodeName == "IMG") && (elem.complete == true)) {
			if (d.getElementById("lgtbx_p")) {
				d.getElementById("lgtbx_p").style.visibility =	"visible";
				d.getElementById("lb_img_dv").style.visibility =	"visible";
			}
			dimensions();
		} else {
			setTimeout("onComplete()", 10);
		}
	}
}
function chk_hidelb(e) {
	var targ;
	var ev =	(!e) ?	window.event :	e;
	if (ev.target) {
		targ =	ev.target;
	} else if (ev.srcElement) {
		targ =	ev.srcElement;
	}
	while (targ = targ.parentNode) {
		if (targ.id == "lgtbx") {
			return false;
		}
	}
	hide_lgtbx();
}
function hide_lgtbx() {
	if (typeof d.getElementById('lgtbx').style.opacity != "string") {
		startH2 = 100;
	}
	if (startH2 < 100) {
		startH2+=	2;
		d.getElementById("ueberblend3").style.opacity =	(100 - startH2) / 100;
		d.getElementById("lgtbx").style.opacity =	(100 - startH2) / 100;
		openTimer2 =	setTimeout("hide_lgtbx()", 10);
	} else {
		bdy.removeChild(d.getElementById("lgtbx"));
		bdy.removeChild(d.getElementById("ueberblend3"));
		startH2 =	0;
	}
}
function profile_resp(id) {
	if (d.getElementById(id).className == "opn") {
		hide_resp(id);
	} else {
		d.getElementById(id).className = "opn";
		d.getElementById("outer").className = "opn";
		window.setTimeout("d.getElementById('outer').onclick = function() { hide_resp('" + id + "'); }; d.getElementById('" + id + "').onclick = function() { hide_resp('" + id + "'); };", 100);
	}
}
function hide_resp(id) {
	d.getElementById(id).className =	"";
	d.getElementById(id).onclick =	null;
	d.getElementById("outer").className =	"";
	d.getElementById("outer").onclick =	null;
}
function GMinitialize() {
	var mdiv =	document.getElementById("gmap");
	var coords =	mdiv.title.split(",");
	mdiv.innerHTML =	"";
	mdiv.title =	"";
	var latlng = new google.maps.LatLng(coords[1], coords[0]);
	var myOptions = {
		zoom: 13,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	map = new google.maps.Map(mdiv, myOptions);
	var image = new google.maps.MarkerImage("http://www.sorat-hotels.com/fileadmin/ge/Icon-Google-Map.png",
		new google.maps.Size(68, 42),
		new google.maps.Point(0,0),
		new google.maps.Point(34, 41)
	);
	mark = new google.maps.Marker({
		position: latlng,
		map: map,
		icon: image
  	});
	mdiv.style.visibility =	"visible";
}

function addSwipeListener(el, listener) {
	var startX;
	var dx;
	var direction;
	var date;
 
	function cancelTouch() {
		el.removeEventListener('touchmove', onTouchMove);
		el.removeEventListener('touchend', onTouchEnd);
		startX =	null;
		startY =	null;
		direction =	null;
	}

	function onTouchMove(e) {
		if (e.touches.length > 1) {
			cancelTouch();
		} else {
			dx =	e.touches[0].pageX - startX;
			var dy =	e.touches[0].pageY - startY;
			if (direction == null) {
				direction =	dx;
				if (Math.abs(dy) < 25) {
					e.preventDefault();
				}
			} else if ((direction < 0 && dx > 0) || (direction > 0 && dx < 0) || Math.abs(dy) > 25) {
				cancelTouch();
			}
		}
	}

	function onTouchEnd(e) {
		cancelTouch();
		if (Math.abs(dx) > 25) {
			listener({ target: el, direction: dx > 0 ? 'right' : 'left' });
		}
	}

	function onTouchStart(e) {
		swipelock =	1;
		if (e.touches.length == 1) {
			dx = null; // swipe error fix by coma
			startX =	e.touches[0].pageX;
			startY =	e.touches[0].pageY;
			el.addEventListener('touchmove', onTouchMove, false);
			el.addEventListener('touchend', onTouchEnd, false);
		}
	}
	if (el.addEventListener) {
		el.addEventListener('touchstart', onTouchStart, false);
	} else if (el.attachEvent) {
		el.attachEvent('touchstart', onTouchStart);
	}
}


(function(w) {
	// This fix addresses an iOS bug, so return early if the UA claims it's something else.
	var ua = navigator.userAgent;
	if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf( "AppleWebKit" ) > -1 ) ){
		return;
	}
	var doc = w.document;
	if (!doc.querySelector) { return; }
	var meta = doc.querySelector("meta[name=viewport]"),
		initialContent = meta && meta.getAttribute("content"),
		disabledZoom = initialContent + ",maximum-scale=1",
		enabledZoom = initialContent + ",maximum-scale=10",
		enabled = true,
		x, y, z, aig;
	if (!meta) { return; }
	function restoreZoom(){
		meta.setAttribute( "content", enabledZoom );
		enabled = true;
		orientchng();
	}
	function disableZoom(){
		meta.setAttribute( "content", disabledZoom );
		enabled = false;
	}
	function checkTilt( e ){

	aig = e.accelerationIncludingGravity;
	x = Math.abs( aig.x );
	y = Math.abs( aig.y );
	z = Math.abs( aig.z );

	// If portrait orientation and in one of the danger zones
	if ((!w.orientation || w.orientation === 180) && (x > 7 || ((z > 6 && y < 8 || z < 8 && y > 6) && x > 5))) {
		if (enabled){
			disableZoom();
		}
	} else if(!enabled) {
		restoreZoom();
	}
}
w.addEventListener( "orientationchange", restoreZoom, false );
w.addEventListener( "devicemotion", checkTilt, false );
}) (this);

if (document.addEventListener) {
	DOMContentLoaded = function() {
		document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
		window.removeEventListener("load", pg_start, false);
		pg_start();
	};
} else if (document.attachEvent) {
	DOMContentLoaded = function() {
		if (document.readyState === "complete") {
			document.detachEvent("onreadystatechange", DOMContentLoaded);
			window.detachEvent("onload", pg_start);
			pg_start();
		}
	};
}
if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
	window.addEventListener("load", pg_start, false);
} else if (document.attachEvent) {
	document.attachEvent("onreadystatechange", DOMContentLoaded);
	window.attachEvent("onload", pg_start);
}
