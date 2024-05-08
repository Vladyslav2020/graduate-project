import React from "react";
import {IconButton, Typography} from "@mui/material";

export const Command = ({title, IconComponent, handler}) => {
    return (
        <IconButton title={title} sx={{borderRadius: '5px', marginLeft: '10px'}} onClick={handler}>
            <IconComponent/>
            <Typography sx={{marginLeft: '5px'}} variant="body1">{title}</Typography>
        </IconButton>
    );
}