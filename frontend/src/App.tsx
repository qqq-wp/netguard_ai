import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Switch, Box } from '@mui/material';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';
import AI from './pages/AI';
import { lightTheme, darkTheme } from './themes';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: darkMode ? darkTheme : lightTheme,
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" flexGrow={1}>NetGuard AI</Typography>
            <Switch 
              checked={darkMode} 
              onChange={(e) => setDarkMode(e.target.checked)} 
              color="default"
            />
            <Typography ml={1}>Тёмная тема</Typography>
          </Toolbar>
        </AppBar>
        <Box p={3}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/ai" element={<AI />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;