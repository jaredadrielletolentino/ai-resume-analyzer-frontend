import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Work as WorkIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { jobService } from '../../services/jobService';

const UserJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching jobs from API...');
      const response = await jobService.getAllJobs({ 
        active: true,
        limit: 100 
      });
      console.log('API Response:', response);
      
      if (response && response.success !== false) {
        const jobsData = response.data || [];
        console.log(`Found ${jobsData.length} active jobs`);
        setJobs(jobsData);
        
        if (jobsData.length === 0) {
          setError('No jobs available. Please contact administrator to add jobs.');
        }
      } else {
        setError(response?.error || 'Failed to load jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.response?.data?.error || 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="gradient-text">
          Job Opportunities
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchJobs}
          disabled={loading}
          className="btn-outline"
        >
          Refresh
        </Button>
      </div>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card className="card">
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <CircularProgress />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <WorkIcon className="text-6xl text-muted mb-4" />
              <Typography variant="h6" className="text-secondary-light">
                No Jobs Available
              </Typography>
              <Typography variant="body2" className="text-muted mt-2">
                There are currently no active job postings. Please check back later or contact the administrator.
              </Typography>
            </div>
          ) : (
            <TableContainer component={Paper} className="bg-transparent">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job Title</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Employment Type</TableCell>
                    <TableCell>Skills</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell>
                        <strong>{job.title}</strong>
                      </TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.location || 'Remote'}</TableCell>
                      <TableCell>
                        <Chip label={job.experienceLevel} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={job.employmentType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(job.skills || []).slice(0, 3).map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" variant="outlined" />
                          ))}
                          {(job.skills || []).length > 3 && (
                            <Chip label={`+${job.skills.length - 3}`} size="small" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {!loading && jobs.length > 0 && (
            <Typography variant="caption" className="text-muted mt-4 block text-center">
              Showing {jobs.length} active job{jobs.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserJobManagement;