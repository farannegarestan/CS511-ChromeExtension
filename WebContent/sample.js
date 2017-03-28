// A generic onclick callback function.

var host = "aws.faran.me:8080"
function captureClickHandler(info, tab) {
    //console.log("Text: " + info["selectionText"])
	console.log(info["selectionText"])
    sendText(info["selectionText"])
}

function captureAllText(info, tab) {
	chrome.tabs.executeScript({
	    code: '(' + function() {
	        return {success: true, html: document.body.textContent};
	    } + ')();'
	}, function(result) {
		console.log(escapeHtml(result[0].html))
		sendText(escapeHtml(result[0].html));
	});
}

function sendText(text) {
	var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://"+host+"/ExtractionServer/ProcessorServlet", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("text="+encodeURIComponent(text));
    xhttp.onload = function() {
        //console.log(xhttp.responseText);
        var newURL = "http://"+host+"/ExtractionServer/ProcessorServlet";
        chrome.tabs.create({ url: newURL });
    };
}

var entityMap = {
		  '&': '&amp;',
		  '<': '&lt;',
		  '>': '&gt;',
		  '"': '&quot;',
		  "'": '&#39;',
		  '/': '&#x2F;',
		  '`': '&#x60;',
		  '=': '&#x3D;'
		};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

chrome.extension.onRequest.addListener(function(request, sender, callback) {
	console.log("get source called")
    if (request.action == "getSource") {
        callback(document.getElementsByTagName('html')[0].innerHTML);
    }
});

// Create one test item for each context type.
chrome.contextMenus.create({"title": "Capture Text", "contexts":["selection"], "onclick": captureClickHandler});
chrome.contextMenus.create({"title": "Capture Page", "contexts":["page"], "onclick": captureAllText});