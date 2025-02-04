import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "./axiosInstance";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const JobResumes = () => {
  const { job_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobDetails = location.state || {};
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");
  const [downloadMessage, setDownloadMessage] = useState("");

  const fetchResumes = async () => {
    setLoading(true);
    setError("");
    try {
      const accessToken = getCookie("access_token");
      const response = await api.get(`resume/get-job-resumess/${job_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setResumes(response.data);
    } catch (err) {
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const viewResume = async (application_id) => {
    try {
      const accessToken = getCookie("access_token");
      const response = await api.get(`resume/download-resume/${application_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${application_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadMessage("Your resume will start downloading shortly.");
      setTimeout(() => setDownloadMessage(""), 3000);
    } catch (err) {
      alert("Failed to fetch or download the resume. Please try again.");
    }
  };

  const analyzeResume = (application_id) => {
    navigate(`/analyze-resume`, {
      state: { job_description: jobDetails.job_description || "No job description available" },
    });
  };

  useEffect(() => {
    fetchResumes();
    // eslint-disable-next-line
  }, [job_id]);

  return (
    <div className="job-resumes-container">
      {/* Animated Background Elements */}
      <div className="bg-circle bg-circle-primary"></div>
      <div className="bg-circle bg-circle-success"></div>

      <div className="container py-5">
        {loading && (
          <div className="alert alert-info">Loading resumes, please wait...</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        {downloadMessage && <div className="alert alert-success">{downloadMessage}</div>}
        
        {/* New Heading for the Page */}
        <h2 className="gradient-text text-center mb-4">Job Resumes</h2>
        
        <div className="row">
          {!loading && !error && resumes.length > 0 ? (
            resumes.map((resume) => (
              <div key={resume.application_id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="glass-card resume-card h-100">
                  <div className="card-body">
                    <h5 className="card-title gradient-text">{resume.job_title}</h5>
                    <p className="card-text">
                      <strong>Candidate:</strong> {resume.candidate_username}
                    </p>
                    <p className="card-text">
                      <strong>Resume Filename:</strong> {resume.filename}
                    </p>
                    <p className="card-text">
                      <strong>Job Description:</strong> {jobDetails.job_description.substring(0, 250) || "No job description available"}.....
                    </p>

                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-outline-primary modern-btn"
                        onClick={() => viewResume(resume.application_id)}
                      >
                        View Resume
                      </button>
                      <button
                        className="btn btn-success modern-btn"
                        onClick={() => analyzeResume(resume.application_id)}
                      >
                        Analyze Resume
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && <div className="alert alert-warning">No resumes available for this job.</div>
          )}
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        .job-resumes-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem 0;
        }
        .container {
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
        /* Glassmorphism Card */
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
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
          border-radius: 50px;
          padding: 0.5rem 1rem;
        }
        .modern-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default JobResumes;
