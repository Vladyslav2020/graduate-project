import { Select, styled } from "@mui/material";

export const CustomSelect = styled(Select)(({theme}) => ({
    '& .MuiSelect-select': {
        paddingTop: '3px',
        paddingBottom: '3px',
    }
}));