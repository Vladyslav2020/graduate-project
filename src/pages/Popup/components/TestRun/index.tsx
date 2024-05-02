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
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux";
import {
    ADD_TEST_STEP_EXECUTION_RESULT,
    CLOSE_TEST_RUN,
    FINISH_TEST_CASE,
    RootState,
    START_TEST_STEP_EXECUTION
} from "../../redux/Reducers";
import {formatDuration, getActionDescriptor, getTestRunBackgroundColor} from "../../utils";
import {TestRunStatus} from "../../interfaces/TestRun";
import {TestCase} from "../../interfaces/TestCase";
import {CustomTableCell} from "../CustomTableCell";
import {TestRunStatusIcon} from "../TestRunStatusIcon";

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
                    <Table sx={{minWidth: 650}} aria-label="test run steps">
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
                                        backgroundColor: getTestRunBackgroundColor(step),
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
                                        }}><TestRunStatusIcon run={step}/></div>
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