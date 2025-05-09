import React, { useEffect } from "react";
import Hamburger from "./Hamburger";
import DarkModeSwitch from "../components/DarkModeSwitch/DarkModeSwitch";
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useMemo } from "react";
import Footer from "./Footer";

function Header() {

  useEffect(() => {
    // Check if the logo animation has already played
    const hasAnimationPlayed = sessionStorage.getItem("logoAnimationPlayed");

    if (!hasAnimationPlayed) {
      // Mark animation as played
      sessionStorage.setItem("logoAnimationPlayed", "true");
    }
  }, []); // Empty dependency array to run only on mount

  // Add a class to #logo-svg based on animation state
  const logoClass = sessionStorage.getItem("logoAnimationPlayed")
    ? "no-animation"
    : "";

  return (
      <header id="header" className="header">
        <div id="loader" className={logoClass} ></div>
        <nav className="navigation">
          <a href="/" id="logo-container">
            <svg
              id="logo-svg"
              className={logoClass} // Apply no-animation class if animation has played
              xmlns="http://www.w3.org/2000/svg"
              width="75"
              height="90"
              viewBox="0 0 75 90"
            >
              <g transform="translate(5,5)">
                <path
                  d="M0,0 65,0 65,80 0,80 0,-2.5"
                  className="path loader-rectangle"
                ></path>
              </g>
              <text className={logoClass} x="13" y="67">
                H
              </text>
            </svg>
            <div id="logo-text">
              <p>Hitesh Patel</p>
              <p>Web Developer</p>
            </div>
          </a>
          <div className="nav-links">
            <ul>
            <li>
              <NavLink to="/#aboutme">About</NavLink>
            </li>
            <li>
              <NavLink to="/#skills">Skills</NavLink>
            </li>
            <li>
              <NavLink to="/#experience">Experience</NavLink>
            </li>
            <li>
              <NavLink to="/#projects">Work</NavLink>
            </li>
            <li>
              <NavLink to="/#contact">Contact</NavLink> {/* Updated to NavLink */}
            </li>
            <li>
              <NavLink to="/blogs">Blogs</NavLink>
            </li>
              <li>
                <DarkModeSwitch />
              </li>
            </ul>

            <div className="resume-link">
              <a href="Resume.pdf">Resume</a>
            </div>
          </div>
          <Hamburger />

          <aside id="right-menu">
            <nav>
              <ol>
              <li>
                <NavLink to="/#aboutme">About</NavLink>
              </li>
              <li>
                <NavLink to="/#skills">Skills</NavLink>
              </li>
              <li>
                <NavLink to="/#experience">Experience</NavLink>
              </li>
              <li>
                <NavLink to="/#projects">Work</NavLink>
              </li>
              <li>
                <NavLink to="/#contact">Contact</NavLink>
              </li>
              <li>
                <NavLink to="/blogs">Blogs</NavLink>
              </li>
                <li>
                  <DarkModeSwitch />
                </li>
              </ol>
              <a href="Resume.pdf" className="resume-link">
                Resume
              </a>
            </nav>
          </aside>
        </nav>
      </header>
    );
  }

  export default React.memo(Header);

  export function LayoutWithNavbar() {
    const location = useLocation();
    const hideNavbar = useMemo(
      () => location.pathname === "/wedding",
      [location.pathname]
    );
  
    return (
      <div>
        {!hideNavbar && <Header />} {/* Conditionally render Navbar */}
        <Outlet /> {/* Render child routes */}
        <Footer />
      </div>
    );
  }


