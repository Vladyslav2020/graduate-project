import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {TestStep} from "../../interfaces/TestStep";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import React from "react";
import {FormControl, IconButton, InputLabel, MenuItem} from "@mui/material";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import {actionsDescriptors, getActionDescriptor} from "../../utils";
import {CustomTableRow} from "../CustomTableRow";
import {CustomTableCell} from "../CustomTableCell";
import {CustomTextField} from "../CustomTextField";
import {CustomSelect} from "../CustomSelect";


type TestStepProps = {
    id: string;
    testStep: TestStep;
    setTestStep: (TestStep) => void;
    handleStepEditing: (id: string) => void;
    handleLocatorEnable: () => void;
    onRemove: (id: string) => void;
    locatorEnabled: boolean;
    activated: boolean;
}

export const TestCaseStep = ({
                                 id,
                                 testStep,
                                 setTestStep,
                                 onRemove,
                                 locatorEnabled,
                                 activated,
                                 handleStepEditing,
                                 handleLocatorEnable
                             }: TestStepProps) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style = {
        transition,
        ...(transform ? {transform: CSS.Transform.toString({...transform, x: 0})} : {})
    };

    const handleRemove = () => {
        onRemove(id);
    }

    const handleActionChange = (event) => {
        setTestStep({...testStep, name: event.target.value});
    }

    const handleElementChange = (event) => {
        setTestStep({...testStep, element: event.target.value});
    }

    const handleValueChange = (event) => {
        setTestStep({...testStep, value: event.target.value});
    }

    const handleActivation = () => {
        handleStepEditing(testStep.id);
    }

    return (
        <CustomTableRow
            sx={{"&:last-child td, &:last-child th": {border: 0}}}
            style={style}
            {...attributes}
            {...listeners}
            onDoubleClick={handleActivation}
        >
            <CustomTableCell
                component="th"
                scope="row"
                ref={setNodeRef}
            >
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <DragIndicatorIcon/>
                </div>
            </CustomTableCell>
            <CustomTableCell>{!activated ? getActionDescriptor(testStep.name)?.label :
                <FormControl fullWidth>
                    <InputLabel id="select-action-label">Action</InputLabel>
                    <CustomSelect
                        labelId="select-action-label"
                        id="select-action"
                        value={testStep.name}
                        label="Action"
                        onChange={handleActionChange}
                    >
                        {actionsDescriptors.map(actionDescriptor => <MenuItem key={actionDescriptor.name}
                                                                              value={actionDescriptor.name}>{actionDescriptor.label}</MenuItem>)}
                    </CustomSelect>
                </FormControl>
            }</CustomTableCell>
            <CustomTableCell>
                {!activated ? testStep.element : <div style={{display: 'flex', alignItems: 'center'}}>
                    <CustomTextField value={testStep.element} onChange={handleElementChange}/>
                    {getActionDescriptor(testStep.name)?.elementType === 'html' &&
                        <IconButton title='Locate HTML element' onClick={handleLocatorEnable}
                                    color={locatorEnabled ? 'primary' : 'default'}
                                    size={'small'}><LocationSearchingIcon/></IconButton>}
                </div>}
            </CustomTableCell>
            <CustomTableCell>{!activated ? testStep.value :
                <CustomTextField value={testStep.value} onChange={handleValueChange}/>}</CustomTableCell>
            <CustomTableCell onClick={handleRemove}>
                <IconButton title='Remove test step' size='small' onClick={handleRemove}><ClearOutlinedIcon/></IconButton>
            </CustomTableCell>
        </CustomTableRow>
    )
}