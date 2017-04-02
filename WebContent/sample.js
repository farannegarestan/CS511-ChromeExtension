// A generic onclick callback function.

var host = "aws.faran.me:8080"
function captureClickHandler(info, tab) {
    //console.log("Text: " + info["selectionText"])
	console.log(info)
    sendText(info["selectionText"])
}

function captureAllText(info, tab) {
	chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, function(dom){
		var arr = dom.split("||")
		console.log(arr)
		sendText(dom)
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

// Create one test item for each context type.
chrome.contextMenus.create({"title": "Capture Text", "contexts":["selection"], "onclick": captureClickHandler});
chrome.contextMenus.create({"title": "Capture Page", "contexts":["page"], "onclick": captureAllText});