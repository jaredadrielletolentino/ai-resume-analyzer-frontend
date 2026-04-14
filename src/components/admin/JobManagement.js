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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    experienceLevel: 'Junior',
    employmentType: 'Full-time',
    skills: [],
    isActive: true,
    salary: { min: '', max: '', currency: 'USD' },
  });
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllJobs({ limit: 100 });
      console.log('Jobs fetched:', response);
      
      if (response && response.success !== false) {
        setJobs(response.data || []);
      } else {
        setError('Failed to load jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      company: '',
      description: '',
      location: '',
      experienceLevel: 'Junior',
      employmentType: 'Full-time',
      skills: [],
      isActive: true,
      salary: { min: '', max: '', currency: 'USD' },
    });
    setSkillInput('');
    setError('');
    setSuccess('');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location || '',
      experienceLevel: job.experienceLevel || 'Junior',
      employmentType: job.employmentType || 'Full-time',
      skills: job.skills || [],
      isActive: job.isActive !== undefined ? job.isActive : true,
      salary: job.salary || { min: '', max: '', currency: 'USD' },
    });
    setSkillInput('');
    setError('');
    setSuccess('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingJob(null);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async () => {
    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        location: formData.location,
        experienceLevel: formData.experienceLevel,
        employmentType: formData.employmentType,
        skills: formData.skills,
        isActive: formData.isActive,
        salary: {
          min: parseInt(formData.salary.min) || 0,
          max: parseInt(formData.salary.max) || 0,
          currency: formData.salary.currency,
        },
      };

      if (editingJob) {
        await adminService.updateJob(editingJob._id, jobData);
        setSuccess('Job updated successfully');
      } else {
        await adminService.createJob(jobData);
        setSuccess('Job created successfully');
      }
      fetchJobs();
      setTimeout(() => handleCloseDialog(), 1500);
    } catch (error) {
      setError(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await adminService.deleteJob(id);
        setSuccess('Job deleted successfully');
        fetchJobs();
      } catch (error) {
        setError('Failed to delete job');
      }
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const newStatus = !job.isActive;
      await adminService.updateJob(job._id, { ...job, isActive: newStatus });
      setSuccess(`Job ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchJobs();
    } catch (error) {
      setError('Failed to update job status');
    }
  };

  const handleViewDetails = (job) => {
    setViewingJob(job);
    setOpenViewDialog(true);
  };

  const experienceLevels = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Lead'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'];
  const currencies = ['USD', 'PHP', 'EUR', 'GBP'];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="gradient-text">
          Job Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          className="btn-primary"
          sx={{ backgroundColor: '#6366f1', '&:hover': { backgroundColor: '#4f46e5' } }}
        >
          Create New Job
        </Button>
      </div>

      {/* Messages */}
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" className="mb-4" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Jobs Table */}
      <Card className="card">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">
              All Jobs ({jobs.length} total)
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchJobs}
              size="small"
            >
              Refresh
            </Button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Typography className="text-secondary-light">
                No jobs found. Click "Create New Job" to add your first job posting.
              </Typography>
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1a1a1e' }}>
                    <TableCell sx={{ color: '#a1a1aa' }}>Status</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>Job Title</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>Company</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>Location</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>Experience</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>Skills</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job._id} sx={{ opacity: job.isActive ? 1 : 0.6 }}>
                      <TableCell>
                        <Chip
                          label={job.isActive ? 'Active' : 'Inactive'}
                          color={job.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <strong>{job.title}</strong>
                      </TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.location || 'Remote'}</TableCell>
                      <TableCell>
                        <Chip label={job.experienceLevel} size="small" />
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
                      <TableCell>
                        <div className="flex gap-1">
                          {/* View Button */}
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(job)}
                            title="View Details"
                            sx={{ color: '#60a5fa' }}
                          >
                            <ViewIcon />
                          </IconButton>
                          
                          {/* Edit Button */}
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditDialog(job)}
                            title="Edit Job"
                            sx={{ color: '#fbbf24' }}
                          >
                            <EditIcon />
                          </IconButton>
                          
                          {/* Toggle Status Button */}
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(job)}
                            title={job.isActive ? 'Disable Job' : 'Enable Job'}
                            sx={{ color: job.isActive ? '#f87171' : '#34d399' }}
                          >
                            {job.isActive ? <BlockIcon /> : <ActivateIcon />}
                          </IconButton>
                          
                          {/* Delete Button */}
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(job._id)}
                            title="Delete Job"
                            sx={{ color: '#ef4444' }}
                          >
                            <DeleteIcon />
                          </IconButton>
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

      {/* Create/Edit Job Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingJob ? 'Edit Job' : 'Create New Job'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Job Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Remote, Manila, New York, etc."
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Job Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  label="Experience Level"
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  label="Employment Type"
                >
                  {employmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            
            <div>
              <Typography variant="subtitle2" className="mb-2">Skills</Typography>
              <div className="flex gap-2 mb-2">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a skill (e.g., React, Node.js, Python)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button onClick={handleAddSkill} variant="outlined">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    color="primary"
                    size="small"
                  />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <TextField
                label="Min Salary"
                type="number"
                value={formData.salary.min}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, min: e.target.value }
                })}
                placeholder="0"
              />
              <TextField
                label="Max Salary"
                type="number"
                value={formData.salary.max}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, max: e.target.value }
                })}
                placeholder="0"
              />
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.salary.currency}
                  onChange={(e) => setFormData({
                    ...formData,
                    salary: { ...formData.salary, currency: e.target.value }
                  })}
                  label="Currency"
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  color="primary"
                />
              }
              label="Job is Active (visible to users)"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#6366f1' }}>
            {editingJob ? 'Update Job' : 'Create Job'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Job Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Job Details
          {viewingJob && (
            <Chip 
              label={viewingJob.isActive ? 'Active' : 'Inactive'}
              color={viewingJob.isActive ? 'success' : 'default'}
              size="small"
              className="ml-2"
            />
          )}
        </DialogTitle>
        <DialogContent>
          {viewingJob && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary-dark p-3 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Job Title</Typography>
                  <Typography variant="h6">{viewingJob.title}</Typography>
                </div>
                <div className="bg-secondary-dark p-3 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Company</Typography>
                  <Typography variant="h6">{viewingJob.company}</Typography>
                </div>
                <div className="bg-secondary-dark p-3 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Location</Typography>
                  <Typography>{viewingJob.location || 'Remote'}</Typography>
                </div>
                <div className="bg-secondary-dark p-3 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Experience Level</Typography>
                  <Typography>{viewingJob.experienceLevel}</Typography>
                </div>
                <div className="bg-secondary-dark p-3 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Employment Type</Typography>
                  <Typography>{viewingJob.employmentType}</Typography>
                </div>
                <div className="bg-secondary-dark p-3 rounded-lg">
                  <Typography variant="subtitle2" className="text-muted">Salary Range</Typography>
                  <Typography>
                    {viewingJob.salary?.min && viewingJob.salary?.max 
                      ? `${viewingJob.salary.currency} ${viewingJob.salary.min.toLocaleString()} - ${viewingJob.salary.max.toLocaleString()}`
                      : 'Not specified'}
                  </Typography>
                </div>
              </div>
              
              <div className="bg-secondary-dark p-3 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Description</Typography>
                <Typography className="whitespace-pre-wrap">{viewingJob.description}</Typography>
              </div>
              
              <div className="bg-secondary-dark p-3 rounded-lg">
                <Typography variant="subtitle2" className="text-muted mb-2">Required Skills</Typography>
                <div className="flex flex-wrap gap-2">
                  {(viewingJob.skills || []).map((skill, idx) => (
                    <Chip key={idx} label={skill} color="primary" size="small" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          <Button 
            onClick={() => {
              setOpenViewDialog(false);
              handleOpenEditDialog(viewingJob);
            }} 
            variant="contained"
            sx={{ backgroundColor: '#6366f1' }}
          >
            Edit Job
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobManagement;