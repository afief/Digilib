var lg = console.log.bind(console);
var lgi = console.log.bind(console);
var lge = console.log.bind(console);
var lgw = console.log.bind(console);

var app_version = 45;
var app_version_text = '0.4.5';

var webUrl = "http://perpustakaansd.labschool.upi.edu/";

//var apiUrl = "http://localhost/perpus/api/";
var apiUrl = "http://perpustakaansd.labschool.upi.edu/api/";


//PROTOTYPES
String.prototype.toTitleCase = function() {
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Number.prototype.toStringZero = function(n) {
	var isM = this < 0;
	var ns = Math.abs(this).toString();
	while (ns.length < n) ns = '0' + ns;
	if (isM) ns = '-' + ns;
	return ns;
};