import React, { useEffect, useState } from "react";
import { displayFile } from "../services/downloadFile";
import './imagedisplay.css';
export const ImageDisplay = ({ profileImgUrl }) => {
    const [imageSrc, setImageSrc] = useState(null); // Blob URL for the image
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch and display the profile image
    useEffect(() => {
        const fetchImage = async () => {
            if (!profileImgUrl) {
                setErrorMessage("No profile image URL provided.");
                return;
            }

            try {
                const blobUrl = await displayFile(profileImgUrl);
                setImageSrc(blobUrl); // Set the Blob URL to display the image
                setErrorMessage("");
            } catch (error) {
                setErrorMessage("Failed to fetch the image. Please try again.");
                console.error("Image Fetch Error:", error);
            }
        };

        fetchImage();
    }, [profileImgUrl]);

    return (
        <div  className='imgcontainer' style={{ padding: "10px", maxWidth: "120px" }}>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {imageSrc && (
                <div style={{ marginTop: "20px" }}>
                    <img src={imageSrc} alt="Profile" style={{ maxWidth: "100%" }} />
                </div>
            )}
        </div>
    );
};