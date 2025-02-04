import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <div className="bg-circle bg-circle-primary"></div>
      <div className="bg-circle bg-circle-success"></div>

      <div className="container-fluid min-vh-100 d-flex align-items-center">
        <div className="row justify-content-center w-100">
          <div className="col-md-8 col-lg-6">
            <div
              className="main-card p-4 p-md-5"
            >
              <h1 className="display-4 mb-4 gradient-text">
                AI-Powered Recruitment System
              </h1>

              <p className="lead text-muted text-center mb-5">
                Transform your hiring experience with intelligent candidate matching
              </p>

              <div className="row mb-5">
                <div className="col-md-4 mb-4 mb-md-0">
                  <div className="hover-effect modern-card card-primary">
                    <i className="fas fa-brain fa-2x text-primary mb-3"></i>
                    <h5>Smart Matching</h5>
                    <p className="text-muted small mb-0">
                      AI-driven candidate selection
                    </p>
                  </div>
                </div>

                <div className="col-md-4 mb-4 mb-md-0">
                  <div className="hover-effect modern-card card-success">
                    <i className="fas fa-clock fa-2x text-success mb-3"></i>
                    <h5>Fast Processing</h5>
                    <p className="text-muted small mb-0">
                      Real-time & quick analysis
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="hover-effect modern-card card-warning">
                    <i className="fas fa-shield-alt fa-2x text-warning mb-3"></i>
                    <h5>Secure Platform</h5>
                    <p className="text-muted small mb-0">
                      Enterprise-grade security level
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center py-4 modern-cta">
                <h3 className="mb-4">Start Your Journey Today</h3>
                <div className="d-flex justify-content-center gap-3">
                  <Link
                    to="/login"
                    className="btn btn-primary btn-lg px-5 rounded-pill modern-btn"
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-success btn-lg px-5 rounded-pill modern-btn"
                  >
                    <i className="fas fa-user-plus me-2"></i>Sign Up
                  </Link>
                </div>
                <p className="text-muted mt-3 mb-0 small">
                  Trusted by 5000+ companies worldwide
                </p>
              </div>
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

        /* Main card styling with glassmorphism effect */
        .main-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          z-index: 1;
          animation: fadeInUp 1s ease;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 40px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        /* Gradient text for heading */
        .gradient-text {
          background: linear-gradient(45deg, #007bff, #00c3ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
          text-align: center;
        }

        /* Modern cards for features */
        .modern-card {
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-primary {
          background: rgba(0, 123, 255, 0.1);
        }
        .card-success {
          background: rgba(40, 167, 69, 0.1);
        }
        .card-warning {
          background: rgba(255, 193, 7, 0.1);
        }
        .hover-effect:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        /* Button modern effects */
        .modern-btn {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .modern-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
        }

        /* Call-to-action section */
        .modern-cta {
          background: rgba(0, 123, 255, 0.05);
          border-radius: 15px;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
