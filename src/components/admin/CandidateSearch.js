import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';

const CandidateSearch = () => {
  const [searchParams, setSearchParams] = useState({
    email: '',
    phone: '',
    name: '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const hasSearchTerm = searchParams.email || searchParams.phone || searchParams.name;
    if (!hasSearchTerm) {
      setError('Please enter at least one search criteria');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await adminService.searchCandidates(searchParams);
      setResults(response.data || []);
    } catch (error) {
      setError('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (candidate) => {
    setSelectedCandidate(candidate);
    setOpenDialog(true);
  };

  const handleClear = () => {
    setSearchParams({ email: '', phone: '', name: '' });
    setResults([]);
    setError('');
  };

  return (
    <div>
      <Typography variant="h5" className="gradient-text mb-6">
        Candidate Search
      </Typography>

      <Card className="card mb-6">
        <CardContent>
          <Typography variant="h6" className="mb-4">
            Search Criteria
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <TextField
              label="Search by Email"
              type="email"
              value={searchParams.email}
              onChange={(e) => setSearchParams({ ...searchParams, email: e.target.value })}
              placeholder="candidate@example.com"
              className="input-field"
            />
            <TextField
              label="Search by Phone"
              value={searchParams.phone}
              onChange={(e) => setSearchParams({ ...searchParams, phone: e.target.value })}
              placeholder="+639123456789"
              className="input-field"
            />
            <TextField
              label="Search by Name"
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              placeholder="John Doe"
              className="input-field"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              className="btn-primary"
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
              className="btn-outline"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : results.length > 0 ? (
        <Card className="card">
          <CardContent>
            <Typography variant="h6" className="mb-4">
              Search Results ({results.length} candidates found)
            </Typography>
            <TableContainer component={Paper} className="bg-transparent">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Match Score</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((candidate) => (
                    <TableRow key={candidate._id}>
                      <TableCell>
                        <strong>{candidate.contactInfo?.name || 'N/A'}</strong>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <EmailIcon className="text-muted text-sm" />
                            <span className="text-sm">{candidate.contactInfo?.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PhoneIcon className="text-muted text-sm" />
                            <span className="text-sm">{candidate.contactInfo?.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <LocationIcon className="text-muted text-sm" />
                          <span>{candidate.contactInfo?.location || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${candidate.result?.score || 0}%`}
                          color={candidate.result?.score >= 70 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(candidate.result?.skillsMatched || []).slice(0, 2).map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" variant="outlined" />
                          ))}
                          {(candidate.result?.skillsMatched || []).length > 2 && (
                            <Chip label={`+${candidate.result.skillsMatched.length - 2}`} size="small" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(candidate)}
                          className="text-primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : (
        !loading && (
          <Card className="card">
            <CardContent>
              <Typography className="text-center text-secondary-light py-8">
                Enter search criteria to find candidates
              </Typography>
            </CardContent>
          </Card>
        )
      )}

      {/* Candidate Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Candidate Details
        </DialogTitle>
        <DialogContent>
          {selectedCandidate && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary-dark p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Full Name</Typography>
                  <Typography variant="h6">{selectedCandidate.contactInfo?.name || 'N/A'}</Typography>
                </div>
                <div className="bg-secondary-dark p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Match Score</Typography>
                  <Typography variant="h6" className="text-primary">
                    {selectedCandidate.result?.score || 0}%
                  </Typography>
                </div>
                <div className="bg-secondary-dark p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Email</Typography>
                  <Typography>{selectedCandidate.contactInfo?.email || 'N/A'}</Typography>
                </div>
                <div className="bg-secondary-dark p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Phone</Typography>
                  <Typography>{selectedCandidate.contactInfo?.phone || 'N/A'}</Typography>
                </div>
                <div className="bg-secondary-dark p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Location</Typography>
                  <Typography>{selectedCandidate.contactInfo?.location || 'N/A'}</Typography>
                </div>
                <div className="bg-secondary-dark p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Submitted</Typography>
                  <Typography>{new Date(selectedCandidate.createdAt).toLocaleDateString()}</Typography>
                </div>
              </div>
              
              <div className="bg-secondary-dark p-4 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Skills Matched</Typography>
                <div className="flex flex-wrap gap-2">
                  {(selectedCandidate.result?.skillsMatched || []).map((skill, idx) => (
                    <Chip key={idx} label={skill} color="success" size="small" />
                  ))}
                </div>
              </div>

              <div className="bg-secondary-dark p-4 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Missing Skills</Typography>
                <div className="flex flex-wrap gap-2">
                  {(selectedCandidate.result?.missingSkills || []).map((skill, idx) => (
                    <Chip key={idx} label={skill} color="error" size="small" />
                  ))}
                </div>
              </div>

              <div className="bg-secondary-dark p-4 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Summary</Typography>
                <Typography>{selectedCandidate.result?.summary || 'N/A'}</Typography>
              </div>

              <div className="bg-secondary-dark p-4 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Recommendations</Typography>
                <ul className="list-disc pl-5 space-y-1">
                  {(selectedCandidate.result?.recommendations || []).map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateSearch;