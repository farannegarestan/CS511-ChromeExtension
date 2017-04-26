function getAnchorBefore(node) {
    return document.evaluate(
        "((./ancestor-or-self::a|./preceding::*)/@*[name()='class'])[last()]",
        node,
        null,
        XPathResult.STRING_TYPE
    ).stringValue;
}

function onMessageListener(message, sender, sendResponse) {
    chrome.extension.onMessage.removeListener(onMessageListener);
    if (sender.id != chrome.runtime.id){
        console.log("Unexpected sender", sender, message);
        return;
    }
    if (message.messageId == "contextDetails") {
        var relevantUrl = message.frameUrl;
        if (!relevantUrl)
            relevantUrl = message.pageUrl;
        if (document.URL != relevantUrl)
            return;
        var selection = window.getSelection();
        if (!selection)
            return;

        result_url = getAnchorBefore(selection.getRangeAt(0).startContainer);
        sendResponse(result_url);
    } else {
        console.log("Unexpected message", message);
    }
}

chrome.extension.onMessage.addListener(onMessageListener);