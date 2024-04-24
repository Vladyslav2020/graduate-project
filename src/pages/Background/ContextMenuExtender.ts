class ContextMenuExtender {
    private menuItems: { id: string; title: string; applicableContexts: chrome.contextMenus.ContextType[] }[] = [
        {id: "verifyValue", title: "Verify Value", applicableContexts: ["editable"]},
        {id: "verifyText", title: "Verify Text", applicableContexts: ["all"]},
        {id: "verifyTitle", title: "Verify Title", applicableContexts: ["all"]},
        {id: "verifyEditable", title: "Verify Editable", applicableContexts: ["editable"]},
        {id: "verifyVisible", title: "Verify Visible", applicableContexts: ["all"]},
    ];
    private contextMenuElement: any = null;

    constructor() {
        this.handleContextMenuClick = this.handleContextMenuClick.bind(this);
        this.captureContextMenuElement = this.captureContextMenuElement.bind(this);
    }

    public declareContextMenuItems() {
        this.menuItems.forEach(item => {
            chrome.contextMenus.create({
                id: item.id,
                title: item.title,
                contexts: item.applicableContexts,
                enabled: true,
            });
        });

        chrome.contextMenus.onClicked.addListener(this.handleContextMenuClick);

        chrome.runtime.onMessage.addListener(this.captureContextMenuElement);
    }

    private captureContextMenuElement(message, sender, sendResponse) {
        if (message.action === 'contextMenuClicked') {
            this.contextMenuElement = {element: message.element, xpath: message.xpath};
        }
    }

    private saveAction(actionName, element, value) {
        chrome.runtime.sendMessage({
            action: actionName,
            element,
            value,
        });
    }

    private handleContextMenuClick(info, tab) {
        // Check which menu item was clicked based on its ID
        console.log("Info", info, 'Tab', tab);

        if (!this.contextMenuElement) {
            return;
        }

        console.log("Context Menu Element", this.contextMenuElement);

        switch (info.menuItemId) {
            case "verifyValue":
                this.saveAction('verifyValue', this.contextMenuElement.xpath, this.contextMenuElement.element.value || '');
                break;
            case "verifyText":
                this.saveAction('verifyText', this.contextMenuElement.xpath, this.contextMenuElement.element.innerText || '');
                break;
            case "verifyTitle":
                this.saveAction('verifyTitle', this.contextMenuElement.xpath, this.contextMenuElement.element.title || '');
                break;
            case "verifyEditable":
                this.saveAction('verifyEditable', this.contextMenuElement.xpath, '');
                break;
            default:
                break;
        }
    }
}

export const contextMenuExtender = new ContextMenuExtender();
