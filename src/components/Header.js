import React from "react";

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
            </ul>
            <div className="resume-link">
              <a href="Resume.pdf">Resume</a>
            </div>
          </div>
          <button id="hamburger">
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
