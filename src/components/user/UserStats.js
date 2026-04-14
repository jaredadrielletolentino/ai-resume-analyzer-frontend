import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { resumeService } from '../../services/resumeService';
import { jobService } from '../../services/jobService';

const UserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [resumesResponse, jobsResponse] = await Promise.all([
        resumeService.getAllAnalyses({ limit: 1 }),
        jobService.getAllJobs({ limit: 1 }),
      ]);

      // Get all resumes to calculate average score
      const allResumesResponse = await resumeService.getAllAnalyses();
      let avgMatchScore = 0;
      let totalScore = 0;
      let analysesWithScores = 0;
      
      if (allResumesResponse.data && allResumesResponse.data.length > 0) {
        allResumesResponse.data.forEach(analysis => {
          if (analysis.result && analysis.result.score) {
            totalScore += analysis.result.score;
            analysesWithScores++;
          }
        });
        avgMatchScore = analysesWithScores > 0 ? Math.round(totalScore / analysesWithScores) : 0;
      }

      setStats({
        totalResumes: resumesResponse.pagination?.totalItems || 0,
        totalJobs: jobsResponse.pagination?.totalItems || 0,
        avgMatchScore: avgMatchScore,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Resumes Analyzed',
      value: stats?.totalResumes || 0,
      icon: <DescriptionIcon className="text-4xl text-primary" />,
      color: 'primary',
      detail: 'Total submissions',
    },
    {
      title: 'Available Jobs',
      value: stats?.totalJobs || 0,
      icon: <WorkIcon className="text-4xl text-success" />,
      color: 'success',
      detail: 'Open positions',
    },
    {
      title: 'Average Match Score',
      value: `${stats?.avgMatchScore || 0}%`,
      icon: <TrendingUpIcon className="text-4xl text-warning" />,
      color: 'warning',
      detail: 'Across all resumes',
    },
    {
      title: 'Success Rate',
      value: stats?.avgMatchScore >= 70 ? 'High' : stats?.avgMatchScore >= 50 ? 'Medium' : 'Low',
      icon: <CheckCircleIcon className="text-4xl text-info" />,
      color: 'info',
      detail: stats?.avgMatchScore >= 70 ? 'Good matches found' : 'Improvement needed',
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

export default UserStats;