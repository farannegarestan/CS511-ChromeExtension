// A generic onclick callback function.

var host = "aws.faran.me:8080"
function captureClickHandler(info, tab) {
    console.log("Text: " + info["selectionText"])
  
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://"+host+"/ExtractionServer/ProcessorServlet", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("text="+info["selectionText"]);
    xhttp.onload = function() {
        console.log(xhttp.responseText);
        var newURL = "http://"+host+"/ExtractionServer/ProcessorServlet";
        chrome.tabs.create({ url: newURL });
    };
}

// Create one test item for each context type.
chrome.contextMenus.create({"title": "Capture Text", "contexts":["selection"], "onclick": captureClickHandler});