chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (dataUrl) {
        console.log('captured', dataUrl);


        chrome.tabs.executeScript(null, {code: 'window.screenRulerScreenshot = "' + dataUrl + '";'}, function () {
            chrome.tabs.executeScript(null, {file: 'src/content_script.js'});
        });
    });
});