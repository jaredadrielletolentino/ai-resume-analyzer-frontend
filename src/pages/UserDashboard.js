import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import MainLayout from '../layouts/MainLayout';
import UserStats from '../components/user/UserStats';
import UserJobManagement from '../components/user/UserJobManagement';
import UserCandidateSearch from '../components/user/UserCandidateSearch';
import UserAnalysisHistory from '../components/user/UserAnalysisHistory';

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index} className="mt-6">
      {value === index && children}
    </div>
  );
};

const UserDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const tabs = [
    { label: 'Overview', icon: <DashboardIcon />, component: <UserStats /> },
    { label: 'Job Opportunities', icon: <WorkIcon />, component: <UserJobManagement /> },
    { label: 'Find Candidates', icon: <SearchIcon />, component: <UserCandidateSearch /> },
    { label: 'My Analyses', icon: <HistoryIcon />, component: <UserAnalysisHistory /> },
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

export default UserDashboard;