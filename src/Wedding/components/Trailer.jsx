import "./Trailer.css";

const Trailer = () => (
    <section className="wedding-trailer-section">
      <h2 className="wedding-section-title">Wedding Trailer</h2>
      <div className="video-wrapper">
          <iframe 
            src="https://www.youtube.com/embed/ikWi2dDbcEc?si=bBU7NxTgp8a-c8ET" 
            title="YouTube video player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          />
        </div>
    </section>
  );

  export default Trailer;