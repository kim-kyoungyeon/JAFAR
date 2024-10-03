import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AIImageEditor: React.FC = () => {
  const [imageUrl, setImageUrl] = (useState < string) | (null > null);
  const [editedImageUrl, setEditedImageUrl] =
    (useState < string) | (null > null);
  const canvasRef = useRef < HTMLCanvasElement > null;
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    // Fetch image from S3 when component mounts
    fetchImageFromS3();
  }, []);

  const fetchImageFromS3 = async () => {
    try {
      const response = await axios.get("/api/get-s3-image", {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setImageUrl(imageUrl);
      loadImageToCanvas(imageUrl);
    } catch (error) {
      console.error("Error fetching image from S3:", error);
    }
  };

  const loadImageToCanvas = (url: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = url;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const saveImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editedImageBlob =
      ((await new Promise()) < Blob) |
      (null >
        ((resolve) => {
          canvas.toBlob((blob) => resolve(blob));
        }));

    if (!editedImageBlob) {
      console.error("Failed to create image blob");
      return;
    }

    // Save temporarily
    const editedImageUrl = URL.createObjectURL(editedImageBlob);
    setEditedImageUrl(editedImageUrl);

    // Save permanently to backend
    const formData = new FormData();
    formData.append("image", editedImageBlob, "edited_image.png");

    try {
      await axios.post("/api/save-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Image saved successfully");
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <div className="ai-image-editor">
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
        />
      </div>
      <div className="controls">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
        />
        <button onClick={saveImage}>Save Image</button>
      </div>
      {editedImageUrl && (
        <div className="preview">
          <h3>Edited Image Preview:</h3>
          <img src={editedImageUrl} alt="Edited" />
        </div>
      )}
    </div>
  );
};

export default AIImageEditor;
