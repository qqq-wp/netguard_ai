import { PaletteOptions } from '@mui/material/styles';

export const lightTheme: PaletteOptions = {
  mode: 'light',
  primary: { main: '#1976d2' },
  background: { default: '#f5f5f5', paper: '#ffffff' },
  text: { primary: '#000000' },
};

export const darkTheme: PaletteOptions = {
  mode: 'dark',
  primary: { main: '#90caf9' },
  background: { default: '#121212', paper: '#1e1e1e' },
  text: { primary: '#ffffff' },
};