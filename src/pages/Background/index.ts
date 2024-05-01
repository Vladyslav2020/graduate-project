import {contextMenuExtender} from "./ContextMenuExtender";

console.log('This is the background page.');
console.log('Put the background scripts here.');

let popupWindowId;
let currentTabId;

contextMenuExtender.declareContextMenuItems();

chrome.action.onClicked.addListener(() => {
    if (!popupWindowId) {
        chrome.windows.create({
            url: chrome.runtime.getURL('popup.html'),
            type: 'popup',
            width: 1050,
            height: 650
        }, (window) => {
            popupWindowId = (window as chrome.windows.Window).id;
        });
    } else {
        chrome.windows.update(popupWindowId, {focused: true});
    }
});

chrome.tabs.onActivated.addListener(({tabId}) => {
    console.log("Tab activated", tabId);
    currentTabId = tabId;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('currentTabId', currentTabId, 'message', message, 'sender', sender);
    if (message.type === 'captureScreenshot' && sender?.tab) {
        const tabId = sender.tab.id as number;
        chrome.tabs.captureVisibleTab(sender.tab.windowId, {format: 'png'}).then(dataUrl => {
            console.log('dataUrl', dataUrl);
            if (chrome.runtime.lastError) {
                console.log('Error capturing visible tab:', chrome.runtime.lastError.message);
            }
            chrome.tabs.sendMessage(tabId, {type: 'capturedScreenshot', screenshot: dataUrl});
        });
    } else {
        chrome.tabs.query({active: true}, function (tabs) {
            console.log('tabs', tabs);
            if (tabs.some(tab => tab.id === currentTabId)) {
                chrome.tabs.sendMessage(currentTabId, message);
            }
        });
    }
});






