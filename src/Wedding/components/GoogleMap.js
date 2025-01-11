import React from "react";
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
    <div style={mapContainerStyle}>
      <iframe
        title="Radhe Farm Navsari Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.9689836632033!2d72.92961257471131!3d20.913567491726113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0f70039e8324f%3A0x33cbc093f8f12f03!2sRadhe%20Farm%20Navsari!5e0!3m2!1sen!2sin!4v1736593811605!5m2!1sen!2sin"
        style={iframeStyle}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};
export default GoogleMap;
