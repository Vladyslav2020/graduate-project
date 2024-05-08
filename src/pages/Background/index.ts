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

            chrome.windows.onRemoved.addListener((windowId) => {
                if (windowId === popupWindowId) {
                    popupWindowId = null;
                }
            });
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
            if (chrome.runtime.lastError) {
                console.log('Error capturing visible tab:', chrome.runtime.lastError.message);
            }
            chrome.tabs.sendMessage(tabId, {type: 'capturedScreenshot', screenshot: dataUrl});
        });
    } else {
        if (!sender.url || !sender.url.includes('popup')) {
            return;
        }
        chrome.tabs.query({active: true}, function (tabs) {
            console.log('tabs', tabs);
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id as number, message);
            });
        });
    }
});






