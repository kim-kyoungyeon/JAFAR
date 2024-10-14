import React, { useState, useEffect } from 'react';
import axios from 'axios';

const S3ImageList = ({ userId }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const s3BucketUrl = `https://jafar-jv-s-buckett.s3.ap-northeast-2.amazonaws.com/${userId}/`;

  useEffect(() => {
    fetchImages();
  }, [userId]);

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${s3BucketUrl}?list-type=2&prefix=${userId}/`);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const keys = xmlDoc.getElementsByTagName('Key');
      const imageUrls = Array.from(keys).map(key => `${s3BucketUrl}${key.textContent}`);
      setImages(imageUrls);
    } catch (err) {
      console.error("Error fetching S3 images:", err);
      setError("Failed to load images. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading images...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="s3-image-list">
      <h3>S3 이미지 목록</h3>
      <div className="image-grid">
        {images.map((imageUrl, index) => (
          <div key={index} className="image-item">
            <img src={imageUrl} alt={`S3 image ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default S3ImageList;