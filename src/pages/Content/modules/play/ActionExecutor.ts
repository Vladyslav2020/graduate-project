import {TestStep} from "../../../Popup/interfaces/TestStep";
import {waitForElementByXPath} from "../utils";
import {TestRunStatus} from "../../../Popup/interfaces/TestRun";

const EDITABLE_TAGS = ['input', 'textarea', 'select'];

export interface ExecutionResult {
    status: TestRunStatus;
    message: string;
}

export interface ActionExecutor {
    name: string;

    execute(testStep: TestStep): Promise<ExecutionResult>;
}

class OpenActionExecutor implements ActionExecutor {
    name = 'open';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        const url = testStep.element;

        return new Promise(async (resolve) => {
            function handleError() {
                resolve({status: TestRunStatus.FAILED, message: 'Failed to load the URL'});
                setTimeout(() => window.location.href, 500);
            }

            try {
                const response = await fetch(url, { method: 'HEAD' });
                console.log('response', response, response.ok);
                if (!response.ok) {
                    handleError();
                }
                window.location.href = url;
            } catch (error) {
                handleError();
            }
        });
    }
}

class ClickActionExecutor implements ActionExecutor {
    name = 'click';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        try {
            const element = await waitForElementByXPath(testStep.element);
            this.clickElement(element);
            return {status: TestRunStatus.PASSED, message: 'Executed action: Click element'};
        } catch (e) {
            return {status: TestRunStatus.FAILED, message: 'Element not found'};
        }
    }

    private clickElement(element): void {
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        element.dispatchEvent(clickEvent);
    }
}

class DoubleClickActionExecutor implements ActionExecutor {
    name = 'doubleClick';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        try {
            const element = await waitForElementByXPath(testStep.element);
            this.doubleClickElement(element);
            return {status: TestRunStatus.PASSED, message: 'Executed action: Double click element'};
        } catch (e) {
            return {status: TestRunStatus.FAILED, message: 'Element not found'};
        }
    }

    private doubleClickElement(element): void {
        const clickEvent = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        element.dispatchEvent(clickEvent);
    }
}

class TypeActionExecutor implements ActionExecutor {
    name = 'type';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        try {
            const element = await waitForElementByXPath(testStep.element);
            if (element.tagName !== 'INPUT') {
                throw new Error('Element not found');
            }

            this.typeIntoInput(element, testStep.value);
            return {status: TestRunStatus.PASSED, message: `Executed action: Type value <${testStep.value}>`};
        } catch (e) {
            return {status: TestRunStatus.FAILED, message: 'Element not found'};
        }
    }

    private typeIntoInput(inputElement, text): void {
        inputElement.value = text;

        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        inputElement.dispatchEvent(inputEvent);
    }
}

class PressKeyActionExecutor implements ActionExecutor {
    name = 'pressKey';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        try {
            const element = await waitForElementByXPath(testStep.element);
            if (element.tagName !== 'INPUT') {
                throw new Error('Element not found');
            }

            this.pressKey(element, testStep.value);
            return {status: TestRunStatus.PASSED, message: `Executed action: Press key <${testStep.value}>`};
        } catch (e) {
            return {status: TestRunStatus.FAILED, message: 'Element not found'};
        }
    }

    private pressKey(inputElement, key): void {
        const eventInitDict = {
            bubbles: true,
            cancelable: true,
            code: key === '${enter}' ? 'Enter' : 'Tab',
            key: key === '${enter}' ? 'Enter' : 'Tab',
            keyCode: key === '${enter}' ? 13 : 9,
        };
        const keyDownEvent = new KeyboardEvent('keydown', eventInitDict);
        const keyPressEvent = new KeyboardEvent('keypress', eventInitDict);

        inputElement.focus();
        inputElement.dispatchEvent(keyDownEvent);
        inputElement.dispatchEvent(keyPressEvent);
    }
}

class VerifyValueActionExecutor implements ActionExecutor {
    name = 'verifyValue';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        try {
            const element = await waitForElementByXPath(testStep.element);
            if (element.tagName !== 'INPUT') {
                throw new Error('Element not found');
            }

            const value = (element as HTMLInputElement).value;
            if (value === testStep.value) {
                return {status: TestRunStatus.PASSED, message: `Executed action: Verify value <${value}>`};
            } else {
                return {
                    status: TestRunStatus.FAILED,
                    message: `Expected value <${testStep.value}>, but found <${value}>`
                };
            }
        } catch (e) {
            return {status: TestRunStatus.FAILED, message: 'Element not found'};
        }
    }
}

class VerifyTextActionExecutor implements ActionExecutor {
    name = 'verifyText';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        try {
            const element = await waitForElementByXPath(testStep.element) as HTMLElement;
            const text = element.innerText;
            if (text === testStep.value) {
                return {status: TestRunStatus.PASSED, message: `Executed action: Verify text <${text}>`};
            } else {
                return {
                    status: TestRunStatus.FAILED,
                    message: `Expected text <${testStep.value}>, but found <${text}>`
                };
            }
        } catch (e) {
            return {status: TestRunStatus.FAILED, message: 'Element not found'};
        }
    }
}

class VerifyTitleActionExecutor implements ActionExecutor {
    name = 'verifyTitle';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        try {
            const element = await waitForElementByXPath(testStep.element) as HTMLElement;
            const title = element.title;
            if (title === testStep.value) {
                return {status: TestRunStatus.PASSED, message: `Executed action: Verify title <${title}>`};
            } else {
                return {
                    status: TestRunStatus.FAILED,
                    message: `Expected title <${testStep.value}>, but found <${title}>`
                };
            }
        } catch (e) {
            return {status: TestRunStatus.FAILED, message: 'Element not found'};
        }
    }
}

class VerifyEditableActionExecutor implements ActionExecutor {
    name = 'verifyEditable';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        try {
            const element = await waitForElementByXPath(testStep.element) as HTMLInputElement;
            const editable = EDITABLE_TAGS.includes(element.tagName.toLowerCase()) && !element.disabled && !element.readOnly || element.contentEditable === 'true';
            if (editable) {
                return {status: TestRunStatus.PASSED, message: `Executed action: Verify editable <${editable}>`};
            } else {
                return {
                    status: TestRunStatus.FAILED,
                    message: 'Expected editable, but found not editable'
                };
            }
        } catch (e) {
            return {status: TestRunStatus.FAILED, message: 'Element not found'};
        }
    }
}

class VerifyVisibleActionExecutor implements ActionExecutor {
    name = 'verifyVisible';

    async execute(testStep: TestStep): Promise<ExecutionResult> {
        try {
            const element = await waitForElementByXPath(testStep.element) as HTMLElement;
            // check visibility hidden
            const visible = element.style.display !== 'none' && element.style.visibility !== 'hidden';
            if (visible) {
                return {status: TestRunStatus.PASSED, message: `Executed action: Verify visible <${visible}>`};
            } else {
                return {
                    status: TestRunStatus.FAILED,
                    message: 'Expected visible, but found not visible'
                };
            }
        } catch (e) {
            return {status: TestRunStatus.FAILED, message: 'Element not found'};
        }
    }
}

export const openActionExecutor = new OpenActionExecutor();
export const clickActionExecutor = new ClickActionExecutor();
export const doubleClickActionExecutor = new DoubleClickActionExecutor();
export const typeActionExecutor = new TypeActionExecutor();
export const pressKeyActionExecutor = new PressKeyActionExecutor();
export const verifyValueActionExecutor = new VerifyValueActionExecutor();
export const verifyTextActionExecutor = new VerifyTextActionExecutor();
export const verifyTitleActionExecutor = new VerifyTitleActionExecutor();
export const verifyEditableActionExecutor = new VerifyEditableActionExecutor();
export const verifyVisibleActionExecutor = new VerifyVisibleActionExecutor();