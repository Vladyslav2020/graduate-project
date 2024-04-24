import {getXPath} from "../utils";

class LocatorSelector {
    previousElement: any;

    constructor() {
        this.previousElement = null;
        this.handleMouseOver = this.handleMouseOver.bind(this);
    }

    public subscribe() {
        document.addEventListener('mouseover', this.handleMouseOver);
        document.addEventListener('click', this.handleClick);
    }

    public unsubscribe() {
        document.removeEventListener('mouseover', this.handleMouseOver);
        document.removeEventListener('click', this.handleClick);
        if (this.previousElement) {
            this.previousElement.style.border = this.previousElement.oldBorder;
        }
        this.previousElement = null;
    }

    private handleMouseOver(event) {
        const target = event.target;

        if (this.previousElement && this.previousElement !== target) {
            this.previousElement.style.border = this.previousElement.oldBorder;
        }

        if (!target.oldBorder) {
            target.oldBorder = target.style.border;
        }

        target.style.border = '2px solid red';

        this.previousElement = target;
    }

    private handleClick(event) {
        const target = event.target;
        const selector = getXPath(target);
        chrome.runtime.sendMessage({locator: selector});
    }
}

export const locatorSelector = new LocatorSelector();