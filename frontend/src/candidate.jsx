import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBriefcase, faHistory } from '@fortawesome/free-solid-svg-icons';
import api from './axiosInstance';

// Helper function to get cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('available');
  const navigate = useNavigate();

  // Check session and role on mount
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userString);
    if (user.role !== 'candidate') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div className="dashboard-container">
      {/* Animated Background Elements */}
      <div className="bg-circle bg-circle-primary"></div>
      <div className="bg-circle bg-circle-success"></div>

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg glass-card-nav shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand gradient-text">Candidate Dashboard</span>
          <div className="d-flex align-items-center">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row gap-3">
              <li className="nav-item">
                <button
                  className={`nav-link nav-btn ${activeTab === 'available' ? 'active' : ''}`}
                  onClick={() => setActiveTab('available')}
                >
                  <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                  Available Jobs
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link nav-btn ${activeTab === 'applied' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applied')}
                >
                  <FontAwesomeIcon icon={faHistory} className="me-2" />
                  Applied Jobs
                </button>
              </li>
            </ul>
            <button 
              onClick={handleLogout} 
              className="btn btn-light text-dark modern-btn ms-2"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-fluid mt-4">
        {activeTab === 'available' ? <AvailableJobs /> : <AppliedJobs />}
      </main>

      {/* Inline CSS */}
      <style>{`
        /* Overall Dashboard Container */
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          padding-bottom: 2rem;
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

        /* Navigation Bar Glassmorphism Style */
        .glass-card-nav {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          margin: 1rem;
          padding: 0.5rem 1rem;
        }

        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(45deg, #007bff, #00c3ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
        }

        /* Navigation Buttons */
        .nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.6);
          font-weight: 500;
          transition: color 0.3s ease, border-bottom 0.3s ease;
        }
        .nav-btn.active {
          color: #000;
          border-bottom: 2px solid #007bff;
        }
        .nav-btn:hover {
          color: #007bff;
        }

        /* Modern Button Effects */
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

        /* Job Card */
        .job-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        .job-card .card-body {
          padding: 1.5rem;
        }
        .job-card .card-footer {
          background: transparent;
          border-top: none;
          padding: 0.75rem 1.5rem;
        }

        /* Available Jobs Grid */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* Applied Jobs Card */
        .applied-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // State to track expanded job cards (key: job_id, value: boolean)
  const [expandedCards, setExpandedCards] = useState({});

  // Helper function to truncate text to a given limit
  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const toggleDetails = (jobId) => {
    setExpandedCards(prevState => ({
      ...prevState,
      [jobId]: !prevState[jobId]
    }));
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    const accessToken = getCookie('access_token');
    
    try {
      const response = await api.get('jobs/get-jobs', { 
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setJobs(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job =>
    job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="gradient-text">Available Jobs</h2>
        <div className="input-group w-50">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search jobs..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button className="btn btn-primary" onClick={() => {
            setSearchQuery('');
            fetchJobs();
          }}>
            Reset
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && filteredJobs.length === 0 && (
        <div className="alert alert-info">No jobs available currently.</div>
      )}

      <div className="jobs-grid">
        {filteredJobs.map((job) => (
          <div className="job-card card h-100" key={job.job_id}>
            <div className="card-body">
              <h5 className="card-title">{job.job_title}</h5>
              <p className="card-text text-muted">
                {expandedCards[job.job_id]
                  ? job.job_description
                  : truncateText(job.job_description, 250)
                }
              </p>
              {/* Show toggle button if description is longer than 250 characters */}
              {job.job_description.length > 250 && (
                <button 
                  className="btn btn-link p-0 mb-3" 
                  onClick={() => toggleDetails(job.job_id)}
                >
                  {expandedCards[job.job_id] ? 'Hide Details' : 'View Details'}
                </button>
              )}
              <div className="mb-3">
                <span className="badge bg-primary me-1">{job.location}</span>
                <span className="badge bg-success me-1">{job.experience_required}</span>
                <span className="badge bg-warning">{job.status}</span>
              </div>
              <Link to={`/apply/${job.job_id}`} className="btn btn-primary w-100 modern-btn">
                Apply Now
              </Link>
            </div>
            <div className="card-footer">
              <small className="text-muted">
                Posted by {job.hr_username} • {new Date(job.date_posted).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AppliedJobs = () => {
  return (
    <div className="applied-card">
      <h5 className="gradient-text">Applied Jobs</h5>
      <p className="text-muted">Your job application history will appear here.</p>
      {/* You can later add a table or cards displaying applied jobs */}
    </div>
  );
};

export default CandidateDashboard;
