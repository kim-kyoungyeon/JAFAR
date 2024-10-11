import React, { useEffect } from 'react';

const OAuthCallback = () => {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      // Save the token in a cookie
      document.cookie = `auth_token=${token}; path=/; domain=43.203.233.134; secure; samesite=strict`;
      
      // Close this window and notify the opener
      if (window.opener) {
        window.opener.postMessage({ type: 'AUTH_SUCCESS', token }, 'http://43.203.233.134:3000');
        window.close();
      } else {
        // If opened directly (not as a popup), redirect to the main page
        window.location.href = 'http://43.203.233.134:3000';
      }
    } else {
      console.error('No token received in the OAuth callback');
      // Handle error (e.g., show an error message or redirect to login page)
    }
  }, []);

  return <div>Processing login...</div>;
};

export default OAuthCallback;