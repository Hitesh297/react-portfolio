
import { useState, useEffect } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);

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
      url: "https://hiteshpateladmin.herokuapp.com/api/projects",
      method: "GET",
    }).then((res) => {
      //   console.log(res.data);
      var responselist = res.data;

      let projectsList = responselist.map((project) => project);
      console.log(projectsList);
      setProjects(projectsList);
    });
  }, [setProjects]);

  return (
    <section id="projects">
      <h2 className="portfolio-section-headings">Projects</h2>
      <ul className="reveal" id="project-list">
        {/* <?php for ($i = 0; $i < count($projectsarray); $i++) : ?> */}
        {projects.map((project, index) => (
          <li key={project.id} className="project-list-item">
            <div className="project-content">
              <div
                className={`proj-image-container ${
                  (index + 1) % 2 === 0 ? "project-overlap" : ""
                }`}
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={project.photo} alt="" width={600} />
                </a>
              </div>
              <div
                className={`project-text ${
                  (index + 1) % 2 === 0 ? "text-left" : "project-overlap text-right"
                }`}
              >
                <p className="project-head">Featured Project</p>
                <h3 className="project-title">{project.title}</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: project.description }}
                  className="project-details"
                ></div>
                <ul className="project-tech-list">
                  {project.technologies.split(",").map((technology, index) => (
                    <li key={index}>{technology.trim()}</li>
                  ))}
                </ul>
                <div className="project-links">
                  <a
                    className="git"
                    href={project.gitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-github"></i>
                  </a>
                  <a
                    className="external-link"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                </div>
              </div>
            </div>
          </li>
        ))}

        {/* <?php endfor; ?> */}
      </ul>
    </section>
  );
};

export default ProjectsSection;
