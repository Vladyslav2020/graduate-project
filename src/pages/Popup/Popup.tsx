import React, {useState} from 'react'
import {Logo} from "./components/Logo";
import {Actions} from "./components/Actions";
import {TestSuites} from "./components/TestSuites";
import {TestCaseSteps} from "./components/TestCaseSteps";
import {TestRunComponent} from "./components/TestRun";
import {useDispatch, useSelector} from 'react-redux';
import {RootState, RUN_TEST_CASE} from "./redux/Reducers";
import {TestRun, TestRunStatus} from "./interfaces/TestRun";
import {TestCase} from "./interfaces/TestCase";
import {generateUniqueId} from "./utils";
import {TestRuns} from "./components/TestRuns";

export const Popup = () => {
    const activeTestCase = useSelector((state: RootState) => state.root.activeTestCase);
    const [showTestRuns, setShowTestRuns] = useState(false);
    const dispatch = useDispatch();
    const [testCaseRunning, setTestCaseRunning] = useState(false);

    const runTestCase = () => {
        setTestCaseRunning(true);
        const newTestRun: TestRun = {
            id: generateUniqueId(),
            status: TestRunStatus.RUNNING,
            steps: [...(activeTestCase as TestCase).steps.map(step => ({...step, status: TestRunStatus.UNKNOWN}))],
            start: new Date(),
            logs: [],
        };
        dispatch({type: RUN_TEST_CASE, testCase: activeTestCase, testRun: newTestRun});
        chrome.runtime.sendMessage({command: 'run-test', testRun: newTestRun});
    }

    return (
        <div className="app">
            <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px'}}>
                <Logo/>
                <div style={{flexGrow: 2}}>
                    <Actions runTestCase={runTestCase}/>
                </div>
            </header>
            {testCaseRunning && <TestRunComponent testCase={activeTestCase as TestCase}/>}
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <TestSuites setShowTestRuns={setShowTestRuns}/>
                {activeTestCase && !showTestRuns && <TestCaseSteps/>}
                {activeTestCase && showTestRuns && <TestRuns testCase={activeTestCase as TestCase}/>}
            </div>
        </div>
    );
}