import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ImageCarousel.css"; // Import CSS for styling


const ImageCarousel = ({ albumId }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const fullSizeRefs = useRef([]);
  const CLIENT_ID = "9adfe3683a98b6a";
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`https://api.imgur.com/3/album/${albumId}/images`, {
          headers: {
            Authorization: `Client-ID ${CLIENT_ID}`,
          },
        });
        //const response = await fetch(apiUrl);
        const {data} = await response.json();

        if(!response.ok) { 
          throw new Error("Error fetching images: Response Code", response.status);
        }
        // Cache only thumbnails
        const processedImages = 
          data.map(async (image) => ({
            name: image.title ,
            thumbnail: await cacheThumbnail(getThumbnailUrl(image.link), image.title),
            fullSize: image.link, // Load full-size dynamically
            loaded: false, // Track whether full image is loaded
          }));
        

        setImages(processedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [albumId]);

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

    return () => fullSizeRefs.current.forEach((img) => img && observer.unobserve(img));
  }, [isFullScreen]);

  // Generate lower resolution thumbnail URL
  const getThumbnailUrl = (url) => url.replace(".jpg", "m.jpg");

  // Function to cache only thumbnail images
  const cacheThumbnail = async (url, cacheKey) => {
    console.log('caching');
    const cachedBlob = localStorage.getItem(cacheKey);
    if (cachedBlob) return cachedBlob; // Return cached thumbnail

    try {
      console.log('getting image for caching');
      const response = await fetch(url);
      if(!response.ok) {
        console.log('Error occured while getting image');
        throw new Error(response.status);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob); // Convert blob to a local URL
      localStorage.setItem(cacheKey, blobUrl); // Store in localStorage
      return blobUrl;
    } catch (error) {
      console.error("Error caching thumbnail:", error);
      return url; // Fallback to original URL
    }
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
