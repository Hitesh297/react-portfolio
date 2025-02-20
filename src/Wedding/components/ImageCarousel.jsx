import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { openDB } from 'idb';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ImageCarousel.css";

const ImageCarousel = ({ apiUrl, title }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fullSizeRefs = useRef([]);

  useEffect(() => {
    let isMounted = true;

    const fetchImages = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (isMounted) {
          const initialImages = data.map((image) => ({
            name: image.name,
            thumbnail: getThumbnailUrl(image.url),
            fullSize: getFullSizeUrl(image.url),
            loaded: false,
            cached: false
          }));
          setImages(initialImages);
          setIsLoading(false);

          initialImages.forEach((image, index) => {
            cacheImagesAsync(image, index);
          });
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setIsLoading(false);
      }
    };

    fetchImages();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  const cacheImagesAsync = async (image, index) => {
    try {
      const cachedThumbnail = await cacheThumbnail(image.thumbnail, `thumb_${image.name}`);
      const cachedFullSize = await cacheThumbnail(image.fullSize, `full_${image.name}`);

      setImages(prev => prev.map((img, i) => 
        i === index ? {
          ...img,
          thumbnail: cachedThumbnail || img.thumbnail,
          fullSize: cachedFullSize || img.fullSize,
          cached: true
        } : img
      ));
    } catch (error) {
      console.error("Error caching image:", error);
    }
  };

  useEffect(() => {
    if (!isFullScreen) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-index"));
          setImages((prev) =>
            prev.map((img, i) => (i === index ? { ...img, loaded: true } : img))
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
  const getFullSizeUrl = (url) => url.replace(".jpeg", "h.jpeg");

  const initDB = async () => {
    return await openDB('ImageCache', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images');
        }
      },
    });
  };

  const cacheThumbnail = async (url, cacheKey) => {
    try {
      const cachedImage = await getImageFromIndexedDB(cacheKey);
      if (cachedImage) return cachedImage;

      const response = await fetch(url);
      const blob = await response.blob();
      const db = await initDB();
      const tx = db.transaction('images', 'readwrite');
      await tx.objectStore('images').put(blob, cacheKey);
      await tx.done;
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error caching image:", error);
      return url;
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

  if (isLoading) {
    return (
      <section className="gallery-section">
        <h2 className="wedding-section-title">{title}</h2>
        <div className="carousel-container">
          <div>Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section">
      <h2 className="wedding-section-title">{title}</h2>
      <div className="carousel-container">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          spaceBetween={30}
          initialSlide={2}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
          className="swiper-container"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="swiper-slide" onClick={() => openFullScreen(index)}>
              <img 
                src={image.thumbnail} 
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
              navigation={true}
              pagination={{ clickable: true }}
              modules={[Pagination, Navigation]}
              className="fullscreen-swiper"
              slidesPerView={1}
              spaceBetween={30}
              speed={500}
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