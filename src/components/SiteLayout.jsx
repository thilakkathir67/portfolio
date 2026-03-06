import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import AdminAccessModal from "./AdminAccessModal";
import TopNav from "./TopNav";

export default function SiteLayout() {
  const { isAdmin, setIsAdmin, passcode } = usePortfolio();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setError("");
        setShowModal(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function resetSecretClicks() {
    clickCountRef.current = 0;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
  }

  function handleLogoClick() {
    clickCountRef.current += 1;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    clickTimerRef.current = setTimeout(() => {
      resetSecretClicks();
    }, 1800);

    if (clickCountRef.current >= 5) {
      resetSecretClicks();
      setError("");
      setShowModal(true);
    }
  }

  function handleUnlock(value) {
    if (value === passcode) {
      setIsAdmin(true);
      setShowModal(false);
      setError("");
      navigate("/admin");
      return;
    }
    setError("Incorrect passcode.");
  }

  function handleLockAdmin() {
    setIsAdmin(false);
    navigate("/");
  }

  return (
    <div className="page-root">
      <Container fluid className="hero-panel">
        <TopNav onLogoClick={handleLogoClick} isAdmin={isAdmin} onLockAdmin={handleLockAdmin} />
        <Outlet />
      </Container>

      <AdminAccessModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleUnlock}
        error={error}
      />
    </div>
  );
}
