import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ImageCarousel.css";

const ImageCarousel = ({ apiUrl, title }) => {
  const [images, setImages] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullSizeRefs = useRef([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Load only first 3 images initially, rest lazy load
        const processedImages = data.map((image, index) => ({
          name: image.name,
          thumbnail: getThumbnailUrl(image.url),
          fullSize: getFullSizeUrl(image.url),
          loaded: index < 3, // Load only first 3 images initially
        }));

        setImages(processedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [apiUrl]);

  // Lazy load full images when they come into view
  useEffect(() => {
    if (!isFullScreen) return; // Prevent unnecessary observation in normal mode

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute("data-index");
            setImages((prev) =>
              prev.map((img, i) =>
                i === Number(index) ? { ...img, loaded: true } : img
              )
            );
          }
        });
      },
      { rootMargin: "100px" }
    );

    fullSizeRefs.current.forEach((img) => img && observer.observe(img));

    return () => {
      fullSizeRefs.current.forEach((img) => img && observer.unobserve(img));
      observer.disconnect();
    };
  }, [isFullScreen, images]);

  // Helper functions
  const getThumbnailUrl = (url) => url.replace(".jpeg", "h.jpeg");
  const getFullSizeUrl = (url) => url.replace(".jpeg", "h.jpeg");

  // Open full-screen mode
  const openFullScreen = (index) => {
    setCurrentIndex(index);
    setIsFullScreen(true);
  };

  // Close full-screen mode
  const closeFullScreen = (e) => {
    e.stopPropagation();
    setIsFullScreen(false);
  };

  return (
    <section className="gallery-section">
      <h2 className="wedding-section-title">{title}</h2>
      <div className="carousel-container">
        {/* Main Swiper Carousel */}
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
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

        {/* Full-Screen Swiper (Only Visible When isFullScreen is True) */}
        {isFullScreen && (
          <div className="fullscreen-overlay">
            <button className="close-button" onClick={closeFullScreen}>✖</button>
            <Swiper
              initialSlide={currentIndex}
              navigation
              pagination={{ clickable: true }}
              modules={[Pagination, Navigation]}
              className="fullscreen-swiper"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} className="fullscreen-slide">
                  <img
                    ref={(el) => (fullSizeRefs.current[index] = el)}
                    data-index={index}
                    src={image.loaded ? image.fullSize : image.thumbnail}
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
