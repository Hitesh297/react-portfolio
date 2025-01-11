import React from "react";
//import './App.css';
import AOS from "aos";
//import 'aos/dist/aos.css';
import "./WeddingApp.css";
import GooglePhotoGallery from "./components/GooglePhotoGallery";
import GoogleMap from "./components/GoogleMap";

const Header = () => (
  <header className="wedding-header">
    <div></div>
    <div className="wedding-header-content">
      <h1 className="wedding-names" data-aos="fade-up">
        Hitesh & Shikha
      </h1>
      <p className="wedding-date" data-aos="fade-up" data-aos-delay="200">
        January 26, 2025
      </p>
      <p data-aos="fade-up" data-aos-delay="400">
        Request the pleasure of your company to celebrate their wedding
      </p>
    </div>
  </header>
);

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
        title="Haldi Ceremony (Groom)"
        time="January 24, 2025 | 10:00 AM"
        description="Begin our celebration with the traditional application of haldi"
        animation="fade-right"
      />
      <Event
        title="Haldi Ceremony (Bride & Groom)"
        time="January 25, 2025 | 11:00 AM"
        description="Begin our celebration with the traditional application of haldi"
        animation="fade-right"
      />

      <Event
        title="Grah Satak (Groom)"
        time="January 25, 2025 | 3:00 PM"
        description="Pre-wedding ritual to remove all the obstacles and bring happiness and prosperity into the lives of the couple"
        animation="fade-left"
      />

      <Event
        title="Sangeet Night"
        time="January 25, 2025 | 7:00 PM"
        description="Join us for an evening of music, dance, and celebration"
        animation="fade-left"
      />

      <Event
        title="Grah Satak (Bride)"
        time="January 26, 2025 | 10:30 AM"
        description="Pre-wedding ritual to remove all the obstacles and bring happiness and prosperity into the lives of the couple"
        animation="fade-left"
      />

      <Event
        title="Wedding Ceremony"
        time="January 26, 2025"
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
      <h3>Radhe Farm</h3>
      <p>Mogar, Gujarat 396445</p>
      <p>India</p>
    </div>
    <GoogleMap />
  </section>
);

const imgarray = [
  "https://drive.google.com/u/0/drive-viewer/AKGpihb5Fc86gQYe5EitBPKAL6lFUefheMfTjyGXUVRGLLYE7cD1uwD3MRvSYLiWpG8c_X-ccEdkz0QAvM5ifz-K0q-dbEnQHrm2VDU=s1600-rw-v1",
  "https://lh3.googleusercontent.com/pw/AP1GczOwftfOazIYw9p4ruHvxrm2Nh5_4EiVNKIHOHsb1PPHTbiwq42ilCay-nbqL4Z4zn95eGnwzmoasRBoEdj0HhNOLmr31MYeYD_1JUfbTlW1mX2b9owg=w2400",
];
const Gallery = () => (
  <section className="section">
    <h2 className="section-title">Our Story</h2>
    <div className="gallery">
      {imgarray.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`Couple photo ${idx + 1}`}
          className="gallery-img"
          data-aos="fade-up"
          data-aos-delay={`${idx * 100}`}
        />
      ))}
    </div>
  </section>
);

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
      <EventsSection />

      {/* <Gallery /> */}
      <GooglePhotoGallery />
      <VenueSection />
    </div>
  );
};

export default WeddingApp;
