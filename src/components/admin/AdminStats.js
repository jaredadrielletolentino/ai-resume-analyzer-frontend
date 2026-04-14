import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userStats, jobsResponse, analysesResponse] = await Promise.all([
        adminService.getUserStats(),
        adminService.getAllJobs({ limit: 1 }),
        adminService.getAllAnalyses({ limit: 1 }),
      ]);

      setStats({
        users: userStats.data,
        totalJobs: jobsResponse.pagination?.totalItems || 0,
        totalAnalyses: analysesResponse.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total || 0,
      icon: <PeopleIcon className="text-4xl text-primary" />,
      color: 'primary',
      detail: `${stats?.users?.active || 0} active`,
    },
    {
      title: 'Total Jobs',
      value: stats?.totalJobs || 0,
      icon: <WorkIcon className="text-4xl text-success" />,
      color: 'success',
      detail: 'Active positions',
    },
    {
      title: 'Resumes Analyzed',
      value: stats?.totalAnalyses || 0,
      icon: <DescriptionIcon className="text-4xl text-warning" />,
      color: 'warning',
      detail: 'Total submissions',
    },
    {
      title: 'Match Rate',
      value: '78%',
      icon: <TrendingUpIcon className="text-4xl text-info" />,
      color: 'info',
      detail: 'Average match score',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h5" className="gradient-text mb-6">
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="card">
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h4" className="font-bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" className="text-muted">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" className="text-muted">
                      {stat.detail}
                    </Typography>
                  </div>
                  <div className={`text-${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AdminStats;