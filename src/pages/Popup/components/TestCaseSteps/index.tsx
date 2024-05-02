import React, {useEffect, useState} from "react";
import {closestCorners, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {TestCaseStep} from "../TestCaseStep";
import {Button, Table, TableBody, TableHead, TableRow} from "@mui/material";
import {TestStep} from "../../interfaces/TestStep";
import {RootState, SET_TEST_STEPS} from "../../redux/Reducers";
import {useDispatch, useSelector} from "react-redux";
import {actionsDescriptors, generateUniqueId} from "../../utils";
import {CustomTableCell} from "../CustomTableCell";

export const TestCaseSteps = () => {
    const testCase = useSelector((state: RootState) => state.root.activeTestCase);
    const dispatch = useDispatch();
    const [editingStep, setEditingStep] = useState(null);
    const [locatorEnabled, setLocatorEnabled] = useState(false);

    console.log('steps', testCase?.steps);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    }));

    const setTestStep = (testStep: TestStep) => {
        dispatch({
            type: SET_TEST_STEPS,
            steps: testCase?.steps.map(step => step.id === testStep.id ? testStep : step)
        });
    }

    const handleDragEnd = (e) => {
        const {active, over} = e;

        if (!active || !over || active.id === over.id) {
            return;
        }

        const getStepIndex = (id) => testCase?.steps.findIndex((step) => step.id === id);

        const originalPos = getStepIndex(active.id) as number;
        const newPos = getStepIndex(over.id) as number;

        dispatch({
            type: SET_TEST_STEPS,
            steps: arrayMove(testCase?.steps as TestStep[], originalPos, newPos)
        });
    };

    const handleStepEditing = (id) => {
        if (editingStep === id) {
            setEditingStep(null);
        } else {
            setEditingStep(id);
        }
        setLocatorEnabled(false);
        chrome.runtime.sendMessage({command: 'disable-locator-selection'});
    }

    const handleLocatorEnable = () => {
        if (locatorEnabled) {
            setLocatorEnabled(false);
            chrome.runtime.sendMessage({command: 'disable-locator-selection'});
        } else {
            setLocatorEnabled(true);
            chrome.runtime.sendMessage({command: 'enable-locator-selection'});
        }
    }

    const clearTestStep = (id) => {
        dispatch({
            type: SET_TEST_STEPS,
            steps: testCase?.steps.filter(step => step.id !== id)
        });
    }

    useEffect(() => {
        const handleMessage = (message, sender, sendResponse) => {
            console.log('message:', message, 'sender', sender, 'sendResponse', sendResponse);
            console.log('locatorEnabled && message.locator', locatorEnabled && message.locator, message.locator, locatorEnabled)
            const steps = testCase?.steps as TestStep[];
            if (locatorEnabled && message.locator) {
                dispatch({
                    type: SET_TEST_STEPS,
                    steps: steps?.map(step => step.id === editingStep ? {
                        ...step,
                        element: message.locator
                    } : step)
                });
                setLocatorEnabled(false);
                chrome.runtime.sendMessage({command: 'disable-locator-selection'});
            }
            if (message.action && actionsDescriptors.some(actionDescriptor => actionDescriptor.name === message.action)) {
                dispatch({
                    type: SET_TEST_STEPS,
                    steps: [...steps, {
                        id: generateUniqueId(),
                        name: message.action,
                        element: message.element,
                        value: message.value
                    }]
                });
            }
        }

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        }
    }, [editingStep, locatorEnabled, setLocatorEnabled]);

    const addTestStep = () => {
        const steps = testCase?.steps as TestStep[];
        dispatch({
            type: SET_TEST_STEPS,
            steps: [...steps, {
                id: generateUniqueId(),
                name: 'click',
                element: '/html[1]/body[1]'
            }]
        });
    }

    return (
        <div>
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <Table sx={{minWidth: 650}} aria-label="commands table">
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>#</CustomTableCell>
                            <CustomTableCell>Command</CustomTableCell>
                            <CustomTableCell>Element</CustomTableCell>
                            <CustomTableCell>Value</CustomTableCell>
                            <CustomTableCell>Clear</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <SortableContext items={testCase?.steps as TestStep[]} strategy={verticalListSortingStrategy}>
                            {testCase?.steps.map((step) => (
                                <TestCaseStep key={step.id} id={step.id} testStep={step} setTestStep={setTestStep}
                                              locatorEnabled={step.id === editingStep && locatorEnabled}
                                              onRemove={clearTestStep} handleStepEditing={handleStepEditing}
                                              handleLocatorEnable={handleLocatorEnable}
                                              activated={step.id === editingStep}/>
                            ))}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>
            <Button size='small' variant='outlined' sx={{marginTop: '5px'}} onClick={addTestStep}>+ Test Step</Button>
        </div>
    );
}