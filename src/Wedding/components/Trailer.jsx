import "./Trailer.css";

const Trailer = () => (
    <section className="wedding-trailer-section">
      <h2 className="wedding-section-title">Wedding Trailer</h2>
      <div className="video-wrapper">
          <iframe 
            src="https://www.youtube.com/embed/qW1LvHpj3RU?si=eHd8IpPMEpj8a6br" 
            title="YouTube video player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          />
        </div>
    </section>
  );

  export default Trailer;