import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./AllImages.css"; // Create AllImages.css

const AllImages = () => {
  const location = useLocation();
  const { apiUrl, title } = location.state || {};
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (apiUrl) {
      const fetchImages = async () => {
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
          }
          const processedImages = data.map((image) => ({
            name: image.name,
            thumbnail: image.link.replace(".jpeg", "m.jpeg"),
            fullSize: image.link.replace(".xxjpeg", "h.jpeg"),
          }));
          
          setImages(processedImages);

        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };
      fetchImages();
    }
  }, [apiUrl]);

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseFullscreen = () => {
    setSelectedImage(null);
  };

  return (
    <div className="all-images-container">
      <h2 className="wedding-section-title">{title}</h2>
      <div className="thumbnails-grid">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.thumbnail}
            alt={image.name}
            className="thumbnail"
            onClick={() => handleThumbnailClick(image)}
          />
        ))}
      </div>
      {selectedImage && (
        <div className="fullscreen-overlay" onClick={handleCloseFullscreen}>
          <div className="fullscreen-content">
            <img src={selectedImage.fullSize} alt={selectedImage.name} className="fullscreen-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllImages;