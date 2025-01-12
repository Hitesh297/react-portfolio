
import { useState, useEffect } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);

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
      url: "https://hiteshpateladmin.herokuapp.com/api/skills",
      method: "GET",
    }).then((res) => {
      //   console.log(res.data);
      var responselist = res.data;

      let skillsList = responselist.map((skill) => skill);
      //   console.log(skillsList);
      setSkills(skillsList);
    });
  }, [setSkills]);

  return (
    <section id="skills">
      <div id="credential-details">
        <h2 className="section-headings">Skills</h2>
        <ul id="skills-list" className="reveal">
          {skills.map((skill) => (
            <li
              key={skill.id}
              dangerouslySetInnerHTML={{
                __html:
                  skill.fontawesomeHTML +
                  "<h3>" +
                  skill.type +
                  "</h3>" +
                  skill.details,
              }}
              className="skills-item"
            ></li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SkillsSection;
