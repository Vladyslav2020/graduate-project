import React, {useState} from 'react';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import {Command} from "../Command";

type ActionsProps = {
    runTestCase: () => void;
}

export const Actions = ({runTestCase}: ActionsProps) => {
    const [recordingEnabled, setRecordingEnabled] = useState(false);

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
                {!recordingEnabled && <Command title='Record' handler={handleRecordAction} IconComponent={RadioButtonCheckedIcon}/>}
                {recordingEnabled && <Command title='Stop Recording' handler={handleStopRecording} IconComponent={StopCircleOutlinedIcon}/>}
                <Command title='Run Test Case' handler={runTestCase} IconComponent={PlayArrowOutlinedIcon}/>
                <Command title='Play Test Suite' handler={stubHandler} IconComponent={PlayArrowOutlinedIcon}/>
            </div>
            <Command title='Add AI-powered test' handler={stubHandler} IconComponent={AutoAwesomeOutlinedIcon}/>
        </div>
    );
}