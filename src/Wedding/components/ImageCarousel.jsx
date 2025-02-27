import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Zoom } from "swiper/modules";
import { openDB } from 'idb';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ImageCarousel.css";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Add a global error handler for debugging on iOS Safari
window.onerror = function(message, source, lineno, colno, error) {
  // Store error in localStorage for later retrieval
  const errorLog = localStorage.getItem('safariErrors') || '';
  localStorage.setItem('safariErrors', 
    `${errorLog}\n${new Date().toISOString()}: ${message} at ${source}:${lineno}:${colno}` + 
    (error && error.stack ? `\nStack: ${error.stack}` : ''));
  console.error("Caught error:", message, error);
  return true; // Prevents default error handling
};

const ImageCarousel = ({ apiUrl, title }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useIndexedDB, setUseIndexedDB] = useState(true);
  const [retryCount, setRetryCount] = useState({});
  
  const fullSizeRefs = useRef([]);
  const isMounted = useRef(true);
  const dbRef = useRef(null);
  const blobUrls = useRef(new Map()); // Track created object URLs
  const navigate = useNavigate();

  // Create a placeholder image - transparent 1x1 pixel
  const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const ERROR_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PGxpbmUgeDE9IjEyIiB5MT0iOCIgeDI9IjEyIiB5Mj0iMTIiPjwvbGluZT48bGluZSB4MT0iMTIiIHkxPSIxNiIgeDI9IjEyLjAxIiB5Mj0iMTYiPjwvbGluZT48L3N2Zz4=';

  // Check if IndexedDB is available (especially for Safari private browsing)
  const checkIndexedDBAvailability = () => {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('test');
        request.onerror = () => resolve(false);
        request.onsuccess = () => {
          request.result.close();
          resolve(true);
        };
      } catch (e) {
        resolve(false);
      }
    });
  };

  useEffect(() => {
    // Cleanup function to mark component as unmounted
    return () => {
      isMounted.current = false;
      
      // Revoke all blob URLs when component unmounts
      blobUrls.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
      blobUrls.current.clear();
    };
  }, []);

  useEffect(() => {
    const setup = async () => {
      const isIndexedDBAvailable = await checkIndexedDBAvailability();
      if (!isIndexedDBAvailable) {
        console.log("IndexedDB unavailable, using fallback mode");
        setUseIndexedDB(false);
      }
      fetchImages();
    };
    
    setup();
  }, [apiUrl]);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Error occurred while fetching data from ${apiUrl}. Response code: ${response.status}`);
      }

      const data = await response.json();
      
      const initialImages = data.map((image) => ({
        name: image.name,
        thumbnail: getThumbnailUrl(image.link),
        fullSize: getFullSizeUrl(image.link),
        thumbnailLoaded: false,
        fullSizeLoaded: false,
        hasError: false,
        isSameImage: getThumbnailUrl(image.link) === getFullSizeUrl(image.link),
      }));

      if (isMounted.current) {
        setImages(initialImages);
      }

      // Prioritize loading first visible images
      const priorityCount = 5; // First 5 images with priority
      
      // Load priority images first (parallel)
      const priorityImagePromises = initialImages.slice(0, priorityCount).map((image, index) => 
        loadImage(image, index)
      );
      await Promise.all(priorityImagePromises);

      // Load remaining images in batches of 3
      const batchSize = 3;
      const remainingImages = initialImages.slice(priorityCount);
      
      for (let i = 0; i < remainingImages.length; i += batchSize) {
        if (!isMounted.current) break; // Stop if component unmounted
        
        const batch = remainingImages.slice(i, i + batchSize);
        const batchPromises = batch.map((image, batchIndex) => 
          loadImage(image, priorityCount + i + batchIndex)
        );
        await Promise.all(batchPromises);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      localStorage.setItem('imageCarouselError', error.toString());
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Helper function to load an individual image
  const loadImage = async (image, index) => {
    try {
      // Load and cache thumbnail first
      let thumbnailUrl = useIndexedDB 
        ? await getImageFromIndexedDB(`thumb_${image.name}`)
        : null;
        
      if (!thumbnailUrl) {
        thumbnailUrl = await cacheImage(image.thumbnail, `thumb_${image.name}`);
      }

      if (isMounted.current) {
        setImages((prev) =>
          prev.map((img, i) =>
            i === index ? { ...img, thumbnail: thumbnailUrl, thumbnailLoaded: true } : img
          )
        );
      }

      // Load full-size image after thumbnail
      let fullSizeUrl = useIndexedDB 
        ? await getImageFromIndexedDB(`full_${image.name}`)
        : null;
        
      if (!fullSizeUrl) {
        fullSizeUrl = await cacheImage(image.fullSize, `full_${image.name}`);
      }

      if (isMounted.current) {
        setImages((prev) =>
          prev.map((img, i) =>
            i === index ? { ...img, fullSize: fullSizeUrl, fullSizeLoaded: true } : img
          )
        );
      }
    } catch (err) {
      console.error(`Error loading image at index ${index}:`, err);
      if (isMounted.current) {
        setImages((prev) =>
          prev.map((img, i) =>
            i === index ? { ...img, hasError: true } : img
          )
        );
      }
    }
  };

  useEffect(() => {
    if (!isFullScreen) return;

    const safeRefs = fullSizeRefs.current?.filter(ref => ref !== null && ref !== undefined) || [];
    
    if (safeRefs.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target) {
          try {
            const index = entry.target.getAttribute("data-index");
            if (index !== null && index !== undefined) {
              if (isMounted.current) {
                setImages((prev) =>
                  prev.map((img, i) => (i === Number(index) ? { ...img, fullSizeLoaded: true } : img))
                );
              }
            }
          } catch (err) {
            console.error("IntersectionObserver error:", err);
          }
        }
      });
    }, { rootMargin: "100px" }); // Increased margin for better prefetching

    safeRefs.forEach((img) => {
      try {
        if (img) observer.observe(img);
      } catch (err) {
        console.error("Error observing image:", err);
      }
    });

    return () => {
      safeRefs.forEach((img) => {
        try {
          if (img) observer.unobserve(img);
        } catch (err) {
          console.error("Error unobserving image:", err);
        }
      });
      observer.disconnect();
    };
  }, [isFullScreen, images]);

  const getThumbnailUrl = (url) => {
    if (!url) return PLACEHOLDER_IMAGE;
    // More robust handling with regex
    return url.replace(/\.jpeg$/i, "h.jpeg");
  };
  
  const getFullSizeUrl = (url) => {
    if (!url) return PLACEHOLDER_IMAGE;
    return url.replace(/\.xxjpeg$/i, "h.jpeg");
  };

  const initDB = async () => {
    if (!useIndexedDB) return null;
    if (dbRef.current) return dbRef.current;
    
    try {
      const db = await openDB('ImageCache', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images');
          }
        },
      });
      dbRef.current = db;
      return db;
    } catch (err) {
      console.error("IndexedDB initialization error:", err);
      setUseIndexedDB(false);
      return null;
    }
  };

  const cacheImage = async (url, cacheKey) => {
    try {
      // For non-IndexedDB mode, just return the URL
      if (!useIndexedDB) return url;
      
      // Try to get from cache first
      const cachedImage = await getImageFromIndexedDB(cacheKey);
      if (cachedImage) return cachedImage;

      const maxRetries = 2;
      const currentRetries = retryCount[cacheKey] || 0;
      
      if (currentRetries >= maxRetries) {
        return cacheKey.startsWith('thumb_') ? ERROR_IMAGE : 
          (await getImageFromIndexedDB(`thumb_${cacheKey.replace('full_', '')}`)) || ERROR_IMAGE;
      }
      
      // Try to store in IndexedDB
      try {
        await storeImageInIndexedDB(url, cacheKey);
        const newCachedImage = await getImageFromIndexedDB(cacheKey);
        return newCachedImage || url;
      } catch (err) {
        if (isMounted.current) {
          setRetryCount(prev => ({
            ...prev,
            [cacheKey]: currentRetries + 1
          }));
        }
        
        console.error("Cache image error:", err);
        
        // For thumbnails, return error image; for full-size, try to use thumbnail as fallback
        if (cacheKey.startsWith('thumb_')) {
          return ERROR_IMAGE;
        } else {
          const thumbKey = `thumb_${cacheKey.replace('full_', '')}`;
          const thumbUrl = await getImageFromIndexedDB(thumbKey);
          return thumbUrl || ERROR_IMAGE;
        }
      }
    } catch (err) {
      console.error("Overall cache error:", err);
      return ERROR_IMAGE;
    }
  };

  const storeImageInIndexedDB = async (imageUrl, imageName) => {
    try {
      if (!useIndexedDB) return;

      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10 second timeout
      
      const response = await fetch(imageUrl, { 
        signal: abortController.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error fetching from ${imageUrl}. Status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const db = await initDB();
      
      if (!db) return;
      
      const tx = db.transaction('images', 'readwrite');
      await tx.objectStore('images').put(blob, imageName);
      await tx.done;
    } catch (error) {
      console.error("Error caching image:", error);
      localStorage.setItem('cacheImageError', `${imageUrl}: ${error.toString()}`);
      throw error; // Re-throw for proper handling upstream
    }
  };

  const getImageFromIndexedDB = async (imageName) => {
    try {
      if (!useIndexedDB) return null;
      
      const db = await initDB();
      if (!db) return null;
      
      const tx = db.transaction('images');
      const blob = await tx.objectStore('images').get(imageName);
      await tx.done;
      
      if (!blob) return null;
      
      // Clean up old URL if it exists
      if (blobUrls.current.has(imageName)) {
        URL.revokeObjectURL(blobUrls.current.get(imageName));
      }
      
      const url = URL.createObjectURL(blob);
      blobUrls.current.set(imageName, url);
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const openFullScreen = (index) => {
    setCurrentIndex(index);
    setIsFullScreen(true);
  };

  const closeFullScreen = (e) => {
    e.stopPropagation();
    setIsFullScreen(false);
  };

  const handleViewAll = () => {
    navigate('/all-images', { state: { apiUrl, title } });
  };

  // Helper for error retry
  const handleImageRetry = (index) => {
    const image = images[index];
    if (!image) return;
    
    // Reset error state
    setImages(prev => 
      prev.map((img, i) => 
        i === index ? { ...img, hasError: false, thumbnailLoaded: false, fullSizeLoaded: false } : img
      )
    );
    
    // Reset retry count for this image
    setRetryCount(prev => {
      const newRetryCount = { ...prev };
      delete newRetryCount[`thumb_${image.name}`];
      delete newRetryCount[`full_${image.name}`];
      return newRetryCount;
    });
    
    // Try loading again
    loadImage(image, index);
  };

  return (
    <div className="gallery-wrapper">
      <section className="gallery-section">
        <div className="title-container">
          <h2 className="wedding-section-title">{title}</h2>
          <button 
            className="view-all-button-vertical" 
            onClick={handleViewAll}
            aria-label="View all images"
          >
            View All
          </button>
        </div>
        
        <div className="carousel-container">
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Loading gallery...</p>
            </div>
          )}
          
          <Swiper 
            effect="coverflow" 
            grabCursor 
            centeredSlides 
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 20
              },
              480: {
                slidesPerView: 2.5,
                spaceBetween: 30
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 40
              }
            }}
            coverflowEffect={{ 
              rotate: 0, 
              stretch: 100, 
              depth: 300, 
              modifier: 1, 
              slideShadows: true 
            }}
            pagination={{ type: 'fraction' }}
            modules={[EffectCoverflow, Pagination]}
            className="swiper-container"
          >
            {images.map((image, index) => (
              <SwiperSlide 
                key={index} 
                className="swiper-slide" 
                onClick={() => openFullScreen(index)}
              >
                {!image.thumbnailLoaded && !image.hasError && (
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                  </div>
                )}
                
                {image.hasError && (
                  <div className="error-indicator" onClick={(e) => {
                    e.stopPropagation();
                    handleImageRetry(index);
                  }}>
                    <p>Failed to load</p>
                    <button className="retry-button">Retry</button>
                  </div>
                )}
                
                <img 
                  src={image.hasError ? ERROR_IMAGE : 
                      (image.thumbnailLoaded ? image.thumbnail : PLACEHOLDER_IMAGE)} 
                  alt={image.name} 
                  className={`slide-image ${image.thumbnailLoaded ? 'loaded' : 'loading'} ${image.hasError ? 'error' : ''}`} 
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {isFullScreen && (
            <div className="fullscreen-overlay">
              <button 
                className="close-button" 
                onClick={closeFullScreen}
                aria-label="Close fullscreen view"
              >
                ✖
              </button>
              
              <Swiper 
                initialSlide={currentIndex} 
                navigation 
                pagination={{ clickable: true }}
                zoom={{
                  maxRatio: 3,
                  minRatio: 1,
                }}
                touchRatio={1.5}  // Increased touch sensitivity 
                resistance={true} // Add resistance at edges
                resistanceRatio={0.85}
                modules={[Pagination, Navigation, Zoom]} 
                className="fullscreen-swiper"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index} className="fullscreen-slide">
                    <div className="swiper-zoom-container">
                      {!image.fullSizeLoaded && !image.thumbnailLoaded && !image.hasError && (
                        <div className="fullscreen-loading-indicator">
                          <div className="spinner"></div>
                          <p>Loading high-resolution image...</p>
                        </div>
                      )}
                      
                      {image.hasError && (
                        <div className="fullscreen-error-indicator">
                          <p>Failed to load image</p>
                          <button 
                            className="retry-button" 
                            onClick={() => handleImageRetry(index)}
                          >
                            Retry
                          </button>
                        </div>
                      )}
                      
                      <img 
                        ref={(el) => (fullSizeRefs.current[index] = el)} 
                        data-index={index}
                        src={image.hasError ? ERROR_IMAGE : 
                             (image.fullSizeLoaded ? image.fullSize : 
                              (image.thumbnailLoaded ? image.thumbnail : PLACEHOLDER_IMAGE))}
                        alt={image.name} 
                        className={`fullscreen-image ${
                          image.fullSizeLoaded ? 'loaded' : 
                          (image.thumbnailLoaded ? 'thumbnail-fallback' : 'loading')
                        } ${image.hasError ? 'error' : ''}`} 
                        loading="lazy" 
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

ImageCarousel.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default ImageCarousel;