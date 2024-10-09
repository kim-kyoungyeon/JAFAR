import React, { useState, useEffect } from "react";
import api from "../services/api";

const S3ImageCRUD = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/pictures/list");
      setFileList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching file list:", error);
      setError("파일 목록을 불러오는 데 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("업로드할 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/pictures/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`파일이 성공적으로 업로드되었습니다. 파일명: ${response.data}`);
      fetchFileList();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("파일 업로드에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await api.get(`/pictures/download/${fileName}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("파일 다운로드에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await api.delete(`/pictures/delete/${fileName}`);
      alert("파일이 성공적으로 삭제되었습니다.");
      fetchFileList();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("파일 삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={fetchFileList}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">S3 이미지 관리</h1>
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
          업로드
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">파일 목록:</h2>
        {fileList.length === 0 ? (
          <p>파일이 없습니다.</p>
        ) : (
          <ul>
            {fileList.map((file, index) => (
              <li key={index} className="mb-2">
                {file}
                <button
                  onClick={() => handleDownload(file)}
                  className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                >
                  다운로드
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default S3ImageCRUD;