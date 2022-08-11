import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const AboutMeSection = () => {
  const [content, setContent] = useState([]);
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    axios({
      url: "https://hiteshpateladmin.herokuapp.com/api/contents",
      method: "GET",
    }).then((res) => {
      //   console.log(res.data);
      var responselist = res.data;

      let contentList = responselist
        .filter((res) => (res.type = "AboutMe"))
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
      <h2 className="section-headings">About Me</h2>
      <div className="aboutme-content reveal">
        <div id="aboutme-text">
          {content}
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
                  {credential.details}
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
