import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import AdminAccessModal from "./AdminAccessModal";
import TopNav from "./TopNav";

export default function SiteLayout() {
  const { isAdmin, unlockAdmin, lockAdmin } = usePortfolio();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        if (isAdmin) {
          navigate("/admin");
        } else {
          setError("");
          setShowModal(true);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash, location.pathname]);

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

  async function handleUnlock(value) {
    try {
      await unlockAdmin(value);
      setShowModal(false);
      setError("");
      navigate("/admin");
    } catch {
      setError("Incorrect passcode.");
    }
  }

  async function handleLockAdmin() {
    await lockAdmin();
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
