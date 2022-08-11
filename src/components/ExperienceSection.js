import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  useEffect(() => {
    axios({
      url: "https://hiteshpateladmin.herokuapp.com/api/experiences",
      method: "GET",
    }).then((res) => {
      //   console.log(res.data);
      var responselist = res.data;

      let experienceList = responselist.map((experience) => experience);
      //   console.log(experienceList);
      setExperiences(experienceList);
    });
  }, [setExperiences]);

  function formatedDate(date) {
    var dateobject = new Date(date);
    const month = dateobject.toLocaleString("default", { month: "short" });
    const year = dateobject.toLocaleString("default", { year: "numeric" });
    // console.log(month + " " + year);
    return month + " " + year;
  }

  function handleClick(e) {
    // console.log("clicked");
    const target = e.target;
    const tabNum = target.dataset.tab;
    const activeTab = document.querySelector(".tabs.active");
    const activeContent = document.querySelector(".content__section.visible");
    const currentContent = document.querySelector(
      `.content__section[data-tab='${tabNum}']`
    );

    if (!tabNum) {
      return;
    }

    activeTab.classList.remove("active");
    target.classList.add("active");
    activeContent.classList.remove("visible");
    currentContent.classList.add("visible");

    var selector = document.getElementById("company-selector");
    var selectorLocation = tabNum * 42 - 42;
    // console.log("location:", selectorLocation);
    selector.style.transform = "translateY(" + selectorLocation + "px)";
  }

  return (
    <section id="experience">
      <h2 className="section-headings">Experience</h2>
      <div className="reveal" id="experience-content">
        <div id="company-list">
          {experiences.map((experience, index) => (
            <button
              key={experience.id}
              data-tab={index + 1}
              className={`tabs ${index === 0 ? "active" : ""}`}
              onClick={(event) => handleClick(event)}
            >
              {experience.companyName}
            </button>
          ))}
          <div id="company-selector"></div>
        </div>
        <div id="role-description">
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className={`content__section ${index === 0 ? "visible" : ""}`}
              data-tab={index + 1}
            >
              <h3>
                <span>{experience.position}</span>
                <span className="company">{"@" + experience.companyName}</span>
              </h3>
              <p className="duration">
                {formatedDate(experience.startDate) +
                  " - " +
                  formatedDate(experience.endDate)}
              </p>
              <div
                dangerouslySetInnerHTML={{
                  __html: experience.responsibilities,
                }}
              ></div>
              {/* {experience.responsibilities} */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
