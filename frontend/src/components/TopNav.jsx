import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const baseNavItems = [
  { label: "Home", path: "/" },
  { label: "About me", path: "/about" },
  { label: "Portfolio", path: "/portfolio" }
];

export default function TopNav({ isAdmin, onLockAdmin }) {
  const navItems = isAdmin ? [...baseNavItems, { label: "Admin", path: "/admin" }] : baseNavItems;

  return (
    <Navbar expand="lg" className="py-3 px-2 px-md-4">
      <Container fluid>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav" className="nav-collapse-right">
          <Nav className="ms-auto gap-lg-4 me-lg-3 align-items-end text-end">
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
          {isAdmin ? (
            <div className="d-flex gap-2">
              <Button variant="outline-light" onClick={onLockAdmin}>
                Lock
              </Button>
            </div>
          ) : null}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
