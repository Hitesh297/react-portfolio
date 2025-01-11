import React from "react";

const GoogleMap = () => {
  const mapStyles = {
    mapOuter: {
      position: "relative",
      textAlign: "right",
      width: "658px",
      height: "400px",
    },
    gmapCanvas: {
      overflow: "hidden",
      background: "none !important",
      width: "658px",
      height: "400px",
    },
    gmapIframe: {
      width: "658px",
      height: "400px",
    },
  };

  return (
    <div style={mapStyles.mapOuter}>
      <div style={mapStyles.gmapCanvas}>
        <iframe
          title="Google Map"
          style={mapStyles.gmapIframe}
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src="https://maps.google.com/maps?width=658&amp;height=400&amp;hl=en&amp;q=radhe farm navsari&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        ></iframe>
        <a href="https://sprunkiplay.com/">Sprunki Game</a>
      </div>
    </div>
  );
};

export default GoogleMap;
