import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material"
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux";
import {
    ADD_TEST_STEP_EXECUTION_RESULT,
    FINISH_TEST_CASE,
    RootState,
    START_TEST_STEP_EXECUTION
} from "../../redux/Reducers";
import {cellStyle, getActionDescriptor} from "../TestCaseSteps";
import {TestRun, TestRunStatus} from "../../interfaces/TestRun";
import {TestCase} from "../../interfaces/TestCase";

type TestRunProps = {
    testCase: TestCase;
}

export const TestRunComponent = ({testCase}: TestRunProps) => {
    const testRun = useSelector((state: RootState) => state.root.activeTestRun);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(!!testRun);

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.type === 'start-test-step-execution') {
                console.log('start-test-step-execution:', message.stepId);
                dispatch({
                    type: START_TEST_STEP_EXECUTION,
                    stepId: message.stepId,
                });
            }
            if (message.type === 'finish-test-step-execution') {
                console.log('finish-test-step-execution:', message.stepId, message.status, message.logs);
                dispatch({
                    type: ADD_TEST_STEP_EXECUTION_RESULT,
                    stepId: message.stepId,
                    status: message.status,
                    logs: message.logs,
                });
            }
            if (message.type === 'finish-test-case-execution') {
                console.log('finish-test-case-execution:', message.status);
                dispatch({
                    type: FINISH_TEST_CASE,
                    testCaseId: (testRun as TestRun).id,
                    status: message.status,
                });
            }
        }

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        }
    }, []);

    useEffect(() => {
        setOpen(!!testRun);
    }, [testRun]);

    const getTestStepBackgroundColor = (step: any) => {
        if (step.status === TestRunStatus.PASSED) {
            return '#E5FFDC';
        }
        if (step.status === TestRunStatus.FAILED) {
            return '#FFE0E0';
        }
        if (step.status === TestRunStatus.RUNNING) {
            return '#F1F9FF';
        }
        return 'none';
    }

    const getTestStepIconColor = (step: any) => {
        if (step.status === TestRunStatus.PASSED) {
            return '#107100';
        }
        if (step.status === TestRunStatus.FAILED) {
            return '#FF7878';
        }
        if (step.status === TestRunStatus.RUNNING) {
            return '#88B8FF';
        }
        return 'none';
    }

    const getTestRunStatusIcon = (step: any) => {
        if (step.status === TestRunStatus.PASSED) {
            return <CheckCircleOutlineRoundedIcon style={{fill: getTestStepIconColor(step)}}/>;
        }
        if (step.status === TestRunStatus.FAILED) {
            return <HighlightOffRoundedIcon/>;
        }
        if (step.status === TestRunStatus.RUNNING) {
            return <PendingOutlinedIcon/>;
        }
        return;
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'xl'}
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Run Test Case: {testCase.title}</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: 'fit-content',
                    }}
                >
                    <Table sx={{minWidth: 650}} aria-label="commands table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={cellStyle}>Action</TableCell>
                                <TableCell style={cellStyle}>Element</TableCell>
                                <TableCell style={cellStyle}>Value</TableCell>
                                <TableCell style={cellStyle}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testRun?.steps.map((step) =>
                                <TableRow
                                    key={step.id}
                                    sx={{
                                        "&:last-child td, &:last-child th": {border: 0},
                                        backgroundColor: getTestStepBackgroundColor(step),
                                    }}
                                >
                                    <TableCell style={cellStyle}>{getActionDescriptor(step.name)?.label}</TableCell>
                                    <TableCell style={cellStyle}>
                                        {step.element}
                                    </TableCell>
                                    <TableCell style={cellStyle}>{step.value}</TableCell>
                                    <TableCell style={cellStyle}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>{getTestRunStatusIcon(step)}</div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Typography variant="h6">Logs</Typography>
                    {testRun?.logs.map((log, index) =>
                        <Typography key={index}>{log}</Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}