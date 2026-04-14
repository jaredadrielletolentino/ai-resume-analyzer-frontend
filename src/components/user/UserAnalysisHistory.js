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
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { resumeService } from '../../services/resumeService';
import { jobService } from '../../services/jobService';

const UserAnalysisHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [matches, setMatches] = useState([]);
  const [matchingJobs, setMatchingJobs] = useState(false);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await resumeService.getAllAnalyses();
      setAnalyses(response.data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (analysis) => {
    setSelectedAnalysis(analysis);
    setOpenDialog(true);
    setMatches([]);
    setMatchingJobs(false);
  };

  const handleFindMatches = async (analysis) => {
    setSelectedAnalysis(analysis);
    setMatchingJobs(true);
    setOpenDialog(true);

    try {
      const response = await jobService.matchResumeWithJobs(analysis._id);
      setMatches(response.topMatches || []);
    } catch (error) {
      console.error('Error matching jobs:', error);
    } finally {
      setMatchingJobs(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <div>
      <Typography variant="h5" className="gradient-text mb-6">
        My Resume Analysis History
      </Typography>

      <Card className="card">
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <CircularProgress />
            </div>
          ) : analyses.length === 0 ? (
            <Typography className="text-center text-secondary-light py-8">
              No analyses found. Upload a resume to get started!
            </Typography>
          ) : (
            <TableContainer component={Paper} className="bg-transparent">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell>Match Score</TableCell>
                    <TableCell>Skills Matched</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyses.map((analysis) => (
                    <TableRow key={analysis._id}>
                      <TableCell>
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{analysis.metadata?.fileName || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${analysis.result?.score || 0}%`}
                          color={getScoreColor(analysis.result?.score || 0)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(analysis.result?.skillsMatched || []).slice(0, 3).map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" variant="outlined" />
                          ))}
                          {(analysis.result?.skillsMatched || []).length > 3 && (
                            <Chip label={`+${analysis.result.skillsMatched.length - 3}`} size="small" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ViewIcon />}
                            onClick={() => handleViewDetails(analysis)}
                            className="btn-outline"
                          >
                            Details
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<TrendingUpIcon />}
                            onClick={() => handleFindMatches(analysis)}
                            className="btn-primary"
                          >
                            Find Jobs
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Analysis Details</DialogTitle>
        <DialogContent>
          {selectedAnalysis && (
            <div className="space-y-4 mt-4">
              {selectedAnalysis.contactInfo && (
                <div className="bg-secondary-dark p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted mb-2">Contact Information</Typography>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedAnalysis.contactInfo.name && (
                      <Typography><strong>Name:</strong> {selectedAnalysis.contactInfo.name}</Typography>
                    )}
                    {selectedAnalysis.contactInfo.email && (
                      <Typography><strong>Email:</strong> {selectedAnalysis.contactInfo.email}</Typography>
                    )}
                    {selectedAnalysis.contactInfo.phone && (
                      <Typography><strong>Phone:</strong> {selectedAnalysis.contactInfo.phone}</Typography>
                    )}
                    {selectedAnalysis.contactInfo.location && (
                      <Typography><strong>Location:</strong> {selectedAnalysis.contactInfo.location}</Typography>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-secondary-dark p-4 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Match Score</Typography>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${selectedAnalysis.result?.score || 0}%` }}
                  />
                </div>
                <Typography className="mt-2 text-center">{selectedAnalysis.result?.score || 0}%</Typography>
              </div>

              <div className="bg-secondary-dark p-4 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Skills Matched</Typography>
                <div className="flex flex-wrap gap-2">
                  {(selectedAnalysis.result?.skillsMatched || []).map((skill, idx) => (
                    <Chip key={idx} label={skill} color="success" size="small" />
                  ))}
                </div>
              </div>

              <div className="bg-secondary-dark p-4 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Missing Skills</Typography>
                <div className="flex flex-wrap gap-2">
                  {(selectedAnalysis.result?.missingSkills || []).map((skill, idx) => (
                    <Chip key={idx} label={skill} color="error" size="small" />
                  ))}
                </div>
              </div>

              <div className="bg-secondary-dark p-4 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Summary</Typography>
                <Typography>{selectedAnalysis.result?.summary || 'N/A'}</Typography>
              </div>

              <div className="bg-secondary-dark p-4 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Recommendations</Typography>
                <ul className="list-disc pl-5 space-y-1">
                  {(selectedAnalysis.result?.recommendations || []).map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              {matchingJobs ? (
                <div className="flex justify-center py-4">
                  <CircularProgress />
                </div>
              ) : matches.length > 0 && (
                <div className="bg-secondary-dark p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted mb-2">Job Matches</Typography>
                  <div className="space-y-3">
                    {matches.map((match, idx) => (
                      <div key={idx} className="border border-gray-700 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <Typography variant="subtitle1">{match.jobTitle}</Typography>
                            <Typography variant="body2" className="text-muted">{match.company}</Typography>
                          </div>
                          <Chip
                            label={`${match.matchScore}%`}
                            color={getScoreColor(match.matchScore)}
                            size="small"
                          />
                        </div>
                        <Typography variant="body2" className="mt-2">{match.summary}</Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAnalysisHistory;