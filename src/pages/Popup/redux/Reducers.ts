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

export const initialTestSuitesState: TestSuitesState = {
    testSuites: [],
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
                            duration: new Date().getTime() - new Date(run.start).getTime(),
                            logs: [...run.logs, action.logs],
                            screenshot: action.screenshot,
                        } : run),
                    } : testCase)
                } : testSuite),
                activeTestRun: {
                    ...state.activeTestRun,
                    status: action.status,
                    duration: new Date().getTime() - new Date((state.activeTestRun as TestRun).start).getTime(),
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
