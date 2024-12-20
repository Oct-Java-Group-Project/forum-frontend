import axios from "axios";

const BASE_URL = "http://localhost:8086/files";

/**
 * Download and display a file (image).
 * @param {string} objectUrl - The S3 object URL for the file to display.
 * @returns {Promise<string>} - A Blob URL to use as the `src` for displaying the file.
 */
export const displayFile = async (objectUrl) => {
    const response = await axios.get(`${BASE_URL}/download`, {
        params: { objectUrl }, // Pass the objectUrl as a query parameter
        responseType: "blob", // Receive the file as a blob
    });

    const blob = response.data;
    return window.URL.createObjectURL(blob); // Return a Blob URL for rendering
};
