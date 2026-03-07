import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";

const CIRCLE_IMAGE_SRC = "/logo.png";

export default function HomePage() {
  const { content } = usePortfolio();
  const navigate = useNavigate();
  const { hero } = content;
  const contactEmail = content.contact?.email || content.about?.email || "";
  const contactPhone = content.contact?.phone || content.about?.phone || "";
  const linkedinUrl = content.contact?.linkedinUrl || content.about?.linkedinUrl || "https://www.linkedin.com/";
  const githubUrl = content.contact?.githubUrl || content.about?.githubUrl || "https://github.com/";
  const resumeUrl = content.about?.resumeUrl || "";
  const resumeFileName = content.about?.resumeFileName || "resume.pdf";
  const gmailHref = contactEmail ? `mailto:${contactEmail}` : "mailto:";
  const skillLogos = [
    { name: "HTML5", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Java", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Postman", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
    { name: "Git", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Bootstrap", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    { name: "MongoDB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" }
  ];
  const summary =
    (content.about.blocks || []).find((block) => block?.type === "text" && typeof block?.value === "string")?.value ||
    content.about.text ||
    "I build practical, user-focused web experiences and keep improving through hands-on projects.";

  function handleProfileClick() {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "/#about");
      return;
    }
    navigate("/#about");
  }

  return (
    <section className="hero-shell">
      <Row className="hero-content hero-minimal align-items-center px-2 px-md-4 pb-4">
        <Col xl={7} lg={7}>
          <p className="hero-intro">{hero.intro || "Hi, my name is"}</p>
          <h1 className="hero-name">{hero.name}</h1>
          <h2 className="hero-focus">{hero.title}</h2>
          <p className="hero-summary">{summary}</p>
          <Button variant="outline-light" className="profile-btn" onClick={handleProfileClick}>
            Check out my Profile!
          </Button>
          <div className="hero-socials" aria-label="Social links">
            <a className="hero-social-link" href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2.4 5.8H5V14H2.4V5.8zM3.7 2A1.5 1.5 0 1 1 2.2 3.5 1.5 1.5 0 0 1 3.7 2zM6.4 5.8h2.5V7h.04c.35-.66 1.22-1.35 2.5-1.35 2.67 0 3.17 1.76 3.17 4.05V14H12V10.4c0-.86-.02-1.97-1.2-1.97-1.2 0-1.38.94-1.38 1.9V14H6.8V5.8z" />
              </svg>
            </a>
            <a className="hero-social-link" href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 1.2a6.8 6.8 0 0 0-2.16 13.25c.34.07.46-.15.46-.33v-1.2c-1.88.4-2.28-.8-2.28-.8-.3-.78-.75-.98-.75-.98-.62-.42.05-.4.05-.4.69.05 1.05.7 1.05.7.6 1.03 1.58.73 1.97.56.06-.44.24-.73.44-.9-1.5-.17-3.08-.75-3.08-3.35 0-.74.26-1.34.7-1.82-.07-.17-.3-.86.07-1.78 0 0 .57-.18 1.87.7a6.44 6.44 0 0 1 3.4 0c1.3-.88 1.86-.7 1.86-.7.37.92.14 1.6.07 1.78.44.48.7 1.08.7 1.82 0 2.6-1.58 3.18-3.08 3.35.24.2.46.6.46 1.22v1.8c0 .18.12.4.47.33A6.8 6.8 0 0 0 8 1.2z" />
              </svg>
            </a>
            <a className="hero-social-link" href={gmailHref} aria-label="Gmail">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M1.5 3h13A1.5 1.5 0 0 1 16 4.5v7A1.5 1.5 0 0 1 14.5 13h-13A1.5 1.5 0 0 1 0 11.5v-7A1.5 1.5 0 0 1 1.5 3zm0 1 6.5 4.2L14.5 4h-13zm13 8v-6l-6.23 4.03a.5.5 0 0 1-.54 0L1.5 6v6h13z" />
              </svg>
            </a>
          </div>
          <div className="hero-contact-box">
            {contactPhone ? (
              <a className="hero-contact-item" href={`tel:${contactPhone}`} aria-label="Phone number">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.2 1.5h2c.38 0 .7.28.75.66l.28 2.1a.75.75 0 0 1-.43.76L4.7 5.6a11.2 11.2 0 0 0 5.7 5.7l.56-1.1a.75.75 0 0 1 .76-.43l2.1.28c.38.05.66.37.66.75v2a1 1 0 0 1-1.1 1A12.9 12.9 0 0 1 2.2 2.6a1 1 0 0 1 1-1.1z" />
                </svg>
                <span>{contactPhone}</span>
              </a>
            ) : (
              <span className="hero-contact-item hero-contact-muted">Add phone in Admin</span>
            )}
            {resumeUrl ? (
              <a
                className="hero-contact-item"
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                download={resumeFileName}
                aria-label="Resume"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 1h7l3 3v11H3V1zm7 1.5V5h2.5L10 2.5zM5 8h6v1H5V8zm0 2h6v1H5v-1z" />
                </svg>
                <span>Resume</span>
              </a>
            ) : (
              <span className="hero-contact-item hero-contact-muted">Add resume in Admin</span>
            )}
          </div>
        </Col>

        <Col xl={5} lg={5} className="position-relative mt-4 mt-lg-0">
          <div className="orbit-stage">
            <div className="image-orbit" aria-hidden="true">
              <img className="orbit-center-image" src={CIRCLE_IMAGE_SRC} alt="Profile orbit image" draggable={false} />
              <div className="skill-orbit">
                {skillLogos.map((skill, index) => (
                  <span
                    key={skill.name}
                    className="skill-logo"
                    style={{
                      "--i": index,
                      "--count": skillLogos.length
                    }}
                  >
                    <img src={skill.src} alt={skill.name} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  );
}
