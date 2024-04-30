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

/*
[
            {id: '1', name: 'open', element: 'https://www.google.com'},
            {id: '2', name: 'type', element: 'input[name=q]', value: 'test'},
            {
                id: '3', name: 'click', element: 'input[name=btnK]'
            },
            {
                id: '4', name: 'click', element: 'input[name=btnK]'
            },
            {
                id: '5', name: 'assert', element: 'input[name=btnK]', value: 'test'
            },
        ]
 */

export const Popup = () => {
    // const [testCase, setTestCase] = useState<TestCase>({
    //     id: '1', title: 'Test case 1', steps: [
    //         {
    //             "id": "1",
    //             "name": "click",
    //             "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
    //             "value": ""
    //         },
    //         {
    //             "id": "2",
    //             "name": "type",
    //             "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
    //             "value": "type 1"
    //         },
    //         {
    //             "id": "3",
    //             "name": "pressKey",
    //             "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
    //             "value": "${enter}"
    //         },
    //         {
    //             "id": "4",
    //             "name": "click",
    //             "element": "/html[1]/body[1]/div[1]/div[2]/div[2]/div[1]/div[1]",
    //             "value": ""
    //         },
    //         {
    //             "id": "5",
    //             "name": "click",
    //             "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
    //             "value": ""
    //         },
    //         {
    //             "id": "6",
    //             "name": "type",
    //             "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
    //             "value": "insert"
    //         },
    //         {
    //             "id": "7",
    //             "name": "pressKey",
    //             "element": "/html[1]/body[1]/div[1]/div[2]/div[1]/input[1]",
    //             "value": "${enter}"
    //         },
    //         {
    //             "id": "8",
    //             "name": "click",
    //             "element": "/html[1]/body[1]/div[1]/div[2]/div[2]/div[2]/div[1]",
    //             "value": ""
    //         },
    //         {
    //             "id": "9",
    //             "name": "click",
    //             "element": "/html[1]/body[1]/div[1]/div[2]/div[3]/div[3]/div[1]",
    //             "value": ""
    //         }
    //     ]
    // });
    const activeTestCase = useSelector((state: RootState) => state.root.activeTestCase);
    const dispatch = useDispatch();
    const [testCaseRunning, setTestCaseRunning] = useState(false);

    const runTestCase = () => {
        setTestCaseRunning(true);
        const newTestRun: TestRun = {
            id: 'run-' + Math.trunc(Math.random() * 1e5),
            status: TestRunStatus.UNKNOWN,
            steps: [...(activeTestCase as TestCase).steps.map(step => ({...step, status: TestRunStatus.UNKNOWN}))],
            start: new Date(),
            duration: 0,
            logs: [],
        };
        console.log('newTestRun', newTestRun);
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
                <TestSuites/>
                {activeTestCase && <TestCaseSteps/>}
            </div>
        </div>
    );
}
