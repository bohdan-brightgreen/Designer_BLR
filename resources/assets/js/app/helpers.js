String.prototype.toCamel = function() {
	var x = this.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
	}).replace(/\s+/g, '');
	x = x.substr( 0, 1 ).toUpperCase() + x.substr(1);
	return x.replace(/-/g, "");
};

String.prototype.toDash = function() {
	return this.toLowerCase().replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

String.prototype.toTitle = function() {
    return this.replace(/-/g , ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function generate_guid() {
	return 'xxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}

function commarize(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function cookie_set (n, v, days) {
	var e = '', d;
	if(days) {
		d = new Date();
		d.setTime(d.getTime() + (days * 86400000));
		e = "; expires=" + d.toGMTString();
	}
	document.cookie = n + "=" + v + e + "; path=/";
}

function cookie_get(n) {
	var match = n + "=", c = '', ca = document.cookie.split(';'), i;
	for (i = 0; i < ca.length, c=ca[i]; i++) {
		c = c.trim();
		if (c.indexOf(match) === 0) {
			return c.substring(match.length, c.length);
		}
	}

	return null;
}

function cookie_delete (n) {
	cookie_set(n, "", -1);
}