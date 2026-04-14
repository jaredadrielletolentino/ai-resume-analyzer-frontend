import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload as UploadIcon, CheckCircle as SuccessIcon } from '@mui/icons-material';
import { resumeService } from '../services/resumeService';
import MainLayout from '../layouts/MainLayout';

const ResumeSubmission = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError(null);
      setResult(null);
    },
  });

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await resumeService.analyzeResume(file, jobDescription);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Typography variant="h4" className="gradient-text font-bold mb-2">
            Resume Analysis
          </Typography>
          <Typography variant="body1" className="text-secondary-light">
            Upload your resume and paste the job description to get AI-powered analysis
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="card">
            <CardContent>
              <Typography variant="h6" className="mb-4">
                Upload Resume
              </Typography>
              
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
              >
                <input {...getInputProps()} />
                <UploadIcon className="text-6xl text-muted mx-auto mb-4" />
                {isDragActive ? (
                  <Typography>Drop the PDF file here...</Typography>
                ) : (
                  <Typography>
                    Drag & drop a PDF file here, or click to select
                  </Typography>
                )}
                <Typography variant="caption" className="text-muted block mt-2">
                  Only PDF files accepted (max 5MB)
                </Typography>
              </div>

              {file && (
                <Alert severity="success" className="mt-4">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Job Description Section */}
          <Card className="card">
            <CardContent>
              <Typography variant="h6" className="mb-4">
                Job Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="mb-4"
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !file || !jobDescription}
                className="btn-primary"
              >
                {loading ? <CircularProgress size={24} /> : 'Analyze Resume'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {error && (
          <Alert severity="error" className="mt-6">
            {error}
          </Alert>
        )}

        {result && (
          <Card className="card mt-6 animate-fade-in-up">
            <CardContent>
              <div className="flex items-center mb-4">
                <SuccessIcon className="text-success mr-2" />
                <Typography variant="h6">Analysis Results</Typography>
              </div>
              
              {/* Contact Info */}
              {result.contactInfo && (
                <div className="bg-secondary-dark rounded-lg p-4 mb-6">
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Contact Information
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.contactInfo.name && (
                      <Typography><strong>Name:</strong> {result.contactInfo.name}</Typography>
                    )}
                    {result.contactInfo.email && (
                      <Typography><strong>Email:</strong> {result.contactInfo.email}</Typography>
                    )}
                    {result.contactInfo.phone && (
                      <Typography><strong>Phone:</strong> {result.contactInfo.phone}</Typography>
                    )}
                    {result.contactInfo.location && (
                      <Typography><strong>Location:</strong> {result.contactInfo.location}</Typography>
                    )}
                  </div>
                </div>
              )}

              {/* Score */}
              <div className="mb-6">
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Match Score
                </Typography>
                <div className="mb-2 flex justify-between">
                  <span className="badge-info">{result.score}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>

              {/* Skills Matched */}
              <div className="mb-6">
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Skills Matched
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {result.skillsMatched?.map((skill, index) => (
                    <span key={index} className="badge-success">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="mb-6">
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Missing Skills
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.map((skill, index) => (
                    <span key={index} className="badge-error">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Summary
                </Typography>
                <Typography className="text-secondary-light">{result.summary}</Typography>
              </div>

              {/* Recommendations */}
              <div>
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Recommendations
                </Typography>
                <ul className="list-disc pl-5 space-y-1">
                  {result.recommendations?.map((rec, index) => (
                    <li key={index} className="text-secondary-light">{rec}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ResumeSubmission;