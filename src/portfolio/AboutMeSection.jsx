
import { useState, useEffect } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

const AboutMeSection = () => {
  const [content, setContent] = useState([]);
  const [credentials, setCredentials] = useState([]);

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
        .filter((res) => res.type === "AboutMe")
        .map((content) => content);
      // console.log(contentList[0]);
      setContent(contentList[0].content);
    });

    axios({
      url: "https://hiteshpateladmin.herokuapp.com/api/qualifications",
      method: "GET",
    }).then((res) => {
      //   console.log(res.data);
      var responselist = res.data;

      let credentialList = responselist.map((credential) => credential);
      //   console.log(credentialList);
      setCredentials(credentialList);
    });
  }, [setContent, setCredentials]);

  return (
    <section id="aboutme">
      <h2 className="portfolio-section-headings">About Me</h2>
      <div className="aboutme-content reveal">
        <div id="aboutme-text">
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
          <div id="credential-details">
            <h3>Qualifications</h3>
            <ul className="credentials-list">
              {credentials.map((credential) => (
                <li key={credential.id} className="credential-item">
                  <div className="credential-title">
                    <i className="fa-solid fa-graduation-cap"></i>
                    <h4>
                      {credential.credential}, {credential.yearCompleted}{" "}
                    </h4>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: credential.details }}
                  ></div>
                  {/* {credential.details} */}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="aboutme-img-container">
          <img src="images/me.jpg" alt="Hitesh Patel" width="300"></img>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
