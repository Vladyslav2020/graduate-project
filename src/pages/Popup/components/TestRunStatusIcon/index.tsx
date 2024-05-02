import React from "react";
import {TestRunStatus} from "../../interfaces/TestRun";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import {getTestStepIconColor} from "../../utils";

export const TestRunStatusIcon = ({run}: any) => {
    const style = {fill: getTestStepIconColor(run)};

    if (run.status === TestRunStatus.PASSED) {
        return <CheckCircleOutlineRoundedIcon style={style}/>;
    }
    if (run.status === TestRunStatus.FAILED) {
        return <HighlightOffRoundedIcon style={style}/>;
    }
    if (run.status === TestRunStatus.RUNNING) {
        return <PendingOutlinedIcon style={style}/>;
    }
    return <></>;
}