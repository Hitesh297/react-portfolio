import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const HeroSection = () => {
  const [content, setContent] = useState([]);

  useEffect(() => {
    axios({
      url: "https://hiteshpateladmin.herokuapp.com/api/contents",
      method: "GET",
    }).then((res) => {
      //   console.log(res.data);
      var responselist = res.data;

      let contentList = responselist
        .filter((res) => res.type === "Hero")
        .map((content) => content);
      //   console.log(contentList[0]);
      setContent(contentList[0].content);
    });
  }, [setContent]);

  return (
    <section id="hero-section">
      <div>
        <h1>Hi, my name is</h1>
      </div>
      <div>
        <h2>Hitesh Patel.</h2>
      </div>
      <div>
        <h3>
          I'm a{" "}
          <span id="role-title" className="">
            Web Developer
          </span>
        </h3>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
      <div>
        <a
          id="hire-me"
          href="https://www.linkedin.com/in/hitesh-patel-dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hire Me!
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
