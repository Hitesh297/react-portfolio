import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Zoom } from "swiper/modules";
import { openDB } from 'idb';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ImageCarousel.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PropTypes from 'prop-types';

const ImageCarousel = ({ apiUrl, title }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const fullSizeRefs = useRef([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`Error occured while fetching data from ${apiUrl}. Response code : ${response.status}`);
        }

        const initialImages = data.map((image) => {
          const thumbnailUrl = getThumbnailUrl(image.link);
          const fullSizeUrl = getFullSizeUrl(image.link);
          
          return {
            name: image.name,
            thumbnail: thumbnailUrl,
            fullSize: fullSizeUrl,
            thumbnailLoaded: false,
            fullSizeLoaded: false,
            // Track if URLs are the same for cache reuse
            isSameImage: thumbnailUrl === fullSizeUrl
          };
        });

        setImages(initialImages);

        // Load images progressively
        initialImages.forEach(async (image, index) => {
          // If thumbnail and fullsize are the same, we only need to cache once
          if (image.isSameImage) {
            const cachedImage = await getImageFromIndexedDB(image.name);
            if (cachedImage) {
              setImages((prev) =>
                prev.map((img, i) => (
                  i === index 
                    ? { 
                        ...img, 
                        thumbnail: cachedImage, 
                        fullSize: cachedImage,
                        thumbnailLoaded: true,
                        fullSizeLoaded: true 
                      } 
                    : img
                ))
              );
            } else {
              const cachedUrl = await cacheImage(image.thumbnail, image.name);
              setImages((prev) =>
                prev.map((img, i) => (
                  i === index 
                    ? { 
                        ...img, 
                        thumbnail: cachedUrl, 
                        fullSize: cachedUrl,
                        thumbnailLoaded: true,
                        fullSizeLoaded: true 
                      } 
                    : img
                ))
              );
            }
          } else {
            // Handle different thumbnail and fullsize URLs
            const [cachedThumbnail, cachedFullSize] = await Promise.all([
              getImageFromIndexedDB(`thumb_${image.name}`),
              getImageFromIndexedDB(`full_${image.name}`)
            ]);

            // Update thumbnail
            if (cachedThumbnail) {
              setImages((prev) =>
                prev.map((img, i) => (
                  i === index 
                    ? { ...img, thumbnail: cachedThumbnail, thumbnailLoaded: true } 
                    : img
                ))
              );
            } else {
              const thumbnailUrl = await cacheImage(image.thumbnail, `thumb_${image.name}`);
              setImages((prev) =>
                prev.map((img, i) => (
                  i === index 
                    ? { ...img, thumbnail: thumbnailUrl, thumbnailLoaded: true } 
                    : img
                ))
              );
            }

            // Update fullsize
            if (cachedFullSize) {
              setImages((prev) =>
                prev.map((img, i) => (
                  i === index 
                    ? { ...img, fullSize: cachedFullSize, fullSizeLoaded: true } 
                    : img
                ))
              );
            } else {
              const fullSizeUrl = await cacheImage(image.fullSize, `full_${image.name}`);
              setImages((prev) =>
                prev.map((img, i) => (
                  i === index 
                    ? { ...img, fullSize: fullSizeUrl, fullSizeLoaded: true } 
                    : img
                ))
              );
            }
          }
        });
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [apiUrl]);

  useEffect(() => {
    if (!isFullScreen) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = entry.target.getAttribute("data-index");
          setImages((prev) =>
            prev.map((img, i) => (i === Number(index) ? { ...img, fullSizeLoaded: true } : img))
          );
        }
      });
    }, { rootMargin: "50px" });

    fullSizeRefs.current.forEach((img) => img && observer.observe(img));

    return () => {
      fullSizeRefs.current.forEach((img) => img && observer.unobserve(img));
      observer.disconnect();
    };
  }, [isFullScreen]);

  const getThumbnailUrl = (url) => url.replace(".jpeg", "h.jpeg");
  const getFullSizeUrl = (url) => url.replace(".xxjpeg", "h.jpeg");

  const initDB = async () => {
    return await openDB('ImageCache', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images');
        }
      },
    });
  };

  const cacheImage = async (url, cacheKey) => {
    const cachedImage = await getImageFromIndexedDB(cacheKey);
    if (cachedImage) return cachedImage;

    await storeImageInIndexedDB(url, cacheKey);
    return url;
  };

  const storeImageInIndexedDB = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      if (!response.ok) {
        throw new Error(`Error occured while fetching data from ${imageUrl}. Response code : ${response.status}`);
      }
      const db = await initDB();
      const tx = db.transaction('images', 'readwrite');
      await tx.objectStore('images').put(blob, imageName);
      await tx.done;
    } catch (error) {
      console.error("Error caching image:", error);
    }
  };

  const getImageFromIndexedDB = async (imageName) => {
    try {
      const db = await initDB();
      const blob = await db.transaction('images').objectStore('images').get(imageName);
      return blob ? URL.createObjectURL(blob) : null;
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

  return (
    <div className="gallery-wrapper"> {/* Wrap the entire gallery */}
    
    <section className="gallery-section">
      
       <div className="title-container"> {/* Wrap title and button */}
      <h2 className="wedding-section-title">{title}</h2>
      <button className="view-all-button-vertical" onClick={handleViewAll}>
        View All
      </button>
        </div>
        
      <div className="carousel-container">
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
          coverflowEffect={{ rotate: 0, stretch: 100, depth: 200, modifier: 1, slideShadows: true }}
          pagination={{ type: 'fraction' }}
          modules={[EffectCoverflow, Pagination]}
          lazy="true"
          className="swiper-container"
          
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="swiper-slide" virtualIndex={index} onClick={() => openFullScreen(index)}>
              <img 
                src={image.thumbnailLoaded ? image.thumbnail : ''} 
                alt={image.name} 
                className="slide-image" 
                loading="lazy"
                
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {isFullScreen && (
          <div className="fullscreen-overlay">
            <button className="close-button" onClick={closeFullScreen}>✖</button>
            <Swiper 
              initialSlide={currentIndex} 
              navigation 
              pagination={{ clickable: true }}
              zoom={true}
              modules={[Pagination, Navigation, Zoom]} 
              className="fullscreen-swiper"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} className="fullscreen-slide">
                  <div className="swiper-zoom-container">
                    <img 
                      ref={(el) => (fullSizeRefs.current[index] = el)} 
                      data-index={index}
                      src={image.fullSizeLoaded ? image.fullSize : (image.thumbnailLoaded ? image.thumbnail : '')}
                      alt={image.name} 
                      className="fullscreen-image" 
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