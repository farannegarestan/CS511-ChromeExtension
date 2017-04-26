// A generic onclick callback function.

var contextMenuId = "capture-link";
var host = "localhost:8080"

chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.removeAll(function() {
        chrome.contextMenus.create({
            id: contextMenuId,
            title: "Capture Link",
            contexts: [ "page", "frame", "selection", "link" ],
        });
    });
});

function sendLink(linkClass, url) {
	var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://"+host+"/ExtractionServer/ProcessorServlet", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("url="+encodeURIComponent(url)+"&linkClass="+encodeURIComponent(linkClass));
    xhttp.onload = function() {
        var newURL = "http://"+host+"/ExtractionServer/ProcessorServlet";
        chrome.tabs.create({ url: newURL });
    };
}

function onClickedListener(info, tab) {
    if (info.menuItemId == contextMenuId) {
        chrome.tabs.executeScript(tab.id, {
            file: "findLink.js",
            allFrames: true,
        }, function() {
            chrome.tabs.sendMessage(tab.id, {
                messageId: "contextDetails",
                pageUrl: info.pageUrl,
                frameUrl: info.frameUrl,
            }, function(response) {
                //chrome.tabs.update(tab.id, {url: response})
            	console.log(response);
            	console.log(tab.url);
            	sendLink(response, tab.url)
                // Overly complex way to copy the URL to the clipboard:
                /*var urlTextArea = document.createElement('textarea');
                urlTextArea.value = response;
                document.body.appendChild(urlTextArea);
                urlTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(urlTextArea);*/
            });
        });
    } else {
        console.log("Unexpected context menu click:", info);
    }
};

chrome.contextMenus.onClicked.addListener(onClickedListener);

/*var host = "localhost:8080"
function captureClickHandler(info, tab) {
    //console.log("Text: " + info["selectionText"])
	console.log(window.getSelection())
	console.log(info)
    sendText(info["selectionText"])
}

function captureLink(info, tab) {
    //console.log("Text: " + info["selectionText"])
	console.log(info)
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
chrome.contextMenus.create({"title": "Capture Link", "contexts":["link"], "onclick": captureLink});*/