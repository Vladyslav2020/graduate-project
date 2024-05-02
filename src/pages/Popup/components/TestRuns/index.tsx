import React from "react";
import {CustomTableCell} from "../CustomTableCell";
import {formatDuration, getTestRunBackgroundColor, getTestStepIconColor} from "../../utils";
import {Box, Table, TableBody, TableHead, TableRow} from "@mui/material";
import {TestCase} from "../../interfaces/TestCase";
import {TestRunStatusIcon} from "../TestRunStatusIcon";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

type TestRunProps = {
    testCase: TestCase;
}

export const TestRuns = ({testCase}: TestRunProps) => {
    const runStatus = testCase.runs.reduce((acc, run) => {
        const group = acc[run.status] || 0;
        acc[run.status] = group + 1;
        return acc;
    }, {});

    const statusData = [{name: 'status', ...runStatus}];

    const runDurationData = testCase.runs.filter(run => run.duration)
        .map(run => ({start: run.start.toLocaleString(), duration: run.duration}));

    return (
        <Box>
            <Table sx={{minWidth: '650px'}} aria-label="test runs">
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
                        <TableRow
                            key={run.id}
                            sx={{
                                "&:last-child td, &:last-child th": {border: 0},
                                backgroundColor: getTestRunBackgroundColor(run),
                            }}
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
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Box sx={{display: 'flex'}}>
                <ResponsiveContainer width='40%' height={400}>
                    <BarChart margin={{top: 20}} data={statusData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        {Object.getOwnPropertyNames(runStatus).map((name, index) => (
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
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}