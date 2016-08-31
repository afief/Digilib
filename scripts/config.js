var lg = console.log.bind(console);
var lgi = console.log.bind(console);
var lge = console.log.bind(console);
var lgw = console.log.bind(console);

var app_version = 2;
var app_version_text = '0.1.2';


var apiUrl = "http://localhost/perpus/api/";
//var apiUrl = "http://perpustakaansd.labschool.upi.edu/api/";


//PROTOTYPES
String.prototype.toTitleCase = function() {
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};