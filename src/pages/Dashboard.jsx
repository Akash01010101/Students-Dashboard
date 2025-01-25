import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import { 
  People as StudentsIcon, 
  Logout as LogoutIcon 
} from '@mui/icons-material';
import { getAuth, signOut } from 'firebase/auth';
import StudentsPage from './StudentsPage';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState('students');
  const auth = getAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check for mobile screen size

  const handleLogout = () => {
    signOut(auth)
      .catch((error) => {
        console.error('Logout error', error);
      });
  };
  
  const nav = useNavigate();

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: `calc(100% - ${isMobile ? 0 : drawerWidth}px)`, 
          ml: `${isMobile ? 0 : drawerWidth}px` 
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Student Management Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? "temporary" : "permanent"} // Use temporary drawer on mobile
        anchor="left"
        open={!isMobile || selectedPage !== 'students'} // Hide drawer on mobile if not needed
        onClose={() => setSelectedPage('students')}
      >
        <Toolbar />
        <List>
          <ListItem 
            button 
            selected={selectedPage === 'students'}
            onClick={() => setSelectedPage('students')}
          >
            <ListItemIcon>
              <StudentsIcon />
            </ListItemIcon>
            <ListItemText primary="Students" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => nav('/students')}
          >
            <ListItemIcon>
              <StudentsIcon />
            </ListItemIcon>
            <ListItemText primary="Students Page" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          p: 3,
          width: `calc(100% - ${isMobile ? 0 : drawerWidth}px)`,
          mt: '64px'  // AppBar height
        }}
      >
        {selectedPage === 'students' && <StudentsPage />}
      </Box>
    </Box>
  );
};

export default Dashboard;
