import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBriefcase, faHistory } from '@fortawesome/free-solid-svg-icons';
import api from './axiosInstance';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const HRJobPost = () => {
  const [jobData, setJobData] = useState({
    job_title: '',
    job_description: '',
    skills_required: '',
    location: '',
    experience_required: '',
    salary_range: '',
  });
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
    } else {
      setCurrentUser(user);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in jobData) {
      if (jobData[key].trim() === '') {
        setMessage({ type: 'error', text: 'Please fill out all fields.' });
        return;
      }
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    const accessToken = getCookie('access_token');
    if (!accessToken) {
      setMessage({ type: 'error', text: 'You are not authenticated.' });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        'jobs/post-job',
        {
          ...jobData,
          skills_required: jobData.skills_required.split(',').map(skill => skill.trim()),
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setJobs((prevJobs) => [response.data, ...prevJobs]);
      setJobData({
        job_title: '',
        job_description: '',
        skills_required: '',
        location: '',
        experience_required: '',
        salary_range: '',
      });

      setMessage({ type: 'success', text: 'Job posted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to post job. Please try again.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div
      className="hr-jobpost-container"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "2rem 0",
      }}
    >
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      {/* Animated Background Elements */}
      <div className="bg-circle bg-circle-primary"></div>
      <div className="bg-circle bg-circle-success"></div>

      <div className="container py-5">
        {/* Job Post Management Card (Layout & Color preserved) */}
        <div className="gradient-header p-4 mb-5">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 fw-bold mb-1">
                <i className="fas fa-briefcase me-2"></i>Job Post Management
              </h1>
              <p className="mb-0 opacity-75">Welcome to your recruitment dashboard</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              {currentUser && (
                <div className="user-card d-flex align-items-center p-2">
                  <i className="fas fa-user-circle fs-4 me-2"></i>
                  <div>
                    <div className="fw-bold">{currentUser.username}</div>
                    <small className="opacity-75">{currentUser.email}</small>
                  </div>
                </div>
              )}
              <a href="/hrjobs" className="nav-pill bg-white text-dark text-decoration-none">
                <i className="fas fa-history me-2"></i>View Previous Posts
              </a>
              <button onClick={handleLogout} className="btn btn-light text-dark ms-2 nav-pill">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Job Posting Form */}
        <div className="glass-card form-card p-4 mb-5" style={{ background: "linear-gradient(145deg, #ffffff, #f8f9fa)" }}>
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">
                    <i className="fas fa-heading me-2"></i>Job Title
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2"
                    name="job_title"
                    value={jobData.job_title}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">
                    <i className="fas fa-map-marker-alt me-2"></i>Location
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">
                    <i className="fas fa-money-bill-wave me-2"></i>Salary Range
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2"
                    name="salary_range"
                    value={jobData.salary_range}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Right Column */}
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">
                    <i className="fas fa-tools me-2"></i>Required Skills
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2"
                    name="skills_required"
                    value={jobData.skills_required}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">
                    <i className="fas fa-chart-line me-2"></i>Experience
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2"
                    name="experience_required"
                    value={jobData.experience_required}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Full Width */}
              <div className="col-12">
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">
                    <i className="fas fa-align-left me-2"></i>Job Description
                  </label>
                  <textarea
                    className="form-control form-control-lg border-2"
                    rows="5"
                    name="job_description"
                    value={jobData.job_description}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-lg btn-primary w-100" disabled={loading}>
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`alert alert-${message.type} mt-3`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Inline CSS */}
      <style>{`
        /* Outer Container */
        .hr-jobpost-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 2rem 0;
          position: relative;
          overflow: hidden;
        }
        /* Container */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        /* Animated Background Circles */
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
        /* Glassmorphism Cards */
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
        }
        /* Header Card (Preserved Layout/Color) */
        .gradient-header {
          background: linear-gradient(45deg, #2c3e50, #3498db);
          color: white;
          border-radius: 15px;
          padding: 1rem 1.5rem;
        }
        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(45deg, #007bff, #00c3ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
        }
        /* User Card */
        .user-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          backdrop-filter: blur(5px);
          padding: 5px 10px;
        }
        /* Nav Pill */
        .nav-pill {
          border-radius: 50px;
          padding: 8px 20px;
          transition: all 0.3s ease;
        }
        .nav-pill:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default HRJobPost;
