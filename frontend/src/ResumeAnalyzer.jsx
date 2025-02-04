import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import api from "./axiosInstance";

const ResumeAnalyzer = () => {
  const location = useLocation();
  const jobDescriptionFromState = location.state?.job_description || "";
  const [jobDesc, setJobDesc] = useState(jobDescriptionFromState);
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parseResponse = (text) => {
    const skillsMatch = text.match(/Matching Skills: (.*?)\n/);
    const scoreMatch = text.match(/Score: (.*?)\n/);
    const conclusionMatch = text.match(/Conclusion: (.*?)\n/);
    const reasonMatch = text.match(/Reason: (.*?)(\n|$)/);
    return {
      skills: skillsMatch ? skillsMatch[1] : "N/A",
      score: scoreMatch ? scoreMatch[1] : "0%",
      conclusion: conclusionMatch ? conclusionMatch[1] : "Not Good Fit",
      reason: reasonMatch ? reasonMatch[1] : "No reason provided",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDesc || !resume) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("job_desc", jobDesc);
    formData.append("resume", resume);

    try {
      const response = await api.post("resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(parseResponse(response.data.result));
    } catch (err) {
      setError("Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-analyzer-container">
      {/* Animated Background Elements */}
      <div className="bg-circle bg-circle-primary"></div>
      <div className="bg-circle bg-circle-success"></div>

      <div className="container">
        <div className="glass-card analyzer-card">
          <h1 className="gradient-text text-center mb-4">Resume Analyzer</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Job Description</label>
              <textarea
                className="form-control"
                rows="5"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Upload Resume (PDF)</label>
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={(e) => setResume(e.target.files[0])}
                style={{ borderRadius: "8px" }}
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary modern-btn w-100"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>

          {result && (
            <div className="mt-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title gradient-text">
                    Score: {result.score}
                  </h5>
                  <div
                    className={`badge ${
                      result.conclusion === "Good Fit"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {result.conclusion}
                  </div>
                  <p className="mt-2 text-muted">{result.reason}</p>

                  <div className="mt-3">
                    <h6>Matching Skills:</h6>
                    <p className="text-muted">{result.skills}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
        .resume-analyzer-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem 0;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
        }
        .analyzer-card {
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
          padding: 0.75rem 1.5rem;
        }
        .modern-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
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
      `}</style>
    </div>
  );
};

export default ResumeAnalyzer;
