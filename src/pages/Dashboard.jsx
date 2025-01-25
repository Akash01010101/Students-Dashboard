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
  IconButton 
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
      <AppBar 
        position="fixed" 
        sx={{ 
          width: `calc(100% - ${drawerWidth}px)`, 
          ml: `${drawerWidth}px` 
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Student Management Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
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

      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          mt: '64px'  // AppBar height
        }}
      >
        {selectedPage === 'students' && <StudentsPage />}
      </Box>
    </Box>
  );
};

export default Dashboard;