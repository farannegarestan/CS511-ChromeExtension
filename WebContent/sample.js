// A generic onclick callback function.
function captureClickHandler(info, tab) {
    console.log("Text: " + info["selectionText"])
    var newURL = "http://www.youtube.com/watch?v=oHg5SJYRHA0";
    chrome.tabs.create({ url: newURL });

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.ipify.org?format=json", true);
    xhttp.send();
    xhttp.onload = function() {
        console.log(xhttp.responseText);
    };
}

// Create one test item for each context type.
chrome.contextMenus.create({"title": "Capture Text", "contexts":["selection"], "onclick": captureClickHandler});