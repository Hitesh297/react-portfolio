import React from "react";
import AboutMeSection from "../portfolio/AboutMeSection";
import ContactSection from "../portfolio/ContactSection";
import ExperienceSection from "../portfolio/ExperienceSection";
import HeroSection from "../portfolio/HeroSection";
import ProjectsSection from "../portfolio/ProjectsSection";
import SkillsSection from "../portfolio/SkillsSection";

const Main = () => {
  return (
    <main>
      <HeroSection />
      <AboutMeSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
};

export default Main;
