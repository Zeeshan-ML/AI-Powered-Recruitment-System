import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "./axiosInstance";
import {
  faMapMarkerAlt,
  faBriefcase,
  faMoneyBillWave,
  faClock,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const HRJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Helper function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handlePostNewJob = () => {
    navigate("/hr");
  };

  // Fetch jobs function
  const fetchJobs = async () => {
    const accessToken = getCookie("access_token");
    const userInfo = JSON.parse(localStorage.getItem("user"));

    console.log("Access Token:", accessToken);
    console.log("User Info:", userInfo);

    if (!accessToken || userInfo?.role !== "hr") {
      setError("Unauthorized access. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await api.get("jobs/hr-jobs", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      setJobs(response.data);
    } catch (err) {
      console.log("Error fetching jobs:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please log in.");
        navigate("/login");
      } else {
        setError("Failed to fetch jobs. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="hr-jobs-container">
      {/* Animated Background Elements */}
      <div className="bg-circle bg-circle-primary"></div>
      <div className="bg-circle bg-circle-success"></div>

      <div className="container py-5">
        {/* Header Section */}
        <div className="glass-card header-card text-center mb-5 p-5">
          <h1 className="gradient-text display-5 fw-bold">Your Posted Jobs</h1>
          <button
            className="btn btn-primary modern-btn mt-3"
            onClick={handlePostNewJob}
          >
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Post New Job
          </button>
        </div>

        {loading && (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="row g-4">
            {jobs.map((job) => (
              <div key={job.job_id} className="col-12 col-md-6 col-lg-4">
                <div className="glass-card job-card h-100">
                  <div className="card-header text-white">
                    <h5 className="card-title gradient-text">{job.job_title}</h5>
                  </div> <br />
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span
                        className={`badge rounded-pill ${
                          job.status === "Open" ? "bg-success" : "bg-danger"
                        } me-2`}
                      >
                        {job.status.toUpperCase()}
                      </span>
                      <small className="text-muted">
                        Posted: {new Date(job.date_posted).toLocaleDateString()}
                      </small>
                    </div>

                    <p className="card-text text-dark mb-4">
                      {job.job_description.substring(0, 120)}...
                    </p>

                    <div className="job-details mb-4">
                      <div className="d-flex align-items-center mb-2">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="text-primary me-2"
                        />
                        <span>{job.location}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FontAwesomeIcon
                          icon={faBriefcase}
                          className="text-primary me-2"
                        />
                        <span>{job.experience_required}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faMoneyBillWave}
                          className="text-primary me-2"
                        />
                        <span>{job.salary_range}</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                      <button
                        className="btn btn-outline-primary btn-sm modern-btn"
                        onClick={() =>
                          navigate(`/jobs/${job.job_id}`, {
                            state: { job_description: job.job_description },
                          })
                        }
                      >
                        Manage Applications →
                      </button>
                      <small className="text-muted">
                        <FontAwesomeIcon icon={faClock} className="me-1" />
                        Updated:{" "}
                        {new Date(job.updated_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inline CSS */}
      <style>{`
        .hr-jobs-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem 0;
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
        /* Glassmorphism Card */
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
        }
        /* Header Card */
        .header-card {
          padding: 40px;
        }
        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(45deg, #007bff, #00c3ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
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
        /* Card Text */
        .card-text {
          line-height: 1.6;
          min-height: 80px;
        }
        /* Job Details */
        .job-details span {
          font-weight: 500;
          color: #4a5568;
        }
        /* Button Outline Hover */
        .btn-outline-primary {
          transition: all 0.3s ease;
        }
        .btn-outline-primary:hover {
          background-color: #0d6efd;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default HRJobs;
