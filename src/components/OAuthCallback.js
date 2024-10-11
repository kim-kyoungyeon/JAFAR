import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      // Here you would typically send these to your backend
      console.log("Received OAuth code:", code);
      console.log("Received OAuth state:", state);

      // For demonstration, we'll just set a dummy token
      const dummyToken =
        "dummy_token_" + Math.random().toString(36).substr(2, 9);
      document.cookie = `auth_token=${dummyToken}; path=/; domain=43.203.233.134; secure; samesite=strict`;

      // Notify the opener or redirect
      if (window.opener) {
        window.opener.postMessage(
          { type: "AUTH_SUCCESS", token: dummyToken },
          "http://43.203.233.134:3000"
        );
        window.close();
      } else {
        // If opened directly (not as a popup), redirect to the main page
        navigate("/");
      }
    } else {
      console.error("No code or state received in the OAuth callback");
      // Handle error (e.g., show an error message or redirect to login page)
      navigate("/");
    }
  }, [location, navigate]);

  return <div>Processing login...</div>;
};

export default OAuthCallback;
