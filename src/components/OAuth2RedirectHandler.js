import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (token) {
      // Store the token in localStorage or a more secure storage
      localStorage.setItem("accessToken", token);
      // Redirect to the main page or dashboard
      navigate("/dashboard");
    } else {
      // Handle login failure
      navigate("/login", { state: { error: "Login failed" } });
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default OAuth2RedirectHandler;
