import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./AllImages.css";

const AllImages = () => {
  const location = useLocation();
  const { apiUrl, title } = location.state || {};
  const [images, setImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (apiUrl) {
      const fetchImages = async () => {
        setLoading(true);
        try {
          const cache = await caches.open('image-cache');
          const cachedResponse = await cache.match(apiUrl);

          let imageData;
          if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            imageData = processImageUrls(cachedData);
          } else {
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error(`Error fetching data: ${response.status}`);
            }
            const data = await response.json();
            cache.put(apiUrl, new Response(JSON.stringify(data)));
            imageData = processImageUrls(data);
          }
          
          setImages(imageData);
          // Initialize loading states for each image
          const initialLoadState = {};
          imageData.forEach((img, index) => {
            initialLoadState[index] = false;
          });
          setLoadedImages(initialLoadState);
          
        } catch (error) {
          console.error("Error fetching images:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchImages();
    }
  }, [apiUrl]);

  // Process image URLs without waiting for images to load
  const processImageUrls = (data) => {
    return data.map(image => {
      const thumbnailUrl = image.link.replace(".jpeg", "m.jpeg");
      const fullSizeUrl = image.link.replace(".xxjpeg", "h.jpeg");
      
      return {
        name: image.name,
        thumbnail: thumbnailUrl,
        fullSize: fullSizeUrl,
      };
    });
  };

  // Handle individual image load completion
  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseFullscreen = () => {
    setSelectedImage(null);
  };

  // Pre-fetch full size image when thumbnail is clicked
  useEffect(() => {
    if (selectedImage) {
      const preloadImage = new Image();
      preloadImage.src = selectedImage.fullSize;
    }
  }, [selectedImage]);

  return (
    <div className="all-images-container">
      <h2 className="wedding-section-title">{title}</h2>
      {loading && images.length === 0 && <div className="loading-spinner">Loading images...</div>}
      <div className="thumbnails-grid">
        {images.map((image, index) => (
          <div key={index} className="thumbnail-container">
            {!loadedImages[index] && <div className="thumbnail-placeholder">Loading...</div>}
            <img
              src={image.thumbnail}
              alt={image.name}
              className={`thumbnail ${loadedImages[index] ? 'loaded' : 'loading'}`}
              onClick={() => handleThumbnailClick(image)}
              onLoad={() => handleImageLoad(index)}
              loading="lazy"
            />
          </div>
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