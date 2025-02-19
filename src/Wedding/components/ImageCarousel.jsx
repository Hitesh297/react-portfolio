import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ImageCarousel.css"; // Import CSS for styling


const ImageCarousel = ({ apiUrl }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const fullSizeRefs = useRef([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Fetched Data:", data);

        // Process images with caching
        const processedImages = await Promise.all(
          data.map(async (image) => ({
            name: image.name,
            thumbnail: await cacheThumbnail(getThumbnailUrl(image.url), image.name),
            //thumbnail: getThumbnailUrl(image.url),
            fullSize: getFullSizeUrl(image.url),
            loaded: false, // Track whether full image is loaded
          }))
        );

        setImages(processedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [apiUrl]);

  useEffect(() => {
    if (!isFullScreen) return;

    // Lazy load full-size images when entering fullscreen mode
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute("data-index");
            setImages((prev) =>
              prev.map((img, i) => (i === Number(index) ? { ...img, loaded: true } : img))
            );
          }
        });
      },
      { rootMargin: "50px" }
    );

    fullSizeRefs.current.forEach((img) => img && observer.observe(img));

    return () => {
      fullSizeRefs.current.forEach((img) => img && observer.unobserve(img));
      observer.disconnect();
    };
  }, [isFullScreen]);

  // Generate lower resolution thumbnail URL
  const getThumbnailUrl = (url) => { 
    return url.replace(".jpeg", "l.jpeg");
  };

  // Generate full resolution image URL
  const getFullSizeUrl = (url) => url.replace(".jpeg", "h.jpeg");

  // Function to cache only thumbnail images
  const cacheThumbnail = async (url, cacheKey) => {
    console.log("Checking cache for:", cacheKey);
    const cachedBase64 = localStorage.getItem(cacheKey);

    if (cachedBase64 && cachedBase64.startsWith("data:image")) {
      console.log("Loaded from cache:", cacheKey);
      return cachedBase64;
    }

    try {
      console.log("Fetching image for caching:", url);
      const response = await fetch(url);

      if (!response.ok) {
        console.error("Error occurred while fetching image:", response.status);
        throw new Error(response.status);
      }

      const blob = await response.blob();
      const base64 = await convertBlobToBase64(blob);

      localStorage.setItem(cacheKey, base64);
      console.log("Image cached:", cacheKey);

      return base64;
    } catch (error) {
      console.error("Error caching thumbnail:", error);
      return url;
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const openFullScreen = (index) => {
    setCurrentIndex(index);
    setIsFullScreen(true);
  };

  const closeFullScreen = (e) => {
    e.stopPropagation(); // Prevent click event from bubbling to the Swiper
    setIsFullScreen(false);
  };

  return (
    <section>
      <h2 className="wedding-section-title">Photo Gallery</h2>
    <div className="carousel-container">
      {/* Main Swiper Carousel */}
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 100,
          depth: 300,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="swiper-container"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="swiper-slide" onClick={() => openFullScreen(index)}>
            <img src={image.thumbnail} alt={image.name} className="slide-image" loading="lazy" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Full-Screen Swiper */}
      {isFullScreen && (
        <div className="fullscreen-overlay">
          <button className="close-button" onClick={closeFullScreen}>✖</button>
          <Swiper
            initialSlide={currentIndex}
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Pagination, Navigation]}
            className="fullscreen-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="fullscreen-slide">
                <img
                  ref={(el) => (fullSizeRefs.current[index] = el)}
                  data-index={index}
                  src={image.loaded ? image.fullSize : image.thumbnail} // Load full image only when visible
                  alt={image.name}
                  className="fullscreen-image"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
    </section>
  );
};

export default ImageCarousel;