import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api"
    : process.env.REACT_APP_API_URL;
const S3ImageRetrieval = ({ keyword }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/images?keyword=${keyword}`
        );
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [keyword]);

  return (
    <div>
      <h2>Images for keyword: {keyword}</h2>
      {images.map((url, index) => (
        <img
          key={index}
          src={`${API_URL}/api/image-proxy?url=${encodeURIComponent(url)}`}
          alt={`${keyword} ${index}`}
          style={{ width: "200px", margin: "10px" }}
        />
      ))}
    </div>
  );
};

export default S3ImageRetrieval;
