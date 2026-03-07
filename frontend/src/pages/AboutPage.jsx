import { useState } from "react";
import { Container } from "react-bootstrap";
import { usePortfolio } from "../context/PortfolioContext";

function getBlockImages(block) {
  if (Array.isArray(block.images) && block.images.length) {
    return block.images.filter((img) => img?.url);
  }
  if (typeof block.value === "string" && block.value) {
    return [{ url: block.value, alt: block.alt || "" }];
  }
  return [];
}

export default function AboutPage() {
  const { content } = usePortfolio();
  const { about } = content;
  const [activeSlide, setActiveSlide] = useState(0);
  const blocks = Array.isArray(about.blocks) ? about.blocks : [];
  const textBlocks = blocks
    .filter((block) => block?.type !== "image" && typeof block?.value === "string" && block.value.trim())
    .map((block) => block.value.trim());
  const images = blocks
    .filter((block) => block?.type === "image")
    .flatMap((block) => getBlockImages(block));
  const hasSlides = images.length > 1;
  const currentSlide = images.length ? activeSlide % images.length : 0;
  const currentImage = images[currentSlide];

  function shiftSlide(direction) {
    if (!images.length) return;
    setActiveSlide((prev) => (prev + direction + images.length) % images.length);
  }

  return (
    <section className="content-page about-page">
      <Container>
        <div className="about-head">
          <span className="about-index">01.</span>
          <h2>{about.title}</h2>
          <div className="about-head-line" />
        </div>

        <div className="about-layout">
          <div className="about-copy">
            {(textBlocks.length ? textBlocks : [about.text]).filter(Boolean).map((text, index) => (
              <p key={`about-text-${index}`}>{text}</p>
            ))}
          </div>

          {currentImage ? (
            <div className="about-visual-col">
              <div className="about-photo-shell">
                <img
                  src={currentImage.url}
                  alt={currentImage.alt || `About slide ${currentSlide + 1}`}
                  className="about-photo"
                />

                {hasSlides ? (
                  <>
                    <button
                      className="about-nav-btn about-nav-left"
                      onClick={() => shiftSlide(-1)}
                      aria-label="Previous image"
                    >
                      &#8249;
                    </button>
                    <button
                      className="about-nav-btn about-nav-right"
                      onClick={() => shiftSlide(1)}
                      aria-label="Next image"
                    >
                      &#8250;
                    </button>
                    <div className="about-slide-count">{`${currentSlide + 1} / ${images.length}`}</div>
                    <div className="about-slider-controls">
                      {images.map((_, dotIndex) => (
                        <button
                          key={`about-dot-${dotIndex}`}
                          className={`about-dot${dotIndex === currentSlide ? " active" : ""}`}
                          onClick={() => setActiveSlide(dotIndex)}
                          aria-label={`Go to image ${dotIndex + 1}`}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
