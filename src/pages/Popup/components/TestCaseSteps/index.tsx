import React, {useEffect, useState} from "react";
import {closestCorners, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {TestCaseStep} from "../TestCaseStep";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {TestStep} from "../../interfaces/TestStep";


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

export const TestCaseSteps = () => {
    const [editingStep, setEditingStep] = useState(null);
    const [locatorEnabled, setLocatorEnabled] = useState(false);
    // TODO: retrieve data from localStorage
    const [steps, setSteps] = useState([
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
    ]);


    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    }));

    const setTestStep = (testStep: TestStep) => {
        setSteps(prevSteps => prevSteps.map(prevStep => prevStep.id === testStep.id ? testStep : prevStep));
    }

    const handleDragEnd = (e) => {
        const {active, over} = e;

        if (!active || !over || active.id === over.id) {
            return;
        }

        const getStepIndex = (id) => steps.findIndex((step) => step.id === id);

        setSteps((steps) => {
            const originalPos = getStepIndex(active.id);
            const newPos = getStepIndex(over.id);
            return arrayMove(steps, originalPos, newPos);
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
        setSteps(prevSteps => prevSteps.filter(step => step.id !== id));
    }

    useEffect(() => {
        const handleMessage = (message, sender, sendResponse) => {
            console.log('message:', message, 'sender', sender, 'sendResponse', sendResponse);
            console.log('locatorEnabled && message.locator', locatorEnabled && message.locator, message.locator, locatorEnabled)
            if (locatorEnabled && message.locator) {
                setSteps(prevSteps => prevSteps.map(step => step.id === editingStep ? {
                    ...step,
                    element: message.locator
                } : step));
                setLocatorEnabled(false);
                chrome.runtime.sendMessage({command: 'disable-locator-selection'});
            }
            if (message.action && actionsDescriptors.some(actionDescriptor => actionDescriptor.name === message.action)) {
                setSteps(prevSteps => [...prevSteps, {
                    id: String(prevSteps.length + 1),
                    name: message.action,
                    element: message.element,
                    value: message.value
                }]);
            }
        }

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        }
    }, [editingStep, locatorEnabled, setLocatorEnabled, steps, setSteps]);

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <Table sx={{minWidth: 650}} aria-label="commands table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Command</TableCell>
                        <TableCell>Element</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Clear</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <SortableContext items={steps} strategy={verticalListSortingStrategy}>
                        {steps.map((step) => (
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
    )
}