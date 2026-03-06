import { Button, Col, Row } from "react-bootstrap";
import LinkChip from "../components/LinkChip";
import { usePortfolio } from "../context/PortfolioContext";

export default function HomePage() {
  const { content } = usePortfolio();
  const { hero } = content;
  const { contact } = content;
  const resumeUrl = content.about.resumeUrl;
  const resumeFileName = content.about.resumeFileName || "resume.pdf";
  const resumeIsData = typeof resumeUrl === "string" && resumeUrl.startsWith("data:");

  return (
    <section className="hero-shell">
      <Row className="align-items-center g-4 hero-content px-2 px-md-4 pb-4">
        <Col lg={6}>
          <p className="eyebrow mb-3">
            {hero.intro}
            <br />
            {hero.name}
          </p>
          <h1 className="hero-title">{hero.title}</h1>

          <div className="socials mb-4">
            {hero.socials.map((social) => (
              <span key={social}>{social}</span>
            ))}
          </div>

          <div className="d-flex flex-wrap gap-3 mb-4">
            <Button className="hire-btn">Hire Me</Button>
            {resumeUrl ? (
              <Button
                as="a"
                href={resumeUrl}
                target={resumeIsData ? undefined : "_blank"}
                rel={resumeIsData ? undefined : "noreferrer"}
                download={resumeIsData ? resumeFileName : undefined}
                variant="outline-light"
                className="cv-btn"
              >
                Download CV
              </Button>
            ) : (
              <Button variant="outline-light" className="cv-btn" disabled>
                Download CV
              </Button>
            )}
          </div>

          <div className="stats-grid">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="link-group mt-4" id="home-links">
            {contact.email ? <LinkChip href={`mailto:${contact.email}`} label={contact.email} icon="email" /> : null}
            {contact.phone ? <LinkChip href={`tel:${contact.phone}`} label={contact.phone} icon="phone" /> : null}
            {contact.githubUrl ? <LinkChip href={contact.githubUrl} label="GitHub" icon="github" external /> : null}
            {contact.linkedinUrl ? (
              <LinkChip href={contact.linkedinUrl} label="LinkedIn" icon="linkedin" external />
            ) : null}
          </div>
        </Col>

        <Col lg={6} className="position-relative">
          <div className="image-orbit" />
          <img
            className="hero-image"
            src={hero.imageUrl}
            alt="Tech circuit board"
          />
        </Col>
      </Row>
    </section>
  );
}
