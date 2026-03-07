import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { usePortfolio } from "../context/PortfolioContext";

function IconCode() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.2 4.2 1.4 8l3.8 3.8.8-.8L3.1 8l2.9-3-.8-.8zm5.6 0-.8.8 2.9 3-2.9 3 .8.8L14.6 8l-3.8-3.8zM8.9 2.4l-2 11.2 1 .2 2-11.2-1-.2z" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M10.5 1H15v4.5h-1.5V3.56L8.28 8.78 7.22 7.72 12.44 2.5H10.5V1zM13 9v5H1V2h5v1.5H2.5v9h9V9H13z" />
    </svg>
  );
}

function getProjectImages(project) {
  if (Array.isArray(project.images) && project.images.length) {
    return project.images.filter((img) => img?.url);
  }
  if (typeof project.imageUrl === "string" && project.imageUrl) {
    return [{ url: project.imageUrl, alt: project.name || "Project image" }];
  }
  return [];
}

export default function PortfolioPage() {
  const { content } = usePortfolio();
  const { portfolio } = content;
  const [activeSlides, setActiveSlides] = useState({});

  function shiftSlide(projectIndex, direction, total) {
    setActiveSlides((prev) => {
      const current = prev[projectIndex] || 0;
      const next = (current + direction + total) % total;
      return { ...prev, [projectIndex]: next };
    });
  }

  return (
    <section className="content-page alt-page">
      <Container>
        <h2>{portfolio.title}</h2>
        <p className="mb-4">{portfolio.text}</p>
        <div className="project-grid feature-grid">
          {portfolio.projects.map((project, index) => {
            const images = getProjectImages(project);
            const slide = activeSlides[index] ? activeSlides[index] % images.length : 0;
            const currentImage =
              images[slide]?.url ||
              "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

            return (
              <article key={`${project.name}-${index}`} className="project-card feature-card">
                <div className="feature-content">
                  <div className="project-meta">
                    {project.period ? <span className="project-period">{project.period}</span> : null}
                    {project.role ? <span className="project-role">{project.role}</span> : null}
                  </div>

                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  {project.stack ? <small>{project.stack}</small> : null}

                  <div className="feature-actions">
                    {project.repoUrl ? (
                      <a href={project.repoUrl} target="_blank" rel="noreferrer" className="feature-btn ghost-btn">
                        <IconCode />
                        <span>Code</span>
                      </a>
                    ) : null}
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="feature-btn primary-btn">
                        <IconExternal />
                        <span>Live Demo</span>
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="feature-image-wrap">
                  <img className="feature-image" src={currentImage} alt={images[slide]?.alt || project.name} />
                  {images.length > 1 ? (
                    <>
                      <Button className="proj-nav-btn proj-nav-left" variant="dark" onClick={() => shiftSlide(index, -1, images.length)}>
                        &#8249;
                      </Button>
                      <Button className="proj-nav-btn proj-nav-right" variant="dark" onClick={() => shiftSlide(index, 1, images.length)}>
                        &#8250;
                      </Button>
                      <div className="proj-slide-count">{`${slide + 1} / ${images.length}`}</div>
                      <div className="proj-dots">
                        {images.map((_, dotIdx) => (
                          <button
                            key={`proj-dot-${index}-${dotIdx}`}
                            className={`proj-dot${dotIdx === slide ? " active" : ""}`}
                            onClick={() => setActiveSlides((prev) => ({ ...prev, [index]: dotIdx }))}
                            aria-label={`Go to project image ${dotIdx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
