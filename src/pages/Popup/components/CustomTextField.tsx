import {styled, TextField} from "@mui/material";

export const CustomTextField = styled(TextField)(({theme}) => ({
    '& .MuiInputBase-input': {
        paddingTop: '0',
        paddingBottom: '0',
    }
}));