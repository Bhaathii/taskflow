import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { LogOut } from 'lucide-react';

function Login({ onLoginSuccess }) {
  const [error, setError] = useState('');

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      // Decode JWT to get user info (basic decoding without verification)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const userData = JSON.parse(jsonPayload);
      
      // Store user info and token in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);
      // Store userId (use the 'sub' claim from Google JWT which is unique per user)
      localStorage.setItem('userId', userData.sub);
      
      onLoginSuccess(userData);
    } catch (err) {
      setError('Failed to process login. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleLoginError = () => {
    setError('Failed to login with Google. Please try again.');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ✓ TaskFlow
          </h1>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Manage your tasks with ease and productivity
          </p>
        </div>

        {error && (
          <div style={{
            background: '#ffe0e0',
            color: '#d32f2f',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '0.95rem'
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            text="signin"
            size="large"
            logo_alignment="center"
          />
        </div>

        <div style={{
          textAlign: 'center',
          color: '#999',
          fontSize: '0.9rem'
        }}>
          <p>Sign in with your Google account to get started</p>
        </div>

        <div style={{
          background: '#f9f9f9',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '30px',
          fontSize: '0.9rem',
          color: '#666',
          lineHeight: '1.6'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>🔒 What we do:</p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li>Create and manage your tasks securely</li>
            <li>Track your productivity in real-time</li>
            <li>Store all your data in the cloud</li>
            <li>Each user has their own private task list</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
