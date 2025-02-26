import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./AllImages.css"; // Create AllImages.css

const AllImages = () => {
  const location = useLocation();
  const { apiUrl, title } = location.state || {};
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (apiUrl) {
      const fetchImages = async () => {
        setLoading(true);
        try {
          const cache = await caches.open('image-cache');
          const cachedResponse = await cache.match(apiUrl);

          if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            setImages(await processImageData(cachedData, cache));
          } else {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (!response.ok) {
              throw new Error(`Error fetching data: ${response.status}`);
            }

            cache.put(apiUrl, new Response(JSON.stringify(data)));
            setImages(await processImageData(data, cache));
          }
        } catch (error) {
          console.error("Error fetching images:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchImages();
    }
  }, [apiUrl]);

  const processImageData = async (data, cache) => {
    return Promise.all(data.map(async (image) => {
      const thumbnailUrl = image.link.replace(".jpeg", "m.jpeg");
      const fullSizeUrl = image.link.replace(".xxjpeg", "h.jpeg");
      
      await cacheImage(thumbnailUrl, cache);
      
      return {
        name: image.name,
        thumbnail: thumbnailUrl,
        fullSize: fullSizeUrl,
      };
    }));
  };

  const cacheImage = async (imageUrl, cache) => {
    const cachedResponse = await cache.match(imageUrl);
    if (!cachedResponse) {
      const response = await fetch(imageUrl, { mode: 'no-cors' });
      cache.put(imageUrl, response);
    }
  };

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseFullscreen = () => {
    setSelectedImage(null);
  };

  return (
    <div className="all-images-container">
      <h2 className="wedding-section-title">{title}</h2>
      {loading && <div className="loading-spinner">Loading...</div>}
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
