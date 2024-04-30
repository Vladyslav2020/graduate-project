import {TestCase} from "../../../Popup/interfaces/TestCase";
import {
    ActionExecutor,
    clickActionExecutor,
    ExecutionResult,
    openActionExecutor,
    pressKeyActionExecutor,
    typeActionExecutor,
    verifyTextActionExecutor,
    verifyTitleActionExecutor,
    verifyValueActionExecutor
} from "./ActionExecutor";
import {TestStep} from "../../../Popup/interfaces/TestStep";
import {TestRunStatus} from "../../../Popup/interfaces/TestRun";

class TestRunner {
    private actionExecutors: { [key: string]: ActionExecutor } = {};

    public async runTestCase(testCase: TestCase) {
        for (const testStep of testCase.steps) {
            chrome.runtime.sendMessage({type: 'start-test-step-execution', stepId: testStep.id});
            const executionResult = await this.actionExecutors[testStep.name].execute(testStep);
            chrome.runtime.sendMessage({
                type: 'finish-test-step-execution',
                stepId: testStep.id,
                status: executionResult.status,
                logs: this.getLogs(executionResult, testStep)
            });
            if (executionResult.status === TestRunStatus.FAILED) {
                chrome.runtime.sendMessage({
                    type: 'finish-test-case-execution', status: TestRunStatus.FAILED});
                return;
            }
        }
        chrome.runtime.sendMessage({type: 'finish-test-case-execution', status: TestRunStatus.PASSED});
    }

    private getLogs(executionResult: ExecutionResult, testStep: TestStep) {
        return (executionResult.status === TestRunStatus.PASSED ? '[info] ' : '[error] ') + executionResult.message +
            (testStep.name === 'open' ? ' - ' + testStep.element : ' - xpath=' + testStep.element);
    }

    public addActionExecutor(actionExecutor: ActionExecutor) {
        this.actionExecutors[actionExecutor.name] = actionExecutor;
    }
}

export const testRunner = new TestRunner();
testRunner.addActionExecutor(openActionExecutor);
testRunner.addActionExecutor(clickActionExecutor);
testRunner.addActionExecutor(typeActionExecutor);
testRunner.addActionExecutor(pressKeyActionExecutor);
testRunner.addActionExecutor(verifyValueActionExecutor);
testRunner.addActionExecutor(verifyTextActionExecutor);
testRunner.addActionExecutor(verifyTitleActionExecutor);