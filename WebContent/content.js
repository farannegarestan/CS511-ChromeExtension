// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
	console.log("listern reached 1")
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
    	console.log("listern reached 2")
    	var links = document.getElementsByClassName("s-color-twister-title-link")
    	var result = "";
    	for (var i = 0, len = links.length; i < len; i++) {
    		result = result + links[i].title + "||";
    	}
        sendResponse(result);
    }
});