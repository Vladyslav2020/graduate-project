import {
    clickActionHandler,
    contextMenuActionHandler,
    doubleClickActionHandler,
    pressKeyActionHandler,
    typeActionHandler
} from "./modules/record/ActionHandler";
import {Recorder} from "./modules/record/Recorder";
import {locatorSelector} from "./modules/locator/LocatorSelector";
import {testRunner} from "./modules/play/TestRunner";

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const recorder = new Recorder(window);
recorder.addActionHandler(typeActionHandler);
recorder.addActionHandler(clickActionHandler);
recorder.addActionHandler(pressKeyActionHandler);
recorder.addActionHandler(contextMenuActionHandler);
recorder.addActionHandler(doubleClickActionHandler);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Message', message, 'sender', sender);
    if (message.command === 'subscribe-recorder') {
        recorder.subscribe();
    } else if (message.command === 'unsubscribe-recorder') {
        recorder.unsubscribe();
    } else if (message.command === 'enable-locator-selection') {
        locatorSelector.subscribe();
    } else if (message.command === 'disable-locator-selection') {
        locatorSelector.unsubscribe();
    } else if (message.command === 'run-test') {
        testRunner.runTestCase(message.testRun);
    }
});



