/**
 * 
 */

if (!window.navigator.standalone) {
    document.addEventListener("DOMContentLoaded", adjustHeight, true);
    window.addEventListener("orientationchange", adjustHeight, true);
} else {
    /* Target only standalone mode */
    document.addEventListener("click", clickHandler, true);
}

function init() {
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = showTrends;
    xml.open("get", "proxy.php?url=" +
        encodeURIComponent("http://api.twitter.com/1/trends.json"));
    xml.send();
}

function buttonState() {
    var but = document.querySelector("button.header-button");
    but.disabled = true;
}

function showTrends() {
    if (this.readyState == this.DONE && this.status == 200) {
        var txt = this.responseText;
        var json = getJSON(txt);

        if (json) {
            renderTrends(json);
            buttonState();
        }
    }
}

function renderTrends(feed) {
    var list = document.getElementById("trends");
    var template = list.innerHTML;
    var trends = feed.trends;
    var html = "";

    for (var n = 0; n < trends.length; n++) {
        html += applyTemplate(template, trends[n]);
    }

    appendContent(list, html);
}

function appendContent(list, html) {
    var dummy = document.createElement("div");
    dummy.innerHTML = html;

    list.innerHTML = "";
    while(dummy.hasChildNodes()) {
        list.appendChild(dummy.firstChild);
    }
    list.className = null;
}

function adjustHeight() {
	var html = document.documentElement;
	var size = window.innerHeight;

	html.style.height = (size + size) + "px";
	window.setTimeout(function() {
		if (window.pageYOffset == 0) {
			window.scrollTo(0, 0);
		}
		html.style.height = window.innerHeight + "px";
	}, 0);

	window.addEventListener("orientationchange", adjustHeight, false);
	
	switch (window.orientation) {
	/* Normal orientation, home button on the bottom */
	case 0:
		document.body.className = "portrait";
		break;

	/* Rotated 90 degrees to the left */
	case 90:
		document.body.className = "landscape";
		break;

	/* Upside down */
	case 180:
		document.body.className = "portrait";
		break;

	/* Rotated 90 degrees to the right */
	case -90:
		document.body.className = "portrait";
		break;
	}
}
