import { styled } from '@mui/material/styles';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';

export const SelectTitle = styled('p')(({ theme }) => ({
    fontFamily: 'Mabry Pro',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: theme.palette.dark.main,
    marginBottom: '1.5rem',
}));

export const SelectContainer = styled(Box)(() => ({
    marginTop: '2rem',
}));

export const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: theme.palette.dark.main,
}));
