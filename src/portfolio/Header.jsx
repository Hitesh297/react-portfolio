import React from "react";
import Hamburger from "./Hamburger";
import DarkModeSwitch from "../components/DarkModeSwitch/DarkModeSwitch";

class Header extends React.Component {
  render() {
    return (
      <header id="header" className="header">
        <div id="loader"></div>
        <nav className="navigation">
          <a href="/" id="logo-container">
            <svg
              id="logo-svg"
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
              <text x="13" y="67">
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
                <a href="#aboutme">About</a>
              </li>
              <li>
                <a href="#skills">Skills</a>
              </li>
              <li>
                <a href="#experience">Experience</a>
              </li>
              <li>
                <a href="#projects">Work</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
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
                  <a href="#aboutme">About</a>
                </li>
                <li>
                  <a href="#skills">Skills</a>
                </li>
                <li>
                  <a href="#experience">Experience</a>
                </li>
                <li>
                  <a href="#projects">Work</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
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
}

export default Header;
