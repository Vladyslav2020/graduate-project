import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Typography
} from "@mui/material"
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux";
import {
    ADD_TEST_STEP_EXECUTION_RESULT,
    CLOSE_TEST_RUN,
    FINISH_TEST_CASE,
    RootState,
    START_TEST_STEP_EXECUTION
} from "../../redux/Reducers";
import {getActionDescriptor} from "../../utils";
import {TestRunStatus} from "../../interfaces/TestRun";
import {TestCase} from "../../interfaces/TestCase";
import {CustomTableCell} from "../CustomTableCell";

type TestRunProps = {
    testCase: TestCase;
}

export const TestRunComponent = ({testCase}: TestRunProps) => {
    const testRun = useSelector((state: RootState) => state.root.activeTestRun);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch({
            type: CLOSE_TEST_RUN,
        });
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
                dispatch({
                    type: FINISH_TEST_CASE,
                    testCaseId: testCase.id,
                    status: message.status,
                    logs: message.logs,
                    screenshot: message.screenshot,
                });
            }
        }

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        }
    }, []);

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
        const style = {fill: getTestStepIconColor(step)};
        if (step.status === TestRunStatus.PASSED) {
            return <CheckCircleOutlineRoundedIcon style={style}/>;
        }
        if (step.status === TestRunStatus.FAILED) {
            return <HighlightOffRoundedIcon style={style}/>;
        }
        if (step.status === TestRunStatus.RUNNING) {
            return <PendingOutlinedIcon style={style}/>;
        }
        return;
    }

    const formatDuration = (durationInMillis: number): string => {
        const totalSeconds = Math.floor(durationInMillis / 1000);
        const milliseconds = durationInMillis % 1000;
        return `${totalSeconds}:${milliseconds.toString().padStart(3, '0')}`;
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'xl'}
            open={!!testRun}
            onClose={handleClose}
        >
            <DialogTitle align='center'>Run Test Case: {testCase.title}</DialogTitle>
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
                                <CustomTableCell>Action</CustomTableCell>
                                <CustomTableCell>Element</CustomTableCell>
                                <CustomTableCell>Value</CustomTableCell>
                                <CustomTableCell>Status</CustomTableCell>
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
                                    <CustomTableCell>{getActionDescriptor(step.name)?.label}</CustomTableCell>
                                    <CustomTableCell>
                                        {step.element}
                                    </CustomTableCell>
                                    <CustomTableCell>{step.value}</CustomTableCell>
                                    <CustomTableCell>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>{getTestRunStatusIcon(step)}</div>
                                    </CustomTableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {testRun?.duration &&
                        <Typography variant="body1">Duration: {formatDuration(testRun.duration)}</Typography>}
                    <Typography variant="h6">Logs</Typography>
                    {testRun?.logs.map((log, index) =>
                        <Typography key={index}>{log}</Typography>
                    )}
                    {testRun?.screenshot &&
                        <Box sx={{maxWidth: '1000px', overflow: 'auto'}}><img src={testRun.screenshot}
                                                                              alt="screenshot"/></Box>}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button disabled={testRun?.status === TestRunStatus.RUNNING} onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}