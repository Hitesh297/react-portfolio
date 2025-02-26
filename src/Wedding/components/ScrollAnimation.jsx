// src/components/ScrollAnimation/ScrollAnimation.jsx
import { useEffect, useState } from "react";
import "./ScrollAnimation.css";
import PropTypes from 'prop-types';

const ScrollAnimation = ({ brideImage, groomImage }) => {
  const [bridePosition, setBridePosition] = useState(-100);
  const [groomPosition, setGroomPosition] = useState(100);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      const config = {
        startPoint: window.innerHeight - window.innerHeight * 0.8,
        meetingPoint: window.innerHeight * 2,
        endPoint: window.innerHeight * 3.5,
        exitPoint: window.innerHeight * 4,
      };

      let newBrideX, newGroomX;

      // Before entry
      if (scrollPosition < config.startPoint) {
        newBrideX = -100;
        newGroomX = 100;
      }
      // Entry animation
      else if (scrollPosition < config.meetingPoint) {
        const progress =
          (scrollPosition - config.startPoint) /
          (config.meetingPoint - config.startPoint);
        newBrideX = -100 + progress * 100;
        newGroomX = 100 - progress * 100;
      }
      // Hold position
      else if (scrollPosition < config.endPoint) {
        newBrideX = 0;
        newGroomX = 0;
      }
      // Exit animation
      else if (scrollPosition < config.exitPoint) {
        const progress =
          (scrollPosition - config.endPoint) /
          (config.exitPoint - config.endPoint);
        newBrideX = -50 - progress * 100;
        newGroomX = 50 + progress * 100;
      }
      // After exit
      else {
        newBrideX = -100;
        newGroomX = 100;
      }

      setBridePosition(newBrideX);
      setGroomPosition(newGroomX);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="animation-container">
      <img
        src={brideImage}
        alt="Bride"
        className="bride-image"
        style={{
          transform: `translateX(${bridePosition}%) translateY(-50%)`,
        }}
      />
      <img
        src={groomImage}
        alt="Groom"
        className="groom-image"
        style={{
          transform: `translateX(${groomPosition}%) translateY(-50%)`,
        }}
      />
    </div>
  );
};

ScrollAnimation.propTypes = {
  brideImage: PropTypes.string.isRequired,
  groomImage: PropTypes.string.isRequired,
};

export default ScrollAnimation;
