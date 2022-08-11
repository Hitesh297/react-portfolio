import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export const LeftPanel = () => {
  const [socialmedias, setSocialMedias] = useState([]);
  // let skills = [];

  useEffect(() => {
    axios({
      url: "https://hiteshpateladmin.herokuapp.com/api/socialmedia",
      method: "GET",
    }).then((res) => {
      var responselist = res.data;
      let faqList = responselist.map((sociallink) => sociallink);
      setSocialMedias(faqList);
    });
  }, [setSocialMedias]);

  return (
    <div id="left">
      <ul id="left-list">
        {socialmedias.map((socialmediaLink) => (
          <li key={socialmediaLink.id}>
            <a
              dangerouslySetInnerHTML={{ __html: socialmediaLink.logo }}
              className="social"
              href={socialmediaLink.url}
              target="_blank"
              rel="noopener noreferrer"
            ></a>
          </li>
        ))}
      </ul>
      <svg id="left-line" height="200" width="40">
        <line x1="20" y1="20" x2="20" y2="200"></line>
      </svg>
    </div>
  );
};
export default LeftPanel;
