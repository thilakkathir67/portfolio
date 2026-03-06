import { useState } from "react";
import { Button, Container } from "react-bootstrap";
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
  const [activeSlides, setActiveSlides] = useState({});

  function shiftSlide(blockIndex, direction, total) {
    setActiveSlides((prev) => {
      const current = prev[blockIndex] || 0;
      const next = (current + direction + total) % total;
      return { ...prev, [blockIndex]: next };
    });
  }

  return (
    <section className="content-page">
      <Container>
        <h2>{about.title}</h2>
        <div className="about-blocks">
          {(about.blocks || []).map((block, index) => {
            if (block.type === "image") {
              const images = getBlockImages(block);
              if (!images.length) return null;
              const current = activeSlides[index] ? activeSlides[index] % images.length : 0;
              const image = images[current];
              return (
                <div key={`about-block-${index}`} className="about-media">
                  <div className="about-slider-shell">
                    <img
                      src={image.url}
                      alt={image.alt || `About visual ${index + 1}`}
                      className="about-image"
                    />
                    {images.length > 1 ? (
                      <>
                        <Button
                          className="about-nav-btn about-nav-left"
                          variant="dark"
                          onClick={() => shiftSlide(index, -1, images.length)}
                        >
                          &#8249;
                        </Button>
                        <Button
                          className="about-nav-btn about-nav-right"
                          variant="dark"
                          onClick={() => shiftSlide(index, 1, images.length)}
                        >
                          &#8250;
                        </Button>
                        <div className="about-slide-count">{`${current + 1} / ${images.length}`}</div>
                      </>
                    ) : null}
                  </div>
                  {images.length > 1 ? (
                    <div className="about-slider-controls">
                      {images.map((_, dotIndex) => (
                        <button
                          key={`about-dot-${index}-${dotIndex}`}
                          className={`about-dot${dotIndex === current ? " active" : ""}`}
                          onClick={() => setActiveSlides((prev) => ({ ...prev, [index]: dotIndex }))}
                          aria-label={`Go to slide ${dotIndex + 1}`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }
            return <p key={`about-block-${index}`}>{block.value}</p>;
          })}
        </div>
      </Container>
    </section>
  );
}
