import {getXPath} from "../utils";

const TYPE_ELEMENTS = ['input', 'textarea']

export interface ActionHandler {
    actionName: string;
    eventName: string;

    handle(event): void;
}

abstract class ActionHandlerBase implements ActionHandler {
    actionName = '';

    eventName = '';

    abstract handle(event): void;

    protected saveAction(actionName, element, value) {
        chrome.runtime.sendMessage({
            action: actionName,
            element,
            value,
        });
    }
}

class TypeActionHandler extends ActionHandlerBase {
    actionName = 'type';

    eventName = 'change';

    constructor() {
        super();
        this.handle = this.handle.bind(this);
    }

    handle(event): void {
        const target = event.target;
        // check target to be input element type
        // check allowed types of input element
        console.log('target:', target, 'target.value', target.value)
        const tagName = target.tagName.toLowerCase();
        if (!TYPE_ELEMENTS.includes(tagName) || !target.value.length) {
            return;
        }
        const xpath = getXPath(target);
        this.saveAction(this.actionName, xpath, target.value);
    }
}

class ClickActionHandler extends ActionHandlerBase {
    actionName = 'click';
    eventName = 'click';

    constructor() {
        super();
        this.handle = this.handle.bind(this);
    }

    handle(event): void {
        console.log(this);
        const xpath = getXPath(event.target);
        console.log('XPath:', xpath)
        this.saveAction(this.actionName, xpath, '');
    }
}

class PressKeyActionHandler extends ActionHandlerBase {
    actionName = 'pressKey';
    eventName = 'keydown';

    constructor() {
        super();
        this.handle = this.handle.bind(this);
    }

    handle(event): void {
        console.log('Key pressed', event.key, event.target);
        const xpath = getXPath(event.target);
        console.log('current value', event.target.value);
        if (event.key === 'Enter') {
            if (TYPE_ELEMENTS.includes(event.target.tagName.toLowerCase()) && event.target.value) {
                this.saveAction('type', xpath, event.target.value);
            }
            this.saveAction(this.actionName, xpath, '${enter}');
        }
        if (event.key === 'Tab') {
            this.saveAction(this.actionName, xpath, '${tab}');
        }
    }
}

class ContextMenuActionHandle extends ActionHandlerBase {
    actionName = 'contextMenu';
    eventName = 'contextmenu';

    constructor() {
        super();
        this.handle = this.handle.bind(this);
    }

    handle(event): void {
        const targetElement = event.target;
        const xpath = getXPath(targetElement);

        chrome.runtime.sendMessage({
            action: 'contextMenuClicked',
            element: {value: targetElement.value, innerText: targetElement.innerText, title: targetElement.title},
            xpath
        });
    }
}

export const typeActionHandler = new TypeActionHandler();
export const clickActionHandler = new ClickActionHandler();
export const pressKeyActionHandler = new PressKeyActionHandler();
export const contextMenuActionHandler = new ContextMenuActionHandle();