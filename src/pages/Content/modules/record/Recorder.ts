import {ActionHandler} from "./ActionHandler";


export class Recorder {
    private window;
    private actionHandlers: ActionHandler[] = [];

    constructor(window) {
        this.window = window;
    }

    subscribe() {
        this.actionHandlers.forEach(actionHandler => this.window.document.addEventListener(actionHandler.eventName, actionHandler.handle));
    }

    addActionHandler(actionHandler) {
        this.actionHandlers.push(actionHandler)
    }

    unsubscribe() {
        this.actionHandlers.forEach(actionHandler => this.window.document.removeEventListener(actionHandler.eventName, actionHandler.handle));
    }

    getActionHandlers() {
        return this.actionHandlers;
    }
}