import { useState } from "react";
import { Accordion, Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { usePortfolio } from "../context/PortfolioContext";

function cloneContent(data) {
  return JSON.parse(JSON.stringify(data));
}

function blankProject() {
  return {
    name: "New Project",
    description: "",
    liveUrl: "",
    repoUrl: "",
    stack: "",
    role: "Full Stack Developer",
    period: "2025 - 2026",
    imageUrl: "",
    images: [{ url: "", alt: "" }]
  };
}

function blankAboutText() {
  return { type: "text", value: "" };
}

function blankAboutImage() {
  return { type: "image", images: [{ url: "", alt: "" }] };
}

function normalizeImportedContent(imported) {
  const next = cloneContent(imported);
  if (!next.about) next.about = {};
  if (!Array.isArray(next.about.blocks) || !next.about.blocks.length) {
    next.about.blocks = next.about.text ? [{ type: "text", value: next.about.text }] : [blankAboutText()];
  }
  next.about.blocks = next.about.blocks.map((block) => {
    if (block.type !== "image") return block;
    if (Array.isArray(block.images) && block.images.length) return block;
    if (typeof block.value === "string" && block.value) {
      return { ...block, images: [{ url: block.value, alt: block.alt || "" }] };
    }
    return { ...block, images: [{ url: "", alt: "" }] };
  });
  if (!next.portfolio) next.portfolio = { projects: [blankProject()] };
  if (!Array.isArray(next.portfolio.projects) || !next.portfolio.projects.length) {
    next.portfolio.projects = [blankProject()];
  }
  next.portfolio.projects = next.portfolio.projects.map((project) => {
    if (Array.isArray(project.images) && project.images.length) return project;
    if (typeof project.imageUrl === "string" && project.imageUrl) {
      return { ...project, images: [{ url: project.imageUrl, alt: project.name || "Project image" }] };
    }
    return { ...project, images: [{ url: "", alt: "" }] };
  });
  return next;
}

function deriveAboutText(about) {
  const blocks = Array.isArray(about?.blocks) ? about.blocks : [];
  const firstText = blocks.find(
    (block) => block?.type !== "image" && typeof block?.value === "string" && block.value.trim()
  );
  return firstText ? firstText.value.trim() : "";
}

export default function AdminPage() {
  const { content, setContent, updatePasscode } = usePortfolio();
  const [draft, setDraft] = useState(() => cloneContent(content));
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [nextPasscode, setNextPasscode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(path, value) {
    setDraft((prev) => {
      const updated = cloneContent(prev);
      let cursor = updated;
      for (let i = 0; i < path.length - 1; i += 1) cursor = cursor[path[i]];
      cursor[path[path.length - 1]] = value;
      return updated;
    });
  }

  async function handleSave() {
    try {
      const payload = cloneContent(draft);
      payload.about = payload.about || {};
      payload.about.text = deriveAboutText(payload.about);
      await setContent(payload);
      if (nextPasscode.trim()) {
        await updatePasscode(currentPasscode, nextPasscode.trim());
        setCurrentPasscode("");
        setNextPasscode("");
      }
      setError("");
      setMessage("Saved. Content updated.");
    } catch (saveError) {
      setError(saveError.message || "Could not save changes.");
      setMessage("");
    }
  }

  function handleReset() {
    setDraft(cloneContent(content));
    setCurrentPasscode("");
    setNextPasscode("");
    setError("");
    setMessage("Reverted unsaved changes.");
  }

  function handleExportJson() {
    const payload = { exportedAt: new Date().toISOString(), content: draft };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-content.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImportJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const imported = parsed.content ? parsed.content : parsed;
        if (!imported.hero || !imported.about || !imported.portfolio || !imported.contact) {
          throw new Error("Invalid file format");
        }
        setDraft(normalizeImportedContent(imported));
        setError("");
        setMessage("Imported JSON. Click Save to apply.");
      } catch {
        setError("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function addProject() {
    updateField(["portfolio", "projects"], [...draft.portfolio.projects, blankProject()]);
  }

  function removeProject(index) {
    const next = draft.portfolio.projects.filter((_, idx) => idx !== index);
    updateField(["portfolio", "projects"], next.length ? next : [blankProject()]);
  }

  function addProjectImage(projectIndex) {
    const current = draft.portfolio.projects?.[projectIndex]?.images || [];
    updateField(["portfolio", "projects", projectIndex, "images"], [...current, { url: "", alt: "" }]);
  }

  function removeProjectImage(projectIndex, imageIndex) {
    const current = draft.portfolio.projects?.[projectIndex]?.images || [];
    const next = current.filter((_, idx) => idx !== imageIndex);
    updateField(
      ["portfolio", "projects", projectIndex, "images"],
      next.length ? next : [{ url: "", alt: "" }]
    );
  }

  function handleProjectImageUpload(projectIndex, imageIndex, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField(["portfolio", "projects", projectIndex, "images", imageIndex, "url"], String(reader.result));
      setMessage("Project image uploaded to draft. Click Save changes.");
      setError("");
    };
    reader.onerror = () => setError("Could not read project image.");
    reader.readAsDataURL(file);
  }

  function addAboutBlock(type) {
    const nextBlock = type === "image" ? blankAboutImage() : blankAboutText();
    updateField(["about", "blocks"], [...(draft.about.blocks || []), nextBlock]);
  }

  function removeAboutBlock(index) {
    const current = draft.about.blocks || [];
    const next = current.filter((_, idx) => idx !== index);
    updateField(["about", "blocks"], next.length ? next : [blankAboutText()]);
  }

  function handleAboutImageUpload(blockIndex, imageIndex, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField(["about", "blocks", blockIndex, "images", imageIndex, "url"], String(reader.result));
      setMessage("About image uploaded to draft. Click Save changes.");
      setError("");
    };
    reader.onerror = () => setError("Could not read about image.");
    reader.readAsDataURL(file);
  }

  function addImageToAboutBlock(blockIndex) {
    const current = draft.about.blocks?.[blockIndex]?.images || [];
    updateField(["about", "blocks", blockIndex, "images"], [...current, { url: "", alt: "" }]);
  }

  function removeImageFromAboutBlock(blockIndex, imageIndex) {
    const current = draft.about.blocks?.[blockIndex]?.images || [];
    const next = current.filter((_, idx) => idx !== imageIndex);
    updateField(["about", "blocks", blockIndex, "images"], next.length ? next : [{ url: "", alt: "" }]);
  }

  function handleResumeUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField(["about", "resumeUrl"], String(reader.result));
      updateField(["about", "resumeFileName"], file.name || "resume.pdf");
      setMessage("Resume uploaded to draft. Click Save changes.");
      setError("");
    };
    reader.onerror = () => setError("Could not read resume file.");
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <section className="content-page admin-page">
      <Container>
        <h2>Admin Panel</h2>
        <p className="mb-3">Sections are collapsible so you can edit without long page scrolling.</p>
        {message ? <Alert variant="success">{message}</Alert> : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}

        <Accordion alwaysOpen defaultActiveKey={["0"]}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Home Content</Accordion.Header>
            <Accordion.Body>
              <Row className="g-3">
                <Col md={6}><Form.Group><Form.Label>Hero intro</Form.Label><Form.Control value={draft.hero.intro} onChange={(e) => updateField(["hero", "intro"], e.target.value)} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Hero name</Form.Label><Form.Control value={draft.hero.name} onChange={(e) => updateField(["hero", "name"], e.target.value)} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Hero title</Form.Label><Form.Control value={draft.hero.title} onChange={(e) => updateField(["hero", "title"], e.target.value)} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Hero image URL</Form.Label><Form.Control value={draft.hero.imageUrl} onChange={(e) => updateField(["hero", "imageUrl"], e.target.value)} /></Form.Group></Col>
                <Col md={12}><Form.Group><Form.Label>Hero summary</Form.Label><Form.Control as="textarea" rows={3} value={draft.hero.summary || ""} onChange={(e) => updateField(["hero", "summary"], e.target.value)} /></Form.Group></Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>About Content</Accordion.Header>
            <Accordion.Body>
              <Row className="g-3">
                <Col md={6}><Form.Group><Form.Label>About title</Form.Label><Form.Control value={draft.about.title} onChange={(e) => updateField(["about", "title"], e.target.value)} /></Form.Group></Col>
                <Col md={6} className="d-flex align-items-end gap-2">
                  <Button size="sm" variant="outline-warning" onClick={() => addAboutBlock("text")}>Add Text Block</Button>
                  <Button size="sm" variant="outline-info" onClick={() => addAboutBlock("image")}>Add Image Block</Button>
                </Col>

                {(draft.about.blocks || []).map((block, index) => (
                  <Col md={12} key={`about-block-${index}`}>
                    <Card className="admin-card">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>{`Block ${index + 1} (${block.type})`}</strong>
                          <Button size="sm" variant="outline-danger" onClick={() => removeAboutBlock(index)}>
                            Remove
                          </Button>
                        </div>

                        {block.type === "image" ? (
                          <Row className="g-2">
                            <Col md={12} className="d-flex justify-content-end">
                              <Button size="sm" variant="outline-info" onClick={() => addImageToAboutBlock(index)}>
                                Add Image To This Block
                              </Button>
                            </Col>
                            {(Array.isArray(block.images) && block.images.length
                              ? block.images
                              : [{ url: block.value || "", alt: block.alt || "" }]
                            ).map((img, imgIndex) => (
                              <Col md={12} key={`about-img-${index}-${imgIndex}`}>
                                <Card className="admin-card">
                                  <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <strong>{`Image ${imgIndex + 1}`}</strong>
                                      <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => removeImageFromAboutBlock(index, imgIndex)}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    <Row className="g-2">
                                      <Col md={8}>
                                        <Form.Control
                                          value={img.url || ""}
                                          placeholder="Image URL"
                                          onChange={(e) =>
                                            updateField(
                                              ["about", "blocks", index, "images", imgIndex, "url"],
                                              e.target.value
                                            )
                                          }
                                        />
                                      </Col>
                                      <Col md={4}>
                                        <Form.Control
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            handleAboutImageUpload(index, imgIndex, e.target.files?.[0]);
                                            e.target.value = "";
                                          }}
                                        />
                                      </Col>
                                      <Col md={12}>
                                        <Form.Control
                                          value={img.alt || ""}
                                          placeholder="Image alt text (optional)"
                                          onChange={(e) =>
                                            updateField(
                                              ["about", "blocks", index, "images", imgIndex, "alt"],
                                              e.target.value
                                            )
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        ) : (
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={block.value || ""}
                            placeholder="Write text..."
                            onChange={(e) => updateField(["about", "blocks", index, "value"], e.target.value)}
                          />
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
                <Col md={8}><Form.Group><Form.Label>Resume URL</Form.Label><Form.Control value={draft.about.resumeUrl || ""} onChange={(e) => updateField(["about", "resumeUrl"], e.target.value)} placeholder="Paste hosted resume URL" /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>Upload resume file</Form.Label><Form.Control type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} /></Form.Group></Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Portfolio Projects</Accordion.Header>
            <Accordion.Body>
              <Row className="g-3">
                <Col md={6}><Form.Group><Form.Label>Portfolio title</Form.Label><Form.Control value={draft.portfolio.title} onChange={(e) => updateField(["portfolio", "title"], e.target.value)} /></Form.Group></Col>
                <Col md={12}><Form.Group><Form.Label>Portfolio intro text</Form.Label><Form.Control as="textarea" rows={3} value={draft.portfolio.text} onChange={(e) => updateField(["portfolio", "text"], e.target.value)} /></Form.Group></Col>
                <Col md={12} className="d-flex justify-content-end"><Button size="sm" variant="outline-warning" onClick={addProject}>Add Project</Button></Col>
                {draft.portfolio.projects.map((project, index) => (
                  <Col md={12} key={`project-${index}`}>
                    <Card className="admin-card"><Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2"><strong>{`Project ${index + 1}`}</strong><Button size="sm" variant="outline-danger" onClick={() => removeProject(index)}>Remove</Button></div>
                      <Row className="g-2">
                        <Col md={6}><Form.Control value={project.name} placeholder="Project name" onChange={(e) => updateField(["portfolio", "projects", index, "name"], e.target.value)} /></Col>
                        <Col md={6}><Form.Control value={project.stack} placeholder="Tech stack" onChange={(e) => updateField(["portfolio", "projects", index, "stack"], e.target.value)} /></Col>
                        <Col md={6}><Form.Control value={project.period || ""} placeholder="Period (ex: 2025 - 2026)" onChange={(e) => updateField(["portfolio", "projects", index, "period"], e.target.value)} /></Col>
                        <Col md={6}><Form.Control value={project.role || ""} placeholder="Role (ex: Full Stack Developer)" onChange={(e) => updateField(["portfolio", "projects", index, "role"], e.target.value)} /></Col>
                        <Col md={12}><Form.Control as="textarea" rows={2} value={project.description} placeholder="Project description" onChange={(e) => updateField(["portfolio", "projects", index, "description"], e.target.value)} /></Col>
                        <Col md={12} className="d-flex justify-content-end">
                          <Button size="sm" variant="outline-info" onClick={() => addProjectImage(index)}>
                            Add Image To Project
                          </Button>
                        </Col>
                        {(Array.isArray(project.images) && project.images.length
                          ? project.images
                          : [{ url: project.imageUrl || "", alt: project.name || "Project image" }]
                        ).map((img, imgIdx) => (
                          <Col md={12} key={`project-image-${index}-${imgIdx}`}>
                            <Card className="admin-card">
                              <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <strong>{`Project Image ${imgIdx + 1}`}</strong>
                                  <Button size="sm" variant="outline-danger" onClick={() => removeProjectImage(index, imgIdx)}>
                                    Remove
                                  </Button>
                                </div>
                                <Row className="g-2">
                                  <Col md={8}>
                                    <Form.Control
                                      value={img.url || ""}
                                      placeholder="Project image URL"
                                      onChange={(e) =>
                                        updateField(["portfolio", "projects", index, "images", imgIdx, "url"], e.target.value)
                                      }
                                    />
                                  </Col>
                                  <Col md={4}>
                                    <Form.Control
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        handleProjectImageUpload(index, imgIdx, e.target.files?.[0]);
                                        e.target.value = "";
                                      }}
                                    />
                                  </Col>
                                  <Col md={12}>
                                    <Form.Control
                                      value={img.alt || ""}
                                      placeholder="Image alt text"
                                      onChange={(e) =>
                                        updateField(["portfolio", "projects", index, "images", imgIdx, "alt"], e.target.value)
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                        <Col md={6}><Form.Control value={project.liveUrl} placeholder="Live project URL" onChange={(e) => updateField(["portfolio", "projects", index, "liveUrl"], e.target.value)} /></Col>
                        <Col md={6}><Form.Control value={project.repoUrl} placeholder="Source/repository URL" onChange={(e) => updateField(["portfolio", "projects", index, "repoUrl"], e.target.value)} /></Col>
                      </Row>
                    </Card.Body></Card>
                  </Col>
                ))}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Contact Content</Accordion.Header>
            <Accordion.Body>
              <Row className="g-3">
                <Col md={6}><Form.Group><Form.Label>Contact title</Form.Label><Form.Control value={draft.contact.title} onChange={(e) => updateField(["contact", "title"], e.target.value)} /></Form.Group></Col>
                <Col md={12}><Form.Group><Form.Label>Contact text</Form.Label><Form.Control as="textarea" rows={3} value={draft.contact.text} onChange={(e) => updateField(["contact", "text"], e.target.value)} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Contact email</Form.Label><Form.Control value={draft.contact.email} onChange={(e) => updateField(["contact", "email"], e.target.value)} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Contact phone</Form.Label><Form.Control value={draft.contact.phone} onChange={(e) => updateField(["contact", "phone"], e.target.value)} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Contact GitHub URL</Form.Label><Form.Control value={draft.contact.githubUrl} onChange={(e) => updateField(["contact", "githubUrl"], e.target.value)} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Contact LinkedIn URL</Form.Label><Form.Control value={draft.contact.linkedinUrl} onChange={(e) => updateField(["contact", "linkedinUrl"], e.target.value)} /></Form.Group></Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>Security And Data</Accordion.Header>
            <Accordion.Body>
              <Row className="g-3">
                <Col md={6}><Form.Group><Form.Label>Current admin passcode</Form.Label><Form.Control type="password" value={currentPasscode} onChange={(e) => setCurrentPasscode(e.target.value)} placeholder="Required only if changing passcode" /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>New admin passcode</Form.Label><Form.Control type="password" value={nextPasscode} onChange={(e) => setNextPasscode(e.target.value)} placeholder="Leave blank to keep current passcode" /></Form.Group></Col>
                <Col md={12} className="d-flex flex-wrap gap-2 mt-3">
                  <Button className="hire-btn" onClick={handleSave}>Save changes</Button>
                  <Button variant="outline-light" onClick={handleReset}>Reset draft</Button>
                  <Button variant="outline-warning" onClick={handleExportJson}>Export JSON</Button>
                  <Form.Group className="d-inline-block mb-0">
                    <Form.Label className="btn btn-outline-info mb-0">Import JSON
                      <Form.Control type="file" accept=".json" onChange={handleImportJson} hidden />
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </section>
  );
}
