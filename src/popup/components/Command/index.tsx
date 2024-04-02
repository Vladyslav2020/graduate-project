import {IconButton, Typography} from "@mui/material";

export const Command = ({title, IconComponent}) => {
    return (
        <IconButton sx={{borderRadius: '5px', marginLeft: '10px'}}>
            <IconComponent/>
            <Typography sx={{marginLeft: '5px'}} variant="body1">{title}</Typography>
        </IconButton>
    );
}