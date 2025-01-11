import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

const HeroSection = () => {
  const [content, setContent] = useState([]);

  axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`, new Date());
      return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error) => {
      // if retry condition is not specified, by default idempotent requests are retried
      return error.response.status === 503;
    },
  });

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
        <h2>
          Hitesh Patel. <span id="iama">I'm a </span>
        </h2>
      </div>
      <div>
        <h3>
          <span id="role-title" className="">
            Web Developer
          </span>
        </h3>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
      <div className="hero-links">
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
