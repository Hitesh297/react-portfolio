import React, { useState, useRef, useEffect } from "react";
//import './App.css';
import AOS from "aos";
//import 'aos/dist/aos.css';
import "./WeddingApp.css";
import GooglePhotoGallery from "./components/GooglePhotoGallery";
import GoogleMap from "./components/GoogleMap";
import ScrollAnimation from "./components/ScrollAnimation";
import CountDownTimer from "./components/CountDownTimer";
import YoutubeVideo from "./components/YoutubeVideo";

function Header() {
  const [isLoading, setIsLoading] = useState(true);
  //const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    //video.addEventListener("loadeddata", () => setIsPlaying(true));
    video.addEventListener("canplay", () => setIsLoading(false));
  }, []);

  return (
    <header className="wedding-header">
      {/* {isLoading && <img src="/images/0F9A1035.jpg" alt="Video Placeholder" />} */}

      <div
        className="video-container"
        style={{ display: isLoading ? "hidden" : "block" }}
      >
        <video
          controls
          autoPlay
          loop
          muted
          playsInline
          ref={videoRef}
          // poster="/images/0F9A1035.jpg"
          preload="auto"
        >
          <source src="/videos/test.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="wedding-header-content">
        <h1 className="wedding-names" data-aos="fade-up">
          Hitesh weds Shikha
        </h1>
        <p className="wedding-date" data-aos="fade-up" data-aos-delay="200">
          February 15, 2025
        </p>
        <p className="wedding-message" data-aos="fade-up" data-aos-delay="400">
          Request the pleasure of your company to celebrate our wedding
        </p>
      </div>
    </header>
  );
}

const Event = ({ title, time, description, animation }) => (
  <div className="wedding-event" data-aos={animation}>
    <h3>{title}</h3>
    <p>{time}</p>
    <p>{description}</p>
  </div>
);

const EventsSection = () => (
  <section className="wedding-event-section">
    <h2 className="wedding-section-title">Wedding Events</h2>
    <div className="timeline">
      <Event
        title="Haldi Ceremony"
        time="February 13, 2025 | 9:00 AM"
        description="Begin our celebration with the traditional application of haldi"
        animation="fade-right"
      />

      <Event
        title="Grah Satak"
        time="February 14, 2025 | 3:00 PM"
        description="Pre-wedding ritual to remove all the obstacles and bring happiness and prosperity into the lives of the couple"
        animation="fade-left"
      />

      <Event
        title="DJ Night"
        time="February 14, 2025 | 9:00 PM"
        description="Join us for an evening of music, dance, and celebration"
        animation="fade-left"
      />

      <Event
        title="Wedding Ceremony (Hast Melap)"
        time="February 15, 2025 : 8:00 PM"
        description="The auspicious wedding ceremony followed by lunch"
        animation="fade-right"
      />
    </div>
  </section>
);

const VenueSection = () => (
  <section className="wedding-venue">
    <h2 className="wedding-section-title" style={{ color: "white" }}>
      Venue
    </h2>
    <div data-aos="zoom-in">
      <h3>51 Eru Garden Society</h3>
      <p>Eru Char Rasta, Navsari</p>
      <p>Gujarat, IN</p>
    </div>
    <GoogleMap />
  </section>
);

// const imgarray = [
//   "https://drive.google.com/u/0/drive-viewer/AKGpihb5Fc86gQYe5EitBPKAL6lFUefheMfTjyGXUVRGLLYE7cD1uwD3MRvSYLiWpG8c_X-ccEdkz0QAvM5ifz-K0q-dbEnQHrm2VDU=s1600-rw-v1",
//   "https://lh3.googleusercontent.com/pw/AP1GczOwftfOazIYw9p4ruHvxrm2Nh5_4EiVNKIHOHsb1PPHTbiwq42ilCay-nbqL4Z4zn95eGnwzmoasRBoEdj0HhNOLmr31MYeYD_1JUfbTlW1mX2b9owg=w2400",
// ];
// const Gallery = () => (
//   <section className="section">
//     <h2 className="section-title">Our Story</h2>
//     <div className="gallery">
//       {imgarray.map((url, idx) => (
//         <img
//           key={idx}
//           src={url}
//           alt={`Couple photo ${idx + 1}`}
//           className="gallery-img"
//           data-aos="fade-up"
//           data-aos-delay={`${idx * 100}`}
//         />
//       ))}
//     </div>
//   </section>
// );

const WeddingApp = () => {
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", "wedding");
    console.log("theme set to wedding");
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div>
      <Header />
      <CountDownTimer />
      <EventsSection />
      <YoutubeVideo title="Pre Wedding Teaser" videoUrl="https://www.youtube.com/embed/qW1LvHpj3RU?si=lvEpnpbk4bKhH3lw" />
      <YoutubeVideo title="Pre Wedding Movie" videoUrl="https://www.youtube.com/embed/IJC3tqQtIPY?si=6fQukObxqhrg_V6O" />
      <ScrollAnimation
        brideImage="/images/bride.png"
        groomImage="/images/groom.png"
      />
      {/* <Gallery /> */}
      <GooglePhotoGallery />
      <VenueSection />
    </div>
  );
};

export default WeddingApp;
