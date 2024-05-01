import {styled, TableRow} from '@mui/material';

export const CustomTableRow = styled(TableRow)(({theme}) => ({
    '&:hover': {
        backgroundColor: '#eaeaea',
    },
}));