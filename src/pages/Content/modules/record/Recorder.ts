import {ActionHandler} from "./ActionHandler";


export class Recorder {
    private window;
    private isSubscribed = false;
    private actionHandlers: ActionHandler[] = [];

    constructor(window) {
        this.window = window;
    }

    subscribe() {
        if (this.isSubscribed) {
            return;
        }
        this.isSubscribed = true;
        this.actionHandlers.forEach(actionHandler => this.window.document.addEventListener(actionHandler.eventName, actionHandler.handle, true));
    }

    addActionHandler(actionHandler) {
        this.actionHandlers.push(actionHandler)
    }

    unsubscribe() {
        if (!this.isSubscribed) {
            return;
        }
        this.isSubscribed = false;
        this.actionHandlers.forEach(actionHandler => this.window.document.removeEventListener(actionHandler.eventName, actionHandler.handle, true));
    }

    getActionHandlers() {
        return this.actionHandlers;
    }
}