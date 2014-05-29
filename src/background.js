var inject = function () {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (dataUrl) {
        chrome.tabs.executeScript(null, {code: 'window.screenRulerScreenshot = "' + dataUrl + '";'}, function () {
            chrome.tabs.executeScript(null, {file: 'src/content_script.js'});
        });
    });
};

chrome.browserAction.onClicked.addListener(inject);

chrome.commands.onCommand.addListener(function(command) {
    if(command === 'open-screenruler') {
        inject();
    }
});