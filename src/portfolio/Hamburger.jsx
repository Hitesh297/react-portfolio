import React from "react";

const Hamburger = () => {
  function toggleMenu() {
    var rightmenu = document.getElementById("right-menu");
    var hamburgericon = document.getElementById("hamburger-icon");
    var closeicon = document.getElementById("close-icon");
    rightmenu.classList.toggle("open");
    if (rightmenu.classList.contains("open")) {
      hamburgericon.style.display = "none";
      closeicon.style.display = "block";
    } else {
      hamburgericon.style.display = "block";
      closeicon.style.display = "none";
    }
  }

  return (
    <button id="hamburger" onClick={toggleMenu}>
      <svg
        id="hamburger-icon"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M 4 7 L 4 9 L 28 9 L 28 7 Z M 4 15 L 4 17 L 28 17 L 28 15 Z M 4 23 L 4 25 L 28 25 L 28 23 Z"></path>
      </svg>
      <svg
        id="close-icon"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M 7.21875 5.78125 L 5.78125 7.21875 L 14.5625 16 L 5.78125 24.78125 L 7.21875 26.21875 L 16 17.4375 L 24.78125 26.21875 L 26.21875 24.78125 L 17.4375 16 L 26.21875 7.21875 L 24.78125 5.78125 L 16 14.5625 Z"></path>
      </svg>
    </button>
  );
};

export default Hamburger;
