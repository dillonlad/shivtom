import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faMessage,
  faPrescriptionBottle,
  faEnvelope,
  faCartShopping,
  faPhone,
  faP,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';

function AppNavbar() {
  const elementHouse = <FontAwesomeIcon icon={faHouse} />;
  const elementCart = <FontAwesomeIcon icon={faCartShopping} />;
  const elementPrescription = <FontAwesomeIcon icon={faPrescriptionBottle} />;
  const elementEnvelope = <FontAwesomeIcon icon={faEnvelope} />;
  const elementWhatsapp = <FontAwesomeIcon icon={['fab', 'whatsapp']} />;
  const elementVoicemail = <FontAwesomeIcon icon={faPhone} />;

  return (
    <>
      {[false].map((expand) => (
        <Navbar
          key={expand}
          expand={expand}
          fixed="top"
          className="mb-3"
        >
          <Container fluid>
            <Navbar.Brand href="/">{elementHouse}</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Kaylan Weds Nikita
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default AppNavbar;
