import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import api from './axiosInstance';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone_no: '',
    role: 'candidate',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess('');
    setError('');

    try {
      const response = await api.post('auth/signup', formData);
      setSuccess('Registration successful! Redirecting...');
      setFormData({
        name: '',
        username: '',
        email: '',
        phone_no: '',
        role: 'candidate',
        password: ''
      });
      // Simulate redirect
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setSuccess('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 0'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'rgba(0, 123, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 6s infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        background: 'rgba(40, 167, 69, 0.1)',
        borderRadius: '50%',
        animation: 'float 8s infinite'
      }}></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              zIndex: 1,
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease'
            }} className="hover-lift">
              <div className="text-center mb-5">
                <h1 style={{
                  background: 'linear-gradient(45deg, #007bff, #00c3ff)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}>
                  Create an Account
                </h1>
                <p className="text-muted">Sign up to join the community</p>
              </div>

              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {success}
                </div>
              )}

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label text-muted">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="candidate">Candidate</option>
                    <option value="hr">HR</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 rounded-pill py-2"
                  disabled={isSubmitting}
                  style={{
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isSubmitting ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>
                      Sign Up
                    </>
                  )}
                </button>

                <div className="text-center mt-4">
                  <Link 
                    to="/login" 
                    className="btn btn-link text-decoration-none"
                    style={{
                      color: '#007bff',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Already have an account? Login here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .hover-lift:hover {
          transform: translateY(-5px);
        }

        .form-control:focus {
          box-shadow: none;
          border-color: #007bff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
        }

        .btn-link:hover {
          transform: translateY(-2px);
          color: #0056b3 !important;
        }
      `}</style>
    </div>
  );
};

export default SignupForm;
