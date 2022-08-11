import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
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
      <h2 className="section-headings">Projects</h2>
      {/* <?php
  $projectsQuery = 'SELECT *
                  FROM projects
                  ORDER BY sequence';
  $projects = mysqli_query($connect, $projectsQuery);
  $projectsarray = array();

  while ($project = mysqli_fetch_assoc($projects)) {
      $projectsarray[] = $project;
  }

  ?> */}
      <ul className="reveal" id="project-list">
        {/* <?php for ($i = 0; $i < count($projectsarray); $i++) : ?> */}
        {projects.map((project, index) => (
          <li key={project.id} className="project-list-item">
            <div className="project-content">
              <div
                className={`proj-image-container ${
                  (index + 1) % 2 === 0 ? "right" : ""
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
                  (index + 1) % 2 === 0 ? "text-left" : "right text-right"
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
