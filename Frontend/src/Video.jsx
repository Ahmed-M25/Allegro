import React, { useState } from 'react';
import axios from 'axios';
import './VideoUpload.css';

function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // Store the URL of the processed video

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload_video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      const { file_path } = response.data;
      setUploadMessage("File uploaded and processed successfully!");
      setVideoUrl(`../../backend/uploads/${file_path.split('/').pop()}`); 
    } catch (error) {
      if (error.response) {
        setUploadMessage(`Error uploading file: ${error.response.status} - ${error.response.data.error}`);
      } else if (error.request) {
        setUploadMessage("No response from server.");
      } else {
        setUploadMessage("Error: " + error.message);
      }
    }
  };

  return (
    <div class="uploadArea">
      <h2>Upload Video</h2>
      <form onSubmit={handleFileUpload}>
        <label htmlFor="file-upload" className="custom-file-upload" style={
          {
            marginTop: '10px',
            marginRight: '5px',
            padding: '8px 16px',
            color: 'white',
            background: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }>
        Upload File
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} accept=".mp4" style={
          {display:'none'}
          } />
        <button type="submit" style={
          {
            marginTop: '10px',
            marginLeft: '5px',
            padding: '8px 16px',
            color: 'white',
            background: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }>Submit</button>
      </form>
      {uploadMessage && <p>{uploadMessage}</p>}

      {videoUrl && (
        <div>
          <h3>Processed Video</h3>
          <video controls width="600">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default VideoUpload;
