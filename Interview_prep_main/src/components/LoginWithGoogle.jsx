// src/components/LoginWithGoogle.jsx
import React from 'react';

export default function LoginWithGoogle() {
  const handleLogin = () => {
    // Redirect to your backend's Google OAuth endpoint
    window.location.href = 'http://localhost:8000/api/auth/google';
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: '10px 20px',
        backgroundColor: '#4285F4',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer'
      }}
    >
      Login with Google
    </button>
  );
}
