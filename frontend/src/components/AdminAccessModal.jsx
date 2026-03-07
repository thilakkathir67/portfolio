import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function AdminAccessModal({ show, onClose, onSubmit, error }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(value);
    setValue("");
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Enter admin passcode</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="password"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Enter passcode"
              autoFocus
            />
          </Form.Group>
          {error ? <p className="modal-error mt-2 mb-0">{error}</p> : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="hire-btn">
            Unlock
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
