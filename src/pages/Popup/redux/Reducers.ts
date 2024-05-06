import {combineReducers} from 'redux';
import {TestSuite} from "../interfaces/TestSuite";
import {TestCase} from "../interfaces/TestCase";
import {TestRun, TestRunStatus} from "../interfaces/TestRun";

export const SET_TEST_SUITES = 'SET_TEST_SUITES';
export const ADD_TEST_SUITE = 'ADD_TEST_SUITE';
export const SET_TEST_STEPS = 'SET_TEST_STEPS';
export const SET_ACTIVE_TEST_SUITE = 'SET_ACTIVE_TEST_SUITE';
export const SET_ACTIVE_TEST_CASE = 'SET_ACTIVE_TEST_CASE';
export const RUN_TEST_CASE = 'RUN_TEST_CASE';
export const SET_TEST_RUN = 'SET_TEST_RUN';
export const ADD_TEST_STEP_EXECUTION_RESULT = 'ADD_TEST_STEP_EXECUTION_RESULT';
export const START_TEST_STEP_EXECUTION = 'START_TEST_STEP_EXECUTION';
export const FINISH_TEST_CASE = 'FINISH_TEST_CASE';
export const CLOSE_TEST_RUN = 'CLOSE_TEST_RUN';
export const GO_TO_BACK_PAGE = 'GO_TO_BACK_PAGE';
export const SHOW_RUNS = 'SHOW_RUNS';

export interface RootState {
    root: TestSuitesState;
}

export interface TestSuitesState {
    testSuites: TestSuite[];
    activeTestSuite: TestSuite | null;
    activeTestCase: TestCase | null;
    activeTestRun: TestRun | null;
    pagesHistory: Page[];
}

type Page = 'testSuites' | 'testCases' | 'runs' | 'run';

const initialTestSuitesState: TestSuitesState = {
    testSuites: [{
        id: 'test-suite-1', title: 'Test Suite 1', testCases: [{
            id: '1', title: 'Test case 1', runs: [], steps: [
                {
                    "id": "1",
                    "name": "click",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
                    "value": ""
                },
                {
                    "id": "2",
                    "name": "type",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
                    "value": "type 1"
                },
                {
                    "id": "3",
                    "name": "pressKey",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
                    "value": "${enter}"
                },
                {
                    "id": "4",
                    "name": "click",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[2]/div[1]/div[1]",
                    "value": ""
                },
                {
                    "id": "5",
                    "name": "click",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
                    "value": ""
                },
                {
                    "id": "6",
                    "name": "type",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
                    "value": "insert"
                }, {
                    "id": "6_1",
                    "name": "verifyValue",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
                    "value": "insert1"
                },
                {
                    "id": "7",
                    "name": "pressKey",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
                    "value": "${enter}"
                },
                {
                    "id": "8",
                    "name": "click",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[2]/div[2]/div[1]",
                    "value": ""
                },
                {
                    "id": "9",
                    "name": "click",
                    "element": "/html[1]/body[1]/div[1]/div[2]/div[3]/div[3]/div[1]",
                    "value": ""
                }
            ]
        }]
    }],
    activeTestSuite: null,
    activeTestCase: null,
    activeTestRun: null,
    pagesHistory: ['testSuites'],
};

const testSuitesReducer = (state: TestSuitesState = initialTestSuitesState, action: any) => {
    switch (action.type) {
        case SET_TEST_SUITES:
            return {
                ...state,
                testSuites: action.testSuites,
            };
        case ADD_TEST_SUITE:
            return {
                ...state,
                testSuites: [...state.testSuites, action.testSuite],
            };
        case SET_TEST_STEPS:
            return {
                ...state,
                testSuites: state.testSuites.map(testSuite => testSuite.id === state.activeTestSuite?.id ? {
                    ...testSuite,
                    testCases: testSuite.testCases.map(testCase => testCase.id === state.activeTestCase?.id ? {
                        ...testCase,
                        steps: action.steps
                    } : testCase)
                } : testSuite),
                activeTestCase: {
                    ...state.activeTestCase,
                    steps: action.steps,
                }
            };
        case SET_ACTIVE_TEST_SUITE:
            return {
                ...state,
                activeTestSuite: action.testSuite,
            };
        case SET_ACTIVE_TEST_CASE:
            return {
                ...state,
                activeTestSuite: action.testSuite,
                activeTestCase: action.testCase,
                pagesHistory: ['testSuites', 'testCases'],
            };
        case RUN_TEST_CASE:
            return {
                ...state,
                testSuites: state.testSuites.map(testSuite => testSuite.id === state.activeTestSuite?.id ? {
                    ...testSuite,
                    testCases: testSuite.testCases.map(testCase => {
                        if (testCase.id !== action.testCase.id) {
                            return testCase;
                        }
                        return {
                            ...testCase,
                            runs: [...testCase.runs, action.testRun]
                        }
                    })
                } : testSuite),
                activeTestRun: action.testRun,
                pagesHistory: [...state.pagesHistory, 'run'],
            };
        case SET_TEST_RUN:
            return {
                ...state,
                activeTestRun: action.testRun,
                pagesHistory: [...state.pagesHistory, 'run'],
            };
        case ADD_TEST_STEP_EXECUTION_RESULT:
            return {
                ...state,
                testSuites: state.testSuites.map(testSuite => testSuite.id === state.activeTestSuite?.id ? {
                    ...testSuite,
                    testCases: testSuite.testCases.map(testCase => testCase.id === state.activeTestCase?.id ? {
                        ...testCase,
                        runs: testCase.runs.map(run => run.id === (state.activeTestRun as TestRun).id ? {
                            ...run,
                            steps: run.steps.map(step => step.id === action.stepId ? {
                                ...step,
                                status: action.status,
                            } : step),
                            logs: [...run.logs, action.logs],
                        } : run)
                    } : testCase)
                } : testSuite),
                activeTestRun: {
                    ...state.activeTestRun,
                    steps: (state.activeTestRun as TestRun).steps.map(step => step.id === action.stepId ? {
                        ...step,
                        status: action.status,
                    } : step),
                    logs: [...(state.activeTestRun as TestRun).logs, action.logs],
                }
            }
        case START_TEST_STEP_EXECUTION:
            return {
                ...state,
                testSuites: state.testSuites.map(testSuite => testSuite.id === state.activeTestSuite?.id ? {
                    ...testSuite,
                    testCases: testSuite.testCases.map(testCase => testCase.id === state.activeTestCase?.id ? {
                        ...testCase,
                        runs: testCase.runs.map(run => run.id === (state.activeTestRun as TestRun).id ? {
                            ...run,
                            steps: run.steps.map(step => step.id === action.stepId ? {
                                ...step,
                                status: TestRunStatus.RUNNING,
                            } : step),
                        } : run)
                    } : testCase)
                } : testSuite),
                activeTestRun: {
                    ...state.activeTestRun,
                    steps: (state.activeTestRun as TestRun).steps.map(step => step.id === action.stepId ? {
                        ...step,
                        status: TestRunStatus.RUNNING,
                    } : step),
                }
            }
        case FINISH_TEST_CASE:
            return {
                ...state,
                testSuites: state.testSuites.map(testSuite => testSuite.id === state.activeTestSuite?.id ? {
                    ...testSuite,
                    testCases: testSuite.testCases.map(testCase => testCase.id === action.testCaseId ? {
                        ...testCase,
                        runs: testCase.runs.map(run => run.id === state.activeTestRun?.id ? {
                            ...run,
                            status: action.status,
                            duration: new Date().getTime() - run.start.getTime(),
                            logs: [...run.logs, action.logs],
                            screenshot: action.screenshot,
                        } : run),
                    } : testCase)
                } : testSuite),
                activeTestRun: {
                    ...state.activeTestRun,
                    status: action.status,
                    duration: new Date().getTime() - (state.activeTestRun as TestRun).start.getTime(),
                    logs: [...(state.activeTestRun as TestRun).logs, action.logs],
                    screenshot: action.screenshot,
                },
            };
        case CLOSE_TEST_RUN:
            return {
                ...state,
                activeTestRun: null,
                pagesHistory: state.pagesHistory.slice(0, -1),
            };
        case GO_TO_BACK_PAGE:
            return {
                ...state,
                pagesHistory: state.pagesHistory.slice(0, -1),
            };
        case SHOW_RUNS:
            return {
                ...state,
                pagesHistory: [...state.pagesHistory, 'runs'],
            };
        default:
            return state;
    }
};

export default combineReducers({
    root: testSuitesReducer,
});
