import "./PortfolioApp.css";

const Footer = () => {
  return (
    <footer>
      <div id="footer-content">
        <p>&copy; {new Date().getFullYear()} Hitesh Patel. Built with ❤️ using React.</p>
        <div style={{ marginTop: "8px" }}>
          <a
            href="https://www.linkedin.com/in/hiteshpatel-dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: "10px", color: "var(--text-colour)", textDecoration: "none" }}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Hitesh297/react-portfolio.git"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-colour)", textDecoration: "none" }}
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
