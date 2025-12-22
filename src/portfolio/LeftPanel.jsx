
import { useState, useEffect } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import { API_BASE_URL } from "../config/api";

export const LeftPanel = () => {
  const [socialmedias, setSocialMedias] = useState([]);

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
    axios.get(`${API_BASE_URL}/api/socialmedia`)
    .then((res) => {
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
