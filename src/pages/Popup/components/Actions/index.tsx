import React from 'react';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import {Command} from "../Command";
import {useDispatch, useSelector} from 'react-redux';
import {CLOSE_TEST_RUN, GO_TO_BACK_PAGE, RootState} from "../../redux/Reducers";

type ActionsProps = {
    runTestCase: () => void;
    recordingEnabled: boolean;
    setRecordingEnabled: (enabled: boolean) => void;
}

export const Actions = ({runTestCase, recordingEnabled, setRecordingEnabled}: ActionsProps) => {
    const dispatch = useDispatch();
    const pagesHistory = useSelector((state: RootState) => state.root.pagesHistory);
    const lastPage = pagesHistory[pagesHistory.length - 1];

    const handleGoBackAction = () => {
        if (lastPage === 'run') {
            dispatch({type: CLOSE_TEST_RUN});
        } else {
            dispatch({type: GO_TO_BACK_PAGE});
        }
    }

    const handleRecordAction = () => {
        setRecordingEnabled(true);
        chrome.runtime.sendMessage({command: 'subscribe-recorder'});
    }

    const handleStopRecording = () => {
        setRecordingEnabled(false);
        chrome.runtime.sendMessage({command: 'unsubscribe-recorder'});
    }

    const stubHandler = () => {

    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <div>
                {pagesHistory.length > 1 &&
                    <Command title='Back' handler={handleGoBackAction} IconComponent={ArrowBackIosNewRoundedIcon}/>}
                {!recordingEnabled && lastPage === 'testCases' &&
                    <Command title='Record' handler={handleRecordAction} IconComponent={RadioButtonCheckedIcon}/>}
                {recordingEnabled && <Command title='Stop Recording' handler={handleStopRecording}
                                              IconComponent={StopCircleOutlinedIcon}/>}
                {pagesHistory.some(page => page === 'testCases') &&
                    <Command title='Run Test Case' handler={runTestCase} IconComponent={PlayArrowOutlinedIcon}/>}
                {lastPage === 'testCases' &&
                    <Command title='Run Test Suite' handler={stubHandler} IconComponent={PlayArrowOutlinedIcon}/>}
            </div>
        </div>
    );
}