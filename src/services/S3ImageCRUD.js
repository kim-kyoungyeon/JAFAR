import React, { useState, useEffect } from "react";
import api from "../services/api";

const S3ImageCRUD = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const baseUrl = "/api/s3";

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await api.get(`${baseUrl}/list`);
      setFileList(response.data);
    } catch (error) {
      console.error("Error fetching file list:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      alert(
        `Error fetching file list: ${error.response?.data || error.message}`
      );
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post(`${baseUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", response);

      alert(`File uploaded successfully. UUID: ${response.data.uuid}`);
      fetchFileList();
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      alert(`Error uploading file: ${error.response?.data || error.message}`);
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await api.get(`${baseUrl}/download/${fileName}`, {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      if (contentType.startsWith("image/")) {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert(`Error downloading file: ${error.response?.data || error.message}`);
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await api.delete(`${baseUrl}/delete/${fileName}`);
      alert("File deleted successfully");
      fetchFileList();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert(`Error deleting file: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">S3 Image CRUD</h1>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2"
          accept="image/*"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">File List:</h2>
        <ul>
          {fileList.map((file, index) => (
            <li key={index} className="mb-2">
              {file}
              <button
                onClick={() => handleDownload(file.split("/").pop())}
                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
              >
                View/Download
              </button>
              <button
                onClick={() => handleDelete(file.split("/").pop())}
                className="bg-red-500 text-white px-2 py-1 rounded ml-2"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default S3ImageCRUD;
