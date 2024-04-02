import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import {Command} from "../Command";

export const Actions = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <div>
                <Command title='Record' IconComponent={RadioButtonCheckedIcon}/>
                <Command title='Run Test' IconComponent={PlayArrowOutlinedIcon}/>
                <Command title='Play Test Suite' IconComponent={PlayArrowOutlinedIcon}/>
            </div>
            <Command title='Add AI-powered test' IconComponent={AutoAwesomeOutlinedIcon}/>
        </div>
    );
}