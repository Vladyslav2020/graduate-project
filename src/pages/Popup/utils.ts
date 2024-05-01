export const actionsDescriptors = [
    {name: 'open', label: 'Open', elementType: 'text'},
    {name: 'click', label: 'Click', elementType: 'html'},
    {name: 'pressKey', label: 'Press Key', elementType: 'html'},
    {name: 'type', label: 'Type', elementType: 'html'},
    {name: 'verifyValue', label: 'Verify Value', elementType: 'html'},
    {name: 'verifyText', label: 'Verify Text', elementType: 'html'},
    {name: 'verifyTitle', label: 'Verify Title', elementType: 'html'},
    {name: 'verifyEditable', label: 'Verify Editable', elementType: 'html'},
    {name: 'verifyVisible', label: 'Verify Visible', elementType: 'html'},
];

export const getActionDescriptor = (name) => {
    return actionsDescriptors.find(actionsDescriptor => actionsDescriptor.name === name);
}

export const generateUniqueId = (): string => {
    const timestamp = new Date().getTime().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${timestamp}${random}`;
}
