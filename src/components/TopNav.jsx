import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const baseNavItems = [
  { label: "Home", path: "/" },
  { label: "About me", path: "/about" },
  { label: "Portfolio", path: "/portfolio" }
];

export default function TopNav({ onLogoClick, isAdmin, onLockAdmin }) {
  const navItems = isAdmin ? [...baseNavItems, { label: "Admin", path: "/admin" }] : baseNavItems;

  return (
    <Navbar expand="lg" className="py-3 px-2 px-md-4">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="logo-text" onClick={onLogoClick}>
          LOGO
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto gap-lg-4 me-lg-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => `nav-link${isActive ? " active-link" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>
          <div className="d-flex gap-2">
            {isAdmin ? (
              <Button variant="outline-light" onClick={onLockAdmin}>
                Lock
              </Button>
            ) : null}
            <Button as={NavLink} to="/" className="hire-btn">
              Hire Me
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
