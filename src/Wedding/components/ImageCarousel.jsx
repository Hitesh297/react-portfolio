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
  const fullSizeRefs = useRef([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const processedImages = await Promise.all(
          data.map(async (image) => ({
            name: image.name,
            thumbnail: await cacheThumbnail(getThumbnailUrl(image.url), image.name),
            fullSize: getFullSizeUrl(image.url),
            loaded: false,
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = entry.target.getAttribute("data-index");
          setImages((prev) =>
            prev.map((img, i) => (i === Number(index) ? { ...img, loaded: true } : img))
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

  const getThumbnailUrl = (url) => url.replace(".jpeg", "l.jpeg");
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
    const cachedImage = await getImageFromIndexedDB(cacheKey);
    if (cachedImage) return cachedImage;

    await storeImageInIndexedDB(url, cacheKey);
    return url;
  };

  const storeImageInIndexedDB = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
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

  return (
    <section className="gallery-section">
      <h2 className="wedding-section-title">{title}</h2>
      <div className="carousel-container">
        <Swiper effect="coverflow" grabCursor centeredSlides slidesPerView="auto"
          coverflowEffect={{ rotate: 0, stretch: 100, depth: 300, modifier: 1, slideShadows: false }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
          className="swiper-container">
          {images.map((image, index) => (
            <SwiperSlide key={index} className="swiper-slide" onClick={() => openFullScreen(index)}>
              <img src={image.thumbnail} alt={image.name} className="slide-image" loading="lazy" />
            </SwiperSlide>
          ))}
        </Swiper>

        {isFullScreen && (
          <div className="fullscreen-overlay">
            <button className="close-button" onClick={closeFullScreen}>✖</button>
            <Swiper initialSlide={currentIndex} navigation pagination={{ clickable: true }}
              modules={[Pagination, Navigation]} className="fullscreen-swiper">
              {images.map((image, index) => (
                <SwiperSlide key={index} className="fullscreen-slide">
                  <img ref={(el) => (fullSizeRefs.current[index] = el)} data-index={index}
                    src={image.loaded ? image.fullSize : image.thumbnail}
                    alt={image.name} className="fullscreen-image" loading="lazy" />
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
