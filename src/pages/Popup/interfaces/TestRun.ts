
export interface TestRun {
    id: string;
    steps: TestRunStep[];
    status: TestRunStatus;
    start: string;
    duration?: number;
    logs: string[];
    screenshot?: string;
}

interface TestRunStep {
    id: string;
    name: string;
    element: string;
    value?: string;
    status: TestRunStatus;
}

export enum TestRunStatus {
    RUNNING = 'running',
    PASSED = 'passed',
    FAILED = 'failed',
    UNKNOWN = 'unknown',
}