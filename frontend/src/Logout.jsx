import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faCheckCircle, faTimesCircle, faUserSlash } from "@fortawesome/free-solid-svg-icons";

// Helper function to get a cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Helper function to delete a cookie
const deleteCookie = (name) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

const Logout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    // Check if a user is logged in (via cookie or local storage)
    const accessToken = getCookie("access_token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!(accessToken || user));
  }, []);

  // Function to perform logout
  const handleLogout = () => {
    deleteCookie("access_token");
    localStorage.removeItem("user");
    setLoggedOut(true);

    // Redirect to home page after a short delay
    setTimeout(() => {
      navigate("/");
    }, 1500);
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

      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="logout-card glass-card text-center">
          {!isLoggedIn ? (
            <div>
              <FontAwesomeIcon icon={faUserSlash} className="text-danger icon mb-3" />
              <h3 className="mb-3 gradient-text">No user is logged in</h3>
              <button className="btn btn-primary modern-btn" onClick={() => navigate("/login")}>
                Go to Login
              </button>
            </div>
          ) : !confirmed && !loggedOut ? (
            <div>
              <FontAwesomeIcon icon={faQuestionCircle} className="text-warning icon mb-3" />
              <h3 className="mb-3 gradient-text">Are you sure you want to log out?</h3>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-success modern-btn"
                  onClick={() => {
                    setConfirmed(true);
                    handleLogout();
                  }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Yes, Log Out
                </button>
                <button className="btn btn-danger modern-btn" onClick={() => navigate(-1)}>
                  <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            loggedOut && (
              <div>
                <FontAwesomeIcon icon={faCheckCircle} className="text-success icon mb-3" />
                <h3 className="mb-3 gradient-text">Logged Out Successfully</h3>
                <p className="text-muted">Redirecting to home page...</p>
              </div>
            )
          )}
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
        
        /* Glassmorphism card styling */
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
        
        /* Gradient text styling for headings */
        .gradient-text {
          background: linear-gradient(45deg, #007bff, #00c3ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
        }
        
        /* Modern button effects */
        .modern-btn {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
        }
        .modern-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
        }
        
        /* Icon sizing */
        .icon {
          font-size: 3rem;
        }
      `}</style>
    </div>
  );
};

export default Logout;
