import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios({
      url: "https://shielded-river-60872.herokuapp.com/api/skills",
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
