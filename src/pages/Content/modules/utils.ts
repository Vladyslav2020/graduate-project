export function getXPath(element) {
    const idx = (sib, name?) => sib
        ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name)
        : 1;
    const segs = elm => !elm || elm.nodeType !== 1
        ? ['']
        : elm.id && document.querySelector(`#${elm.id}`) === elm
            ? [`id("${elm.id}")`]
            : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
    return segs(element).join('/');
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
