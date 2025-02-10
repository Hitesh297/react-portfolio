
import "./GoogleMap.css";

const GoogleMap = () => {
  const mapContainerStyle = {
    position: "relative",
    paddingBottom: "56.25%", // 16:9 aspect ratio
    height: 0,
    overflow: "hidden",
  };

  const iframeStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
  };

  return (
    <div data-aos="zoom-in" style={mapContainerStyle}>
      <iframe
        title="Hitesh & Pragya Wedding Venue"
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1863.410855421798!2d72.90594747107727!3d20.91949148801854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDU1JzEwLjIiTiA3MsKwNTQnMjQuMiJF!5e0!3m2!1sen!2sin!4v1739191285167!5m2!1sen!2sin"
        style={iframeStyle}
        allowFullScreen={true}
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

    </div>
  );
};
export default GoogleMap;
