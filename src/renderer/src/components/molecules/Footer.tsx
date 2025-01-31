import React from "react";
import { Navbar, Container } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <Container fluid>
      <Navbar
        bg="dark"
        variant="dark"
        className="border-top border-body justify-content-end"
      >
        <Navbar.Text className="justify-content-end me-2">
          ©2024 by <a href="mailto:marcin.jedercki@gmail.com">Alucard</a>
        </Navbar.Text>
      </Navbar>
    </Container>
  );
};
export default Footer;
