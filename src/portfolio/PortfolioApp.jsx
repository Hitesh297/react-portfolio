import LeftPanel from "./LeftPanel";
import Main from "../components/Main";
import RightPanel from "./RightPanel";
import React from "react";
import { useLocation } from "react-router-dom";
import "./PortfolioApp.css";

const PortfolioApp = () => {
  const location = useLocation();
  // ---- Right menu toggle ----
  React.useEffect(() => {
    const rightmenu = document.getElementById("right-menu");
    const hamburgericon = document.getElementById("hamburger-icon");
    const closeicon = document.getElementById("close-icon");
    const rightmenuitems = document.querySelectorAll("#right-menu ol a");

    if (!rightmenu || !hamburgericon || !closeicon) return;

    const toggleMenu = () => {
      rightmenu.classList.toggle("open");
      const isOpen = rightmenu.classList.contains("open");
      hamburgericon.style.display = isOpen ? "none" : "block";
      closeicon.style.display = isOpen ? "block" : "none";
    };

    rightmenuitems.forEach((el) => el.addEventListener("click", toggleMenu));

    return () => {
      rightmenuitems.forEach((el) => el.removeEventListener("click", toggleMenu));
    };
  }, []);

  // ---- Scroll behavior: hide header + reveal animations ----
  React.useEffect(() => {
    let prevScrollPos = window.pageYOffset;

    const handleScroll = () => {
      // Hide navbar on scroll
      const header = document.getElementById("header");
      if (header) {
        const currentScrollPos = window.pageYOffset;
        if (prevScrollPos > currentScrollPos) {
          header.style.top = "0";
        } else {
          header.style.top = "-100px";
        }
        prevScrollPos = currentScrollPos;
      }

      // Reveal sections on scroll
      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 30;

        if (revealTop < windowHeight - revealPoint) {
          el.classList.add("activescroll");
        } else {
          el.classList.remove("activescroll");
        }
      });
    };

    // Run once on mount (important for items already in view)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // ---- Smooth scroll to hash (#section) ----
  React.useEffect(() => {
    if (!location.hash) return;

    // Wait a tick so React can render the target element (important on navigation)
    const t = setTimeout(() => {
      const element = document.querySelector(location.hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 0);

    return () => clearTimeout(t);
  }, [location.hash]);

  // ---- Optional: ping server (kept, but not called) ----
  React.useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await fetch(
          "https://localhost:7028/api/health/ping"
        );
        const data = await response.json();
        console.log("Ping success:", data);
      } catch (error) {
        console.error("Ping error:", error);
      }
    };

    // pingServer(); // uncomment if you want to call it
  }, []);

  
  return (
    <div className="App">
      {/* <Header /> */}
      <LeftPanel />
      <RightPanel />
      <Main />
    </div>
  );
};

export default PortfolioApp;
