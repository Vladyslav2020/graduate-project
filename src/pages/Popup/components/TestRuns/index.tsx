import React from "react";
import {CustomTableCell} from "../CustomTableCell";
import {capitalizeFirstLetter, formatDuration, getTestRunBackgroundColor, getTestStepIconColor} from "../../utils";
import {Box, Table, TableBody, TableHead, TableRow, Typography} from "@mui/material";
import {TestCase} from "../../interfaces/TestCase";
import {TestRunStatusIcon} from "../TestRunStatusIcon";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {CustomTableRow} from "../CustomTableRow";
import {TestRun} from "../../interfaces/TestRun";
import {useDispatch} from "react-redux";
import {SET_TEST_RUN} from "../../redux/Reducers";

type TestRunProps = {
    testCase: TestCase;
}

export const TestRuns = ({testCase}: TestRunProps) => {
    const dispatch = useDispatch();

    const runStatus2Count = testCase.runs.reduce((acc, run) => {
        const group = acc[run.status] || 0;
        acc[run.status] = group + 1;
        return acc;
    }, {});

    const statusData = [{name: 'status', ...runStatus2Count}];

    const runDurationData = testCase.runs.filter(run => run.duration)
        .map(run => ({start: run.start.toLocaleString(), duration: run.duration}));

    const calculateMeanDuration = (runs) => {
        const sum = runs.reduce((acc, run) => acc + (run.duration ? run.duration : 0), 0);
        return sum / runs.length;
    };

    const meanDuration = testCase.runs.length > 1 ? calculateMeanDuration(testCase.runs) : 0;

    const openTestRun = (testRun: TestRun) => {
        dispatch({type: SET_TEST_RUN, testRun});
    }

    return (
        <Box>
            <Typography variant='h6' align='center'>Runs of Test Case: {testCase.title}</Typography>
            {testCase.runs.length === 0 &&
                <Typography variant='body1' align='center' sx={{color: 'gray'}}>No runs yet</Typography>}
            {testCase.runs.length > 0 && <Table sx={{minWidth: '650px'}} aria-label="test runs">
                <TableHead>
                    <TableRow>
                        <CustomTableCell>#</CustomTableCell>
                        <CustomTableCell>Start time</CustomTableCell>
                        <CustomTableCell>Duration</CustomTableCell>
                        <CustomTableCell>Status</CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testCase.runs.map((run, index) =>
                        <CustomTableRow
                            key={run.id}
                            sx={{
                                "&:last-child td, &:last-child th": {border: 0},
                                backgroundColor: getTestRunBackgroundColor(run),
                            }}
                            onClick={() => openTestRun(run)}
                        >
                            <CustomTableCell>{index + 1}</CustomTableCell>
                            <CustomTableCell>{run.start.toLocaleString()}</CustomTableCell>
                            <CustomTableCell>{!run.duration ? 'unknown' : formatDuration(run.duration)}</CustomTableCell>
                            <CustomTableCell>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}><TestRunStatusIcon run={run}/></div>
                            </CustomTableCell>
                        </CustomTableRow>
                    )}
                </TableBody>
            </Table>}
            {testCase.runs.length > 1 && <Typography>Mean duration: {formatDuration(meanDuration)}</Typography>}
            {Object.getOwnPropertyNames(runStatus2Count).map((status, index) => <div key={index}><Typography
                sx={{color: getTestStepIconColor({status: status}), display: 'inline'}}>{capitalizeFirstLetter(status)}</Typography>
                <Typography sx={{display: 'inline'}}>: {runStatus2Count[status]}</Typography>
            </div>)}
            {testCase.runs.length > 0 && <Box sx={{display: 'flex'}}>
                <ResponsiveContainer width='40%' height={400}>
                    <BarChart margin={{top: 20}} data={statusData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        {Object.getOwnPropertyNames(runStatus2Count).map((name, index) => (
                            <Bar key={index} dataKey={name}
                                 fill={getTestStepIconColor({status: name})}/>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width='60%' height={400}>
                    <LineChart margin={{top: 20}} data={runDurationData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="start"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Line type="monotone" dataKey="duration" stroke="#8884d8"/>
                        {testCase.runs.length > 1 &&
                            <ReferenceLine y={meanDuration} stroke="#f57d05"/>}
                    </LineChart>
                </ResponsiveContainer>
            </Box>}
        </Box>
    );
}