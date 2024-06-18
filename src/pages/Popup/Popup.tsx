import React, {useState} from 'react'
import {Logo} from "./components/Logo";
import {Actions} from "./components/Actions";
import {TestSuites} from "./components/TestSuites";
import {TestCaseSteps} from "./components/TestCaseSteps";
import {TestRunComponent} from "./components/TestRun";
import {useDispatch, useSelector} from 'react-redux';
import {RootState, RUN_TEST_CASE, SET_ACTIVE_TEST_CASE} from "./redux/Reducers";
import {TestRun, TestRunStatus} from "./interfaces/TestRun";
import {TestCase} from "./interfaces/TestCase";
import {generateUniqueId} from "./utils";
import {TestRuns} from "./components/TestRuns";
import {TestSuite} from "./interfaces/TestSuite";

export const Popup = () => {
    const activeTestSuite = useSelector((state: RootState) => state.root.activeTestSuite);
    const testSuites = useSelector((state: RootState) => state.root.testSuites);
    const activeTestCase = useSelector((state: RootState) => state.root.activeTestCase);
    const pagesHistory = useSelector((state: RootState) => state.root.pagesHistory);
    const lastPage = pagesHistory[pagesHistory.length - 1];
    const dispatch = useDispatch();
    const [recordingEnabled, setRecordingEnabled] = useState(false);
    const [recordingTab, setRecordingTab] = useState(null);

    function createTestRun(testCase: TestCase) {
        const newTestRun: TestRun = {
            id: generateUniqueId(),
            status: TestRunStatus.RUNNING,
            steps: [...testCase.steps.map(step => ({...step, status: TestRunStatus.UNKNOWN}))],
            start: new Date().toISOString(),
            logs: [],
        };
        return newTestRun;
    }

    const runTestCase = () => {
        if (!activeTestCase) {
            return;
        }
        const newTestRun = createTestRun(activeTestCase);
        dispatch({type: RUN_TEST_CASE, testCase: activeTestCase, testRun: newTestRun});
        chrome.runtime.sendMessage({command: 'run-test', testRun: newTestRun});
    }

    const runTestSuite = async () => {
        if (!activeTestSuite) {
            return;
        }
        const testSuite = testSuites.find(suite => suite.id === activeTestSuite.id) as unknown as TestSuite;
        const waitForTestRunFinish = () => {
            return new Promise<void>((resolve) => {
                const handleTestRunFinished = (message) => {
                    if (message.type === 'finish-test-case-execution') {
                        chrome.runtime.onMessage.removeListener(handleTestRunFinished);
                        resolve();
                    }
                };
                chrome.runtime.onMessage.addListener(handleTestRunFinished);
            });
        };

        for (let testCase of testSuite.testCases) {
            const newTestRun = createTestRun(testCase);
            dispatch({type: SET_ACTIVE_TEST_CASE, testSuite, testCase});
            dispatch({type: RUN_TEST_CASE, testCase: testCase, testRun: newTestRun});
            chrome.runtime.sendMessage({command: 'run-test', testRun: newTestRun});
            await waitForTestRunFinish();
            console.log('test-run finished', testCase, newTestRun);
        }
    }

    return (
        <div className="app">
            <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px'}}>
                <Logo/>
                <div style={{flexGrow: 2}}>
                    <Actions recordingEnabled={recordingEnabled} setRecordingEnabled={setRecordingEnabled}
                             runTestCase={runTestCase} runTestSuite={runTestSuite}/>
                </div>
            </header>
            <div style={{display: 'flex', justifyContent: lastPage === 'testSuites' ? 'center' : 'space-between'}}>
                <TestSuites/>
                {lastPage !== 'testSuites' && <div style={{flexGrow: '1'}}>
                    {lastPage === 'testCases' &&
                        <TestCaseSteps recordingEnabled={recordingEnabled} recordingTab={recordingTab}
                                       setRecordingTab={setRecordingTab}/>}
                    {lastPage === 'runs' && <TestRuns testCase={activeTestCase as TestCase}/>}
                    {lastPage === 'run' && <TestRunComponent testCase={activeTestCase as TestCase}/>}
                </div>}
            </div>
        </div>
    );
}
