import Header from "./Header";
import LeftPanel from "./LeftPanel";
import Main from "../components/Main";
import RightPanel from "./RightPanel";
import React from "react";
import './PortfolioApp.css';

const PortfolioApp = () => {
  React.useEffect(() => {
    //handle events for right menu
window.onload = function() {
  var hamburger = document.getElementById("hamburger");
  var rightmenu = document.getElementById("right-menu");
  var rightmenuitems = document.querySelectorAll("#right-menu ol a");
  var hamburgericon = document.getElementById("hamburger-icon");
  var closeicon = document.getElementById("close-icon");
  rightmenuitems.forEach((element) => {
    element.onclick = toggleMenu;
  });

  // hamburger.onclick = toggleMenu;

  function toggleMenu() {
    rightmenu.classList.toggle("open");
    if (rightmenu.classList.contains("open")) {
      hamburgericon.style.display = "none";
      closeicon.style.display = "block";
    } else {
      hamburgericon.style.display = "block";
      closeicon.style.display = "none";
    }
  }

  //hide navbar on scroll
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("header").style.top = "0";
    } else {
      document.getElementById("header").style.top = "-100px";
    }
    prevScrollpos = currentScrollPos;

    // slide and show section
    var reveals = document.querySelectorAll(".reveal");

    for (let i = 0; i < reveals.length; i++) {
      var windowheight = window.innerHeight;
      var revealtop = reveals[i].getBoundingClientRect().top;
      var revealpoint = 30;

      if (revealtop < windowheight - revealpoint) {
        reveals[i].classList.add("activescroll");
      } else {
        reveals[i].classList.remove("activescroll");
      }
    }
  };


  window.setTimeout(function() {
    var roletitle = document.getElementById("role-title");
    var options = {
      strings: ["Software Engineer", "Full Stack Developer", "Web Developer"],
      typeSpeed: 50,
      backSpeed: 20,
      backDelay: 2000,
      loop: true,
    };

    roletitle.innerText = "";
    roletitle.classList.add("auto-type");
    //var typed = new Typed(".auto-type", options);
  }, 6000);

};
    
  }, []);
    return (
      
         <div className="App">
          
      <Header />
      <LeftPanel />
      <RightPanel />
      <Main />
      

    </div>
    );
}

export default PortfolioApp;