import { Container } from "react-bootstrap";
import LinkChip from "../components/LinkChip";
import { usePortfolio } from "../context/PortfolioContext";

export default function ContactPage() {
  const { content } = usePortfolio();
  const { contact } = content;

  return (
    <section className="content-page">
      <Container>
        <h2>{contact.title}</h2>
        <p className="mb-4">{contact.text}</p>
        <div className="contact-grid">
          {contact.email ? (
            <LinkChip href={`mailto:${contact.email}`} label={contact.email} icon="email" />
          ) : null}
          {contact.phone ? (
            <LinkChip href={`tel:${contact.phone}`} label={contact.phone} icon="phone" />
          ) : null}
          {contact.githubUrl ? (
            <LinkChip href={contact.githubUrl} label="GitHub" icon="github" external />
          ) : null}
          {contact.linkedinUrl ? (
            <LinkChip href={contact.linkedinUrl} label="LinkedIn" icon="linkedin" external />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
