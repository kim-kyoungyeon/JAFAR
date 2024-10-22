import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
const S3ImageRetrieval = ({ keyword, onImageSelect, recommendedImages }) => {
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    const preloadImages = async () => {
      if (!recommendedImages || recommendedImages.length === 0) return;

      const loaded = await Promise.all(
        recommendedImages.map(async (url) => {
          const img = new Image();
          img.src = `${API_URL}/api/image-proxy?url=${encodeURIComponent(url)}`;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          return url;
        })
      );
      setLoadedImages(loaded);
    };

    preloadImages();
  }, [recommendedImages]);
  if (!recommendedImages || recommendedImages.length === 0) {
    return <div>이미지를 불러오는 중입니다...</div>;
  }

  return (
    <div>
      <h3>추천 이미지</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loadedImages.map((url, index) => (
          <img
            key={index}
            src={`${API_URL}/api/image-proxy?url=${encodeURIComponent(url)}`}
            alt={`${keyword} ${index}`}
            style={{
              width: "100%",
              maxWidth: "200px",
              height: "auto",
              margin: "10px 0",
              cursor: "pointer",
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            onClick={() => onImageSelect(url)}
          />
        ))}
      </div>
    </div>
  );
};

export default S3ImageRetrieval;
