import React, { useEffect, useState } from "react";
import { handleMakeRequest } from '../app/RequestNavigator';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchContent = async () => {
      if (token) {
        try {
          const response = await handleMakeRequest(navigate,'/', 'GET', null, {}, true)
          setContent(response.data);
        } catch (error) {
          // If the token is invalid, navigate to login
          console.error("Error fetching main content:", error);
          navigate("/login");
        }
      } else {
        // If there is no token, navigate to login
        navigate("/login");
      }
    };

    fetchContent();
  }, [navigate]);

  return (
    <div>
      <h1>Main Page</h1>
      <p>{content}</p>
    </div>
  );
}

export default MainPage;
