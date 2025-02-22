import "./YoutubeVideo.css";
import PropTypes from 'prop-types';

const YoutubeVideo = ({ title, videoUrl }) => (
  <section className="wedding-trailer-section">
    <div className="title-container"> {/* Add title-container */}
      <h2 className="wedding-section-title">{title}</h2>
    </div>
    <div className="video-wrapper">
      <iframe 
        src={videoUrl} 
        title="YouTube video player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen
      />
    </div>
  </section>
);

YoutubeVideo.propTypes = {
  title: PropTypes.string.isRequired,
  videoUrl: PropTypes.string.isRequired
}

export default YoutubeVideo;