import React, { useState } from 'react';
import { Row, Col, Container, Modal, Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const Landing = () => {
  const location = useLocation();
  const itineraryData = location.state?.events || {};

  // Extract a flat list of all unique event names for the checkboxes
  const allEventNames = Object.values(itineraryData).flat().map((e) => e.name);

  // State for RSVP Modal and Success Modal
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    events: allEventNames,
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (eventName) => {
    setFormData((prev) => {
      const isSelected = prev.events.includes(eventName);
      if (isSelected) {
        return { ...prev, events: prev.events.filter((e) => e !== eventName) };
      } else {
        return { ...prev, events: [...prev.events, eventName] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.events.length === 0) {
      alert('Please select at least one event.');
      return;
    }

    try {
      const response = await fetch(
        'https://1juz8ik4ll.execute-api.eu-west-2.amazonaws.com/prod',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setShowModal(false);
        setShowSuccessModal(true);
        setFormData({ name: '', events: allEventNames, notes: '' });
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(
      date
    );
    const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(
      date
    );
    const day = date.getDate();
    return `${weekday} ${day}${getOrdinal(day)} ${month}`;
  };

  return (
    <Container fluid className="p-0 min-vh-100 overflow-hidden">
      <Row className="g-0 min-vh-100">
        {/* Left Side: Image 4 (50% Width) */}
        <Col md={6} className="position-relative d-none d-md-block">
          <img
            src="/assets/1000090540.jpg"
            alt="Tom and Shivani"
            style={{
              width: '100%',
              height: '100vh',
              objectFit: 'cover',
              position: 'sticky',
              top: 0,
            }}
          />
        </Col>

        {/* Right Side: Title + Itinerary Content */}
        <Col
          md={6}
          xs={12}
          className="d-flex flex-column align-items-center justify-content-start px-4 px-lg-5 py-5"
          style={{
            maxHeight: '100vh',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ maxWidth: '540px', width: '100%' }}>
            {/* Header Title */}
            <div className="text-center mb-4">
              <h1
                style={{
                  fontSize: 'clamp(42px, 5vw, 65px)',
                  color: '#6b505f',
                  fontFamily: 'SwirlyCanalope',
                  margin: 0,
                }}
              >
                Tom & Shivani
              </h1>
            </div>

            {/* Mobile Fallback Image Header (Visible only on small screens) */}
            <div className="d-block d-md-none mb-4 text-center">
              <img
                src="/assets/image4.jpg"
                alt="Tom & Shivani"
                style={{
                  width: '100%',
                  maxHeight: '350px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                }}
              />
            </div>

            {/* Itinerary Section */}
            <div style={{ fontFamily: 'serif', color: '#6b505f' }}>
              <h2 className="text-center mb-1" style={{ fontSize: '2.2rem' }}>
                The Itinerary
              </h2>
              <p className="text-center mb-4" style={{ opacity: 0.85 }}>
                Welcome! We are so glad you're here.
              </p>

              {/* RSVP Button */}
              <div className="mb-5 text-center">
                <Button
                  variant="outline-dark"
                  onClick={() => setShowModal(true)}
                  style={{
                    fontSize: '18px',
                    padding: '10px 32px',
                    fontFamily: 'SwirlyCanalope',
                    color: '#6b505f',
                    borderColor: '#6b505f',
                  }}
                >
                  RSVP Here
                </Button>
              </div>

              {/* Schedule / Event List */}
              {Object.entries(itineraryData).map(([date, eventsList]) => (
                <div key={date} className="mb-5">
                  <h4
                    className="mb-4 text-start"
                    style={{
                      borderBottom: '1px solid #6b505f',
                      paddingBottom: '8px',
                      fontWeight: '300',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {formatDate(date)}
                  </h4>
                  {eventsList.map((event, index) => (
                    <Row key={index} className="mb-4 align-items-top g-0">
                      <Col className="text-start">
                        <div
                          style={{
                            fontSize: '1.2rem',
                            textTransform: 'capitalize',
                            fontWeight: '500',
                          }}
                        >
                          {event.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.9rem',
                            opacity: 0.75,
                            fontStyle: 'italic',
                          }}
                        >
                          {event.location}
                        </div>
                      </Col>
                      <Col xs={4} className="text-end">
                        <span style={{ fontSize: '1.05rem', fontWeight: '500' }}>
                          {event.time}
                        </span>
                      </Col>
                    </Row>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* RSVP Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'serif' }}>Wedding RSVP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Which events will you attend?</Form.Label>
              <div className="p-3 border rounded bg-light">
                {allEventNames.map((eventName, idx) => (
                  <Form.Check
                    key={idx}
                    type="checkbox"
                    id={`event-${idx}`}
                    label={
                      eventName.charAt(0).toUpperCase() + eventName.slice(1)
                    }
                    checked={formData.events.includes(eventName)}
                    onChange={() => handleCheckboxChange(eventName)}
                    className="mb-2"
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                rows={3}
                placeholder="Dietary requirements or other notes..."
                onChange={handleInputChange}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="dark"
                type="submit"
                style={{ backgroundColor: '#6b505f', border: 'none' }}
              >
                Submit RSVP
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Body className="text-center p-5">
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>🥂</div>
          <h2 style={{ fontFamily: 'SwirlyCanalope', color: '#6b505f' }}>
            Thank You!
          </h2>
          <p className="mt-3" style={{ fontSize: '18px' }}>
            Your RSVP has been received. We're looking forward to seeing you!
          </p>
          <Button
            variant="dark"
            className="mt-4"
            onClick={() => setShowSuccessModal(false)}
            style={{
              backgroundColor: '#6b505f',
              border: 'none',
              padding: '10px 40px',
            }}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Landing;