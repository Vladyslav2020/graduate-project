import {getXPath, isElementValid} from '../utils';

const TYPE_ELEMENTS = ['input', 'textarea'];
const TYPE_INPUT_ELEMENTS = ['text', 'password', 'email', 'url', 'number', 'datetime', 'datetime-local', 'date', 'month', 'time', 'week', 'range', 'search', 'tel', 'color', 'file'];

let clickTargetXPath;

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
        const tagName = target.tagName.toLowerCase();
        if (!TYPE_ELEMENTS.includes(tagName) || !TYPE_INPUT_ELEMENTS.includes(target.type) || !target.value.length) {
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
        if (!isElementValid(event.target)) {
            return;
        }
        const xpath = getXPath(event.target);
        clickTargetXPath = xpath;
        this.saveAction(this.actionName, xpath, '');
    }
}

class DoubleClickActionHandler extends ActionHandlerBase {
    actionName = 'doubleClick';
    eventName = 'dblclick';

    constructor() {
        super();
        this.handle = this.handle.bind(this);
    }

    handle(event): void {
        const xpath = isElementValid(event.target) ? getXPath(event.target) : clickTargetXPath;
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
        const xpath = getXPath(event.target);
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
export const doubleClickActionHandler = new DoubleClickActionHandler();