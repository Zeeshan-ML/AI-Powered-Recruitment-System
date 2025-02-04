import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import api from './axiosInstance';

// Helper function to get cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const ApplyJob = () => {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const hrUsername = searchParams.get('hr_username');
  const jobTitle = searchParams.get('job_title');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [candidateUsername, setCandidateUsername] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      window.location.href = '/login';
      return;
    }
    const user = JSON.parse(userString);
    setCandidateUsername(user.username);
    if (user.role !== 'candidate') {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    // Prepare form data for multipart upload
    const formData = new FormData();
    formData.append('candidate_username', candidateUsername);
    formData.append('hr_username', hrUsername);
    formData.append('job_title', jobTitle);
    formData.append('file', file);
    formData.append('job_id', jobId);

    // Retrieve access token from cookies
    const accessToken = getCookie('access_token');
    if (!accessToken) {
      setError('Authentication token not found.');
      setUploading(false);
      return;
    }

    try {
      const response = await api.post('resume/upload-resume', formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`Resume uploaded successfully! File: ${response.data.file_name}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="apply-job-container">
      {/* Animated Background Elements */}
      <div className="bg-circle bg-circle-primary"></div>
      <div className="bg-circle bg-circle-success"></div>

      <div className="container">
        <div className="glass-card apply-card">
          <h2 className="gradient-text text-center mb-4">Apply for {jobTitle}</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="resume" className="form-label">Upload Resume (PDF only)</label>
              <input
                type="file"
                className="form-control"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className="btn btn-primary modern-btn w-100" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        .apply-job-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
        }
        .apply-card {
          margin-top: 2rem;
        }
        .gradient-text {
          background: linear-gradient(45deg, #007bff, #00c3ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
        }
        .modern-btn {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
          border-radius: 50px;
          padding: 0.5rem 1.5rem;
        }
        .modern-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
        }
        /* Background circles with pulse animation */
        .bg-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.7;
          animation: pulse 6s infinite;
        }
        .bg-circle-primary {
          top: -60px;
          right: -60px;
          width: 220px;
          height: 220px;
          background: rgba(0, 123, 255, 0.15);
        }
        .bg-circle-success {
          bottom: -120px;
          left: -120px;
          width: 320px;
          height: 320px;
          background: rgba(40, 167, 69, 0.15);
          animation-duration: 8s;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ApplyJob;
