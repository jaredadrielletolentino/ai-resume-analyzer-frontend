import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

const MainLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleDashboard = () => {
    navigate(isAdmin() ? '/admin' : '/dashboard');
    handleClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-primary-dark">
      <AppBar position="static" className="navbar">
        <Toolbar>
          <Typography
            variant="h6"
            className="gradient-text cursor-pointer flex-grow"
            onClick={() => navigate('/')}
          >
            AI Resume Analyzer
          </Typography>
          
          <div className="flex gap-4">
            {user && isAdmin() && (
              <Button
                color="inherit"
                onClick={() => navigate('/admin')}
                className={`nav-link ${isActive('/admin') ? 'nav-link-active' : ''}`}
                startIcon={<AdminIcon />}
              >
                Admin
              </Button>
            )}
            
            {user ? (
              <div>
                <IconButton onClick={handleMenu} color="inherit">
                  <Avatar className="bg-primary">
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">{user.email}</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleDashboard}>
                    <DashboardIcon className="mr-2" /> Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button color="inherit" onClick={() => navigate('/login')} className="nav-link">
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      
      <div className="container py-8">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;