import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import MainLayout from '../layouts/MainLayout';
import AdminStats from '../components/admin/AdminStats';
import UserManagement from '../components/admin/UserManagement';
import JobManagement from '../components/admin/JobManagement';
import CandidateSearch from '../components/admin/CandidateSearch';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index} className="mt-6">
      {value === index && children}
    </div>
  );
};

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const tabs = [
    { label: 'Dashboard', icon: <DashboardIcon />, component: <AdminStats /> },
    { label: 'User Management', icon: <PeopleIcon />, component: <UserManagement /> },
    { label: 'Job Management', icon: <WorkIcon />, component: <JobManagement /> },
    { label: 'Candidate Search', icon: <SearchIcon />, component: <CandidateSearch /> },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                className="normal-case"
              />
            ))}
          </Tabs>
        </Box>
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;