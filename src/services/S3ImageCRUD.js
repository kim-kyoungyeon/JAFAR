import React, { useState, useEffect } from "react";
import axios from "axios";

const S3ImageCRUD = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const baseUrl = "http://3.39.251.48:8080/api/s3";

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await axios.get(`${baseUrl}/list`);
      setFileList(response.data);
    } catch (error) {
      console.error("Error fetching file list:", error);
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
      await axios.post(`${baseUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully");
      fetchFileList();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.post(
        `${baseUrl}/download/${fileName}`,
        null,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await axios.delete(`${baseUrl}/delete/${fileName}`);
      alert("File deleted successfully");
      fetchFileList();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">S3 Image CRUD</h1>
      <div className="mb-4">
        <input type="file" onChange={handleFileChange} className="mb-2" />
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
                onClick={() => handleDownload(file)}
                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(file)}
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
