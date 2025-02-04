import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "./axiosInstance";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Helper function to set a cookie
  const setCookie = (name, value, maxAgeInSeconds) => {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAgeInSeconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    try {
      const response = await api.post("auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Extract response data
      const {
        access_token,
        token_type,
        role,
        name,
        username,
        email,
        phone_no,
      } = response.data;

      // Save the access token as a cookie (set expiration to 7 days)
      setCookie("access_token", access_token, 7 * 24 * 60 * 60);

      // Save the rest of the user info in localStorage
      const userInfo = { name, username, email, phone_no, role, token_type };
      localStorage.setItem("user", JSON.stringify(userInfo));

      setMessage("Welcome back! Redirecting...");
      setCredentials({ username: "", password: "" });

      // Wait a moment so the user sees the message before redirecting
      setTimeout(() => {
        if (role === "hr") {
          window.location.href = "/hr"; // Redirect HR users
        } else if (role === "candidate") {
          window.location.href = "/candidate"; // Redirect Candidate users
        } else {
          window.location.href = "/dashboard"; // Fallback redirect
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "2rem 0",
      }}
    >
      {/* Animated Background Elements */}
      <div className="bg-circle bg-circle-primary"></div>
      <div className="bg-circle bg-circle-success"></div>

      <div className="container">
        <div className="row align-items-center min-vh-100">
          {/* Info/Illustration Panel (hidden on small screens) */}
          <div className="col-md-6 d-none d-md-block">
            <div className="info-panel">
              <div className="info-overlay">
                <h2 className="info-title">Welcome to Our Platform</h2>
                <p className="info-text">
                  Experience a seamless and secure login with our AI-driven recruitment system.
                  Empower your career and join thousands of satisfied users.
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="col-md-6">
            <div className="login-card glass-card hover-lift">
              <div className="text-center mb-5">
                <h1 className="gradient-text">Welcome Back</h1>
                <p className="text-muted">Sign in to continue to your account</p>
              </div>

              {message && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label text-muted">Username</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      name="username"
                      value={credentials.username}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-2 modern-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Login
                    </>
                  )}
                </button>

                <div className="text-center mt-4">
                  <Link to="/signup" className="btn btn-link text-decoration-none">
                    Don't have an account? Create one
                  </Link>
                </div>

                <div className="text-center mt-3">
                  <Link to="/forgot-password" className="text-muted text-decoration-none small">
                    Forgot password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
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

        /* Glassmorphism card for the login form */
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
        }

        /* Gradient text for headings */
        .gradient-text {
          background: linear-gradient(45deg, #007bff, #00c3ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        /* Modern button effects */
        .modern-btn {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .modern-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
        }

        /* Input group styling */
        .input-group-text {
          background: transparent;
          border-right: none;
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #007bff;
        }

        /* Info panel for the illustration/information side */
        .info-panel {
          height: 100%;
          min-height: 400px;
          background: url('https://source.unsplash.com/600x800/?technology,office') no-repeat center center;
          background-size: cover;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .info-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 123, 255, 0.6);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20px;
          color: #fff;
        }
        .info-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .info-text {
          font-size: 1rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
