import {TestRunStatus} from "./interfaces/TestRun";

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

export const getTestStepIconColor = (run: any) => {
    if (run.status === TestRunStatus.PASSED) {
        return '#107100';
    }
    if (run.status === TestRunStatus.FAILED) {
        return '#FF7878';
    }
    if (run.status === TestRunStatus.RUNNING) {
        return '#88B8FF';
    }
    return 'none';
}

export const getTestRunBackgroundColor = (item: any) => {
    if (item.status === TestRunStatus.PASSED) {
        return '#E5FFDC';
    }
    if (item.status === TestRunStatus.FAILED) {
        return '#FFE0E0';
    }
    if (item.status === TestRunStatus.RUNNING) {
        return '#F1F9FF';
    }
    return 'none';
}

export const formatDuration = (durationInMillis: number): string => {
    const totalSeconds = Math.floor(durationInMillis / 1000);
    const milliseconds = durationInMillis % 1000;
    return `${totalSeconds}:${milliseconds.toString().padStart(3, '0')}`;
}