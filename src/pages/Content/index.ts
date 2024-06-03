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
import {TestRunStatus} from "../Popup/interfaces/TestRun";

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

let executionData: any = null;
let timeoutId;

function restoreData() {
    chrome.storage.local.get("executionData", (result) => {
        if (result.executionData) {
            executionData = result.executionData;
            console.log("Data restored:", executionData);
            chrome.storage.local.remove("executionData");
        }
    });
}

function continueExecution(loadResult) {
    if (executionData) {
        testRunner.runTestCase(executionData.testCase, executionData.testStep, loadResult);
    }
}

window.onload = () => {
    clearTimeout(timeoutId);
    continueExecution({status: TestRunStatus.PASSED, message: 'Executed action: Open URL'});
}

timeoutId = setTimeout(() => {
    continueExecution({status: TestRunStatus.FAILED, message: 'Failed to load the URL'});
}, 5000)

restoreData();