import React, { useState } from "react";
import axios from "axios";

// Base URL for the file service
const BASE_URL = "http://localhost:8086/files";

/**
 * Upload a file to the backend file service.
 * @param {File} file - The file to upload.
 * @returns {Promise<{ message: string, objectUrl: string }>} - Response from the backend.
 */
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data; // Assumes response contains { message, objectUrl }
};

/**
 * Download a file from the backend file service.
 * @param {string} objectUrl - The S3 object URL for the file to download.
 * @returns {Promise<Blob>} - The file content as a Blob.
 */
export const downloadFile = async (objectUrl) => {
    const response = await axios.get(`${BASE_URL}/download`, {
        params: { objectUrl }, // Pass the objectUrl as a query parameter
        responseType: "blob", // Receive the file as a blob
    });

    return {
        blob: response.data, // Blob content
        fileName: response.headers["content-disposition"]
            ?.split("filename=")?.[1]?.replace(/"/g, "") || "downloaded-file", // Extract filename from Content-Disposition header
    };
};

/**
 * React component for testing the file service.
 */
export const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");

    // Handle file input
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle file upload
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }

        try {
            const response = await uploadFile(file);
            setMessage(response.message);
            setDownloadUrl(response.objectUrl);
        } catch (error) {
            setMessage("Error uploading file. Please try again.");
            console.error("Upload Error:", error);
        }
    };

    // Handle file download
    const handleDownload = async () => {
        if (!downloadUrl) {
            setMessage("No file to download.");
            return;
        }

        try {
            const { blob, fileName } = await downloadFile(downloadUrl);

            // Create a URL for the blob and download the file
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName); // Use the extracted file name
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setMessage("Error downloading file. Please try again.");
            console.error("Download Error:", error);
        }
    };

    return (
        <div style={{padding: "20px", maxWidth: "400px", margin: "auto"}}>
            <h2>File Service Tester</h2>
            <form onSubmit={handleUpload}>
                <div>
                    <label htmlFor="fileInput">Select File:</label>
                    <input
                        id="fileInput"
                        type="file"
                        onChange={handleFileChange}
                        style={{display: "block", marginBottom: "10px"}}
                    />
                </div>
                <button type="submit" style={{marginBottom: "10px"}}>
                    Upload
                </button>
            </form>
            <p>{downloadUrl}</p>
            <div>
                <label htmlFor="downloadInput">Download URL:</label>
                <input
                    id="downloadInput"
                    type="text"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    style={{display: "block", marginBottom: "10px", width: "100%"}}
                />
                <button onClick={handleDownload} style={{marginBottom: "10px"}}>
                    Download File
                </button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};