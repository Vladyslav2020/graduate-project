export function getXPath(element) {
    let selector = '';
    let foundRoot;
    let currentElement = element;

    do {
        const tagName = currentElement.tagName.toLowerCase();
        const parentElement = currentElement.parentElement;

        if ((parentElement?.childElementCount || 0) > 1) {
            const parentsChildren = [...parentElement.children];
            let tag: any[] = [];
            parentsChildren.forEach(child => {
                if (child.tagName.toLowerCase() === tagName) {
                    tag.push(child); // Append to tag
                }
            })

            if (tag.length === 1) {
                selector = `/${tagName}${selector}`;
            } else {
                const position = tag.indexOf(currentElement) + 1;
                selector = `/${tagName}[${position}]${selector}`;
            }
        } else {
            selector = `/${tagName}${selector}`;
        }

        currentElement = parentElement;
        foundRoot = parentElement.tagName.toLowerCase() === 'html';
        if (foundRoot) selector = `/html${selector}`;
    }
    while (foundRoot === false);

    return selector;
}

export function isElementValid(element) {
    if (!element) {
        return false;
    }
    let currentElement = element;
    while (currentElement) {
        if (currentElement.tagName.toLowerCase() === 'body') {
            return true;
        }
        currentElement = currentElement.parentElement;
    }
    return false;
}

export function waitForElementByXPath(xpath: string, timeout = 1000): Promise<Element> {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const element = getElementByXPath(xpath);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 100);
        setTimeout(() => {
            clearInterval(interval);
            reject(new Error('Timeout'));
        }, timeout);
    });
}

export function getElementByXPath(xpath: string): Element | null {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

    if (result.singleNodeValue instanceof Element) {
        return result.singleNodeValue;
    } else {
        return null;
    }
}
